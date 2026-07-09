---
title: "Ramadan's Spark CTF 2025 — WhatIsXSS"
description: 'Stored XSS with JS deobfuscation'
pubDate: 'Mar 29 2025'
tags: ['ctf', 'web', 'xss']
thumbnail: 'https://miro.medium.com/v2/resize:fit:1100/1*SQiVwympl3hvplsAk941gA.png'
---

# WhatIsXSS

<img src="https://miro.medium.com/v2/resize:fit:1100/1*SQiVwympl3hvplsAk941gA.png" alt="XSS challenge" />

Upon opening the web application, we find a simple page explaining the XSS vulnerability and how it works.

Inspecting the source code, we discover a `script.js` file that contains the flag. However, the script is obfuscated, so we need to perform JavaScript deobfuscation.

Within the script, we encounter multiple fake flags, but the correct flag is stored inside a function called `revealFlagyabro()`.

By executing a standard **Stored XSS** payload:

```
<img src=x onerror=revealFlagyabro() >
```

we successfully capture the flag, which is base64-encoded:

**Flag:** `Spark{Y0u_N33d_t0_l34Rn_XSS!!!!!}`
