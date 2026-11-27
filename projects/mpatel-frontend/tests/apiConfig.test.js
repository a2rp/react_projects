import assert from "node:assert/strict";
import test from "node:test";
import { resolveApiBaseUrl } from "../src/apiConfig.js";

test("API URL falls back to the local backend", () => {
    assert.equal(resolveApiBaseUrl(undefined), "http://localhost:1198/api/v1");
    assert.equal(resolveApiBaseUrl("  "), "http://localhost:1198/api/v1");
});

test("API URL trims whitespace and trailing slashes", () => {
    assert.equal(resolveApiBaseUrl("  https://example.test/api/v1///  "), "https://example.test/api/v1");
});
