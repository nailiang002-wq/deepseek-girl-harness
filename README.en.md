# DeepSeek Girl · Harness Desktop

**Bring DeepSeek Girl into Harness: a companion who thinks with you and happily eats a basin of rice.**

English · [中文](README.md) · **v1.8.0**

![Winter wardrobe: cream and blue puffer, and moonlit winter cape](docs/images/winter.png)

<p align="center"><img src="docs/images/feeding.gif" width="420" alt="Animation preview: DeepSeek Girl happily eats rice from an iron basin"></p>

<p align="center"><a href="https://github.com/nailiang002-wq/deepseek-girl-harness/releases/download/v1.8.0/DeepSeekGirl-Harness-v1.8.0.zip"><strong>⬇ Download v1.8.0 (ZIP)</strong></a> · <a href="#install-in-three-steps">Install in three steps</a> · <a href="https://github.com/nailiang002-wq/deepseek-girl-harness/issues">Report a problem / Suggest an interaction</a></p>

**For DeepSeek Harness Desktop; tested on Windows.** This is an unofficial character plugin that lives inside the Harness window. The prebuilt download needs no Node.js, and animations and interactions require no extra model calls.

DeepSeek Girl is an interactive character plugin for **DeepSeek Harness Desktop**. She changes expressions with your current task. Pick her up, move her around the window, feed her plain white rice, or let her wear an upside-down iron basin as a hat. Time-based speech bubbles bring a small greeting to your day. Version 1.8 adds a cream and blue puffer and a moonlit winter cape, bringing the wardrobe to five complete outfits, each with a three-bite meal.

## Install in three steps

![Download, add the plugin, and enable it: three installation steps](docs/images/install.png)

1. **Download and extract** the ZIP above; find the `DshDeepSeekGirl` folder.
2. In Harness, open **Plugins → Add plugin** and enter that folder’s full path.
3. **Install and enable** the plugin, then reload when prompted. If your version has no reload option, quit and reopen Harness.

Tap her head for a gentle pat; three quick taps make her pout. Click her body or right-click for the menu. Feed her using the rice basin, drag to move, or use Ctrl + mouse wheel to resize.

If installation fails, open an [issue](https://github.com/nailiang002-wq/deepseek-girl-harness/issues) with your Harness version, operating system, and error message. Feedback about favorite motions, stuttering, and future interactions is welcome.

## Image and animation demos

![Twelve expressions of DeepSeek Girl](docs/images/overview.png)

![Twelve-pose rice feeding, head pats, and playful pouts](docs/images/interactions.png)

<p align="center"><img src="docs/images/petting.gif" width="420" alt="Head-pat and repeated-tap pout animation preview"></p>

These previews use the same sprite atlases and motion rules as the plugin. They contain no personal conversations. Each outfit covers all twelve states, with 78 key poses per outfit (390 in total). A meal plays its twelve-pose bite three times, for 36 pose visits; other states have six poses. They are combined with continuous breathing, swaying, and a soft landing.

## What she does

| Feature | Behavior |
| --- | --- |
| Task expressions | Thinks during reasoning, types while the answer streams, celebrates completion, and looks upset after an error |
| Wardrobe | Classic maid, blue & white hoodie, star pajamas, cream & blue puffer, and moonlit winter cape; preview first, then confirm to save |
| White-rice feeding | Three full bites with scooping, lifting the spoon, chewing, and a satisfied smile; returns to the current task after about 13 seconds |
| Head pats | Tap her head to see her close her eyes and nuzzle, with little floating hearts; also available in the menu |
| Repeated taps | Three quick head taps trigger a brief playful pout, returning after about 1.8 seconds; head pats do not interrupt a meal |
| Asking for rice | Holds out an empty basin while idle; feeding pauses requests for two minutes |
| Basin hat | Toggle an upside-down silver basin that moves with her |
| Pick up and drop | Gently swings while dragged and settles when released; remembers her position |
| Time greetings | Greets you using your computer’s local time and reminds you to rest late at night |
| Sleep | Rests after 90 seconds without input and wakes on mouse or keyboard activity |
| Animation controls | Preview expressions, pause motion, respect reduced-motion settings, and pause visual playback while the window is hidden |

There are **12 states**: idle, thinking, answering, success, error, dragging, landing, sleeping, asking for rice, eating rice, enjoying head pats, and pouting. Stopping a task or waiting for approval is not treated as successful completion.

## Other installation options and compatibility

Alternatively, download or clone this repository and add its root folder—the one containing `package.json`—as a plugin. **The prebuilt plugin does not require Node.js or a build step.**

Tested on DeepSeek Harness Desktop for Windows. Other operating systems have not been tested. The plugin uses Harness’s Cordis interface and its built-in conversation and chat services.

## Controls

| Action | Result |
| --- | --- |
| Drag the character | Move her |
| Ctrl + mouse wheel | Resize her |
| Tap her head | Pet her; three quick taps make her pout |
| Click her body / Right-click / Enter or Space | Open expressions and interactions |
| Click the rice basin | Feed her |
| Menu: Open wardrobe | Preview, apply, or cancel an outfit change |
| Menu: Wear / Remove basin hat | Toggle the hat |
| Menu: Say hello | Show the current time greeting manually |
| Menu: Disable time greetings / idle rice requests | Turn off an automatic interaction |
| Menu: Pause animation | Stop pose playback and continuous motion |

Outfit, position, size, hat, and interaction preferences are stored locally. Disable or uninstall the plugin from the Harness plugin list.

## A small wardrobe

**Winter additions:** A cream and blue quilted puffer with a knitted blue scarf, and a teal winter cape with ivory fur trim, a gold crescent clasp, and a cream turtleneck. Both cover all twelve states and retain the basin hat and three-bite feeding animation.

![Five-outfit wardrobe with a winter preview](docs/images/wardrobe-winter.png)

Open the character menu and choose **Open wardrobe**. Select an outfit to preview it, then choose **Wear this outfit** to remember it. Cancel, Escape, or clicking outside restores the saved outfit. The selected card also shows a live preview when the panel covers the character.

All five outfits cover thinking, answering, feeding, head pats, pouting, dragging, sleeping, and the other states. Changing clothes preserves the current task and meal progress, along with the basin hat and character position. The twelve meal poses now play three complete bites instead of stopping after one.

## Her little rice-money ledger

Version 1.7 adds a small card beside the character. Click it for native-account balances, today's estimated fees, and Token details. The character menu can hide the card. Values refresh about once a minute while visible, with a manual refresh in the details panel. Financial values stay in memory; only the display preference is saved.

![Ledger preview using synthetic example values](docs/images/finance.png)

**v1.7.1 fix:** Restores the daily-usage connection when the balance works but the estimate stays unavailable. Balance and usage refresh independently; a stalled request times out and can be retried. Reload the interface after updating.

**The image uses synthetic example values, not a real account.**

- **Balance** comes from the account signed in to Harness, including recharge and bonus wallets. CNY and USD remain separate. This account may differ from the owner of a configured API key; API-key and third-party account balances are not queried by this release.
- **Today's Tokens** come from provider-reported usage in this local Harness profile's durable session records. The local calendar day is used. Forked inherited history is excluded; retries count separately and final samples replace earlier samples from the same attempt. Reloads derive the totals again from the logs.
- **Estimated today** uses known official DeepSeek model rates and reported uncached input, cache reads, and output. It shows an off-peak-to-peak **CNY range**, with pricing checked on 2026-10-16. It is not the account's settled bill, and does not include other devices or services. [Official pricing](https://api-docs.deepseek.com/quick_start/pricing/) and the panel's official-bill link let you check the source and actual spending.
- Missing usage, unsupported models/providers, and insufficient cache evidence are disclosed. Title/search requests without reported Tokens count as coverage gaps. Missing totals show **—**; login, network, and scan failures are distinct from a confirmed zero. A failed session scan never becomes a zero daily total.

The feature uses the existing authenticated Harness Remote APIs. It does not ask for an API key or send chat text to a new service. Polling stops when hidden or disabled. Balances are cleared after sign-out.

## Time greetings

**Version 1.4 adds handwriting and a crayon-note greeting bubble**: cream paper, blue hand-drawn double lines, a small star, and pale peach doodles. The font is bundled for offline use. Placement follows the measured text height, with wrapping and viewport-edge handling, including dark backgrounds and reduced motion.

![Handwritten greetings: morning, late night, and a longer English message](docs/images/greetings.png)

These previews show the actual client in a standalone test page.

| Local time | Greeting |
| --- | --- |
| 05:00–10:59 | Good morning! Let’s make it a lovely day. |
| 11:00–13:59 | Good afternoon! Remember lunch. I’d love a basin of rice, too! |
| 14:00–17:59 | Hello! Take a moment to rest and have some water. |
| 18:00–22:59 | Good evening! You’ve worked hard. Remember to relax. |
| 23:00–04:59 the next day | It’s getting late. Take care of yourself and get some rest. |

Automatic greetings appear once per time period, including after a conversation switch or app restart. The hours before and after midnight share one late-night period. Greetings wait until she is idle if you are working, feeding her, petting her, triggering a pout, dragging, previewing a state, or using the menu. Bubbles disappear after about ten seconds and have a close button.

## Animation and local behavior

Version 1.3 replaces timer-driven image changes with predecoded transparent sprite atlases played by the browser. Continuous breathing and swaying do not rerender the whole character every frame. Drag updates are coalesced with the display refresh cycle. Version 1.6 reuses twelve meal poses across three bites and supplies every state in all three outfits. Decoded atlas caching is bounded, and switching outfits preserves the elapsed time of one-shot reactions. These are not newly drawn illustrations for every display refresh.

The plugin observes task state without rewriting conversation content, sending external telemetry, or making extra model calls for feeding and greetings.

## Development

Use Node.js 20 or newer. Source frames, the client template, and tests are included.

```sh
npm install
npm run build
npm test
```

Optional checks in a real browser:

```sh
npx playwright install chromium
npm run test:browser
```

For the native connection regression, point `DSG_HARNESS_NODE_MODULES` at Harness's `node_modules` directory and run `npm run test:native`. It uses native Cordis, Typert, and Client Gateway with synthetic sessions to verify the complete usage path. It does not read personal profiles or real conversations, or make network requests.

`client.template.js` is the editable client template. `scripts/build.cjs` embeds `assets/frames`, `assets/outfits`, and `assets/props` into `client.js`. `logic.js` contains state and time rules; `projection.js` distinguishes completion, failure, and stopping. Temporary test files go into `.cache/`.

Browser checks cover all 60 outfit/state atlases, wardrobe preview/apply/cancel and saved reloads, three-bite meal timing, switching outfits during a meal, loop and one-shot endings, meal restarts, head/body taps, repeated taps, touch input, keyboard menus, the hat, pause, reduced motion, hidden-window playback, and saved drag positions. In a standalone test page, about three seconds of looping playback reduced character component renders from ten in the earlier version to zero in this version. This is not a fixed frame-rate guarantee for every machine or application load.

## Artwork

This is an unofficial character plugin, with no affiliation to DeepSeek. Illustrations were generated with ImageGen from a character reference supplied by the project creator. Original prompts are in [assets/generation-prompts.txt](assets/generation-prompts.txt), and the new v1.5 art prompts are in [assets/v1.5-generation-prompts.txt](assets/v1.5-generation-prompts.txt). Wardrobe prompts and selected source sheets are in [assets/outfits](assets/outfits). The original reference image is not included.

The greeting font is a renamed subset of [Xiaolai v3.126](https://github.com/lxgw/kose-font), distributed as DSG Greeting Hand under SIL Open Font License 1.1. See [assets/fonts](assets/fonts) for the license and provenance. This is the font’s license, not a license for the entire plugin or character artwork.
