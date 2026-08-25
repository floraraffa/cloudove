// CloudMessaging: capa de mensajeria sobre Snap Cloud (Supabase, proyecto "Cloud Messages").
// Identidad: cada usuario se registra con nombre + idioma y recibe un codigo de amigo (NUBE-XX)
// que queda persistido en el device. Los mensajes viajan como texto por la tabla `messages`
// y esperan en la base hasta que el destinatario abre la lente.

import { createClient } from "SupabaseClient.lspkg/supabase-snapcloud";

export interface CloudMessage {
  id: string;
  from_code: string;
  from_name: string;
  to_code: string;
  text: string;
  lang: string;
}

@component
export class CloudMessaging extends BaseScriptComponent {
  // asset creado por el plugin de Supabase con "Import Credentials" (camino oficial de Snap Cloud)
  @input
  supabaseProject: SupabaseProject;

  private client: any = null;
  private static instance: CloudMessaging = null;

  onAwake() {
    CloudMessaging.instance = this;
  }

  static get(): CloudMessaging {
    return CloudMessaging.instance;
  }

  private getClient(): any {
    if (this.client) {
      return this.client;
    }
    if (!this.supabaseProject) {
      print(
        "CloudMessaging: falta el asset Supabase Project (plugin de Supabase -> Import Credentials)"
      );
      return null;
    }
    this.client = createClient(
      this.supabaseProject.url,
      this.supabaseProject.publicToken
    );
    print("CloudMessaging: cliente conectado a " + this.supabaseProject.name);
    return this.client;
  }

  isReady(): boolean {
    return this.getClient() != null;
  }

  myCode(): string {
    return global.persistentStorageSystem.store.getString("userCode") || "";
  }

  myName(): string {
    return global.persistentStorageSystem.store.getString("userName") || "";
  }

  isRegistered(): boolean {
    return this.myCode().length > 0;
  }

  // limpia el nombre que llega del ASR: sin puntuacion, sin espacios extra,
  // primera letra en mayuscula — asi "flor.", "Flor" y "FLOR" son la misma persona
  static cleanName(raw: string): string {
    let n = raw
      .split(".").join("")
      .split(",").join("")
      .split("!").join("")
      .split("?").join("")
      .trim();
    if (n.length > 24) {
      n = n.substring(0, 24);
    }
    if (n.length > 0) {
      n = n.charAt(0).toUpperCase() + n.substring(1);
    }
    return n;
  }

  // convierte un email dictado por voz a formato real:
  // "flor arroba gmail punto com" -> "flor@gmail.com"
  static cleanEmail(raw: string): string {
    let e = (" " + raw.toLowerCase() + " ")
      .split(" arroba ").join("@")
      .split(" at ").join("@")
      .split(" arobase ").join("@")
      .split(" chiocciola ").join("@")
      .split(" punto ").join(".")
      .split(" ponto ").join(".")
      .split(" point ").join(".")
      .split(" punkt ").join(".")
      .split(" dot ").join(".")
      .split(" guion bajo ").join("_")
      .split(" guion ").join("-")
      .split(" underscore ").join("_")
      .split(" dash ").join("-");
    e = e.split(" ").join("").split(",").join("");
    while (e.length > 0 && e.charAt(e.length - 1) === ".") {
      e = e.substring(0, e.length - 1);
    }
    return e;
  }

  static isValidEmail(email: string): boolean {
    const at = email.indexOf("@");
    return at > 0 && email.indexOf(".", at) > at + 1;
  }

  // login: busca la cuenta por email; si existe, restaura la sesion en este device
  async loginByEmail(
    email: string,
    lang: string
  ): Promise<{ code: string; name: string } | null> {
    const client = this.getClient();
    if (!client) {
      throw "Snap Cloud sin configurar";
    }
    const { data, error } = await client
      .from("users")
      .select("*")
      .ilike("email", email)
      .limit(1);
    if (error) {
      throw error.message;
    }
    if (!data || data.length === 0) {
      return null;
    }
    const u = data[0];
    global.persistentStorageSystem.store.putString("userCode", u.code);
    global.persistentStorageSystem.store.putString("userName", u.name);
    global.persistentStorageSystem.store.putString("userEmail", email);
    print("CloudMessaging: login por email OK: " + u.name + " (" + u.code + ")");
    return { code: u.code, name: u.name };
  }

  // registro de cuenta nueva: email + nombre
  async register(
    name: string,
    lang: string,
    email: string
  ): Promise<{ code: string; name: string; existing: boolean }> {
    const client = this.getClient();
    if (!client) {
      throw "Snap Cloud sin configurar";
    }
    const finalName = CloudMessaging.cleanName(name);
    let code = this.myCode();
    if (code.length === 0) {
      // genera un codigo NUBE unico (verifica que no exista antes de usarlo)
      for (let i = 0; i < 6; i++) {
        const cand = "NUBE-" + Math.floor(100 + Math.random() * 900);
        const { data } = await client
          .from("users")
          .select("code")
          .eq("code", cand)
          .limit(1);
        if (!data || data.length === 0) {
          code = cand;
          break;
        }
      }
      if (code.length === 0) {
        code = "NUBE-" + Math.floor(1000 + Math.random() * 9000);
      }
    }
    const { error } = await client
      .from("users")
      .upsert({ code: code, name: finalName, lang: lang, email: email });
    if (error) {
      throw error.message;
    }
    global.persistentStorageSystem.store.putString("userCode", code);
    global.persistentStorageSystem.store.putString("userName", finalName);
    global.persistentStorageSystem.store.putString("userEmail", email);
    print("CloudMessaging: cuenta creada: " + finalName + " / " + email + " (" + code + ")");
    return { code: code, name: finalName, existing: false };
  }

  // busca un usuario por su direccion: email (con @) o codigo NUBE
  // acepta "NUBE-123", "nube 123" o solo "123"
  async findByAddress(address: string): Promise<any> {
    const client = this.getClient();
    if (!client) {
      throw "Snap Cloud sin configurar";
    }
    const a = address.toLowerCase().split(" ").join("");
    if (a.indexOf("@") >= 0) {
      const { data, error } = await client
        .from("users")
        .select("*")
        .ilike("email", a)
        .limit(1);
      if (error) {
        throw error.message;
      }
      return data && data.length > 0 ? data[0] : null;
    }
    let code = a.toUpperCase().split("_").join("-");
    const digits = code.split("NUBE").join("").split("-").join("");
    if (digits.length > 0) {
      code = "NUBE-" + digits;
    }
    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("code", code)
      .limit(1);
    if (error) {
      throw error.message;
    }
    return data && data.length > 0 ? data[0] : null;
  }

  async findUser(code: string): Promise<any> {
    const client = this.getClient();
    if (!client) {
      throw "Snap Cloud sin configurar";
    }
    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("code", code.toUpperCase())
      .maybeSingle();
    if (error) {
      throw error.message;
    }
    return data;
  }

  // los demas usuarios registrados de la lente (para el selector de destinatario)
  async listUsers(): Promise<any[]> {
    const client = this.getClient();
    if (!client) {
      throw "Snap Cloud sin configurar";
    }
    const { data, error } = await client
      .from("users")
      .select("*")
      .neq("code", this.myCode())
      .limit(10);
    if (error) {
      throw error.message;
    }
    return data || [];
  }

  async send(
    toCode: string,
    text: string,
    lang: string,
    photo: string
  ): Promise<void> {
    const client = this.getClient();
    if (!client) {
      throw "Snap Cloud sin configurar";
    }
    const row: any = {
      from_code: this.myCode(),
      from_name: this.myName(),
      to_code: toCode,
      text: text,
      lang: lang,
    };
    if (photo && photo.length > 0) {
      row.photo = photo;
    }
    const { error } = await client.from("messages").insert(row);
    if (error) {
      throw error.message;
    }
    print("CloudMessaging: mensaje enviado a " + toCode);
  }

  async fetchUnread(): Promise<CloudMessage[]> {
    const client = this.getClient();
    if (!client) {
      return [];
    }
    const me = this.myCode();
    if (me.length === 0) {
      return [];
    }
    const { data, error } = await client
      .from("messages")
      .select("*")
      .eq("to_code", me)
      .eq("read", false)
      .order("created_at");
    if (error) {
      print("CloudMessaging: error al buscar mensajes -> " + error.message);
      return [];
    }
    return data || [];
  }

  async markRead(id: string): Promise<void> {
    const client = this.getClient();
    if (!client) {
      return;
    }
    await client.from("messages").update({ read: true }).eq("id", id);
  }

  // los mensajes se ven UNA sola vez: al cerrarlos o responderlos se eliminan para siempre
  async deleteMessage(id: string): Promise<void> {
    const client = this.getClient();
    if (!client) {
      return;
    }
    const { error } = await client.from("messages").delete().eq("id", id);
    if (error) {
      print("CloudMessaging: ERROR al eliminar mensaje -> " + error.message);
    } else {
      print("CloudMessaging: mensaje eliminado para siempre");
    }
  }
}
