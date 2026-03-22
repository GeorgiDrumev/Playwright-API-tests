# Playwright API Automation — Mockerito Education API

End-to-end API automation suite for the [Mockerito Education sandbox](https://mockerito.com/docs?domain=education), covering all CRUD endpoints across 7 resource groups.

## Tech stack

| Tool                                         | Purpose                                           |
| -------------------------------------------- | ------------------------------------------------- |
| [@playwright/test](https://playwright.dev)   | Test runner + `APIRequestContext` for HTTP        |
| [Zod](https://zod.dev)                       | Schema definition and runtime response validation |
| [@faker-js/faker](https://fakerjs.dev)       | Deterministic random test data generation         |
| [TypeScript](https://www.typescriptlang.org) | Static typing throughout all layers               |
| [Prettier](https://prettier.io)              | Consistent code formatting                        |

## Architecture

The project follows a strict layered architecture — each layer has a single responsibility:

```
dtos/          Zod schemas + inferred TypeScript types (one file per resource)
factories/     Static factory classes — build() / buildMany() / buildUpdate() for test payloads
utils/         Shared utilities (HttpClient with 429 retry, sleep)
services/      One class per endpoint group — wraps HttpClient, returns APIResponse
fixtures/      Playwright fixture files — lifecycle management (create → use → cleanup)
tests/         Spec files — Given / When / Then via test.step()
```

### Layer rules

- **DTOs** define the shape via Zod; types are always inferred (`z.infer<>`)
- **Services** accept `HttpClient` (injected) and expose one method per endpoint
- **HttpClient** automatically retries on `429 Too Many Requests` (exponential backoff, 3 attempts)
- **Fixtures** compose via `.extend()` — `enrollment.fixtures` extends `student.fixtures` so `createdStudent` is inherited; `submission.fixtures` extends `enrollment.fixtures`
- **Tests** always use `Given / When / Then` steps; the HTTP call is always visible in the `When` step

## Resources covered

| Resource    | Tests | Notes                                                        |
| ----------- | ----- | ------------------------------------------------------------ |
| Auth        | 2     | Login success + invalid credentials                          |
| Assignments | 9     | Full CRUD + types list + submissions sub-resource            |
| Courses     | 10    | Full CRUD + categories/levels lists + search                 |
| Teachers    | 9     | Full CRUD + specializations list + courses sub-resource      |
| Users       | 7     | Full CRUD                                                    |
| Students    | —     | Full CRUD service, DTO, factory, and fixture implemented; spec file pending |
| Enrollments | 9     | Full CRUD + statuses list                                    |
| Submissions | 9     | Full CRUD + grade endpoint + statuses list                   |

**Total: 55 tests**

## Setup

```bash
npm install
npx playwright install
```

## Running tests

```bash
# Full suite
npm test

# Re-run only the last-failed tests (fastest feedback after a fix)
npm run test:failed

# Interactive debug mode — Playwright Inspector opens before each request
npm run test:debug

# Open the HTML report with traces for failed tests
npm run report
```

> The sandbox enforces a rate limit. Tests run with `--workers=1` and `HttpClient` retries `429` responses automatically with exponential backoff.

## Formatting

```bash
npm run format        # fix
npm run format:check  # check only (CI)
```
