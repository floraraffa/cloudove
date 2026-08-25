// CloudMessenger: la nube mensajera completa.
// - Entra volando y habla al llegar (audio pre-pedido durante el vuelo).
// - Primera vez: pide tu nombre por voz, te registra en Snap Cloud y te da tu codigo de amigo.
// - Grabas un mensaje por voz -> Repetir / Borrar / Enviar -> eliges destinatario -> viaja por Snap Cloud.
// - Cada 5s consulta mensajes entrantes: los traduce a tu idioma (OpenAI) y te los lee.
// Estados: idle -> flying -> waitingAudio/speaking -> ready -> listening -> composed -> choosing -> flyingAway -> hidden -> (respawn)

import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { OpenAI } from "RemoteServiceGateway.lspkg/HostedExternal/OpenAI";
import { getLang, fmt } from "./Languages";
import { CloudMessaging } from "./CloudMessaging";

@component
export class CloudMessenger extends BaseScriptComponent {
  @input
  interactable: Interactable;

  @input
  voiceAudio: AudioComponent;

  @input
  cameraObject: SceneObject;

  @input
  cloudVisual: SceneObject;

  @input
  noteObject: SceneObject;

  @input
  actionsContainer: SceneObject;

  @input
  bitmojiObject: SceneObject;

  @input
  scrollObject: SceneObject;

  @input
  notifCloud: SceneObject;

  @input
  landmarksContainer: SceneObject;

  @input
  cloudImage: Image;

  @input
  texClosed: Texture;

  @input
  texOpen: Texture;

  @input
  texListen: Texture;

  @input("float")
  flightDuration: number = 3.0;

  @input("float")
  readingDuration: number = 3.0;

  private asrModule: AsrModule = require("LensStudio:AsrModule");
  private cameraModule: CameraModule = require("LensStudio:CameraModule");
  private capturedB64: string = "";
  private cameraAvailable: boolean = false;
  private noteTextComp: Text = null;
  // tamaños de letra originales, para escalar por idioma sin acumular cambios
  private scrollTextBaseSize: number = -1;
  private noteTextBaseSize: number = -1;
  private transcript: string = "";
  private liveText: string = "";
  private recordMode: string = "message"; // "message" | "name" | "email"
  private pendingEmail: string = "";
  private emailDraft: string = "";
  private kbMode: string = "email"; // "email" | "recipient"
  private inbox: any = null;
  private inboxAnnounced: boolean = false;
  private notifT: number = 1;
  private replyTo: any = null;
  private pendingDeleteId: string = "";
  private handledIds: string[] = [];
  private notifBound: boolean = false;
  private notifVisible: boolean = false;
  private postcardFlip: number = 99; // <0: frente a la vista, 0..0.9: girando, 99: quieta

  private pendingTrack: AudioTrackAsset = null;
  private pendingFailed: boolean = false;
  private lastText: string = "";
  private lastTrack: AudioTrackAsset = null;
  private flapMode: string = "timer"; // "audio" | "timer"
  private flapDuration: number = 3;
  private afterSpeak: string = "ready";

  private recipients: any[] = [];
  private pendingIncoming: any = null;
  private pollT: number = 0;
  private polling: boolean = false;
  private reentry: boolean = false;
  private arriveText: string = "";
  private arriveSpeak: boolean = true;
  private bound: boolean = false;

  private state: string = "idle";
  private t: number = 0;
  private elapsed: number = 0;
  private p0: vec3 = vec3.zero();
  private p1: vec3 = vec3.zero();
  private p2: vec3 = vec3.zero();

  private actions: { [key: string]: SceneObject } = {};
  private actionLabels: { [key: string]: Text } = {};

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.begin());
    this.createEvent("UpdateEvent").bind(() => this.update());
  }

  private myLang(): string {
    return global.persistentStorageSystem.store.getString("nativeLang") || "es";
  }

  // textos del sistema en el idioma elegido
  private ui() {
    return getLang(this.myLang()).ui;
  }

  private begin() {
    this.noteObject.enabled = false;
    this.hideScroll();

    if (this.cloudImage && !this.bound) {
      this.cloudImage.mainMaterial = this.cloudImage.mainMaterial.clone();
    }
    if (this.cloudImage) {
      this.cloudImage.mainPass.baseTex = this.texClosed;
    }

    if (!this.bound) {
      this.setupActions();
      if (this.interactable) {
        // tocar la nube grande ya NO graba: si hay mensaje pendiente, lo abre
        this.interactable.onTriggerEnd.add(() => this.openInbox());
        print("CloudMessenger: nube grande conectada (tap = abrir mensaje)");
      } else {
        print("CloudMessenger: AVISO - nube grande sin interactable");
      }
      // la nubecita queda SIEMPRE activa (nunca se deshabilita, solo se estaciona
      // fuera de vista): asi su area de toque nunca deja de funcionar
      if (this.notifCloud) {
        const notifInter = this.notifCloud.getComponent(
          Interactable.getTypeName()
        ) as Interactable;
        if (notifInter) {
          notifInter.onTriggerEnd.add(() => {
            print("CloudMessenger: nubecita tocada");
            this.openInbox();
          });
          this.notifBound = true;
          print("CloudMessenger: nubecita conectada");
        } else {
          print("CloudMessenger: AVISO - nubecita sin interactable");
        }
      }
      this.bound = true;
      // sondeo silencioso: el boton Foto solo aparece si la camara realmente
      // funciona en este dispositivo (en el preview del editor no existe)
      try {
        const probe = CameraModule.createImageRequest();
        this.cameraModule
          .requestImage(probe)
          .then(() => {
            this.cameraAvailable = true;
            print("CloudMessenger: camara disponible, boton Foto activo");
          })
          .catch(() => {
            this.cameraAvailable = false;
            print("CloudMessenger: camara no disponible, boton Foto oculto");
          });
      } catch (e) {
        this.cameraAvailable = false;
        print("CloudMessenger: camara no disponible, boton Foto oculto");
      }
    } else {
      this.showActions([]);
    }
    this.hideNotif();

    const camT = this.cameraObject.getTransform();
    const cam = camT.getWorldTransform();
    const camPos = camT.getWorldPosition();
    const fwd = cam.multiplyDirection(new vec3(0, 0, -1)).normalize();
    const right = cam.multiplyDirection(new vec3(1, 0, 0)).normalize();

    this.p2 = camPos.add(fwd.uniformScale(80)).add(new vec3(0, -5, 0));
    this.p0 = camPos
      .add(fwd.uniformScale(350))
      .add(right.uniformScale(-180))
      .add(new vec3(0, 90, 0));
    const mid = this.p0.add(this.p2).uniformScale(0.5);
    this.p1 = mid.add(new vec3(0, 60, 0));

    this.getTransform().setWorldPosition(this.p0);
    this.state = "flying";
    this.t = 0;
    // consulta los mensajes sin leer apenas la nube este lista (sin esperar el sondeo)
    this.pollT = 99;

    // que dice la nube al llegar
    const msging = CloudMessaging.get();
    if (!this.reentry && msging && msging.isReady() && !msging.isRegistered()) {
      this.arriveText = this.ui().askEmailIntro;
      this.recordMode = "email";
    } else if (!this.reentry) {
      this.arriveText = getLang(this.myLang()).greeting;
      this.recordMode = "message";
    } else {
      this.arriveText = this.ui().reentry;
      this.recordMode = "message";
    }
    this.arriveSpeak = !this.reentry;
    if (this.arriveSpeak) {
      this.prefetch(this.arriveText);
    }

    // tu Bitmoji aparece junto a la nube una vez que estas registrada
    if (this.bitmojiObject) {
      this.bitmojiObject.enabled =
        msging != null && msging.isReady() && msging.isRegistered();
    }
    print(
      "CloudMessenger: despegue" + (this.reentry ? " (reentrada)" : "")
    );
  }

  // ---------- botonera ----------

  private setupActions() {
    if (!this.actionsContainer) {
      return;
    }
    for (let i = 0; i < this.actionsContainer.getChildrenCount(); i++) {
      const action = this.actionsContainer.getChild(i);
      const name = action.name;
      this.actions[name] = action;
      for (let j = 0; j < action.getChildrenCount(); j++) {
        const child = action.getChild(j);
        const inter = child.getComponent(
          Interactable.getTypeName()
        ) as Interactable;
        if (inter) {
          inter.onTriggerEnd.add(() => this.onAction(name));
        }
        const label = child.getComponent("Component.Text") as Text;
        if (label) {
          this.actionLabels[name] = label;
        }
      }
    }
    this.showActions([]);
    print("CloudMessenger: acciones listas");
  }

  private showActions(names: string[]) {
    for (const key in this.actions) {
      this.actions[key].enabled = names.indexOf(key) >= 0;
    }
  }

  private setActionLabel(name: string, text: string) {
    if (this.actionLabels[name]) {
      this.actionLabels[name].text = text;
    }
  }

  private placeAction(name: string, x: number, y: number = 0) {
    if (this.actions[name]) {
      this.actions[name].getTransform().setLocalPosition(new vec3(x, y, 0));
    }
  }

  // redimensiona la pastilla (Bg) y su area tocable (Hit) de un boton
  private sizeAction(name: string, w: number, h: number) {
    const root = this.actions[name];
    if (!root) {
      return;
    }
    for (let i = 0; i < root.getChildrenCount(); i++) {
      const ch = root.getChild(i);
      if (ch.name === "Hit") {
        ch.getTransform().setLocalScale(new vec3(w - 0.5, h + 1.2, 4));
      } else if (ch.name.substring(0, 2) === "Bg") {
        ch.getTransform().setLocalScale(new vec3(w, h, 1));
      }
    }
  }

  private showComposedActions() {
    this.setActionLabel("replay", this.ui().replay);
    this.setActionLabel("delete", this.ui().del);
    this.setActionLabel("send", this.ui().send);
    // vuelven a su tamaño compacto (Responder/Cerrar los agrandan en el inbox)
    this.sizeAction("replay", 11, 3.5);
    this.sizeAction("delete", 11, 3.5);
    this.sizeAction("send", 11, 3.5);
    if (this.cameraAvailable) {
      // 4 botones: fila completa con Foto (devuelto a su tamaño chico)
      this.setActionLabel("photo", this.ui().photoBtn);
      this.sizeAction("photo", 11, 3.5);
      this.placeAction("replay", -19.5);
      this.placeAction("delete", -6.5);
      this.placeAction("photo", 6.5);
      this.placeAction("send", 19.5);
      this.showActions(["replay", "delete", "photo", "send"]);
    } else {
      // 3 botones: centrados, sin el hueco de Foto
      this.placeAction("replay", -13.5);
      this.placeAction("delete", 0);
      this.placeAction("send", 13.5);
      this.showActions(["replay", "delete", "send"]);
    }
  }

  // captura una foto con la camara de los Specs y la adjunta al mensaje
  private takePhoto() {
    if (this.state !== "composed") {
      return;
    }
    print("CloudMessenger: capturando foto...");
    try {
      const request = CameraModule.createImageRequest();
      this.cameraModule
        .requestImage(request)
        .then((frame: any) => {
          Base64.encodeTextureAsync(
            frame.texture,
            (b64: string) => {
              this.capturedB64 = b64;
              this.setNote(this.ui().photoTaken);
              print(
                "CloudMessenger: foto capturada (" +
                  Math.round(b64.length / 1024) +
                  " KB)"
              );
            },
            () => {
              print("CloudMessenger: fallo al codificar la foto");
            },
            CompressionQuality.LowQuality,
            EncodingType.Jpg
          );
        })
        .catch((e: any) => {
          print("CloudMessenger: fallo de captura -> " + e);
          this.setNote(this.ui().cameraNo);
        });
    } catch (e) {
      print("CloudMessenger: camara no disponible -> " + e);
      this.setNote(this.ui().cameraNo);
    }
  }

  private onAction(name: string) {
    print("CloudMessenger: boton '" + name + "' tocado (estado: " + this.state + ")");
    if (name === "readmsg") {
      this.openInbox();
      return;
    }
    if (name === "photo") {
      if (this.state === "ready" && this.recordMode === "message") {
        // en ready, este boton es "Escribir": mensaje nuevo por teclado
        this.replyTo = null;
        this.openKeyboard("msg");
        return;
      }
      this.takePhoto();
      return;
    }
    if (this.state === "inboxOpen") {
      if (name === "replay") {
        this.replyToMessage();
      } else if (name === "send") {
        this.closeMessage();
      }
      return;
    }
    if (this.state === "choosing") {
      const idx = name === "replay" ? 0 : name === "delete" ? 1 : 2;
      if (idx < this.recipients.length) {
        this.doSend(this.recipients[idx]);
      }
      return;
    }
    if (name === "primary") {
      this.onPrimary();
    } else if (name === "replay") {
      this.replayMessage();
    } else if (name === "delete") {
      this.deleteMessage();
    } else if (name === "send") {
      this.sendMessage();
    }
  }

  private onPrimary() {
    if (this.state === "ready") {
      if (this.recordMode === "email") {
        this.openKeyboard("email");
      } else {
        // grabar desde el boton normal = mensaje nuevo, sin destinatario prefijado
        this.replyTo = null;
        this.startListening();
      }
    } else if (this.state === "listening") {
      this.stopListening();
    } else if (this.state === "choosing") {
      // tocar la nube cancela la eleccion
      this.state = "composed";
      this.setNote(this.transcript);
      this.showComposedActions();
    }
  }

  // ---------- hablar (TTS con prefetch) ----------

  private prefetch(text: string) {
    this.pendingTrack = null;
    this.pendingFailed = false;
    OpenAI.speech({
      model: "gpt-4o-mini-tts",
      input: text,
      voice: "nova",
    })
      .then((track: AudioTrackAsset) => {
        this.pendingTrack = track;
        this.lastText = text;
        this.lastTrack = track;
        if (this.state === "waitingAudio") {
          this.playPending();
        }
      })
      .catch((err) => {
        this.pendingFailed = true;
        print("CloudMessenger: TTS fallo -> " + err);
        if (this.state === "waitingAudio") {
          this.speakFallback();
        }
      });
  }

  private playPending() {
    this.voiceAudio.audioTrack = this.pendingTrack;
    this.voiceAudio.play(1);
    this.flapMode = "audio";
    this.state = "speaking";
    this.t = 0;
  }

  private speakFallback() {
    this.flapMode = "timer";
    this.flapDuration = this.readingDuration;
    this.state = "speaking";
    this.t = 0;
  }

  // reproduce un texto (con cache) y al terminar pasa al estado `after`
  private speakAudio(text: string, after: string) {
    this.afterSpeak = after;
    this.showActions([]);
    if (this.lastTrack && this.lastText === text) {
      this.pendingTrack = this.lastTrack;
      this.playPending();
    } else {
      this.state = "waitingAudio";
      this.t = 0;
      this.prefetch(text);
    }
  }

  // habla mostrando el texto en el globo
  private speakText(text: string, after: string) {
    this.noteObject.enabled = true;
    this.setNote(text);
    this.speakAudio(text, after);
  }

  // ---------- pergamino de mensajes entrantes ----------

  private findChildByName(obj: SceneObject, name: string): SceneObject {
    for (let i = 0; i < obj.getChildrenCount(); i++) {
      const child = obj.getChild(i);
      if (child.name === name) {
        return child;
      }
      const found = this.findChildByName(child, name);
      if (found) {
        return found;
      }
    }
    return null;
  }

  // la POSTAL: llega mostrando el frente (foto o cielo), se sostiene un momento
  // y se da vuelta para mostrar el mensaje escrito con su firma
  private showScroll(
    messageText: string,
    sender: string,
    photoB64: string,
    senderLang: string
  ) {
    if (!this.scrollObject) {
      return;
    }
    this.noteObject.enabled = false;
    this.scrollObject.enabled = true;
    const photoObj = this.findChildByName(this.scrollObject, "ScrollPhoto");
    if (photoObj) {
      this.setScrollPhoto(photoObj, photoB64, senderLang);
    }
    // la cinta con el lugar de origen, como toda holiday card
    const placeObj = this.findChildByName(this.scrollObject, "FrontPlace");
    if (placeObj) {
      const txt = placeObj.getComponent("Component.Text") as Text;
      if (txt) {
        txt.text = getLang(senderLang).place;
      }
    }
    const textObj = this.findChildByName(this.scrollObject, "ScrollText");
    if (textObj) {
      const txt = textObj.getComponent("Component.Text") as Text;
      if (txt) {
        if (this.scrollTextBaseSize < 0) {
          this.scrollTextBaseSize = txt.size;
        }
        const fit = this.scriptFit();
        txt.size = Math.round(this.scrollTextBaseSize * fit.sizeMul);
        txt.text = this.wrapText(messageText, fit.chars);
      }
    }
    const signObj = this.findChildByName(this.scrollObject, "ScrollSign");
    if (signObj) {
      const txt = signObj.getComponent("Component.Text") as Text;
      if (txt) {
        txt.text = "— " + sender;
      }
    }
    // arranca mostrando el frente; con foto se aprecia mas tiempo antes del giro
    this.scrollObject.getTransform().setLocalRotation(quat.quatIdentity());
    this.postcardFlip = photoB64 && photoB64.length > 0 ? -2.4 : -1.2;
  }

  // busca la postal-landmark segun el idioma del remitente (es->Obelisco,
  // de->torre de TV de Berlin, fr->Eiffel, etc.)
  private landmarkFor(lang: string): Texture {
    if (!this.landmarksContainer) {
      return null;
    }
    const holder = this.findChildByName(this.landmarksContainer, lang);
    if (!holder) {
      return null;
    }
    const sc = holder.getComponent("Component.ScriptComponent") as any;
    return sc && sc.texture ? (sc.texture as Texture) : null;
  }

  // la estampilla del dorso lleva la misma imagen que el frente
  private setBackStamp(tex: Texture) {
    const stampObj = this.findChildByName(this.scrollObject, "BackStamp");
    if (!stampObj) {
      return;
    }
    if (!tex) {
      stampObj.enabled = false;
      return;
    }
    const img = stampObj.getComponent("Component.Image") as Image;
    if (img) {
      img.mainMaterial = img.mainMaterial.clone();
      img.mainPass.baseTex = tex;
      // Stretch: la estampilla llena el recuadro punteado exacto, sin bandas
      img.stretchMode = StretchMode.Stretch;
      stampObj.enabled = true;
    }
  }

  // frente de la postal: la foto adjunta, o el poster del lugar del remitente
  private setScrollPhoto(
    photoObj: SceneObject,
    photoB64: string,
    senderLang: string
  ) {
    if (!photoB64 || photoB64.length === 0) {
      const landmark = this.landmarkFor(senderLang);
      if (landmark) {
        const img = photoObj.getComponent("Component.Image") as Image;
        if (img) {
          img.mainMaterial = img.mainMaterial.clone();
          img.mainPass.baseTex = landmark;
          photoObj.enabled = true;
          this.setBackStamp(landmark);
          print("CloudMessenger: postal landmark de '" + senderLang + "'");
          return;
        }
      }
      photoObj.enabled = false;
      this.setBackStamp(null);
      return;
    }
    Base64.decodeTextureAsync(
      photoB64,
      (tex: Texture) => {
        const img = photoObj.getComponent("Component.Image") as Image;
        if (img) {
          img.mainMaterial = img.mainMaterial.clone();
          img.mainPass.baseTex = tex;
          photoObj.enabled = true;
          this.setBackStamp(tex);
          print("CloudMessenger: foto adjunta mostrada");
        }
      },
      () => {
        print("CloudMessenger: fallo al decodificar la foto adjunta");
        photoObj.enabled = false;
        this.setBackStamp(null);
      }
    );
  }

  private hideScroll() {
    if (this.scrollObject) {
      this.scrollObject.enabled = false;
    }
  }

  // ---------- flujo principal ----------

  private arrive() {
    this.noteObject.enabled = true;
    this.setNote(this.arriveText);
    this.afterSpeak = "ready";
    if (!this.arriveSpeak) {
      this.goReady();
      return;
    }
    if (this.pendingTrack) {
      this.playPending();
    } else if (this.pendingFailed) {
      this.speakFallback();
    } else {
      this.state = "waitingAudio";
      this.t = 0;
    }
  }

  private goReady() {
    if (this.inbox && !this.inboxAnnounced) {
      this.state = "ready";
      this.announceInbox();
      return;
    }
    if (this.inbox) {
      // hay un mensaje esperando: el UNICO boton es "Leer mensaje"
      // (Grabar aparece recien despues de resolverlo)
      this.state = "ready";
      this.setActionLabel("readmsg", this.ui().readMsg);
      this.showActions(["readmsg"]);
      return;
    }
    this.state = "ready";
    if (this.recordMode === "message") {
      // dos formas de componer: dictar (Grabar) o teclear (Escribir).
      // El boton "photo" hace de Escribir en este estado — en composed
      // showComposedActions lo reetiqueta y reubica como Foto.
      // Ambas pastillas del mismo tamaño, mellizas
      this.setActionLabel("primary", this.ui().record);
      this.setActionLabel("photo", this.ui().writeBtn);
      this.sizeAction("primary", 13, 4.6);
      this.sizeAction("photo", 13, 4.6);
      this.placeAction("primary", -8);
      this.placeAction("photo", 8);
      this.showActions(["primary", "photo"]);
      return;
    }
    this.sizeAction("primary", 19, 5.9);
    this.placeAction("primary", 0);
    this.showActions(["primary"]);
    const label =
      this.recordMode === "email" ? this.ui().sayEmail : this.ui().sayName;
    this.setActionLabel("primary", label);
  }

  private startListening() {
    this.hideScroll();
    this.noteObject.enabled = true;
    this.transcript = "";
    this.liveText = "";
    this.capturedB64 = "";
    this.state = "listening";
    if (this.cloudImage && this.texListen) {
      this.cloudImage.mainPass.baseTex = this.texListen;
    }
    this.setNote(
      this.recordMode === "email"
        ? this.ui().askEmail
        : this.recordMode === "name"
          ? this.ui().askName
          : this.ui().listening
    );
    this.sizeAction("primary", 13, 4.6);
    this.placeAction("primary", 0);
    this.showActions(["primary"]);
    this.setActionLabel("primary", this.ui().stop);

    const options = AsrModule.AsrTranscriptionOptions.create();
    options.silenceUntilTerminationMs = 1500;
    options.mode = AsrModule.AsrMode.HighAccuracy;
    options.onTranscriptionUpdateEvent.add((ev) => {
      if (ev.isFinal) {
        this.transcript = (this.transcript + " " + ev.text).trim();
        this.liveText = "";
      } else {
        this.liveText = ev.text;
      }
      this.setNote((this.transcript + " " + this.liveText).trim());
    });
    options.onTranscriptionErrorEvent.add((code) => {
      print("CloudMessenger: error ASR -> " + code);
      this.setNote(this.ui().noHear);
      if (this.cloudImage) {
        this.cloudImage.mainPass.baseTex = this.texClosed;
      }
      this.goReady();
    });
    this.asrModule.startTranscribing(options);
  }

  private stopListening() {
    this.asrModule.stopTranscribing();
    if (this.cloudImage) {
      this.cloudImage.mainPass.baseTex = this.texClosed;
    }
    const finalMsg = (this.transcript + " " + this.liveText).trim();
    if (finalMsg.length === 0) {
      this.setNote(this.ui().noHear);
      this.goReady();
      return;
    }
    if (this.recordMode === "email") {
      this.doEmailLogin(finalMsg);
      return;
    }
    if (this.recordMode === "name") {
      this.doRegister(finalMsg);
      return;
    }
    this.transcript = finalMsg;
    this.state = "composed";
    this.setNote(finalMsg);
    this.showComposedActions();
    print("CloudMessenger: mensaje compuesto -> " + finalMsg);
  }

  // ---------- login por email / registro ----------

  // texto escrito con el teclado del sistema (AR keyboard en Specs,
  // teclado de la compu en el preview): para el email propio y para la
  // direccion del destinatario — nada de dictar emails por voz
  private openKeyboard(mode: string) {
    this.kbMode = mode;
    this.state = "typingEmail";
    this.emailDraft = "";
    this.noteObject.enabled = true;
    const prompt =
      mode === "email"
        ? this.ui().askEmail
        : mode === "msg"
          ? this.ui().typeMsg
          : this.ui().askRecipient;
    this.setNote(prompt);
    this.showActions([]);
    const options = new TextInputSystem.KeyboardOptions();
    options.keyboardType =
      mode === "msg"
        ? TextInputSystem.KeyboardType.Text
        : TextInputSystem.KeyboardType.Email;
    options.returnKeyType = TextInputSystem.ReturnKeyType.Done;
    options.onTextChanged = (text: string, range: vec2) => {
      this.emailDraft = text;
      this.setNote(text.length > 0 ? text : prompt);
    };
    options.onReturnKeyPressed = () => {
      this.submitTyped();
    };
    options.onKeyboardStateChanged = (open: boolean) => {
      if (!open && this.state === "typingEmail") {
        this.submitTyped();
      }
    };
    global.textInputSystem.requestKeyboard(options);
    print("CloudMessenger: teclado abierto (" + mode + ")");
  }

  private submitTyped() {
    if (this.state !== "typingEmail") {
      return;
    }
    // salir de typingEmail YA: el Enter y el cierre del teclado disparan
    // este metodo DOS veces, y como lo que sigue es asincrono, el segundo
    // disparo pasaba el guardia y duplicaba el envio (o el login)
    this.state = "resolving";
    if (this.kbMode === "msg") {
      // mensaje escrito: se respetan mayusculas y espacios
      const msg = this.emailDraft.trim();
      if (msg.length === 0) {
        this.goReady();
        return;
      }
      this.transcript = msg;
      this.capturedB64 = "";
      this.state = "composed";
      this.setNote(msg);
      this.showComposedActions();
      print("CloudMessenger: mensaje escrito -> " + msg);
      return;
    }
    const text = this.emailDraft.toLowerCase().split(" ").join("").trim();
    if (this.kbMode === "email") {
      if (!CloudMessaging.isValidEmail(text)) {
        this.setNote(this.ui().badEmail);
        this.goReady();
        return;
      }
      this.doEmailLogin(text);
    } else {
      this.resolveRecipient(text);
    }
  }

  // busca al destinatario por email o codigo NUBE y envia
  private resolveRecipient(addr: string) {
    if (addr.length === 0) {
      this.state = "composed";
      this.setNote(this.transcript);
      this.showComposedActions();
      return;
    }
    this.setNote(this.ui().searching);
    CloudMessaging.get()
      .findByAddress(addr)
      .then((user: any) => {
        if (user) {
          this.doSend(user);
        } else {
          this.state = "composed";
          this.setNote(this.ui().notFound);
          this.showComposedActions();
        }
      })
      .catch((err) => {
        this.state = "composed";
        this.setNote("Error: " + err);
        this.showComposedActions();
      });
  }

  private doEmailLogin(raw: string) {
    const email = CloudMessaging.cleanEmail(raw);
    if (!CloudMessaging.isValidEmail(email)) {
      print("CloudMessenger: email no valido -> " + email);
      this.setNote(this.ui().badEmail);
      this.goReady();
      return;
    }
    this.setNote(email);
    this.showActions([]);
    CloudMessaging.get()
      .loginByEmail(email, this.myLang())
      .then((user: { code: string; name: string } | null) => {
        if (user) {
          // cuenta existente: login — y consulta YA los mensajes sin leer,
          // para que el anuncio salga antes que el boton de grabar
          this.recordMode = "message";
          if (this.bitmojiObject) {
            this.bitmojiObject.enabled = true;
          }
          this.pollT = 99;
          this.speakText(
            fmt(this.ui().welcomeBack, user.name, user.code),
            "ready"
          );
        } else {
          // cuenta nueva: falta el nombre
          this.pendingEmail = email;
          this.recordMode = "name";
          this.speakText(this.ui().newAccount, "ready");
        }
      })
      .catch((err) => {
        print("CloudMessenger: error de login -> " + err);
        this.setNote("Error: " + err);
        this.goReady();
      });
  }

  private doRegister(name: string) {
    this.setNote(fmt(this.ui().registering, name, ""));
    this.showActions([]);
    CloudMessaging.get()
      .register(name, this.myLang(), this.pendingEmail)
      .then((result: { code: string; name: string; existing: boolean }) => {
        this.recordMode = "message";
        if (this.bitmojiObject) {
          this.bitmojiObject.enabled = true;
        }
        this.pollT = 99;
        this.speakText(
          fmt(this.ui().registered, result.name, result.code),
          "ready"
        );
      })
      .catch((err) => {
        print("CloudMessenger: error de registro -> " + err);
        this.setNote("Error: " + err);
        this.goReady();
      });
  }

  // ---------- componer / enviar ----------

  private replayMessage() {
    if (this.state !== "composed" || this.transcript.length === 0) {
      return;
    }
    this.speakText(this.transcript, "composed");
  }

  private deleteMessage() {
    if (this.state !== "composed") {
      return;
    }
    this.transcript = "";
    this.capturedB64 = "";
    this.setNote(this.ui().deleted);
    this.goReady();
  }

  private sendMessage() {
    if (this.state !== "composed") {
      print("CloudMessenger: Enviar ignorado, estado es '" + this.state + "'");
      return;
    }
    const msging = CloudMessaging.get();
    print("CloudMessenger: buscando destinatarios...");
    if (!msging || !msging.isReady()) {
      this.setNote(
        "Snap Cloud sin configurar. Pega la URL y la anon key en SnapCloudConfig."
      );
      return;
    }
    if (!msging.isRegistered()) {
      this.setNote("Primero necesito tu nombre. Reinicia la lente.");
      return;
    }
    // si es una respuesta, va directo al remitente; si no, se pide la direccion
    if (this.replyTo) {
      this.doSend(this.replyTo);
      return;
    }
    this.openKeyboard("recipient");
  }

  private doSend(user: any) {
    if (this.state === "sending") {
      // ya hay un envio en vuelo: nunca duplicar el mensaje
      return;
    }
    this.state = "sending";
    this.showActions([]);
    this.setNote(fmt(this.ui().sending, user.name, ""));
    CloudMessaging.get()
      .send(user.code, this.transcript, this.myLang(), this.capturedB64)
      .then(() => {
        this.deleteOpenedMessage();
        this.setNote(fmt(this.ui().sent, user.name, ""));
        this.flyAway();
      })
      .catch((err) => {
        this.setNote(this.ui().sendError + err);
        this.state = "composed";
        this.showComposedActions();
      });
  }

  private flyAway() {
    const camPos = this.cameraObject.getTransform().getWorldPosition();
    const myPos = this.getTransform().getWorldPosition();
    const away = myPos.sub(camPos);
    away.y = 0;
    const dir = away.length > 0.01 ? away.normalize() : new vec3(0, 0, -1);
    this.p0 = myPos;
    this.p2 = myPos.add(dir.uniformScale(300)).add(new vec3(0, 180, 0));
    const mid = this.p0.add(this.p2).uniformScale(0.5);
    this.p1 = mid.add(new vec3(0, 60, 0));
    this.noteObject.enabled = false;
    this.hideScroll();
    this.replyTo = null;
    this.showActions([]);
    this.state = "flyingAway";
    this.t = 0;
    print("CloudMessenger: se va volando con el mensaje");
  }

  // ---------- recepcion ----------

  private checkIncoming() {
    const msging = CloudMessaging.get();
    if (!msging || !msging.isReady() || !msging.isRegistered()) {
      return;
    }
    this.polling = true;
    msging
      .fetchUnread()
      .then((msgs: any[]) => {
        this.polling = false;
        if (msgs.length === 0 || this.inbox) {
          return;
        }
        // nunca re-anunciar un mensaje ya abierto en esta sesion
        let candidate: any = null;
        for (let i = 0; i < msgs.length; i++) {
          if (this.handledIds.indexOf(msgs[i].id) < 0) {
            candidate = msgs[i];
            break;
          }
        }
        if (!candidate) {
          return;
        }
        this.inbox = candidate;
        this.inboxAnnounced = false;
        if (this.state === "hidden") {
          this.t = 99; // la nube vuelve volando y anuncia al llegar
        } else if (this.state === "ready") {
          this.announceInbox();
        }
      })
      .catch(() => {
        this.polling = false;
      });
  }

  // anuncia el mensaje pendiente: la nubecita entra volando y la nube avisa de quien es
  private announceInbox() {
    if (!this.inbox || this.inboxAnnounced) {
      return;
    }
    this.inboxAnnounced = true;
    this.showNotif();
    this.speakText(
      fmt(this.ui().newMessageFrom, this.inbox.from_name, ""),
      "ready"
    );
  }

  private showNotif() {
    if (!this.notifCloud) {
      return;
    }
    this.notifVisible = true;
    this.notifT = 0;
  }

  private hideNotif() {
    if (this.notifCloud) {
      this.notifVisible = false;
      // estacionada lejos, fuera de vista (sigue activa pero inalcanzable)
      this.notifCloud.getTransform().setLocalPosition(new vec3(300, 300, 0));
    }
  }

  // tocar la nubecita abre el pergamino con el mensaje
  private openInbox() {
    if (!this.inbox) {
      print("CloudMessenger: tap de nube sin mensaje pendiente");
      return;
    }
    if (
      this.state !== "ready" &&
      this.state !== "speaking" &&
      this.state !== "waitingAudio"
    ) {
      print("CloudMessenger: tap ignorado, estado '" + this.state + "'");
      return;
    }
    const m = this.inbox;
    this.inbox = null;
    this.inboxAnnounced = false;
    this.hideNotif();
    // marcado como leido YA (para que el sondeo no lo re-encuentre)
    // y recordado localmente; el borrado definitivo llega al responder o cerrar
    this.handledIds.push(m.id);
    CloudMessaging.get().markRead(m.id);
    this.pendingDeleteId = m.id;
    this.replyTo = { code: m.from_code, name: m.from_name };
    print("CloudMessenger: abriendo mensaje de " + m.from_name);
    this.presentIncoming(m);
  }

  // solo-una-vez: al terminar con el mensaje (cerrar o responder) se borra de la base
  private deleteOpenedMessage() {
    if (this.pendingDeleteId.length > 0) {
      CloudMessaging.get().deleteMessage(this.pendingDeleteId);
      this.pendingDeleteId = "";
    }
  }

  private showInboxActions() {
    this.setActionLabel("replay", this.ui().reply);
    this.setActionLabel("send", this.ui().close);
    // Responder/Cerrar: misma altura, distancia y tamaño que Grabar/Escribir
    this.sizeAction("replay", 13, 4.6);
    this.sizeAction("send", 13, 4.6);
    this.placeAction("replay", -8);
    this.placeAction("send", 8);
    this.showActions(["replay", "send"]);
  }

  // Responder: el mensaje ya fue leido -> se elimina, y se graba la respuesta
  // que ira directo al remitente
  private replyToMessage() {
    this.deleteOpenedMessage();
    this.hideScroll();
    this.recordMode = "message";
    this.startListening();
  }

  private closeMessage() {
    this.deleteOpenedMessage();
    this.hideScroll();
    this.replyTo = null;
    this.goReady();
  }

  private presentIncoming(m: any) {
    const myLang = this.myLang();
    print(
      "CloudMessenger: mensaje de " +
        m.from_name +
        " (" +
        m.lang +
        " -> " +
        myLang +
        ")"
    );
    if (m.lang === myLang) {
      this.showScroll(m.text, m.from_name, m.photo || "", m.lang);
      this.speakAudio(
        fmt(this.ui().says, m.from_name, "") + " " + m.text,
        "inboxOpen"
      );
      return;
    }
    this.noteObject.enabled = true;
    this.setNote(this.ui().translating);
    this.showActions([]);
    OpenAI.chatCompletions({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Traduce el mensaje del usuario al idioma con codigo ISO '" +
            myLang +
            "'. Responde SOLO con la traduccion, sin comentarios.",
        },
        { role: "user", content: m.text },
      ],
    })
      .then((resp: any) => {
        const translated = resp.choices[0].message.content;
        this.showScroll(translated, m.from_name, m.photo || "", m.lang);
        this.speakAudio(
          fmt(this.ui().says, m.from_name, "") + " " + translated,
          "inboxOpen"
        );
      })
      .catch((e) => {
        print("CloudMessenger: traduccion fallo -> " + e);
        this.showScroll(m.text, m.from_name, m.photo || "", m.lang);
        this.speakAudio(
          fmt(this.ui().says, m.from_name, "") + " " + m.text,
          "inboxOpen"
        );
      });
  }

  // ---------- update ----------

  private update() {
    const dt = getDeltaTime();
    this.elapsed += dt;

    if (this.state === "flying") {
      // la reentrada (despues de enviar) es mas rapida que la llegada inicial
      this.t += dt / (this.reentry ? 1.5 : this.flightDuration);
      const k = Math.min(this.t, 1);
      const s = k * k * (3 - 2 * k);
      const a = vec3.lerp(this.p0, this.p1, s);
      const b = vec3.lerp(this.p1, this.p2, s);
      this.getTransform().setWorldPosition(vec3.lerp(a, b, s));
      if (k >= 1) {
        this.t = 0;
        print("CloudMessenger: llegue");
        this.arrive();
      }
    } else if (this.state === "flyingAway") {
      this.t += dt / 1.6;
      const k = Math.min(this.t, 1);
      const s = k * k;
      const a = vec3.lerp(this.p0, this.p1, s);
      const b = vec3.lerp(this.p1, this.p2, s);
      this.getTransform().setWorldPosition(vec3.lerp(a, b, s));
      if (k >= 1) {
        this.state = "hidden";
        this.cloudVisual.enabled = false;
        this.t = 0;
        print("CloudMessenger: se fue, vuelve enseguida");
      }
    } else if (this.state === "hidden") {
      this.t += dt;
      if (this.t >= 1.5) {
        this.reentry = true;
        this.cloudVisual.enabled = true;
        this.begin();
      }
    } else if (this.state === "waitingAudio") {
      this.t += dt;
      if (this.t >= 7) {
        this.speakFallback();
      }
    } else if (this.state === "speaking") {
      this.t += dt;
      let talking = false;
      let done = false;
      if (this.flapMode === "audio") {
        talking = this.voiceAudio && this.voiceAudio.isPlaying();
        done = this.t > 0.7 && !talking;
      } else {
        talking = true;
        done = this.t >= this.flapDuration;
      }
      if (this.cloudImage) {
        if (talking) {
          const open = Math.floor(this.t / 0.18) % 2 === 0;
          this.cloudImage.mainPass.baseTex = open
            ? this.texOpen
            : this.texClosed;
        } else {
          this.cloudImage.mainPass.baseTex = this.texClosed;
        }
      }
      if (done) {
        if (this.cloudImage) {
          this.cloudImage.mainPass.baseTex = this.texClosed;
        }
        if (this.afterSpeak === "composed") {
          this.state = "composed";
          this.setNote(this.transcript);
          this.showComposedActions();
        } else if (this.afterSpeak === "inboxOpen") {
          // el pergamino queda abierto con Responder / Cerrar
          this.state = "inboxOpen";
          this.showInboxActions();
        } else {
          this.goReady();
        }
      }
    }

    // giro de la postal: del frente (foto) al dorso (mensaje)
    if (
      this.scrollObject &&
      this.scrollObject.enabled &&
      this.postcardFlip < 98
    ) {
      this.postcardFlip += dt;
      if (this.postcardFlip >= 0) {
        const k = Math.min(this.postcardFlip / 0.9, 1);
        const s = k * k * (3 - 2 * k);
        this.scrollObject
          .getTransform()
          .setLocalRotation(quat.angleAxis(s * Math.PI, vec3.up()));
        if (k >= 1) {
          this.postcardFlip = 99;
        }
      }
    }

    // animacion de la nubecita de notificacion: entra volando y luego flota
    if (this.notifCloud && this.notifVisible) {
      if (this.notifT < 1) {
        this.notifT = Math.min(1, this.notifT + dt / 1.2);
        const s = this.notifT * this.notifT * (3 - 2 * this.notifT);
        const from = new vec3(60, 30, -20);
        // pegadita a la nube grande (el toque en esa zona abre el mensaje
        // igual, sea que lo reciba ella o la nube grande)
        const to = new vec3(13, 5, 8);
        this.notifCloud.getTransform().setLocalPosition(vec3.lerp(from, to, s));
      } else {
        const lp = this.notifCloud.getTransform().getLocalPosition();
        this.notifCloud
          .getTransform()
          .setLocalPosition(
            new vec3(lp.x, 5 + Math.sin(this.elapsed * 2.6) * 1.5, lp.z)
          );
      }
    }

    // consulta periodica de mensajes entrantes
    if ((this.state === "ready" || this.state === "hidden") && !this.inbox) {
      this.pollT += dt;
      if (this.pollT >= 5 && !this.polling) {
        this.pollT = 0;
        this.checkIncoming();
      }
    }

    // seguimiento suave de la cabeza: la nube (y todo su sequito) acompana hacia donde miras
    if (
      this.state === "ready" ||
      this.state === "listening" ||
      this.state === "composed" ||
      this.state === "choosing" ||
      this.state === "speaking" ||
      this.state === "waitingAudio" ||
      this.state === "resolving" ||
      this.state === "sending"
    ) {
      const camT = this.cameraObject.getTransform();
      const camPos = camT.getWorldPosition();
      const f = camT.getWorldTransform().multiplyDirection(new vec3(0, 0, -1));
      f.y = 0;
      const fn = f.length > 0.01 ? f.normalize() : new vec3(0, 0, -1);
      const target = camPos.add(fn.uniformScale(80)).add(new vec3(0, -5, 0));
      const cur = this.getTransform().getWorldPosition();
      const k = 1 - Math.exp(-dt * 3);
      this.getTransform().setWorldPosition(vec3.lerp(cur, target, k));
    }

    // flotacion permanente
    if (this.cloudVisual && this.cloudVisual.enabled) {
      const lp = this.cloudVisual.getTransform().getLocalPosition();
      this.cloudVisual
        .getTransform()
        .setLocalPosition(
          new vec3(lp.x, Math.sin(this.elapsed * 2.0) * 3.0, lp.z)
        );
    }

    this.faceUser();
  }

  private setNote(text: string) {
    if (!this.noteTextComp && this.noteObject) {
      this.noteTextComp = this.findText(this.noteObject);
    }
    if (this.noteTextComp) {
      if (this.noteTextBaseSize < 0) {
        this.noteTextBaseSize = this.noteTextComp.size;
      }
      const fit = this.scriptFit();
      this.noteTextComp.size = Math.round(this.noteTextBaseSize * fit.sizeMul);
      this.noteTextComp.text = this.wrapText(
        text,
        Math.round((36 * fit.chars) / 16)
      );
    }
  }

  private findText(obj: SceneObject): Text {
    const own = obj.getComponent("Component.Text") as Text;
    if (own) {
      return own;
    }
    for (let i = 0; i < obj.getChildrenCount(); i++) {
      const found = this.findText(obj.getChild(i));
      if (found) {
        return found;
      }
    }
    return null;
  }

  // los alfabetos anchos (cirilico, arabe, devanagari) y los ideogramas
  // no entran igual que el latino: letra mas chica y/o cortes mas frecuentes
  private scriptFit(): { chars: number; sizeMul: number } {
    const lang = this.myLang();
    if (lang === "ja" || lang === "zh") {
      return { chars: 10, sizeMul: 0.85 };
    }
    if (lang === "ko") {
      return { chars: 11, sizeMul: 0.85 };
    }
    if (lang === "ru") {
      return { chars: 16, sizeMul: 0.7 };
    }
    if (lang === "ar" || lang === "hi") {
      return { chars: 16, sizeMul: 0.8 };
    }
    return { chars: 16, sizeMul: 1 };
  }

  private wrapText(text: string, maxChars: number): string {
    // corta palabras mas largas que la linea (japones/chino no usan espacios:
    // el mensaje entero llega como una sola "palabra")
    const raw = text.split(" ");
    const words: string[] = [];
    for (let i = 0; i < raw.length; i++) {
      let w = raw[i];
      while (w.length > maxChars) {
        words.push(w.substring(0, maxChars));
        w = w.substring(maxChars);
      }
      if (w.length > 0) {
        words.push(w);
      }
    }
    let lines: string[] = [];
    let current = "";
    for (let i = 0; i < words.length; i++) {
      const candidate = current.length > 0 ? current + " " + words[i] : words[i];
      if (candidate.length > maxChars && current.length > 0) {
        lines.push(current);
        current = words[i];
      } else {
        current = candidate;
      }
    }
    if (current.length > 0) {
      lines.push(current);
    }
    return lines.join("\n");
  }

  private faceUser() {
    const camPos = this.cameraObject.getTransform().getWorldPosition();
    const myPos = this.getTransform().getWorldPosition();
    const dir = camPos.sub(myPos);
    dir.y = 0;
    if (dir.length > 0.01) {
      this.getTransform().setWorldRotation(
        quat.lookAt(dir.normalize(), vec3.up())
      );
    }
  }
}
