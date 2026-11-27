import React, { useState } from "react";
import { FiFilm, FiSearch, FiStar } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import MovieCard from "./MovieCard";
import styles from "./styles.module.scss";
import { prepareMovieQuery, readMovieSearchResponse } from "./searchLogic.js";

const MovieSearchApp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [movies, setMovies] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const publicUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { movieName, isValid } = prepareMovieQuery(searchInput);
        if (!isValid) {
            toast.warn("Search with at least 3 characters.");
            return;
        }
        const searchUrl = import.meta.env.VITE_MOVIE_SEARCH_URL;
        if (!searchUrl) {
            toast.error("Movie search service is not configured.");
            return;
        }
        setIsLoading(true);
        setHasSearched(true);
        setMovies([]);
        try {
            const response = await axios.post(searchUrl, { movieName });
            const result = readMovieSearchResponse(response?.data);
            setMovies(result.movies);
            if (result.error) toast.error(result.error);
        } catch (error) {
            if (error?.response?.status === 429) {
                toast.error("Search limit reached. Please try again later.");
            } else {
                toast.error("Unable to reach the movie search service.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="search" className={styles.container}>
            <div className={styles.main}>
                <div className={styles.hero} style={{ backgroundImage: `url(${publicUrl}/movie-backdrop.jpg)` }}>
                    <div className={styles.heroOverlay}></div>
                    <div className={styles.heroContent}><span className={styles.eyebrow}>MOVIE DISCOVERY</span><h1>Find your next watch.</h1><p>Search a title and browse the key details returned by the movie service in a focused, responsive card grid.</p><div className={styles.heroNote}><FiStar /> Search by title, year or keyword</div></div>
                </div>

                <div className={styles.searchPanel}>
                    <div className={styles.panelHeading}><FiFilm /><div><h2>Search the catalogue</h2><p id="movie-search-hint">Enter at least three characters to begin.</p></div></div>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <label className={styles.searchField} htmlFor="movieSearch"><FiSearch /><input id="movieSearch" type="search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search movie here" aria-describedby="movie-search-hint" /></label>
                        <button type="submit" disabled={isLoading} className={styles.submitButton}>{isLoading ? <span className={styles.spinner} aria-label="Searching" /> : <><FiSearch /> Search</>}</button>
                    </form>
                </div>

                <div id="results" className={styles.outputContainer} aria-busy={isLoading}><div className={styles.resultsHeading}><div><span className={styles.eyebrow}>RESULTS</span><h2 aria-live="polite" aria-atomic="true">{isLoading ? "Searching..." : hasSearched ? `${movies.length} title${movies.length === 1 ? "" : "s"} found` : "Ready when you are"}</h2></div>{hasSearched && <span className={styles.resultHint}>Powered by your configured search service</span>}</div>{isLoading ? <div className={styles.loadingState}><span className={styles.spinner} aria-hidden="true"></span><p>Looking through the catalogue...</p></div> : movies.length ? <div className={styles.moviesContainer}>{movies.map((movie) => <MovieCard key={movie.imdbID || `${movie.Title}-${movie.Year}`} {...movie} />)}</div> : <div className={styles.emptyState}><FiFilm aria-hidden="true" /><h3>{hasSearched ? "No titles to display" : "Your results will appear here"}</h3><p>{hasSearched ? "Try another title or a broader search term." : "Start with a movie name to explore the catalogue."}</p></div>}</div>
            </div>
        </section>
    );
};

export default MovieSearchApp;
