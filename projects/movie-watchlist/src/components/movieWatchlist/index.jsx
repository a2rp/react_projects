import { useCallback, useMemo, useState } from "react";
import { FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../confirmDialog/index.jsx";
import styles from "./styles.module.css";

const starterFilms = [
    { id: 1, title: "The Grand Budapest Hotel", director: "Wes Anderson", year: 2014, runtime: "1h 39m", genre: "Comedy", status: "Want to watch", art: "grandBudapest" },
    { id: 2, title: "In the Mood for Love", director: "Wong Kar-wai", year: 2000, runtime: "1h 38m", genre: "Romance", status: "Watching", art: "moodForLove" },
    { id: 3, title: "Arrival", director: "Denis Villeneuve", year: 2016, runtime: "1h 56m", genre: "Science fiction", status: "Want to watch", art: "arrival" },
    { id: 4, title: "Moonlight", director: "Barry Jenkins", year: 2016, runtime: "1h 51m", genre: "Drama", status: "Watched", art: "moonlight" },
    { id: 5, title: "The Farewell", director: "Lulu Wang", year: 2019, runtime: "1h 40m", genre: "Drama", status: "Want to watch", art: "farewell" },
];
const statuses = ["Want to watch", "Watching", "Watched", "Paused"];
const key = "frame-list-films";
const isFilm = (film) =>
    film &&
    (typeof film.id === "string" || typeof film.id === "number") &&
    typeof film.title === "string" &&
    typeof film.director === "string" &&
    (typeof film.year === "string" || typeof film.year === "number") &&
    typeof film.runtime === "string" &&
    typeof film.genre === "string" &&
    statuses.includes(film.status);

const readWatchlist = () => {
    try {
        const stored = localStorage.getItem(key);
        if (stored === null) return { films: starterFilms, canWrite: true, message: "" };

        const parsed = JSON.parse(stored);
        const hasUniqueIds =
            Array.isArray(parsed) &&
            new Set(parsed.map((film) => String(film?.id))).size === parsed.length;
        if (!Array.isArray(parsed) || !parsed.every(isFilm) || !hasUniqueIds) {
            return {
                films: starterFilms,
                canWrite: false,
                message: "Saved watchlist data could not be read. Its original value was left untouched; changes in this session will not be saved.",
            };
        }

        return { films: parsed, canWrite: true, message: "" };
    } catch {
        return {
            films: starterFilms,
            canWrite: false,
            message: "Browser storage is unavailable. Changes in this session will not be saved.",
        };
    }
};

const MovieWatchlist = () => {
    const [initialData] = useState(readWatchlist);
    const [films, setFilms] = useState(initialData.films);
    const [canWriteStorage, setCanWriteStorage] = useState(initialData.canWrite);
    const [storageMessage, setStorageMessage] = useState(initialData.message);
    const [filter, setFilter] = useState("All films");
    const [search, setSearch] = useState("");
    const [title, setTitle] = useState("");
    const [removing, setRemoving] = useState(null);
    const persistFilms = (updatedFilms) => {
        if (!canWriteStorage) return;
        try {
            localStorage.setItem(key, JSON.stringify(updatedFilms));
        } catch {
            setCanWriteStorage(false);
            setStorageMessage("This browser could not save your watchlist. Changes in this session will not be saved.");
        }
    };
    const filtered = useMemo(() => films.filter((film) => (filter === "All films" || film.status === filter) && (film.title + " " + film.director + " " + film.genre).toLowerCase().includes(search.trim().toLowerCase())), [films, filter, search]);
    const updateStatus = (id, status) => {
        const updatedFilms = films.map((film) => film.id === id ? { ...film, status } : film);
        setFilms(updatedFilms);
        persistFilms(updatedFilms);
    };
    const addFilm = (event) => {
        event.preventDefault();
        const clean = title.trim();
        if (!clean) return;
        const id = globalThis.crypto?.randomUUID?.() ?? `film-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const updatedFilms = [{ id, title: clean, director: "Your note", year: new Date().getFullYear(), runtime: "Not set", genre: "Added by you", status: "Want to watch", art: "newFilm" }, ...films];
        setFilms(updatedFilms);
        persistFilms(updatedFilms);
        setTitle("");
    };
    const cancelDelete = useCallback(() => setRemoving(null), []);
    const confirmDelete = () => {
        if (!removing) return;
        const updatedFilms = films.filter((film) => film.id !== removing.id);
        setFilms(updatedFilms);
        persistFilms(updatedFilms);
        setRemoving(null);
    };
    const count = (status) => films.filter((film) => film.status === status).length;

    return <div className={styles.page}>
        <section className={styles.heading} id="watchlist"><div><p className={styles.label}>Your personal cinema</p><h1 id="watchlist-title" tabIndex={-1}>Save a film for later.</h1><p className={styles.lead}>A neat little place for the movies you mean to watch.</p></div><div className={styles.monthCard}><span>Films finished</span><strong>{count("Watched")}</strong><small>checked off your list</small></div></section>
        <section className={styles.statusRow} id="your-month" aria-label="Watchlist summary"><div><span>Want to watch</span><strong>{count("Want to watch")}</strong></div><div><span>In progress</span><strong>{count("Watching")}</strong></div><div><span>Finished</span><strong>{count("Watched")}</strong></div><div className={styles.quote}>“The right film finds the right evening.”</div></section>
        <section className={styles.collection} aria-labelledby="collection-title">
            <div className={styles.collectionHead}><div><h2 id="collection-title">All films</h2><p aria-live="polite" aria-atomic="true">{filtered.length} {filtered.length === 1 ? "film" : "films"} on your list</p></div><label className={styles.search}><FiSearch aria-hidden="true" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a film" aria-label="Search films" /></label></div>
            <div className={styles.tabs} role="group" aria-label="Filter watchlist">{["All films", ...statuses].map((status) => <button key={status} type="button" onClick={() => setFilter(status)} aria-pressed={filter === status} className={filter === status ? styles.selectedTab : ""}>{status}</button>)}</div>
            <div className={styles.filmList}>{filtered.map((film, index) => <article key={film.id} className={styles.filmRow}>
                <div className={styles.poster + " " + styles[film.art]} aria-hidden="true"><span>{film.title}</span><small>{film.year}</small></div>
                <span className={styles.rank}>{String(index + 1).padStart(2, "0")}</span>
                <div className={styles.filmInfo}><h3>{film.title}</h3><p>{film.director} <span>·</span> {film.year} <span>·</span> {film.runtime}</p><span className={styles.genre}>{film.genre}</span></div>
                <label className={styles.statusSelect}><span>Status</span><select value={film.status} onChange={(event) => updateStatus(film.id, event.target.value)} aria-label={"Status for " + film.title}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
                <button type="button" className={styles.deleteButton} onClick={() => setRemoving(film)} aria-label={"Remove " + film.title}><FiTrash2 aria-hidden="true" /></button>
            </article>)}</div>
            {!filtered.length && <p className={styles.empty}>No films here yet. Change the filter or add one below.</p>}
        </section>
        <form className={styles.addFilm} onSubmit={addFilm}><div><h2>Add a film</h2><p>Keep your next movie night in mind.</p></div><label><span>Film title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="For example, The Apartment" /></label><button type="submit"><FiPlus aria-hidden="true" /> Add to watchlist</button>{storageMessage && <p className={styles.storageMessage} role="status">{storageMessage}</p>}</form>
        {removing && <ConfirmDialog title="Remove this film?" description={removing.title + " will be removed from your watchlist."} confirmLabel="Remove film" fallbackFocusId="watchlist-title" onCancel={cancelDelete} onConfirm={confirmDelete} />}
    </div>;
};

export default MovieWatchlist;
