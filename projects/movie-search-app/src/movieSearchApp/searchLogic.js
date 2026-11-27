export function prepareMovieQuery(value) {
    const movieName = String(value ?? "").trim();
    return {
        movieName,
        isValid: movieName.length >= 3,
    };
}

export function readMovieSearchResponse(data) {
    const result = data?.movies;
    if (result?.Response !== "True") {
        return { movies: [], error: result?.Error || "No movies found." };
    }

    return {
        movies: Array.isArray(result.Search) ? result.Search : [],
        error: null,
    };
}
