# Greeting handwriting font

`greeting-hand.woff2` is an 18.2 KiB web-only subset derived from **Xiaolai v3.126**, by LXGW and Nozomi Seto. It includes all five Chinese and English greeting messages plus printable ASCII. It is embedded into `client.js`; the installed plugin makes no font download requests and requires no system-font installation.

Upstream: https://github.com/lxgw/kose-font

Source: https://github.com/lxgw/kose-font/releases/download/v3.126/Xiaolai-Regular.ttf

The subset has been renamed **DSG Greeting Hand**. Original copyright and licensing records are retained. The font is licensed under **SIL Open Font License 1.1**; the full license is included in `OFL-Xiaolai.txt`. This license applies to the font, not to the entire plugin or its character artwork.

To regenerate after changing greeting text, download the pinned source font and run:

```sh
python -m pip install fonttools==4.66.1 brotli==1.2.0
python scripts/subset-greeting-font.py /path/to/Xiaolai-Regular.ttf
npm run build
```

The regular build uses the committed WOFF2 file and does not require Python or network access. Source checksum and character coverage are recorded in `source.json`. Characters added to future greetings must be included by regenerating the subset; otherwise the fallback font renders those characters.
