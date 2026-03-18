---
title: "Writing Bun Dev Server Tests"
description: "Write HMR and dev server tests for Bun using devTest/prodTest harnesses — covers file watching, hot reload verification, client simulation, and error handling."
author: "oven-sh"
repoUrl: "https://github.com/oven-sh/bun"
categories:
  - testing
tags:
  - bun
  - hmr
  - dev-server
  - testing
date: "2026-03-18T16:01:00Z"
slug: bun-dev-server-tests
---

# Writing Bun Dev Server Tests

Dev server tests validate hot-reloading robustness and reliability using the bake harness.

## File Structure

```
test/bake/
├── bake-harness.ts          # devTest, prodTest, Dev class, Client class
├── client-fixture.mjs       # subprocess for Client (page loading, IPC)
└── dev/
    ├── bundle.test.ts       # DevServer-specific bundling bugs
    ├── css.test.ts          # CSS bundling
    ├── plugins.test.ts      # development plugins
    ├── ecosystem.test.ts    # library compatibility
    ├── esm.test.ts          # ESM features in dev mode
    ├── html.test.ts         # HTML file handling
    ├── react-spa.test.ts    # React, react-refresh, server components
    └── sourcemap.test.ts    # source map correctness
```

## Basic devTest

```typescript
import { devTest, emptyHtmlFile } from "../bake-harness";

devTest("html file is watched", {
  files: {
    "index.html": emptyHtmlFile({
      scripts: ["/script.ts"],
      body: "<h1>Hello</h1>",
    }),
    "script.ts": `console.log("hello");`,
  },
  async test(dev) {
    // Fetch and verify response
    await dev.fetch("/").expect.toInclude("<h1>Hello</h1>");

    // Patch a file and verify hot reload
    await dev.patch("index.html", { find: "Hello", replace: "World" });
    await dev.fetch("/").expect.toInclude("<h1>World</h1>");

    // Open a browser client
    await using c = await dev.client("/");
    await c.expectMessage("hello");

    // Verify reload behavior
    await c.expectReload(async () => {
      await dev.patch("index.html", { find: "World", replace: "Bar" });
    });
    await c.expectMessage("hello");
  },
});
```

## Key APIs

### `dev` object
- `dev.fetch(path)` — HTTP request to the dev server
- `dev.client(path)` — Open a browser client at the path
- `dev.write(file, content)` — Write a file (waits for hot reload)
- `dev.patch(file, { find, replace })` — Patch file content (waits for hot reload)
- `dev.delete(file)` — Delete a file (waits for hot reload)

### `c` (Client) object
- `c.expectMessage(text)` — Assert a `console.log` output
- `c.expectReload(fn)` — Wrap code that triggers a full page reload

**Important**: Always use `dev.write/patch/delete` instead of `node:fs` — these methods wait for the hot reload to complete before returning.

## Testing Build Errors

```typescript
devTest("import then create", {
  files: {
    "index.html": `<!DOCTYPE html><html><head></head><body>
      <script type="module" src="/script.ts"></script>
    </body></html>`,
    "script.ts": `import data from "./data"; console.log(data);`,
  },
  async test(dev) {
    // Open client expecting a build error
    const c = await dev.client("/", {
      errors: ['script.ts:1:18: error: Could not resolve: "./data"'],
    });

    // Fix the error and verify recovery
    await c.expectReload(async () => {
      await dev.write("data.ts", "export default 'data';");
    });

    await c.expectMessage("data");
  },
});
```

## Test Categories

| File | What to test |
|---|---|
| `bundle.test.ts` | DevServer-specific bundling bugs (not general bundler bugs) |
| `css.test.ts` | CSS hot reload, CSS modules, PostCSS |
| `ecosystem.test.ts` | Concrete bugs with specific library versions |
| `react-spa.test.ts` | react-refresh transforms, server components, RSC |
| `sourcemap.test.ts` | Source map accuracy after hot reload |

## Running Tests

```bash
# Run a specific test file
bun test test/bake/dev/bundle.test.ts

# Run with debug output
BUN_DEV_DEBUG=1 bun test test/bake/dev/html.test.ts
```

## Key Points

- `dev.write/patch/delete` automatically wait for the hot reload cycle to complete
- Use the `errors` option on `dev.client()` to assert expected build failures
- `await using c = await dev.client("/")` ensures the client is properly cleaned up
- `c.expectReload()` asserts a full page reload happens, not just a module update
- Test ecosystem compatibility with concrete bugs, not full package test suites
