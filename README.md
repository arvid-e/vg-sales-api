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

I chose to implement JWT authentication that generates token which has a set limit lifetime where it can be used. 

### API Design

**REST students:**

- _How did you implement HATEOAS? How does it improve API discoverability?_

I implemented HATEOAS by attaching links to the response which can be used to navigate to relevant API endpoints. This makes it so that new endpoints can be discovered dynamically simply by making a request to one of the endpoints. The frontend can therefore see what actions are available next without having to hardcore every available endpoint.


- _How did you structure your resource URLs and use HTTP methods/status codes?_

**HTTP methods**  

I utilized standard HTTP verbs to define the nature of the request, ensuring the API is self-descriptive:

- **GET**: Used for retrieving data (e.g., fetching the game list or a single user profile). These are "safe" operations that do not modify the database.

- **POST**: Used for creating new resources, such as registering a user or adding a new game entry.

- **PATCH/PUT**: Used for updates. I preferred PATCH for partial updates to existing records to save bandwidth and prevent accidental data overwrites.

- **DELETE**: Used for removing resources, such as deleting a user account or a game.

**Status codes**:  
- 200 OK: For successful GET or PUT.
- 201 Created: Successful POST (user registration or creating game).
- 400 Bad Request: When the input (validation) failed.
- 401 Unauthorized: When a user isn't logged in.
- 404 Not Found: When a resource doesn't exist.
- 500 Internal Server Error: For unexpected crashes.


### Error Handling

_How does your API handle errors? Describe the format and consistency of your error responses._

Errors are handled by throwing custom errors depending on what type of error it is. For example I defined a `NotFoundError` which has an error code of 404 and its error message always ends with " not found", which makes it simple and consistant since you only have to enter the name of the resource as argument. This way errors will be in a consistant format and will always have the correct status codes. I set up a global error handler middleware which handles all errors that are thrown. It handles the most common errors, and some MongoDB errors. If unexpected errors occur they are caught by the error middleware and handled gracefully to not crash the server. All errors has a consistant format of the following:

```
{
   error: "Error message"
}
```

## Core Technologies Used

_List the technologies you chose and briefly explain why:_

**List of technologies**
- Typescript
   - I chose to develop in Typescript to get access to static typing which catches type-related errors early and makes for a safer codebase.
- Express
   - The server is setup using Express which makes it easy to setup a server and define the routes, controller, services, and repositories.
- MongoDB (Database)
- Mongoose
- jsonwebtokens (JWT tokens)
- bcrypt
- swagger

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
| Filtering and pagination for large result sets                       | [#17](../../issues/17) | :white_large_square: |

### Functional Requirements — REST

| Requirement                                                 | Issue                  | Status               |
| ----------------------------------------------------------- | ---------------------- | -------------------- |
| RESTful endpoints with proper HTTP methods and status codes | [#12](../../issues/12) | :white_large_square: |
| HATEOAS (hypermedia links in responses)                     | [#13](../../issues/13) | :white_large_square: |

### Functional Requirements — GraphQL

| Requirement                                          | Issue                  | Status               |
| ---------------------------------------------------- | ---------------------- | -------------------- |
| Queries and mutations via single `/graphql` endpoint | [#14](../../issues/14) | :white_large_square: |
| At least one nested query                            | [#15](../../issues/15) | :white_large_square: |
| GraphQL Playground available                         | [#16](../../issues/16) | :white_large_square: |

### Non-Functional Requirements

| Requirement                                                 | Issue                  | Status               |
| ----------------------------------------------------------- | ---------------------- | -------------------- |
| API documentation (Swagger/OpenAPI or Postman)              | [#6](../../issues/6)   | :white_large_square: |
| Automated Postman tests (20+ test cases, success + failure) | [#7](../../issues/7)   | :white_large_square: |
| CI/CD pipeline running tests on every commit/MR             | [#8](../../issues/8)   | :white_large_square: |
| Seed script for sample data                                 | [#5](../../issues/5)   | :white_large_square: |
| Code quality (consistent standard, modular, documented)     | [#10](../../issues/10) | :white_large_square: |
| Deployed and publicly accessible                            | [#9](../../issues/9)   | :white_large_square: |
| Peer review reflection submitted on merge request           | [#11](../../issues/11) | :white_large_square: |

## Test push
