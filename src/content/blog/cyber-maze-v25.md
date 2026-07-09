---
title: "Continue Y/N — Cyber Maze Challenge V25"
description: 'Multi-step exploitation chain: LFR → JWT forgery → SSRF → SQLi → RCE'
pubDate: 'Dec 2 2025'
tags: ['ctf', 'web', 'lfi', 'jwt', 'ssrf', 'sqli', 'rce']
thumbnail: 'https://miro.medium.com/v2/resize:fit:1100/1*RCCZfevKdHDHkJt-RC_6Hg.png'
---

# Continue Y/N — Cyber Maze Challenge V25

This challenge chains Local File Read, JWT forgery for admin escalation, SSRF, and SQL query execution to retrieve the flag.

## Recon & Registration

Upon opening the web app we find a simple login/register page. We create an account with random creds and log in.

<img src="https://miro.medium.com/v2/resize:fit:1100/1*RCCZfevKdHDHkJt-RC_6Hg.png" alt="Login page" />

<img src="https://miro.medium.com/v2/resize:fit:1100/1*kQjXg95DygFC-AHE0rwr9A.png" alt="Dashboard after login" />

## File Upload & Directory Traversal

We discover we can upload files and download them.

<img src="https://miro.medium.com/v2/resize:fit:1100/1*5cNkBgXMgXXmcqlsGalSDA.png" alt="Upload feature" />

<img src="https://miro.medium.com/v2/resize:fit:1100/1*9uKmlmdKDjU-aWUKf4j4gQ.png" alt="Download feature" />

We intercept the download request with Burp.

<img src="https://miro.medium.com/v2/resize:fit:1100/1*OUVBKQA5t-mQtszH5vlarQ.png" alt="Burp interception" />

<img src="https://miro.medium.com/v2/resize:fit:1100/1*rG4vdlKXjOpK1fO15KOAyw.png" alt="Download request" />

We try changing the filename to `flag.txt` — no such file. We try a non-existent file to trigger an error.

<img src="https://miro.medium.com/v2/resize:fit:1100/1*odokagxn7eNttk45wr1MqQ.png" alt="Flag.txt attempt" />

<img src="https://miro.medium.com/v2/resize:fit:1100/1*7jIknNDvn_GVGg81_IaSwA.png" alt="Error message" />

The error leaks the path `routers/main.js`. The filter strips `../` but can be bypassed with `....//` — the inner `../` gets removed, leaving `../`.

<img src="https://miro.medium.com/v2/resize:fit:1100/1*v7as8BEWkzoxisbQ_X4Izg.png" alt="Path traversal bypass" />

<img src="https://miro.medium.com/v2/resize:fit:1100/1*qQggY6m7TsnUBQjnHcPMVw.png" alt="Bypass payload" />

## Source Code Analysis

We successfully retrieve `routers/main.js`:

<img src="https://miro.medium.com/v2/resize:fit:1100/1*6YLBraxw7flMaB8PALFBBQ.png" alt="Main.js output" />

Key findings from the source:
- JWT secret in `helpers/JWTHelper.js`: `C3n7uRY0uN20********`
- Admin middleware restricts certain routes
- SSRF via SMS test API
- SQL execution endpoint at `/api/sql/exec` requiring admin + localhost + password

## JWT Forgery

We find the JWT secret:

<img src="https://miro.medium.com/v2/resize:fit:1100/1*L90ATpF9dJdV-vk_c2QHLQ.png" alt="JWT secret" />

Using JWT Auditor we forge a new token with username `admin`:

<img src="https://miro.medium.com/v2/resize:fit:1100/1*nIGh-Sy5eCI0ySwpdzEk3w.png" alt="JWT forgery" />

Replace the session cookie and we're admin.

<img src="https://miro.medium.com/v2/resize:fit:1100/1*DvUYMBZ4T4vIB3FCoUpYeQ.png" alt="Admin dashboard" />

## Admin Panel & SSRF

The admin panel has SQL terminal and SMS config:

<img src="https://miro.medium.com/v2/resize:fit:1100/1*qbrPHeHYfKT3rkpnAwaQgA.png" alt="Admin panel" />

SQL terminal requires localhost access:

<img src="https://miro.medium.com/v2/resize:fit:1100/1*-to3zx5bXxHHePrh62Eq9Q.png" alt="SQL terminal" />

We go to SMS config:

<img src="https://miro.medium.com/v2/resize:fit:1100/1*gkUKbQi0Cb3XSmtsZF996Q.png" alt="SMS config" />

Intercept the test connection request:

<img src="https://miro.medium.com/v2/resize:fit:1100/1*IsfcPCWy2VeoEBNifm7LKQ.png" alt="SMS test request" />

We test for SSRF with a netcat listener and confirm it works.

<img src="https://miro.medium.com/v2/resize:fit:1100/1*2Bn_r2YatIkYzKxuPqkheQ.png" alt="SSRF confirmed" />

The `LocalMiddleware` checks `remoteIp !== '127.0.0.1' && hostHeader !== '127.0.0.1:4002'`. We set the URL to `http://127.0.0.1:4002`:

<img src="https://miro.medium.com/v2/resize:fit:1100/1*ofPLMtLHuyYSOEOTzP9z1w.png" alt="Localhost bypass" />

## SQL Execution via SSRF

We use the SMS test API to POST to `/api/sql/exec` — first gets access denied, so we add our admin session token in headers.

<img src="https://miro.medium.com/v2/resize:fit:1100/1*JuZ9vtMEoFKcRYFeqQLymA.png" alt="SQL exec with session" />

We need the SQL password from `config.js`: `d7aXhuL4ZKKwyuES7UNutrEq`

<img src="https://miro.medium.com/v2/resize:fit:1100/1*6-MW6I9Hfw4o0qFgbxftiQ.png" alt="SQL exec with password" />

## RCE & Flag

The `execQuery` function allows running system commands via `SELECT * FROM \`whoami\`` syntax with a whitelist of allowed commands.

We run commands to find and read the flag.

**Flag:** `CM{example_flag}` *(placeholder — actual flag redacted)*
