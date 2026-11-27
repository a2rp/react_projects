import assert from "node:assert/strict";
import test from "node:test";
import { prepareMovieQuery, readMovieSearchResponse } from "../src/movieSearchApp/searchLogic.js";

test("movie queries are trimmed and require at least three characters", () => {
    assert.deepEqual(prepareMovieQuery("  up "), { movieName: "up", isValid: false });
    assert.deepEqual(prepareMovieQuery("  Up!  "), { movieName: "Up!", isValid: true });
});

test("movie search response returns results from a successful service reply", () => {
    const firstMovie = { Title: "Example", Year: "2026" };
    assert.deepEqual(readMovieSearchResponse({ movies: { Response: "True", Search: [firstMovie] } }), {
        movies: [firstMovie],
        error: null,
    });
});

test("movie search response supplies an error for empty or unsuccessful replies", () => {
    assert.deepEqual(readMovieSearchResponse({ movies: { Response: "False", Error: "Not found" } }), {
        movies: [],
        error: "Not found",
    });
    assert.deepEqual(readMovieSearchResponse({}), { movies: [], error: "No movies found." });
});
