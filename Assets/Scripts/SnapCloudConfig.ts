// SnapCloudConfig: credenciales del proyecto Snap Cloud "Cloud Messages".
// Pega aca la Project URL y la anon key (la anon key esta pensada para ir en el cliente).

@component
export class SnapCloudConfig extends BaseScriptComponent {
  @input
  @label("Project URL")
  projectUrl: string = "[PEGAR PROJECT URL]";

  @input
  @label("Anon Key")
  anonKey: string = "[PEGAR ANON KEY]";

  private static instance: SnapCloudConfig = null;

  onAwake() {
    SnapCloudConfig.instance = this;
  }

  static get(): SnapCloudConfig {
    return SnapCloudConfig.instance;
  }

  static isConfigured(): boolean {
    const c = SnapCloudConfig.instance;
    return (
      c != null &&
      c.projectUrl.indexOf("PEGAR") < 0 &&
      c.anonKey.indexOf("PEGAR") < 0 &&
      c.projectUrl.length > 10
    );
  }
}
