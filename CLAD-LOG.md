# CLAD Log — Cloudove (Week 3 “Connect”)

Development log and representative prompt transcript for the AI-assisted creation of Cloudove in Lens Studio 5.23.1. The project was developed collaboratively by Florencia Raffa and Claude (Anthropic) through CLAD and the Lens Studio MCP server.

## Human + AI collaboration

- **Florencia:** concept, product decisions, kawaii cloud artwork and logo, UX direction, all acceptance testing on preview and Spectacles, and every course correction below.
- **Claude:** Lens Studio scene construction and inspection, TypeScript implementation, SIK interaction wiring, ASR/TTS/translation integration, Snap Cloud (Supabase) schema and messaging layer, SVG UI asset generation, AI stamp/travel-poster generation, debugging from runtime logs, and repository preparation.

OpenAI runs through Snap's Remote Service Gateway, and the messaging backend uses Snap Cloud (managed Supabase), so the submitted scene runs directly in Lens Studio.

## Concept exploration — connecting people, not screens

**Representative prompts:** “I want to think about Week 3 Connect ideas: teacher-student trades, a card game, a language practice room, group pictionary — which is best?” … “Could we use the camera as a video call?” … “Build a spatial experience that connects people, platforms, or everyday communication workflows — we have to prioritize this.”

- Evaluated multiplayer rooms, Bitmoji-body avatars, and video calls against the one-week scope and platform constraints; real-time approaches were ruled out as infeasible or off-theme.
- Landed on asynchronous spatial messaging: “Could it be carrier pigeons?” → “What if we use the cloud? I've been putting it in all my lenses as a mascot.”
- Chose Florencia's hand-made kawaii cloud sprite set (closed/open mouth for talking, listening pose, heart-cloud for notifications) as the messenger.

## Voice pipeline — the cloud that listens and speaks every language

**Representative prompts:** “I want the intro to choose your native language, an OpenAI voice per language, and the receiver hears it translated.” … “The cloud must already be talking when it arrives — there's a huge delay.” … “Snap TTS is English-only with bad pronunciation, use OpenAI TTS.”

- Integrated the native AsrModule for live transcription while recording.
- Connected OpenAI through Remote Service Gateway: `gpt-4o-mini-tts` (voice “nova”) for speech, `gpt-4o-mini` for translation into the receiver's language.
- Killed the arrival delay by prefetching the TTS audio during the cloud's flight — speech starts ~30 ms after landing.
- Localized every UI string, spoken line, and button across 12 languages with `{name}`/`{code}` templating.

## Accounts and private addressing

**Representative prompts:** “There should be a register and login — I keep getting duplicate users in the database.” … “Login MUST be via email.” … “When I dictate the email it adds periods — the email must be typed by the person.” … “A public user list makes no sense — make it private, send by writing the NUBE number or email.”

- Built the messaging layer on Snap Cloud (managed Supabase) via the official plugin credential import; schema in `snap-cloud-setup.sql`.
- Replaced voice-dictated identity with typed email login on the system keyboard, generating collision-checked NUBE-XXX friend codes.
- Addressing is fully private: messages go to an email or NUBE-code; there is no user directory.

## The postal experience — view-once holiday cards

**Representative prompts:** “Instead of a scroll I want a postcard, like holiday cards — image on one side, message on the other.” … “Put a generic postcard image by place — for example Berlin's TV tower in geometric design.” … “Add the location ribbon to the postcard.” … “When I press Close the message must be deleted and never appear again — I already read it.”

- Two-sided postcard with a pre-mirrored back so the 180° flip reads correctly; front shows an AI-generated geometric travel poster of the sender's language homeland, with a place ribbon; back carries the translated message, signature, and a matching stamp.
- Implemented the view-once contract: opening marks the message read; Reply and Close both delete it permanently.
- A photo-attachment path (CameraModule capture traveling as base64 JPEG) was prototyped, but the shipped experience keeps the travel-poster fronts — the camera flow did not make the final cut.

## The notification that refused to be tapped — and the button pattern

**Representative prompts:** “I tap the heart cloud and nothing happens. Fix it now.” … “Don't spend more tokens saying you fixed it — FIX IT.”

- Three attempts to make the animated heart-cloud tappable failed silently: SIK interactables on animated/toggled objects never received triggers (proven via runtime logs showing zero events).
- Lesson recorded and applied everywhere since: every interaction uses the static “Actions” button pattern (collider + interactable on a stable child, discovered by name). The heart-cloud became visual-only with a localized “Read message” pill button.
- The correct flow order came from Florencia's screen recording: explanation → email → pending message announced *before* the record button → deletion on close/reply.

## Compose both ways, and the disappearing-duplicate bug

**Representative prompts:** “When I send a message, it should be possible with the microphone or written.” … “Record and Type should be the same size.” … “Sometimes when I close a message it plays one more time.”

- Added typed composition through the system keyboard alongside voice recording, with per-state button relabeling/resizing so one set of scene objects serves every screen.
- The “message repeats once” report was diagnosed from runtime logs as **duplicate database rows**: the Lens Studio keyboard fires both `onReturnKeyPressed` and `onKeyboardStateChanged(closed)`, and the async recipient lookup let the second event through — double send. Fixed by leaving the guard state synchronously and adding an in-flight send lock.

## Typography across scripts

**Representative prompt:** “Adjust the texts in complex languages because they overflow the speech bubble.”

- Cyrillic, Arabic, and Devanagari get proportionally smaller type; Japanese/Chinese (no spaces — the whole message is one “word”) get character-based line wrapping. Applied to both the postcard and the cloud's speech bubble.

## Intro polish — the postcard that mails itself

**Representative prompts:** “The language selection background should be a postcard; on selection it flips and leaves, then the cloud comes.” … “The stamp must be fully inside the dashed box, no matter what.” … “Hovering a language should change the stamp.” … “‘Choose your language’ should adapt to the hovered language.”

- Language pills live on the writing half of a giant postcard under the Cloudove logo; hovering any language previews its country stamp in the dashed franking box *and* switches the title to that language.
- Selection franks the stamp, flips the card to the destination's travel poster, and sends it off in a slow, subtle zigzag before the cloud arrives.
- Layout debugging included discovering that the postcard texture letter-boxes inside its quad, so the *drawn* dashed box sits lower than the geometric one — the stamp now fills it edge to edge.

## Closed-loop verification

CLAD repeatedly ran the same loop:

1. Inspect the live Lens Studio scene and runtime state.
2. Make a scoped TypeScript or scene change.
3. Force TypeScript compilation.
4. Refresh Preview and collect fresh runtime logs.
5. Verify with Preview screenshots or Florencia's screen recordings.
6. Refine copy, layout, interaction, or error handling — and never claim a fix without log evidence.

— Florencia Raffa & Claude, August 2026
