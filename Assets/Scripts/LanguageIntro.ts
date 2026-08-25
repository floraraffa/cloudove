// LanguageIntro: menu de idiomas sobre una POSTAL.
// - Los idiomas son pastillas en el lado de escritura (derecha) de la postal.
// - Al elegir: la ESTAMPILLA del pais aparece en el recuadro punteado,
//   la postal se DA VUELTA mostrando el poster del destino elegido,
//   y se va volando en un zigzag suave. Recien entonces entra la nube.

import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { getLang } from "./Languages";

@component
export class LanguageIntro extends BaseScriptComponent {
  @input
  buttonsContainer: SceneObject;

  @input
  messengerRoot: SceneObject;

  @input
  stampsContainer: SceneObject;

  @input
  landmarksContainer: SceneObject;

  @input
  chosenStampObj: SceneObject;

  @input
  cardBackObj: SceneObject;

  @input
  titleObj: SceneObject;

  // -1: quieta | >=0: animacion de despedida
  private leaving: number = -1;
  private basePos: vec3 = vec3.zero();

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => this.setup());
    this.createEvent("UpdateEvent").bind(() => this.update());
  }

  private setup() {
    this.basePos = this.getTransform().getWorldPosition();
    if (this.chosenStampObj) {
      this.chosenStampObj.enabled = false;
    }
    const saved = global.persistentStorageSystem.store.getString("nativeLang");
    if (saved && saved.length > 0) {
      print("LanguageIntro: idioma recordado -> " + saved + ", salteando menu");
      this.finish();
      return;
    }
    let wired = 0;
    for (let i = 0; i < this.buttonsContainer.getChildrenCount(); i++) {
      const child = this.buttonsContainer.getChild(i);
      const code = child.name;
      const interactable = child.getComponent(
        Interactable.getTypeName()
      ) as Interactable;
      if (interactable) {
        interactable.onTriggerEnd.add(() => this.selectLanguage(code));
        // al pasar por encima, la estampilla del pais se asoma en el recuadro
        interactable.onHoverEnter.add(() => this.previewStamp(code));
        wired++;
      }
    }
    print("LanguageIntro: " + wired + " idiomas listos");
  }

  private previewStamp(code: string) {
    if (this.leaving >= 0) {
      return;
    }
    this.setImageTex(this.chosenStampObj, this.texFor(this.stampsContainer, code));
    // el titulo saluda en el idioma que estas señalando
    this.setTitle(code);
  }

  private setTitle(code: string) {
    if (!this.titleObj) {
      return;
    }
    const lang = getLang(code);
    if (!lang || !lang.chooseLang) {
      return;
    }
    const txt = this.titleObj.getComponent("Component.Text") as Text;
    if (txt) {
      txt.text = lang.chooseLang;
    }
  }

  private findChild(container: SceneObject, name: string): SceneObject {
    if (!container) {
      return null;
    }
    for (let i = 0; i < container.getChildrenCount(); i++) {
      if (container.getChild(i).name === name) {
        return container.getChild(i);
      }
    }
    return null;
  }

  // los contenedores indice guardan una textura por idioma en un SetTexture
  private texFor(container: SceneObject, code: string): Texture {
    const holder = this.findChild(container, code);
    if (!holder) {
      return null;
    }
    const sc = holder.getComponent("Component.ScriptComponent") as any;
    return sc && sc.texture ? (sc.texture as Texture) : null;
  }

  private setImageTex(obj: SceneObject, tex: Texture) {
    if (!obj || !tex) {
      return;
    }
    const img = obj.getComponent("Component.Image") as Image;
    if (img) {
      img.mainMaterial = img.mainMaterial.clone();
      img.mainPass.baseTex = tex;
      // Stretch: la imagen llena su marco completo (estampilla en el
      // recuadro punteado, poster a todo lo ancho del dorso)
      img.stretchMode = StretchMode.Stretch;
      obj.enabled = true;
    }
  }

  selectLanguage(code: string) {
    if (this.leaving >= 0) {
      return;
    }
    global.persistentStorageSystem.store.putString("nativeLang", code);
    print("LanguageIntro: idioma elegido -> " + code);
    // la estampilla del pais se "franquea" en el recuadro punteado
    this.setImageTex(this.chosenStampObj, this.texFor(this.stampsContainer, code));
    this.setTitle(code);
    // y el dorso (apaisado, como la postal de mensajes) muestra el destino
    if (this.cardBackObj) {
      this.cardBackObj.enabled = true;
      const poster = this.findChild(this.cardBackObj, "BackPoster");
      this.setImageTex(
        poster ? poster : this.cardBackObj,
        this.texFor(this.landmarksContainer, code)
      );
    }
    this.leaving = 0;
  }

  private update() {
    if (this.leaving < 0) {
      return;
    }
    this.leaving += getDeltaTime();
    const flipDur = 1.3;
    const travelDur = 3.4;

    if (this.leaving <= flipDur) {
      // fase 1: la postal se da vuelta y muestra el destino
      const k = this.leaving / flipDur;
      const s = k * k * (3 - 2 * k);
      this.getTransform().setLocalRotation(
        quat.angleAxis(s * Math.PI, vec3.up())
      );
      return;
    }

    // fase 2: se va despacio, en un zigzag suave
    this.getTransform().setLocalRotation(quat.angleAxis(Math.PI, vec3.up()));
    const t2 = Math.min((this.leaving - flipDur) / travelDur, 1);
    const s2 = t2 * t2 * (3 - 2 * t2);
    const zig = Math.sin(s2 * Math.PI * 3) * 7;
    const offset = new vec3(s2 * 22 + zig, s2 * 18, s2 * -42);
    this.getTransform().setWorldPosition(this.basePos.add(offset));
    const sc = 1 - s2 * 0.5;
    this.getTransform().setLocalScale(new vec3(sc, sc, sc));
    if (t2 >= 1) {
      this.finish();
    }
  }

  private finish() {
    this.sceneObject.enabled = false;
    if (this.messengerRoot) {
      this.messengerRoot.enabled = true;
    }
  }
}
