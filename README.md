# API Design Assignment

## Project Name

vg-sales-api

## Objective

Design and develop a robust, well-documented API (REST or GraphQL) that allows users to retrieve and manage information from a dataset of your choice. The API must include JWT authentication, automated testing via Postman/Newman in a CI/CD pipeline, and be publicly deployed.

Choose a dataset (10000+ data points) that interests you — it should include at least one primary CRUD resource and two additional read-only resources. Sources like [Kaggle](https://www.kaggle.com/datasets), public APIs, or CSV files work well. Pick something you find interesting, as you will reuse this API in the next assignment (WT dashboard).

_Describe your API in a few sentences: what dataset does it serve, what are its main resources, and what can users do with it?_

The vg-sales-api is a HATEOAS REST API which serves a video game sales dataset. Its main resource is video games, which has attributes like its name, release year, sales data etc. Users can use this API to view a all games ranked in order of sales, sort by platform, publisher or genre, and add or remove games.

## Implementation Type

REST

## Links and Testing

|                                       | URL / File                            |
| ------------------------------------- | ------------------------------------- |
| **Production API**                    | _..._                                 |
| **API Documentation**                 | _..._                                 |
| **GraphQL Playground** (GraphQL only) | _..._                                 |
| **Postman Collection**                | `*.postman_collection.json`           |
| **Production Environment**            | `production.postman_environment.json` |

**Examiner can verify tests in one of the following ways:**

1. **CI/CD pipeline** — check the pipeline output in GitHub for test results.
2. **Run manually** — no setup needed:
   ```
   npx newman run <collection.json> -e production.postman_environment.json --insecure
   ```

## Dataset

| Field                                | Description                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| **Dataset source**                   | CSV file downloaded from Kaggle                                                      |
| **Primary resource (CRUD)**          | Games (`rank`, `name`, `platform`, `publisher`, `year`, `genre`, `naSales`, `sales`) |
| **Secondary resource 1 (read-only)** | Platform (`name`, `platformId`)                                                      |
| **Secondary resource 2 (read-only)** | Publisher (`name`,`publisherId`)                                                     |

## Design Decisions

### Authentication

_Describe your JWT authentication solution. Why did you choose this approach? What alternatives exist, and what are their trade-offs?_

**My chosen solution: Stateless JWT**

I implemented a stateless JWT authentication flow. Upon a successful login, the server issues a digitally signed token containing the user's unique identifier. This token is sent with every subsequent request in the `Authorization: Bearer <token>` header.

**Why this approach?**

Scalability: 
- Since the token contains all necessary user information, the server does not need to query the database to "remember" the session. This reduces database I/O and allows the API to scale horizontally across multiple server instances easily.

Decoupling: 
- The frontend and backend are decoupled; the backend simply validates the signature of the incoming string.

Simplicity:
- This solution is simple to implement but still very effective.

**The Trade-offs (Security vs. Convenience)**

The primary downside of my current implementation is the lack of revocation control.

The Risk:  
- Once a token is issued, it is valid until it expires. If a token is intercepted via an XSS attack or a man-in-the-middle attack, an attacker has full access until the expiration time.

The Mitigation:
- To minimize this window, I set a relatively short expiration time. However, this creates a poor user experience as the user must re-log during long sessions.

### **Alternatives and Enhancements**  

**Refresh Tokens**:

- A more robust alternative is the access/refresh token pattern.

How it works: 
- The user receives a short-lived access token (e.g. 10 minutes) and a long-lived refresh token (e.g. 7 days). The refresh token is stored in a database and sent via an HttpOnly cookie to prevent JavaScript access.

Trade-off: 
- This introduces "state" back into the system because the server must check the database during the refresh flow. However, it allows for revoking of active refresh tokens. If a user logs out or a device is stolen, we simply delete the refresh token from the database, and the attacker is locked out the moment the current access token expires.

**Server-Side Sessions**:
- Making use of cookies.

How it works: 
- The server stores a session ID in a database and sends a cookie to the client. On every request, the server looks up that ID.

Trade-off:
- This is highly secure and offers perfect control over every session. However, it is harder to scale. If you have millions of users, the session lookup becomes a performance bottleneck, and you must ensure your servers can all access the same session store.


**OAuth 2.0 / OpenID Connect**

How it works: 

- Delegating authentication to a third party like Google or GitHub.

Trade-off: 
- High security and better user UX (no new passwords), but high implementation complexity and a dependency on an external provider's uptime.




### API Design

**REST students:**


I implemented HATEOAS by attaching links to the response which can be used to navigate to relevant API endpoints. This makes it so that new endpoints can be discovered dynamically simply by making a request to one of the endpoints. The frontend can therefore see what actions are available next without having to hardcode every available endpoint. For example, there are links attached to each game found, and depending on if the user is logged in or not the links shown are different. For logged in users there are links for updating or deleting games, but for unverified users only read-only links can be viewed, making sure only usable links appear.


**HTTP methods**  

I utilized standard HTTP verbs to define the nature of the request, ensuring the API is self-descriptive:

- **GET**: Used for retrieving data (e.g., fetching the game list or a publisher). These are "safe" operations that do not modify the database.

- **POST**: Used for creating new resources, such as registering a user or adding a new game entry.

- **PATCH/PUT**: Used for updates. I preferred PATCH for partial updates to existing records to save bandwidth and prevent accidental data overwrites.

- **DELETE**: Used for removing resources, such as deleting a game.

**Status codes**:  
- 200 OK: For successful GET or PUT.
- 201 Created: Successful POST (user registration or creating game).
- 400 Bad Request: When the input (validation) failed.
- 401 Unauthorized: When a user isn't logged in.
- 404 Not Found: When a resource doesn't exist.
- 500 Internal Server Error: For unexpected crashes.


### Error Handling

Errors are handled by throwing custom errors depending on what type of error it is. For example I defined a `NotFoundError` which has an error code of 404 and its error message always ends with " not found", which makes it simple and consistant since you only have to enter the name of the resource as argument. This way errors will be in a consistant format and will always have the correct status codes. I set up a global error handler middleware which handles all errors that are thrown. It handles the most common errors, and some MongoDB errors. If unexpected errors occur they are caught by the error middleware and handled gracefully to not crash the server. All errors have a consistant format of the following, together with the correct error code:

```
{
   error: "Error message"
}
```

## Core Technologies Used

**List of technologies**
- Typescript
   - I chose to develop in Typescript to get access to static typing which catches type-related errors early and makes for a safer codebase. It also helps for pointing out where error handling is needed.
- Express
   - The server is setup using Express which makes it easy to setup and seperate the routes, controller, services, and repositories.
- MongoDB (Database)
  - MongoDB is used as the database as it is fit for a HATEOAS REST API and straight forward to use.
- Mongoose
  - Used to interact with MongoDB.
- jsonwebtokens (JWT tokens)
  - Used for generating and verifying JWT tokens.
- bcrypt
  - Hashing passwords for safe password storage and comparing hashes.
- swagger
  - Documenting all API endpoints in an interactive playground environment where the endpoints can be tested. Accessable at `/api-docs`.

## Reflection

_What was hard? What did you learn? What would you do differently?_

## Acknowledgements

_Resources, attributions, or shoutouts._

## Requirements

See [all requirements in Issues](../../issues/). Close issues as you implement them. Create additional issues for any custom functionality. See [TESTING.md](TESTING.md) for detailed testing requirements.

### Functional Requirements — Common

| Requirement                                                          | Issue                  | Status               |
| -------------------------------------------------------------------- | ---------------------- | -------------------- |
| Data acquisition — choose and document a dataset (1000+ data points) | [#1](../../issues/1)   | :white_check_mark:   |
| Full CRUD for primary resource, read-only for secondary resources    | [#2](../../issues/2)   | :white_check_mark:   |
| JWT authentication for write operations                              | [#3](../../issues/3)   | :white_check_mark:   |
| Error handling (400, 401, 404 with consistent format)                | [#4](../../issues/4)   | :white_check_mark:   |
| Filtering and pagination for large result sets                       | [#17](../../issues/17) | :white_check_mark:  |

### Functional Requirements — REST

| Requirement                                                 | Issue                  | Status               |
| ----------------------------------------------------------- | ---------------------- | -------------------- |
| RESTful endpoints with proper HTTP methods and status codes | [#12](../../issues/12) | :white_check_mark:  |
| HATEOAS (hypermedia links in responses)                     | [#13](../../issues/13) | :white_check_mark:  |


### Non-Functional Requirements

| Requirement                                                 | Issue                  | Status               |
| ----------------------------------------------------------- | ---------------------- | -------------------- |
| API documentation (Swagger/OpenAPI or Postman)              | [#6](../../issues/6)   | :white_check_mark:  |
| Automated Postman tests (20+ test cases, success + failure) | [#7](../../issues/7)   | :white_check_mark:  |
| CI/CD pipeline running tests on every commit/MR             | [#8](../../issues/8)   | :white_check_mark:  |
| Seed script for sample data                                 | [#5](../../issues/5)   | :white_check_mark:  |
| Code quality (consistent standard, modular, documented)     | [#10](../../issues/10) | :white_large_square: |
| Deployed and publicly accessible                            | [#9](../../issues/9)   | :white_large_square: |
| Peer review reflection submitted on merge request           | [#11](../../issues/11) | :white_large_square: |

## Test push
