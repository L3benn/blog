---
title: 'SheSecured CTF — Fama Mino?'
description: 'SQL injection, LFI, and PHP filter chain to gain RCE'
pubDate: 'Jul 6 2025'
tags: ['ctf', 'web', 'sqli', 'lfi', 'php-filter']
thumbnail: 'https://miro.medium.com/v2/resize:fit:1100/1*07xsTfo1zz4E_wc_Mp4oOw.png'
---

# SheSecured CTF — Fama Mino?

<img src="https://miro.medium.com/v2/resize:fit:1100/1*07xsTfo1zz4E_wc_Mp4oOw.png" alt="Fama Mino challenge" />

This web challenge is vulnerable to both SQL injection (SQLi) and Local File Inclusion (LFI).

Upon accessing the application, we're presented with login and registration functionality. After registering and logging in, we're redirected with a URL parameter like:

```
/?page=login.php
```

This suggests the application is including files based on user input. We test for LFI:

```
/?page=/etc/passwd
```

This confirms the LFI — the contents of `/etc/passwd` are displayed.

By reading `/etc/passwd` we discover a MySQL server. We test a basic SQL injection in the login form and receive a MySQL error, confirming SQLi alongside LFI. However, this alone isn't enough to retrieve the flag.

We then attempt PHP filter wrappers:

```
/?page=php://filter/convert.base64-encode/resource=index.php
```

A base64-encoded response confirms the backend is PHP. With all this info, we craft a malicious SQL payload to write a PHP file using `INTO OUTFILE`:

<img src="https://miro.medium.com/v2/resize:fit:1100/1*rVSmh8MuA5-p6MB8FpbyhA.png" alt="LFI error" />

```
random' UNION SELECT 1,"<?php system(\"ls\"); ?>",3,4 INTO OUTFILE "/tmp/bbb.txt" -- -
```

We use LFI to include and execute the malicious file, listing the directory. Then we read the flag:

```
random' UNION SELECT 1,"<?php system(\"cat /flag.txt\"); ?>",3,4 INTO OUTFILE "/tmp/bbb2.txt" -- -
```

**Flag:** `Spark{dimaa_famma_minooooooooo!!!}`
