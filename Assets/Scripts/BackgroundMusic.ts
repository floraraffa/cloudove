// BackgroundMusic: musica de fondo en loop, con boton de altavoz para mutear.
// La pista NO viene en el codigo: se asigna a mano en el Inspector.
//   1) Arrastra tu .mp3/.wav a Assets/
//   2) Selecciona el objeto "Music" y asignala en el campo Music Track.
// Sin pista asignada, el boton se esconde y no suena nada.
// La preferencia de mute queda persistida entre sesiones.

import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";

@component
export class BackgroundMusic extends BaseScriptComponent {
  @input
  @allowUndefined
  musicTrack: AudioTrackAsset;

  @input
  buttonRoot: SceneObject;

  @input
  texOn: Texture;

  @input
  texOff: Texture;

  private audio: AudioComponent = null;
  private muted: boolean = false;
  private ducked: boolean = false;
  private bound: boolean = false;

  private static instance: BackgroundMusic = null;

  // la nube avisa cuando esta hablando: la musica baja y despues vuelve
  static duck(on: boolean) {
    const inst = BackgroundMusic.instance;
    if (inst) {
      inst.ducked = on;
      inst.applyVolume();
    }
  }

  onAwake() {
    BackgroundMusic.instance = this;
    this.createEvent("OnStartEvent").bind(() => this.setup());
    // el boton vive bajo la nube (deshabilitada durante el intro): recien
    // cuando su jerarquia se habilita, el interactable puede recibir taps
    this.createEvent("UpdateEvent").bind(() => this.lazyBind());
  }

  private setup() {
    if (!this.musicTrack) {
      if (this.buttonRoot) {
        this.buttonRoot.enabled = false;
      }
      print("BackgroundMusic: sin pista asignada (campo Music Track), boton oculto");
      return;
    }
    this.audio = this.sceneObject.createComponent("Component.AudioComponent");
    this.audio.audioTrack = this.musicTrack;
    this.muted = global.persistentStorageSystem.store.getBool("musicMuted");
    this.applyVolume();
    this.audio.play(-1);
    print("BackgroundMusic: sonando en loop desde el inicio (muted=" + this.muted + ")");
  }

  private lazyBind() {
    if (this.bound || !this.audio || !this.buttonRoot) {
      return;
    }
    if (!this.buttonRoot.isEnabledInHierarchy) {
      return;
    }
    this.bound = true;
    for (let i = 0; i < this.buttonRoot.getChildrenCount(); i++) {
      const child = this.buttonRoot.getChild(i);
      const inter = child.getComponent(
        Interactable.getTypeName()
      ) as Interactable;
      if (inter) {
        inter.onTriggerEnd.add(() => this.toggle());
      }
    }
    this.updateIcon();
    print("BackgroundMusic: boton de mute conectado");
  }

  private applyVolume() {
    if (!this.audio) {
      return;
    }
    // muteada: 0 | hablando la nube: casi nada | normal: suave
    this.audio.volume = this.muted ? 0 : this.ducked ? 0.08 : 0.35;
  }

  private toggle() {
    this.muted = !this.muted;
    global.persistentStorageSystem.store.putBool("musicMuted", this.muted);
    this.applyVolume();
    this.updateIcon();
    print("BackgroundMusic: " + (this.muted ? "muteada" : "sonando"));
  }

  private updateIcon() {
    const icon = this.findChild(this.buttonRoot, "Icon");
    const tex = this.muted ? this.texOff : this.texOn;
    if (!icon || !tex) {
      return;
    }
    const img = icon.getComponent("Component.Image") as Image;
    if (img) {
      img.mainMaterial = img.mainMaterial.clone();
      img.mainPass.baseTex = tex;
      img.stretchMode = StretchMode.Stretch;
    }
  }

  private findChild(root: SceneObject, name: string): SceneObject {
    if (!root) {
      return null;
    }
    for (let i = 0; i < root.getChildrenCount(); i++) {
      if (root.getChild(i).name === name) {
        return root.getChild(i);
      }
    }
    return null;
  }
}
