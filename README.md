# WS Chat

This is we application to emulate realtime chat between 2 users using websocket

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

# When testing on CI, must build the project first

pnpm build

# Runs the end-to-end tests

pnpm test:e2e

# Runs the tests only on Chromium

pnpm test:e2e --project=chromium

# Runs the tests of a specific file

pnpm test:e2e tests/example.spec.ts

# Runs the tests in debug mode

pnpm test:e2e --debug

````

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
````

---

## 🗄️ Basic Question

**Task :**

Imagine you're building a website that allows users to submit photos. One of the requirements is that each photo must be reviewed by a moderator before it can be published. How would you design the logic for this process? What technologies would you use? Do you have any data structure in mind to support this based on your technology of choice to handle those data?

**Answer :**

- System Design :

```
- User upload photo
- System storoes the photo into private file storage,
- System stores the data into database (PENDING status)
- Moderator review the photo
- If :
  - Approved, update status into APPROVED, publish the photo
  - Rejected, update status into REJECTED
- User got notified of the result
```

- Architecture and Technologies :

```
Frontend (Vue.js) for user and moderator
Database (PostgreSQL) strong relational dbms
Backend API (Express.js) faster and high performance
Storage (AWS S3 / GCP) scalable, cheap, secure
```

- Data Mode Design

```
-- Table : public.users
{
  id: UUID (PK)
  name: VARCHAR
  role: ENUM("user","moderator")
}

-- Table : public.photos
{
  id: UUID(PK)
  user_id: UUID (FK) #public.users.id
  url: TEXT
  status: ENUM("PENDING","APPROVED","REJECTED")
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

-- Table : public.photo_approval_logs
{
  id: UUID (PK)
  photo_id: UUID (FK) #public.photos.id
  moderator_id:  UUID (FK) #public.users.id
  action: ENUM("APPROVED","REJECTED")
  created_at: TIMESTAMP
}
```

## DATABASE QUESTION

Notice all the tables available here:

```
Tablename Records
Customers: 91
Categories: 8
Employess: 10
OrderDetails: 518
Orders: 196
Products: 77
Shippers: 3
Suppliers: 29
```

**Task :**

Write a SQL query that shows me how many customers there are from Germany.

**Answer :**

```
SELECT
  COUNT(c.CustomerID) AS total_customer
FROM
  Customers c
WHERE
  c.Country = 'Germany'
;
```

**Task :**

Write a query that shows me a list of the countries that have the most customers; from most customers to least customers. Don’t show countries that have less than 5 customers.

**Answer :**

```
SELECT
  c.Country AS country_name,
  COUNT(c.CustomerID) AS total_customer
FROM
  Customers c
GROUP BY
  c.Country
HAVING
  COUNT(c.CustomerID) > 4
ORDER BY
  total_customer DESC
;
```

**Task :**

Reverse Engineer These Results (tell me the query that we need to write to get these results):

**Answer :**

```
SELECT
  c.CustomerName,
  COUNT(o.OrderID) as CountOrder,
  MIN(o.OrderDate) as FirstOrder,
  MAX(o.OrderDate) as LastOrder
FROM
  Customers c
  LEFT JOIN Orders o
    ON o.CustomerID = c.CustomerID
GROUP BY
  c.CustomerName
ORDER BY
  LastOrder DESC
;
```

## JavaScript/TypeScript Questions

Answer as many levels as you can… the level you reach will only affect the type of position you’re qualified for - we have many positions available. But if you don’t complete level 1, you won’t get an interview.

**Task :**

Make a javascript or typescript function that converts any string to Title Case

**Answer :**

```
function titleCase(str: string): string{
  return str
    .toLowerCase()
    .split(" ")
    .map((word: string) =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ")
}
```

**Task :**

Fix this code, using promises

**Answer :**

```
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
```

**Task :**

Rewrite using Async/Await

**Answer :**

```
function fetchData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!url) {
        resolve("url is required", null);
      } else {
        resolve(null, `Data form ${url}`);
      }
    }, 1000)
  })
}

fuction processData(data) {
  return new Promise ((resolve, reject) => {
    setTimeout(()=>{
      if (!data) {
        resolve("Data is required", null);
      } else {
        resolve(null, data.toUpperCase());
      }
    }, 1000)
  })
}

async function execute() => {
  try {
    const data = await fetchData("https://example.com);
    const processedData = await processData(data);

    console.log('processed Data : ', processedData);
  }
  catch (error) {
    console.error('Failed!', error.message)
  }
})
```

---

**Task :**

Create a real-time chat between two windows; using web sockets, vuejs and typescript

**Answer :**

```
Github : https://github.com/noersaeka/chat
Demo : http://ekachat-frontend.s3-website.ap-southeast-3.amazonaws.com/
```

---

## VueJS

**Task :**  
Explain Vue.js reactivity and common issues when tracking changes.

**Answer :**  
Vue reactivity means when data changes, the UI updates automatically.

Common issues:

- Losing reactivity when destructuring reactive objects
- Directly mutating props
- Incorrect handling of nested objects or arrays

Solution:

- Use `ref`, `reactive`, `computed`, and `watch` properly
- Use `toRefs()` when needed

---

**Task :**  
Describe data flow between components in a Vue.js app.

**Answer :**  
Vue uses one-way data flow.

- Parent to child: use `props`
- Child to parent: use `emit`

For shared global state:

- Use Pinia or Vuex

Flow:
Parent → Props → Child → Emit Event → Parent updates state

---

**Task :**  
List the most common causes of memory leaks in Vue.js apps and how they can be solved.

**Answer :**  
Common causes:

- Event listeners not removed
- Timers not cleared
- WebSocket not closed
- Watchers/subscriptions not cleaned up

Solutions:

- Cleanup in `onUnmounted()`
- Remove event listeners
- Clear intervals/timeouts
- Close WebSocket connections

---

**Task :**  
What have you used for state management?

**Answer :**  
I usually use:

- Pinia for Vue 3 projects
- Vuex for older Vue projects

Use cases:

- Authentication
- User profile
- Global settings
- Shared data between components

---

**Task :**  
What’s the difference between pre-rendering and server-side rendering?

**Answer :**  
**Pre-rendering:**

- HTML generated during build time
- Best for static pages like blogs or landing pages

**Server-side rendering (SSR):**

- HTML generated on every request
- Best for dynamic pages like dashboards or personalized content

Simple:

- Pre-render = build once
- SSR = render on request

---

## Website Security Best Practises

**Task :**  
Tell me all the security best practices you can think of - start with the most important ones first.

**Answer :**

For application security, I usually start with strong authentication and authorization by making sure users are properly authenticated, tokens are stored securely, and permissions are always validated on the backend. Passwords should never be stored in plain text and should always be hashed securely. I also prefer secure session management, token expiration, and proper logout or session revocation mechanisms.

Input validation is another important area because many vulnerabilities come from untrusted user input. I always validate and sanitize data on both frontend and backend to prevent issues like XSS, SQL injection, and malicious payloads. Secure communication is also essential, so I use HTTPS, TLS, and secure WebSocket connections to protect data in transit.

On the infrastructure side, I avoid hardcoding secrets and instead store credentials securely using environment variables or secret managers. I regularly update dependencies, configure APIs and CORS properly, and apply least privilege access for servers and databases. Monitoring, logging, rate limiting, backups, and regular security reviews are also important to detect suspicious activity early and reduce overall security risk.

---

## Website Performance Best Practises

**Task :**  
Tell me all the performance best practices you can think of - start with the most important ones first.

**Answer :**

For frontend performance, I usually focus first on reducing unnecessary rendering by optimizing component updates, using computed properties, minimizing reactive state, and reducing heavy DOM operations. I also improve loading speed by applying code splitting, lazy loading, and removing unused dependencies so the application only loads what is needed. For better user experience, I optimize assets such as images and static files by compressing them, using modern formats, and lazy loading resources.

On the backend and network side, I focus on efficient data fetching by caching API responses, paginating large datasets, and avoiding duplicate requests. I also optimize server and database performance with indexing, caching, connection pooling, and async processing for heavier tasks. Finally, I monitor application performance regularly and prevent memory leaks by cleaning up event listeners, timers, and WebSocket connections.

---

## Tools

**Task :**  
Tools (Rate yourself 1 to 5)

**Answer :**

```
Git : 4/5
Redis : 3/5
VSCode / JetBrains : 4/5
Linux : 2/5 (Macos Unix)
AWS : 4/5
EC2 : 2/5
Lambda : 4/5
RDS : 3/5
CloudWatch : 4/5
S3 : 4/5
Unit Testing : 3/5
Kanban Boards : 5/5 (Jira)
```
