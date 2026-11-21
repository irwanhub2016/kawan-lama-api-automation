# Swagger Petstore User API Automation

Playwright Test and TypeScript API automation for the Swagger Petstore User operations. The suite uses `APIRequestContext`; it does not launch a browser or automate the Swagger UI.

## Contract and scope

The implementation was based on the [Swagger UI](https://petstore.swagger.io/) and its [OpenAPI v2 document](https://petstore.swagger.io/v2/swagger.json) (API version 1.0.9).

| Method | Path | Contract details |
|---|---|---|
| POST | `/user` | Required JSON body references `User`. The schema declares `id`, `username`, `firstName`, `lastName`, `email`, `password`, `phone`, and `userStatus`; it declares no required properties or email format. The response is documented only as a generic successful operation, without a specific status or response schema. |
| GET | `/user/{username}` | Required string path parameter. `200` returns `User`; `400` means invalid username; `404` means user not found. |
| PUT | `/user/{username}` | Required string path parameter and required JSON body referencing `User`. The spec lists `400` and `404`, but does not define a success status or response schema. The positive test sends a complete object; it does not assume partial-update behavior. |

`User` property types are `integer` for `id` and `userStatus`, and `string` for the other six properties. The schema does not mark any property as required. Consequently, validation-rejection behavior for empty bodies, nulls, invalid data types, string limits, duplicate usernames, and mismatched path/body usernames is not asserted as a contract requirement.

The live API check observed a contract discrepancy: `PUT /user/{username}` returned `200` for a generated username that had not been created, although the OpenAPI response list includes `404 User not found`. The regression test retains the documented `404` assertion and is marked as an expected failure until the demo service conforms or the contract is clarified. This request may create data on the shared server.

## Technology

- Node.js 22+
- TypeScript
- Playwright Test (`APIRequestContext`)
- GitHub Actions

## Architecture

```text
src/
  clients/UserApiClient.ts       HTTP methods and endpoint URL construction
  config/environment.ts         Base URL and opt-in exploratory setting
  data/userTestData.ts           Shared defaults
  fixtures/apiFixtures.ts        Per-test API client/service fixtures
  schemas/userSchema.ts          Runtime checks matching the Swagger User schema
  services/UserService.ts        Create/read and update/read API workflows
  types/userTypes.ts             User and CompleteUser types
  utils/apiHelpers.ts            Reusable response assertions
  utils/testDataFactory.ts       Unique user data per test
tests/
  user/                          Independent endpoint tests
  e2e/                            Integrated POST → GET → PUT → GET test
.github/workflows/api-tests.yml  CI workflow
```

The API client owns HTTP communication and has no test assertions. Endpoint tests own assertions. The `User` interface reflects the optional properties in the Swagger schema; `CompleteUser` is used by the data factory for the complete positive test data shape.

## Install and run

```bash
npm ci
cp .env.example .env
npm run typecheck
npm test
```

Set `API_BASE_URL` in `.env` to configure the API base URL. `.env` is local and ignored by Git; commit changes to `.env.example` when the required environment variables change. Environment variables already set by the shell or CI take precedence. For a one-off override:

```bash
API_BASE_URL=https://petstore.swagger.io/v2 npm test
```

Run individual endpoint suites:

```bash
npx playwright test tests/user/createUser.spec.ts
npx playwright test tests/user/getUser.spec.ts
npx playwright test tests/user/updateUser.spec.ts
```

Run only the integrated end-to-end test:

```bash
npm run test:e2e
```

## Exploratory tests

The OpenAPI document does not promise rejection behavior for most malformed input cases. Those tests are marked `@exploratory` and skipped by default, so the regular CI suite does not mutate the shared demo API with malformed/duplicate requests. To run them intentionally:

```bash
API_EXPLORATORY_TESTS=true npm run test:exploratory
```

On Windows PowerShell, set the variable with `$env:API_EXPLORATORY_TESTS = "true"` before running the npm command. Exploratory results report actual status codes without asserting undocumented outcomes. Several inputs can create or modify data in the shared demo service. The suite uses generated usernames and does not call DELETE; generated records may remain in the public demo environment.

## Adding tests and endpoints

1. Add request/response types based on the OpenAPI contract in `src/types/`.
2. Add methods and endpoint paths to the relevant API client.
3. Add or adjust schema checks based only on documented fields and types.
4. Add reusable operation-level behavior in a service only when it composes API calls.
5. Generate isolated test data through `src/utils/testDataFactory.ts`.
6. Add endpoint tests under `tests/`; keep undocumented validation tests exploratory.

To add test data, extend `User` only when the API schema supports the field, add stable defaults in `src/data/userTestData.ts`, and use factory overrides in tests. Do not share mutable user objects between tests.

## Failures and reports

- Run one test with `npx playwright test tests/user/getUser.spec.ts --grep "not-found"` to narrow a failure.
- `API_BASE_URL` can point the suite at a compatible test environment.
- The HTML report is generated in `playwright-report/` even if tests fail. View it with `npm run report`.
- Swagger Petstore is a shared demo service. A failing request may reflect service instability or state, not an automation defect. The negative tests assert only outcomes that the OpenAPI document states; exploratory checks do not assign undocumented pass/fail expectations.
- Each test creates unique records. There is no cleanup call because DELETE is outside the three-endpoint test scope and the service is shared.

## GitHub Actions

`.github/workflows/api-tests.yml` runs type checking and API tests on pushes, pull requests, and manual dispatch. It uses `npm ci`, installs no browser binaries, and uploads the HTML report and test results even when a test fails.
