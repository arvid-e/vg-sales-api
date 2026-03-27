# API Design Assignment

## Project Name

vg-sales-api

## Objective

Design and develop a robust, well-documented API (REST or GraphQL) that allows users to retrieve and manage information from a dataset of your choice. The API must include JWT authentication, automated testing via Postman/Newman in a CI/CD pipeline, and be publicly deployed.

Choose a dataset (10000+ data points) that interests you — it should include at least one primary CRUD resource and two additional read-only resources. Sources like [Kaggle](https://www.kaggle.com/datasets), public APIs, or CSV files work well. Pick something you find interesting, as you will reuse this API in the next assignment (WT dashboard).

## Summary

This API serves a comprehensive directory of video games sales, providing structured data regarding titles, genres, and sales rankings. It acts as a centralized repository for game enthusiasts and developers to query historical and modern game sales information. The sales numbers are in millions.

**Main Resources**  
The API is built around three core, interconnected resources:

- **Games**: The primary entity containing titles, descriptions, and metadata.
- **Platforms**: Hardware entities (e.g., PC, PlayStation, Nintendo) that host specific games.
- **Publishers**: The industry organizations responsible for bringing the games to market.

**User Capabilities**  
The API provides a secure and scalable interface for several key actions:

- **Discovery**: Users can browse and filter the entire dataset by genre, platform, or publisher using query parameters and pagination.

- **Resource Management**: Authenticated users have the power to Create, Update, and Delete game records, ensuring the database remains current.

- **HATEOAS Navigation**: The API follows RESTful best practices by providing dynamic links in every response, allowing clients to navigate related resources without hardcoding URLs.

- **Secure Access**: All data-modifying actions are protected by JWT-based authentication, ensuring that only authorized contributors can alter the directory.
## Implementation Type

REST

## Links and Testing

|                                       | URL / File                            |
| ------------------------------------- | ------------------------------------- |
| **Production API**                    | cu3040.camp.lnu.se/api/v1/                               |
| **API Documentation**                 | cu3040.camp.lnu.se/api/v1/api-docs/                               |
| **Postman Collection**                | `*.postman_collection.json`           |
| **Production Environment**            | `production.postman_environment.json` |

**Examiner can verify tests in one of the following ways:**

1. **CI/CD pipeline** — check the pipeline output in GitHub for test results.
2. **Run manually** — no setup needed:
   ```
   npx newman run ./tests/collection.json -e ./tests/production.postman_environment.json --insecure
   ```

## Dataset

| Field                                | Description                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| **Dataset source**                   | CSV file downloaded from Kaggle                                                      |
| **Primary resource (CRUD)**          | Games (`rank`, `name`, `platform`, `publisher`, `year`, `genre`, `sales`) |
| **Secondary resource 1 (read-only)** | Platform (`name`, `platformId`)                                                      |
| **Secondary resource 2 (read-only)** | Publisher (`name`,`publisherId`)                                                     |


### Seed script
A seed script exists that fills the database with the sales data from the CSV file.  

Usage:  
- `npm run seed`

## Design Decisions

### Authentication


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

The hardest part in this assignment was making the API tests in Postman and setting up the CI/CD pipeline for them. I had never made API tests in Postman before so there was much to learn. I struggled a bit with setting up the CI/CD pipeline and has problems where the tests would pass locally but fail in the pipeline. I learned that including logging in the pipeline steps made it easier to see what went wrong and what the cause of the problem was. I run all my production code inside Docker which makes putting into production easier, but getting the setup to work correctly is sometimes a burden. I still think running everything inside Docker is the best move since it requires less coupling to the server it runs on, keeps everything isolated in the same place and makes it easy to start and stop it. I also learned how to do search queries using Mongoose efficiently. I learned that API tests can be very useful since they founds lots of problem I did not notice. Even though I have no White Box tests I feel like the application is quite well tested from the API Black Box tests. Something I would do differently if I had more time would be to create a single utility for adding the HATEOAS links. I would also make White Box tests.

## Acknowledgements

Kaggle resource:  
- https://www.kaggle.com/datasets/anandshaw2001/video-game-sales

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
| Code quality (consistent standard, modular, documented)     | [#10](../../issues/10) | :white_check_mark: |
| Deployed and publicly accessible                            | [#9](../../issues/9)   | :white_check_mark: |
| Peer review reflection submitted on merge request           | [#11](../../issues/11) | :white_large_square: |

