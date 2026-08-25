<p align="center">
  <img src="logo.png" alt="Cloudove" width="420">
</p>

<p align="center"><strong>Voice postcards, carried by a cloud — across any language.</strong></p>

Cloudove is a spatial, asynchronous messaging experience for Snap Spectacles, built in Lens Studio 5.23 for the **CLAD Summer Hackathon — Week 3: Connect**.

A kawaii messenger cloud flies to you, listens to your voice message (or lets you type it), and carries it to a friend anywhere in the world. When your friend opens the Lens, the cloud arrives with a tiny heart-cloud in tow, announces who wrote to them, and unfolds a **two-sided holiday postcard**: the front is a geometric travel poster of the sender's homeland with its place ribbon, and the back carries the message **translated into the receiver's language**, with a matching country stamp and signature, while the cloud reads it aloud in a natural voice.

Every message is **view-once**: reply or close it, and it is gone forever — like a real postcard handed to you, not a chat log.

## How it works

1. **Choose your language** on a giant postcard: 12 language pills, each hover previews that country's stamp in the dashed franking box and greets you in that language. On selection the postcard flips to a travel poster of your destination and drifts away in a gentle zigzag.
2. **Sign in with your email** (typed on the system keyboard — AR keyboard on Spectacles). Your account gets a friendly NUBE-code you can share.
3. **Compose**: record with the microphone (ASR transcribes as you speak) or type it. Review, re-listen, delete, or send.
4. **Address it** to a friend's email or NUBE-code — no public user list, fully private.
5. **Receive**: the heart-cloud flies in, the cloud announces the sender, and one tap opens the postcard. The message is translated to *your* language and read aloud. Reply flies straight back to the sender.

## Tech

- **Lens Studio 5.23.1** / Spectacles Interaction Kit (SIK)
- **AsrModule** — on-device speech transcription (40+ languages, auto-detect)
- **OpenAI via Remote Service Gateway** — `gpt-4o-mini-tts` for the cloud's voice, `gpt-4o-mini` for message translation
- **Snap Cloud (managed Supabase)** — accounts, private addressing, message queue, view-once deletion
- **12 languages end to end**: Español, English, Français, Português, Italiano, Deutsch, 日本語, 한국어, 中文, Русский, العربية, हिन्दी — every UI string, prompt, stamp, and travel poster
- Original kawaii cloud artwork by Florencia Raffa

### Backend

The messaging backend runs on **Snap Cloud (managed Supabase)**: user accounts, private addressing, and the view-once message queue. The database schema lives in [snap-cloud-setup.sql](snap-cloud-setup.sql).

## Running it

1. Open `Flying Messages.esproj` in Lens Studio 5.23+.
2. Press play in Preview, or send it to Spectacles.
3. Pick a language, sign in with any email, and send a cloud to a friend (or to yourself with a second email).

## Credits

- **Concept, art direction, cloud mascot & UX**: Florencia Raffa
- **AI pair**: Claude (Anthropic) through CLAD and the Lens Studio MCP server — see [CLAD-LOG.md](CLAD-LOG.md) for the full development log

*CLAD Summer Hackathon 2026 — Week 3: “Build a spatial experience that connects people, platforms, or everyday communication workflows.”*
