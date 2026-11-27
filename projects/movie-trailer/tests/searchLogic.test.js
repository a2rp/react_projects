import assert from "node:assert/strict";
import test from "node:test";
import { prepareTrailerQuery } from "../src/movieTrailer/searchLogic.js";

test("trailer queries are trimmed and require at least two characters", () => {
    assert.deepEqual(prepareTrailerQuery("  A "), { title: "A", isValid: false });
    assert.deepEqual(prepareTrailerQuery("  Up  "), { title: "Up", isValid: true });
});
