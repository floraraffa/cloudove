// SetTexture: asigna una textura a un Image clonando su material,
// para no afectar a otros Images que compartan el material default.

@component
export class SetTexture extends BaseScriptComponent {
  @input
  image: Image;

  @input
  texture: Texture;

  onAwake() {
    if (this.image && this.texture) {
      this.image.mainMaterial = this.image.mainMaterial.clone();
      this.image.mainPass.baseTex = this.texture;
    }
  }
}
