// Catalogo de idiomas de Flying Messages.
// label: como se muestra en el menu. greeting: presentacion hablada de la nube.
// ui: todos los textos del sistema (botones, avisos, registro, envio, recepcion).
// Plantillas: {name} y {code} se reemplazan en runtime.

export interface UIStrings {
  askNameIntro: string;
  reentry: string;
  sayName: string;
  record: string;
  stop: string;
  replay: string;
  del: string;
  send: string;
  listening: string;
  askName: string;
  noHear: string;
  registering: string;
  registered: string;
  welcomeBack: string;
  askEmailIntro: string;
  sayEmail: string;
  askEmail: string;
  badEmail: string;
  newAccount: string;
  askRecipient: string;
  notFound: string;
  newMessageFrom: string;
  reply: string;
  close: string;
  readMsg: string;
  writeBtn: string;
  typeMsg: string;
  photoBtn: string;
  photoTaken: string;
  cameraNo: string;
  deleted: string;
  searching: string;
  noFriends: string;
  whoTo: string;
  sending: string;
  sent: string;
  sendError: string;
  says: string;
  translating: string;
}

export interface LangDef {
  code: string;
  label: string;
  place: string;
  chooseLang: string;
  greeting: string;
  ui: UIStrings;
}

export const LANGS: LangDef[] = [
  {
    code: "es",
    chooseLang: "Elegi tu idioma",
    place: "Buenos Aires",
    label: "Español",
    greeting:
      "Hola! Soy tu nube mensajera. Grabo tu mensaje de voz, se lo llevo volando a quien elijas y se lo leo en su idioma. Tocame para grabar tu mensaje.",
    ui: {
      askNameIntro:
        "Hola! Soy tu nube mensajera. Llevo mensajes de voz a tus amigos y se los leo en su idioma. Primero, toca el boton y decime tu nombre.",
      reentry: "Mensaje nuevo? Escribi o graba.",
      sayName: "Decir mi nombre",
      record: "Grabar",
      stop: "Detener",
      replay: "Repetir",
      del: "Borrar",
      send: "Enviar",
      listening: "Te escucho...",
      askName: "Como te llamas?",
      noHear: "No escuche nada. Proba de nuevo.",
      registering: "Registrando a {name}...",
      registered: "Listo {name}! Tu codigo de amigo es {code}. Compartilo con quien quieras que te escriba. Ahora escribi o graba tu primer mensaje.",
      welcomeBack: "Bienvenida de nuevo {name}! Tu codigo sigue siendo {code}. Escribi o graba tu mensaje cuando quieras.",
      askEmailIntro:
        "Hola! Soy tu nube mensajera. Llevo mensajes de voz entre amigos y se los leo a cada uno en su idioma. Y ojo: cada mensaje se puede ver una sola vez, despues desaparece para siempre. Para empezar, toca el boton y escribi tu email.",
      sayEmail: "Escribir mi email",
      askEmail: "Cual es tu email?",
      badEmail: "No entendi el email. Proba de nuevo, letra por letra.",
      newAccount:
        "No encontre ese email, creemos tu cuenta! Toca el boton y decime tu nombre.",
      askRecipient:
        "Escribi el email o el codigo NUBE de tu amigo",
      notFound:
        "No encontre a nadie con esa direccion. Fijate si esta bien escrita.",
      newMessageFrom:
        "Tenes un mensaje nuevo de {name}! Toca la nubecita para leerlo.",
      reply: "Responder",
      close: "Cerrar",
      readMsg: "Leer mensaje",
      writeBtn: "Escribir",
      typeMsg: "Escribi tu mensaje",
      photoBtn: "Foto",
      photoTaken: "Foto lista! Va a viajar con tu mensaje. Toca Foto de nuevo para repetirla.",
      cameraNo: "La camara solo funciona en los Spectacles. Tu mensaje va igual, con una postal de diseno.",
      deleted: "Mensaje borrado. Grabemos otro!",
      searching: "Buscando amigos...",
      noFriends:
        "Aun no hay amigos registrados. Compartile tu codigo {code} a un amigo: cuando abra la lente y diga su nombre, va a aparecer aca.",
      whoTo: "A quien se lo mando?",
      sending: "Enviando a {name}...",
      sent: "Enviado a {name}!",
      sendError: "No pude enviarlo: ",
      says: "{name} te dice:",
      translating: "Traduciendo...",
    },
  },
  {
    code: "en",
    chooseLang: "Choose your language",
    place: "New York",
    label: "English",
    greeting:
      "Hi! I'm your messenger cloud. I record your voice message, fly it to whoever you choose, and read it aloud in their language. Tap me to record your message.",
    ui: {
      askNameIntro:
        "Hi! I'm your messenger cloud. I carry voice messages to your friends and read them in their language. First, tap the button and tell me your name.",
      reentry: "New message? Type or record.",
      sayName: "Say my name",
      record: "Record",
      stop: "Stop",
      replay: "Replay",
      del: "Delete",
      send: "Send",
      listening: "I'm listening...",
      askName: "What's your name?",
      noHear: "I didn't hear anything. Try again.",
      registering: "Registering {name}...",
      registered: "Done {name}! Your friend code is {code}. Share it with anyone you want to hear from. Now type or record your first message.",
      welcomeBack: "Welcome back {name}! Your code is still {code}. Type or record your message whenever you like.",
      askEmailIntro:
        "Hi! I'm your messenger cloud. I carry voice messages between friends and read them to each one in their own language. And careful: each message can only be seen once, then it disappears forever. To start, tap the button and type your email.",
      sayEmail: "Type my email",
      askEmail: "What's your email?",
      badEmail: "I didn't catch that email. Try again, slowly.",
      newAccount:
        "I couldn't find that email, let's create your account! Tap the button and tell me your name.",
      askRecipient: "Type your friend's email or NUBE code",
      notFound: "I couldn't find anyone at that address. Check the spelling.",
      newMessageFrom: "You have a new message from {name}! Tap the little cloud to read it.",
      reply: "Reply",
      close: "Close",
      readMsg: "Read message",
      writeBtn: "Type",
      typeMsg: "Type your message",
      photoBtn: "Photo",
      photoTaken: "Photo ready! It will travel with your message. Tap Photo again to retake.",
      cameraNo: "The camera only works on Spectacles. Your message will still travel with a designer postcard.",
      deleted: "Message deleted. Let's record another!",
      searching: "Looking for friends...",
      noFriends:
        "No friends registered yet. Share your code {code} with a friend: when they open the Lens and say their name, they'll show up here.",
      whoTo: "Who should I take it to?",
      sending: "Sending to {name}...",
      sent: "Sent to {name}!",
      sendError: "I couldn't send it: ",
      says: "{name} says:",
      translating: "Translating...",
    },
  },
  {
    code: "fr",
    chooseLang: "Choisis ta langue",
    place: "Paris",
    label: "Français",
    greeting:
      "Salut ! Je suis ton nuage messager. J'enregistre ton message vocal, je l'apporte a qui tu veux et je le lis dans sa langue. Touche-moi pour enregistrer ton message.",
    ui: {
      askNameIntro:
        "Salut ! Je suis ton nuage messager. J'apporte des messages vocaux a tes amis et je les lis dans leur langue. D'abord, touche le bouton et dis-moi ton prenom.",
      reentry: "Nouveau message ? Ecris ou enregistre.",
      sayName: "Dire mon prenom",
      record: "Enregistrer",
      stop: "Arreter",
      replay: "Reecouter",
      del: "Supprimer",
      send: "Envoyer",
      listening: "Je t'ecoute...",
      askName: "Comment tu t'appelles ?",
      noHear: "Je n'ai rien entendu. Reessaie.",
      registering: "Enregistrement de {name}...",
      registered: "C'est fait {name} ! Ton code ami est {code}. Partage-le avec qui tu veux. Maintenant ecris ou enregistre ton premier message.",
      welcomeBack: "Content de te revoir {name} ! Ton code est toujours {code}. Ecris ou enregistre ton message quand tu veux.",
      askEmailIntro:
        "Salut ! Je suis ton nuage messager. Je porte des messages vocaux entre amis et je les lis a chacun dans sa langue. Attention : chaque message ne se voit qu'une seule fois, puis il disparait pour toujours. Pour commencer, touche le bouton et tape ton email.",
      sayEmail: "Taper mon email",
      askEmail: "Quel est ton email ?",
      badEmail: "Je n'ai pas compris l'email. Reessaie lentement.",
      newAccount:
        "Je n'ai pas trouve cet email, creons ton compte ! Touche le bouton et dis-moi ton prenom.",
      askRecipient: "Tape l'email ou le code NUBE de ton ami",
      notFound: "Je n'ai trouve personne a cette adresse. Verifie l'orthographe.",
      newMessageFrom: "Tu as un nouveau message de {name} ! Touche le petit nuage pour le lire.",
      reply: "Repondre",
      close: "Fermer",
      readMsg: "Lire le message",
      writeBtn: "Ecrire",
      typeMsg: "Ecris ton message",
      photoBtn: "Photo",
      photoTaken: "Photo prete ! Elle voyagera avec ton message. Retouche Photo pour recommencer.",
      cameraNo: "La camera ne fonctionne que sur les Spectacles. Ton message partira avec une carte design.",
      deleted: "Message supprime. On en enregistre un autre !",
      searching: "Recherche d'amis...",
      noFriends:
        "Aucun ami inscrit pour l'instant. Partage ton code {code} : quand ton ami ouvrira la Lens et dira son prenom, il apparaitra ici.",
      whoTo: "A qui je l'apporte ?",
      sending: "Envoi a {name}...",
      sent: "Envoye a {name} !",
      sendError: "Je n'ai pas pu l'envoyer : ",
      says: "{name} te dit :",
      translating: "Traduction...",
    },
  },
  {
    code: "pt",
    chooseLang: "Escolha seu idioma",
    place: "Rio de Janeiro",
    label: "Português",
    greeting:
      "Oi! Sou sua nuvem mensageira. Gravo sua mensagem de voz, levo voando para quem voce escolher e leio no idioma da pessoa. Toque em mim para gravar sua mensagem.",
    ui: {
      askNameIntro:
        "Oi! Sou sua nuvem mensageira. Levo mensagens de voz para seus amigos e leio no idioma deles. Primeiro, toque no botao e me diga seu nome.",
      reentry: "Mensagem nova? Escreva ou grave.",
      sayName: "Dizer meu nome",
      record: "Gravar",
      stop: "Parar",
      replay: "Repetir",
      del: "Apagar",
      send: "Enviar",
      listening: "Estou ouvindo...",
      askName: "Qual e o seu nome?",
      noHear: "Nao ouvi nada. Tente de novo.",
      registering: "Registrando {name}...",
      registered: "Pronto {name}! Seu codigo de amigo e {code}. Compartilhe com quem voce quiser. Agora escreva ou grave sua primeira mensagem.",
      welcomeBack: "Bem-vinda de volta {name}! Seu codigo continua sendo {code}. Escreva ou grave sua mensagem quando quiser.",
      askEmailIntro:
        "Oi! Sou sua nuvem mensageira. Levo mensagens de voz entre amigos e leio para cada um no seu idioma. E atencao: cada mensagem so pode ser vista uma vez, depois desaparece para sempre. Para comecar, toque no botao e digite seu email.",
      sayEmail: "Digitar meu email",
      askEmail: "Qual e o seu email?",
      badEmail: "Nao entendi o email. Tente de novo, devagar.",
      newAccount:
        "Nao encontrei esse email, vamos criar sua conta! Toque no botao e me diga seu nome.",
      askRecipient: "Digite o email ou o codigo NUBE do seu amigo",
      notFound: "Nao encontrei ninguem nesse endereco. Confira a escrita.",
      newMessageFrom: "Voce tem uma mensagem nova de {name}! Toque na nuvenzinha para ler.",
      reply: "Responder",
      close: "Fechar",
      readMsg: "Ler mensagem",
      writeBtn: "Escrever",
      typeMsg: "Escreva sua mensagem",
      photoBtn: "Foto",
      photoTaken: "Foto pronta! Vai viajar com sua mensagem. Toque em Foto de novo para repetir.",
      cameraNo: "A camera so funciona nos Spectacles. Sua mensagem vai mesmo assim, com um cartao de design.",
      deleted: "Mensagem apagada. Vamos gravar outra!",
      searching: "Procurando amigos...",
      noFriends:
        "Ainda nao ha amigos registrados. Compartilhe seu codigo {code}: quando seu amigo abrir a Lens e disser o nome, ele aparece aqui.",
      whoTo: "Para quem eu levo?",
      sending: "Enviando para {name}...",
      sent: "Enviado para {name}!",
      sendError: "Nao consegui enviar: ",
      says: "{name} diz:",
      translating: "Traduzindo...",
    },
  },
  {
    code: "it",
    chooseLang: "Scegli la tua lingua",
    place: "Roma",
    label: "Italiano",
    greeting:
      "Ciao! Sono la tua nuvola messaggera. Registro il tuo messaggio vocale, lo porto a chi vuoi e lo leggo nella sua lingua. Toccami per registrare il tuo messaggio.",
    ui: {
      askNameIntro:
        "Ciao! Sono la tua nuvola messaggera. Porto messaggi vocali ai tuoi amici e li leggo nella loro lingua. Prima, tocca il pulsante e dimmi il tuo nome.",
      reentry: "Nuovo messaggio? Scrivi o registra.",
      sayName: "Dire il mio nome",
      record: "Registra",
      stop: "Ferma",
      replay: "Riascolta",
      del: "Elimina",
      send: "Invia",
      listening: "Ti ascolto...",
      askName: "Come ti chiami?",
      noHear: "Non ho sentito nulla. Riprova.",
      registering: "Registrando {name}...",
      registered: "Fatto {name}! Il tuo codice amico e {code}. Condividilo con chi vuoi. Ora scrivi o registra il tuo primo messaggio.",
      welcomeBack: "Bentornata {name}! Il tuo codice e sempre {code}. Scrivi o registra il tuo messaggio quando vuoi.",
      askEmailIntro:
        "Ciao! Sono la tua nuvola messaggera. Porto messaggi vocali tra amici e li leggo a ciascuno nella sua lingua. Attenzione: ogni messaggio si puo vedere una sola volta, poi sparisce per sempre. Per iniziare, tocca il pulsante e scrivi la tua email.",
      sayEmail: "Scrivere la mia email",
      askEmail: "Qual e la tua email?",
      badEmail: "Non ho capito l'email. Riprova lentamente.",
      newAccount:
        "Non ho trovato questa email, creiamo il tuo account! Tocca il pulsante e dimmi il tuo nome.",
      askRecipient: "Scrivi l'email o il codice NUBE del tuo amico",
      notFound: "Non ho trovato nessuno a questo indirizzo. Controlla la scrittura.",
      newMessageFrom: "Hai un nuovo messaggio da {name}! Tocca la nuvoletta per leggerlo.",
      reply: "Rispondi",
      close: "Chiudi",
      readMsg: "Leggi messaggio",
      writeBtn: "Scrivi",
      typeMsg: "Scrivi il tuo messaggio",
      photoBtn: "Foto",
      photoTaken: "Foto pronta! Viaggera con il tuo messaggio. Tocca Foto di nuovo per rifarla.",
      cameraNo: "La fotocamera funziona solo sugli Spectacles. Il messaggio partira comunque con una cartolina di design.",
      deleted: "Messaggio eliminato. Registriamone un altro!",
      searching: "Cerco amici...",
      noFriends:
        "Nessun amico registrato ancora. Condividi il tuo codice {code}: quando il tuo amico aprira la Lens e dira il suo nome, apparira qui.",
      whoTo: "A chi lo porto?",
      sending: "Invio a {name}...",
      sent: "Inviato a {name}!",
      sendError: "Non sono riuscita a inviarlo: ",
      says: "{name} dice:",
      translating: "Traduco...",
    },
  },
  {
    code: "de",
    chooseLang: "Wahle deine Sprache",
    place: "Berlin",
    label: "Deutsch",
    greeting:
      "Hallo! Ich bin deine Botenwolke. Ich nehme deine Sprachnachricht auf, fliege sie zu wem du willst und lese sie in seiner Sprache vor. Tippe mich an, um deine Nachricht aufzunehmen.",
    ui: {
      askNameIntro:
        "Hallo! Ich bin deine Botenwolke. Ich bringe Sprachnachrichten zu deinen Freunden und lese sie in ihrer Sprache vor. Tippe zuerst auf den Knopf und sag mir deinen Namen.",
      reentry: "Neue Nachricht? Schreiben oder aufnehmen.",
      sayName: "Meinen Namen sagen",
      record: "Aufnehmen",
      stop: "Stopp",
      replay: "Anhoren",
      del: "Loschen",
      send: "Senden",
      listening: "Ich hore zu...",
      askName: "Wie heisst du?",
      noHear: "Ich habe nichts gehort. Versuch es nochmal.",
      registering: "Registriere {name}...",
      registered: "Fertig {name}! Dein Freundescode ist {code}. Teile ihn mit wem du willst. Jetzt schreib oder sprich deine erste Nachricht.",
      welcomeBack: "Willkommen zurueck {name}! Dein Code ist weiterhin {code}. Schreib oder sprich deine Nachricht, wann du willst.",
      askEmailIntro:
        "Hallo! Ich bin deine Botenwolke. Ich trage Sprachnachrichten zwischen Freunden und lese sie jedem in seiner Sprache vor. Achtung: jede Nachricht kann nur EINMAL gesehen werden, dann verschwindet sie fur immer. Tippe zum Start auf den Knopf und gib deine E-Mail ein.",
      sayEmail: "E-Mail eingeben",
      askEmail: "Wie lautet deine E-Mail?",
      badEmail: "Ich habe die E-Mail nicht verstanden. Versuch es langsam nochmal.",
      newAccount:
        "Diese E-Mail kenne ich nicht, erstellen wir dein Konto! Tippe auf den Knopf und sag mir deinen Namen.",
      askRecipient: "Gib die E-Mail oder den NUBE-Code deines Freundes ein",
      notFound: "Ich habe niemanden mit dieser Adresse gefunden. Prufe die Schreibweise.",
      newMessageFrom: "Du hast eine neue Nachricht von {name}! Tippe auf die kleine Wolke, um sie zu lesen.",
      reply: "Antworten",
      close: "Schliessen",
      readMsg: "Nachricht lesen",
      writeBtn: "Schreiben",
      typeMsg: "Schreib deine Nachricht",
      photoBtn: "Foto",
      photoTaken: "Foto fertig! Sie reist mit deiner Nachricht. Tippe erneut auf Foto zum Wiederholen.",
      cameraNo: "Die Kamera funktioniert nur auf den Spectacles. Deine Nachricht reist trotzdem, mit einer Design-Postkarte.",
      deleted: "Nachricht geloscht. Nehmen wir eine neue auf!",
      searching: "Suche Freunde...",
      noFriends:
        "Noch keine Freunde registriert. Teile deinen Code {code}: wenn dein Freund die Lens offnet und seinen Namen sagt, erscheint er hier.",
      whoTo: "Zu wem soll ich sie bringen?",
      sending: "Sende an {name}...",
      sent: "Gesendet an {name}!",
      sendError: "Ich konnte sie nicht senden: ",
      says: "{name} sagt:",
      translating: "Ubersetze...",
    },
  },
  {
    code: "ja",
    chooseLang: "言語を選んでね",
    place: "Monte Fuji",
    label: "日本語",
    greeting:
      "こんにちは！私はあなたのメッセンジャークラウドです。声のメッセージを録音して、選んだ相手に届けて、その人の言語で読み上げます。タップしてメッセージを録音してね。",
    ui: {
      askNameIntro:
        "こんにちは！私はメッセンジャークラウドです。友達に声のメッセージを届けて、相手の言語で読み上げます。まず、ボタンをタップして名前を教えてね。",
      reentry: "新しいメッセージ？書くか録音してね。",
      sayName: "名前を言う",
      record: "録音",
      stop: "停止",
      replay: "もう一度聞く",
      del: "削除",
      send: "送信",
      listening: "聞いています...",
      askName: "お名前は？",
      noHear: "聞こえませんでした。もう一度どうぞ。",
      registering: "{name}を登録中...",
      registered: "できたよ{name}！フレンドコードは{code}。伝えたい人にシェアしてね。さっそくメッセージを書くか録音してみて。",
      welcomeBack: "おかえり{name}！コードは{code}のままだよ。メッセージを書くか録音してね。",
      askEmailIntro:
        "こんにちは！私はメッセンジャークラウド。友達同士の声のメッセージを運んで、それぞれの言語で読み上げます。注意：メッセージは一度しか見られず、その後は永遠に消えます。始めるにはボタンをタップしてメールを入力してね。",
      sayEmail: "メールを入力",
      askEmail: "メールアドレスは？",
      badEmail: "メールが聞き取れませんでした。ゆっくりもう一度どうぞ。",
      newAccount:
        "そのメールは見つかりませんでした。アカウントを作りましょう！ボタンをタップして名前を教えてね。",
      askRecipient: "友達のメールまたはNUBEコードを入力してね",
      notFound: "そのアドレスの人が見つかりませんでした。綴りを確認してね。",
      newMessageFrom: "{name}から新しいメッセージ！小さな雲をタップして読んでね。",
      reply: "返信",
      close: "閉じる",
      readMsg: "メッセージを読む",
      writeBtn: "書く",
      typeMsg: "メッセージを書いてね",
      photoBtn: "写真",
      photoTaken: "写真OK！メッセージと一緒に届きます。撮り直すにはもう一度タップ。",
      cameraNo: "カメラはSpectaclesでのみ使えます。メッセージはデザインポストカードで届きます。",
      deleted: "メッセージを削除しました。もう一度録音しよう！",
      searching: "友達を探しています...",
      noFriends:
        "まだ友達が登録されていません。コード {code} を友達に教えてね。レンズを開いて名前を言うと、ここに表示されます。",
      whoTo: "誰に届けますか？",
      sending: "{name}に送信中...",
      sent: "{name}に送信しました！",
      sendError: "送信できませんでした: ",
      says: "{name}からのメッセージ:",
      translating: "翻訳中...",
    },
  },
  {
    code: "ko",
    chooseLang: "언어를 선택하세요",
    place: "Seul",
    label: "한국어",
    greeting:
      "안녕하세요! 저는 당신의 메신저 구름이에요. 음성 메시지를 녹음해서 원하는 사람에게 날아가 그 사람의 언어로 읽어줘요. 저를 탭해서 메시지를 녹음하세요.",
    ui: {
      askNameIntro:
        "안녕하세요! 저는 메신저 구름이에요. 친구에게 음성 메시지를 전하고 그들의 언어로 읽어줘요. 먼저 버튼을 탭하고 이름을 말해주세요.",
      reentry: "새 메시지? 쓰거나 녹음하세요.",
      sayName: "이름 말하기",
      record: "녹음",
      stop: "중지",
      replay: "다시 듣기",
      del: "삭제",
      send: "보내기",
      listening: "듣고 있어요...",
      askName: "이름이 뭐예요?",
      noHear: "아무것도 못 들었어요. 다시 해보세요.",
      registering: "{name} 등록 중...",
      registered: "완료 {name}! 친구 코드는 {code}예요. 소식을 받고 싶은 사람과 공유하세요. 이제 첫 메시지를 쓰거나 녹음해 보세요.",
      welcomeBack: "다시 만나서 반가워요 {name}! 코드는 여전히 {code}예요. 메시지를 쓰거나 녹음해 보세요.",
      askEmailIntro:
        "안녕하세요! 저는 메신저 구름이에요. 친구 사이의 음성 메시지를 전하고 각자의 언어로 읽어줘요. 주의: 메시지는 딱 한 번만 볼 수 있고, 그 후엔 영원히 사라져요. 시작하려면 버튼을 탭하고 이메일을 입력하세요.",
      sayEmail: "이메일 입력하기",
      askEmail: "이메일이 뭐예요?",
      badEmail: "이메일을 알아듣지 못했어요. 천천히 다시 말해주세요.",
      newAccount:
        "그 이메일을 찾지 못했어요. 계정을 만들어요! 버튼을 탭하고 이름을 말해주세요.",
      askRecipient: "친구의 이메일이나 NUBE 코드를 입력하세요",
      notFound: "그 주소의 사람을 찾지 못했어요. 맞게 썼는지 확인해주세요.",
      newMessageFrom: "{name}에게서 새 메시지가 왔어요! 작은 구름을 탭해서 읽어보세요.",
      reply: "답장",
      close: "닫기",
      readMsg: "메시지 읽기",
      writeBtn: "쓰기",
      typeMsg: "메시지를 입력하세요",
      photoBtn: "사진",
      photoTaken: "사진 준비 완료! 메시지와 함께 전달돼요. 다시 찍으려면 한 번 더 탭하세요.",
      cameraNo: "카메라는 Spectacles에서만 작동해요. 메시지는 디자인 엽서와 함께 전달돼요.",
      deleted: "메시지가 삭제됐어요. 다시 녹음해요!",
      searching: "친구를 찾는 중...",
      noFriends:
        "아직 등록된 친구가 없어요. 코드 {code}를 친구에게 공유하세요. 친구가 렌즈를 열고 이름을 말하면 여기에 나타나요.",
      whoTo: "누구에게 전할까요?",
      sending: "{name}에게 보내는 중...",
      sent: "{name}에게 보냈어요!",
      sendError: "보내지 못했어요: ",
      says: "{name}의 메시지:",
      translating: "번역 중...",
    },
  },
  {
    code: "zh",
    chooseLang: "选择你的语言",
    place: "Gran Muralla",
    label: "中文",
    greeting:
      "你好！我是你的信使云。我会录下你的语音消息，飞去送给你选择的人，并用对方的语言读出来。点我开始录制你的消息。",
    ui: {
      askNameIntro:
        "你好！我是你的信使云。我把语音消息带给你的朋友，并用他们的语言读出来。首先，点按钮告诉我你的名字。",
      reentry: "新消息？写下或录制。",
      sayName: "说出我的名字",
      record: "录音",
      stop: "停止",
      replay: "重听",
      del: "删除",
      send: "发送",
      listening: "我在听...",
      askName: "你叫什么名字？",
      noHear: "我什么都没听到。再试一次。",
      registering: "正在注册{name}...",
      registered: "好了{name}！你的好友代码是{code}。分享给你想联系的人。现在写下或录制你的第一条消息吧。",
      welcomeBack: "欢迎回来{name}！你的代码还是{code}。随时写下或录制你的消息。",
      askEmailIntro:
        "你好！我是信使云。我在朋友之间传递语音消息，并用各自的语言读出来。注意：每条消息只能看一次，之后永远消失。点按钮输入你的邮箱开始吧。",
      sayEmail: "输入邮箱",
      askEmail: "你的邮箱是什么？",
      badEmail: "我没听清邮箱。请慢慢再说一次。",
      newAccount:
        "没有找到这个邮箱，我们来创建账号吧！点按钮告诉我你的名字。",
      askRecipient: "输入朋友的邮箱或NUBE代码",
      notFound: "没有找到这个地址的人。请检查拼写。",
      newMessageFrom: "{name}给你发来新消息！点小云朵阅读。",
      reply: "回复",
      close: "关闭",
      readMsg: "阅读消息",
      writeBtn: "打字",
      typeMsg: "写下你的消息",
      photoBtn: "照片",
      photoTaken: "照片好了！会随消息一起送达。再点一次可重拍。",
      cameraNo: "相机只能在Spectacles上使用。你的消息仍会以设计明信片送达。",
      deleted: "消息已删除。再录一条吧！",
      searching: "正在寻找朋友...",
      noFriends:
        "还没有注册的朋友。把你的好友码 {code} 分享给朋友：当他打开镜头并说出名字，就会出现在这里。",
      whoTo: "送给谁呢？",
      sending: "正在发送给{name}...",
      sent: "已发送给{name}！",
      sendError: "发送失败: ",
      says: "{name}对你说:",
      translating: "翻译中...",
    },
  },
  {
    code: "ru",
    chooseLang: "Выбери свой язык",
    place: "Moscu",
    label: "Русский",
    greeting:
      "Привет! Я твое облако-посыльный. Я записываю голосовое сообщение, доставляю его кому захочешь и читаю вслух на его языке. Коснись меня, чтобы записать сообщение.",
    ui: {
      askNameIntro:
        "Привет! Я облако-посыльный. Я доставляю голосовые сообщения твоим друзьям и читаю их на их языке. Сначала нажми кнопку и скажи мне свое имя.",
      reentry: "Новое сообщение? Напиши или запиши.",
      sayName: "Сказать имя",
      record: "Записать",
      stop: "Стоп",
      replay: "Прослушать",
      del: "Удалить",
      send: "Отправить",
      listening: "Я слушаю...",
      askName: "Как тебя зовут?",
      noHear: "Я ничего не услышало. Попробуй еще раз.",
      registering: "Регистрирую {name}...",
      registered: "Готово {name}! Твой код друга {code}. Поделись им с кем хочешь. Теперь напиши или запиши первое сообщение.",
      welcomeBack: "С возвращением {name}! Твой код всё ещё {code}. Напиши или запиши сообщение, когда захочешь.",
      askEmailIntro:
        "Привет! Я облако-посыльный. Я ношу голосовые сообщения между друзьями и читаю их каждому на его языке. Внимание: каждое сообщение можно увидеть только ОДИН раз, потом оно исчезает навсегда. Чтобы начать, нажми кнопку и введи свой email.",
      sayEmail: "Ввести email",
      askEmail: "Какой у тебя email?",
      badEmail: "Я не разобрало email. Попробуй еще раз, медленно.",
      newAccount:
        "Такой email не найден, создадим аккаунт! Нажми кнопку и скажи свое имя.",
      askRecipient: "Введи email или NUBE-код друга",
      notFound: "Никого с таким адресом не нашлось. Проверь написание.",
      newMessageFrom: "У тебя новое сообщение от {name}! Коснись облачка, чтобы прочитать.",
      reply: "Ответить",
      close: "Закрыть",
      readMsg: "Читать сообщение",
      writeBtn: "Написать",
      typeMsg: "Напиши сообщение",
      photoBtn: "Фото",
      photoTaken: "Фото готово! Оно отправится с сообщением. Нажми еще раз, чтобы переснять.",
      cameraNo: "Камера работает только на Spectacles. Сообщение все равно отправится с дизайнерской открыткой.",
      deleted: "Сообщение удалено. Запишем другое!",
      searching: "Ищу друзей...",
      noFriends:
        "Пока нет зарегистрированных друзей. Поделись кодом {code}: когда друг откроет линзу и скажет свое имя, он появится здесь.",
      whoTo: "Кому доставить?",
      sending: "Отправляю {name}...",
      sent: "Отправлено {name}!",
      sendError: "Не удалось отправить: ",
      says: "{name} говорит:",
      translating: "Перевожу...",
    },
  },
  {
    code: "ar",
    chooseLang: "اختر لغتك",
    place: "Arabia",
    label: "العربية",
    greeting:
      "مرحبا! أنا سحابتك الرسولة. أسجل رسالتك الصوتية وأطير بها إلى من تختار وأقرأها بلغته. المسني لتسجيل رسالتك.",
    ui: {
      askNameIntro:
        "مرحبا! أنا سحابتك الرسولة. أحمل الرسائل الصوتية إلى أصدقائك وأقرأها بلغتهم. أولا، المس الزر وقل لي اسمك.",
      reentry: "رسالة جديدة؟ اكتب او سجل.",
      sayName: "قول اسمي",
      record: "سجل",
      stop: "إيقاف",
      replay: "إعادة",
      del: "حذف",
      send: "إرسال",
      listening: "أنا أسمعك...",
      askName: "ما اسمك؟",
      noHear: "لم أسمع شيئا. حاول مرة أخرى.",
      registering: "جاري تسجيل {name}...",
      registered: "تم {name}! رمز صديقك هو {code}. شاركه مع من تحب. الان اكتب او سجل رسالتك الاولى.",
      welcomeBack: "اهلا بعودتك {name}! رمزك ما زال {code}. اكتب او سجل رسالتك متى شئت.",
      askEmailIntro:
        "مرحبا! أنا سحابة الرسائل. أحمل الرسائل الصوتية بين الأصدقاء وأقرأها لكل واحد بلغته. انتبه: كل رسالة تُرى مرة واحدة فقط ثم تختفي إلى الأبد. للبدء، المس الزر واكتب بريدك.",
      sayEmail: "كتابة بريدي",
      askEmail: "ما هو بريدك الإلكتروني؟",
      badEmail: "لم أفهم البريد. حاول مرة أخرى ببطء.",
      newAccount:
        "لم أجد هذا البريد، لننشئ حسابك! المس الزر وقل لي اسمك.",
      askRecipient: "اكتب بريد صديقك أو رمز NUBE الخاص به",
      notFound: "لم أجد أحدا بهذا العنوان. تحقق من الكتابة.",
      newMessageFrom: "لديك رسالة جديدة من {name}! المس السحابة الصغيرة لقراءتها.",
      reply: "رد",
      close: "إغلاق",
      readMsg: "قراءة الرسالة",
      writeBtn: "اكتب",
      typeMsg: "اكتب رسالتك",
      photoBtn: "صورة",
      photoTaken: "الصورة جاهزة! ستسافر مع رسالتك. المس صورة مرة أخرى لإعادتها.",
      cameraNo: "الكاميرا تعمل فقط على Spectacles. ستصل رسالتك مع بطاقة بتصميم جميل.",
      deleted: "تم حذف الرسالة. لنسجل أخرى!",
      searching: "أبحث عن الأصدقاء...",
      noFriends:
        "لا يوجد أصدقاء مسجلون بعد. شارك رمزك {code} مع صديق: عندما يفتح العدسة ويقول اسمه سيظهر هنا.",
      whoTo: "إلى من آخذها؟",
      sending: "جاري الإرسال إلى {name}...",
      sent: "تم الإرسال إلى {name}!",
      sendError: "لم أستطع إرسالها: ",
      says: "{name} يقول لك:",
      translating: "جاري الترجمة...",
    },
  },
  {
    code: "hi",
    chooseLang: "अपनी भाषा चुनें",
    place: "Taj Mahal",
    label: "हिन्दी",
    greeting:
      "नमस्ते! मैं आपका संदेशवाहक बादल हूँ। मैं आपका वॉयस संदेश रिकॉर्ड करता हूँ, जिसे आप चुनें उस तक उड़ाकर ले जाता हूँ और उसकी भाषा में पढ़कर सुनाता हूँ। संदेश रिकॉर्ड करने के लिए मुझे छुएँ।",
    ui: {
      askNameIntro:
        "नमस्ते! मैं संदेशवाहक बादल हूँ। मैं आपके दोस्तों तक वॉयस संदेश पहुँचाता हूँ और उनकी भाषा में पढ़ता हूँ। पहले, बटन छुएँ और मुझे अपना नाम बताएँ।",
      reentry: "नया संदेश? लिखें या रिकॉर्ड करें।",
      sayName: "अपना नाम बोलें",
      record: "रिकॉर्ड",
      stop: "रोकें",
      replay: "फिर सुनें",
      del: "हटाएँ",
      send: "भेजें",
      listening: "मैं सुन रहा हूँ...",
      askName: "आपका नाम क्या है?",
      noHear: "मुझे कुछ सुनाई नहीं दिया। फिर कोशिश करें।",
      registering: "{name} को पंजीकृत कर रहा हूँ...",
      registered: "हो गया {name}! आपका फ्रेंड कोड {code} है। जिसे चाहें उसके साथ साझा करें। अब अपना पहला संदेश लिखें या रिकॉर्ड करें।",
      welcomeBack: "वापसी पर स्वागत है {name}! आपका कोड अब भी {code} है। जब चाहें अपना संदेश लिखें या रिकॉर्ड करें।",
      askEmailIntro:
        "नमस्ते! मैं संदेशवाहक बादल हूँ। मैं दोस्तों के बीच वॉयस संदेश ले जाता हूँ और हर एक को उसकी भाषा में पढ़कर सुनाता हूँ। ध्यान दें: हर संदेश सिर्फ एक बार देखा जा सकता है, फिर हमेशा के लिए गायब हो जाता है। शुरू करने के लिए बटन छुएँ और अपना ईमेल लिखें।",
      sayEmail: "ईमेल लिखें",
      askEmail: "आपका ईमेल क्या है?",
      badEmail: "ईमेल समझ नहीं आया। धीरे-धीरे फिर बताएँ।",
      newAccount:
        "यह ईमेल नहीं मिला, चलिए खाता बनाते हैं! बटन छुएँ और अपना नाम बताएँ।",
      askRecipient: "अपने दोस्त का ईमेल या NUBE कोड लिखें",
      notFound: "इस पते पर कोई नहीं मिला। लिखावट जाँचें।",
      newMessageFrom: "{name} का नया संदेश आया है! पढ़ने के लिए छोटे बादल को छुएँ।",
      reply: "जवाब दें",
      close: "बंद करें",
      readMsg: "संदेश पढ़ें",
      writeBtn: "लिखें",
      typeMsg: "अपना संदेश लिखें",
      photoBtn: "फोटो",
      photoTaken: "फोटो तैयार! यह आपके संदेश के साथ जाएगी। दोबारा लेने के लिए फिर छुएँ।",
      cameraNo: "कैमरा केवल Spectacles पर काम करता है। आपका संदेश फिर भी डिजाइन पोस्टकार्ड के साथ जाएगा।",
      deleted: "संदेश हटा दिया। एक और रिकॉर्ड करें!",
      searching: "दोस्त खोज रहा हूँ...",
      noFriends:
        "अभी कोई दोस्त पंजीकृत नहीं है। अपना कोड {code} साझा करें: जब आपका दोस्त लेंस खोलकर अपना नाम बोलेगा, वह यहाँ दिखेगा।",
      whoTo: "किसे पहुँचाऊँ?",
      sending: "{name} को भेज रहा हूँ...",
      sent: "{name} को भेज दिया!",
      sendError: "भेज नहीं सका: ",
      says: "{name} कहते हैं:",
      translating: "अनुवाद कर रहा हूँ...",
    },
  },
];

export function getLang(code: string): LangDef {
  for (let i = 0; i < LANGS.length; i++) {
    if (LANGS[i].code === code) {
      return LANGS[i];
    }
  }
  return LANGS[0];
}

// reemplaza {name} y {code} en las plantillas
export function fmt(template: string, name: string, code: string): string {
  return template.split("{name}").join(name).split("{code}").join(code);
}
