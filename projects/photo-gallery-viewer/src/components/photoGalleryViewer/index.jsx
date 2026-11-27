import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowDown, FiHeart, FiSearch, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const startingPhotos = [
    { id: 1, title: "Light by the water", note: "A small detail on the lake edge", collection: "Nature", image: "yellow-leaf.jpg", shape: "tall", favorite: true },
    { id: 2, title: "Forest current", note: "After the rain, the creek ran clear", collection: "Nature", image: "waterfall.jpg", shape: "wide", favorite: false },
    { id: 3, title: "Studio study", note: "Notes from a quiet afternoon", collection: "Details", image: "visual-notes.jpg", shape: "square", favorite: false },
    { id: 4, title: "Turntable detail", note: "Needle down, afternoon on", collection: "Objects", image: "vinyl.jpg", shape: "tall", favorite: true },
    { id: 5, title: "Sunlit wall", note: "Warm light on an old surface", collection: "Details", image: "sunlit-texture.jpg", shape: "square", favorite: false },
    { id: 6, title: "Late lunch", note: "A table shared with friends", collection: "Places", image: "shared-table.jpg", shape: "wide", favorite: false },
    { id: 7, title: "Rocky shore", note: "The last stretch before the tide", collection: "Places", image: "rocky-shore.jpg", shape: "tall", favorite: true },
    { id: 8, title: "Open country", note: "A road with nowhere to be", collection: "Nature", image: "open-country.jpg", shape: "wide", favorite: false },
];
const collections = ["All photos", "Nature", "Objects", "Places", "Details"];
const storageKey = "stillroom-gallery-favorites";
const validPhotoIds = new Set(startingPhotos.map((photo) => photo.id));
const defaultFavorites = startingPhotos.filter((photo) => photo.favorite).map((photo) => photo.id);
const photoSrc = (image) => import.meta.env.BASE_URL + "images/" + image;

const normalizeFavorites = (value) => {
    if (!Array.isArray(value)) return null;
    if (value.every((id) => typeof id === "number" || typeof id === "string")) {
        const ids = value.map(Number);
        return ids.every((id) => Number.isInteger(id) && validPhotoIds.has(id)) ? [...new Set(ids)] : null;
    }
    if (value.every((photo) => photo && typeof photo === "object" && Number.isInteger(photo.id) && validPhotoIds.has(photo.id) && typeof photo.favorite === "boolean")) {
        return [...new Set(value.filter((photo) => photo.favorite).map((photo) => photo.id))];
    }
    return null;
};

const readFavorites = () => {
    try {
        const saved = localStorage.getItem(storageKey);
        if (saved === null) return { value: defaultFavorites, notice: "" };
        const normalized = normalizeFavorites(JSON.parse(saved));
        return normalized ? { value: normalized, notice: "" } : { value: defaultFavorites, notice: "Saved favorites could not be read. You can still use favorites during this visit." };
    } catch {
        return { value: defaultFavorites, notice: "Saved favorites could not be read. You can still use favorites during this visit." };
    }
};

const PhotoGalleryViewer = () => {
    const [savedFavorites] = useState(readFavorites);
    const [favoriteIds, setFavoriteIds] = useState(savedFavorites.value);
    const [storageNotice, setStorageNotice] = useState(savedFavorites.notice);
    const [collection, setCollection] = useState("All photos");
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [search, setSearch] = useState("");
    const [activePhotoId, setActivePhotoId] = useState(null);
    const openerRef = useRef(null);
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);

    const photos = useMemo(() => startingPhotos.map((photo) => ({ ...photo, favorite: favoriteIds.includes(photo.id) })), [favoriteIds]);
    const activePhoto = photos.find((photo) => photo.id === activePhotoId) ?? null;
    const visiblePhotos = useMemo(() => photos.filter((photo) => {
        const matchesCollection = collection === "All photos" || photo.collection === collection;
        const matchesFavorite = !favoritesOnly || photo.favorite;
        const searchableText = `${photo.title} ${photo.note} ${photo.collection}`.toLowerCase();
        return matchesCollection && matchesFavorite && searchableText.includes(search.trim().toLowerCase());
    }), [photos, collection, favoritesOnly, search]);

    useEffect(() => {
        if (!activePhotoId) return undefined;
        const previousFocus = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                setActivePhotoId(null);
                return;
            }
            if (event.key !== "Tab") return;

            const focusableElements = dialogRef.current?.querySelectorAll("button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)");
            if (!focusableElements?.length) {
                event.preventDefault();
                return;
            }
            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];
            if (!dialogRef.current?.contains(document.activeElement)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            } else if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
            const returnTarget = openerRef.current?.isConnected ? openerRef.current : previousFocus;
            if (returnTarget instanceof HTMLElement && returnTarget.isConnected) returnTarget.focus();
        };
    }, [activePhotoId]);

    const openPhoto = (photoId, event) => {
        openerRef.current = event.currentTarget;
        setActivePhotoId(photoId);
    };

    const toggleFavorite = (photoId) => {
        const nextFavorites = favoriteIds.includes(photoId)
            ? favoriteIds.filter((id) => id !== photoId)
            : [...favoriteIds, photoId];
        try {
            localStorage.setItem(storageKey, JSON.stringify(nextFavorites));
            setStorageNotice("");
        } catch {
            setStorageNotice("Favorites could not be saved in this browser. They will reset when you leave this page.");
        }
        setFavoriteIds(nextFavorites);
    };

    return <div className={styles.gallery}>
        <section className={styles.galleryHead} id="gallery">
            <div><p className={styles.label}>A field of small moments</p><h1>Keep a little light.</h1><p>Photographs, details, and places worth looking at twice.</p></div>
            <div className={styles.photoCount}><strong>{photos.length}</strong><span>frames in this room</span></div>
        </section>
        {storageNotice && <p className={styles.storageNotice} role="status">{storageNotice}</p>}
        <div className={styles.galleryTools} id="collections">
            <div className={styles.collectionFilters} role="group" aria-label="Filter gallery by collection">
                {collections.map((item) => <button type="button" key={item} onClick={() => setCollection(item)} aria-pressed={collection === item} className={collection === item ? styles.activeFilter : ""}>{item}</button>)}
            </div>
            <button type="button" className={favoritesOnly ? styles.favoriteActive : styles.favoriteFilter} onClick={() => setFavoritesOnly((value) => !value)} aria-pressed={favoritesOnly}><FiHeart aria-hidden="true" /> Favorites</button>
            <label className={styles.search}><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a moment" aria-label="Search photos" /></label>
        </div>
        <div className={styles.gallerySummary}><span>{visiblePhotos.length} photos</span><span>Bundled images · No photo uploads</span></div>
        <section className={styles.photoGrid} aria-label="Photo gallery">
            {visiblePhotos.map((photo) => <article className={styles.photoCard + " " + styles[photo.shape]} key={photo.id}>
                <button className={styles.photoButton} type="button" onClick={(event) => openPhoto(photo.id, event)} aria-label={"Open photo " + photo.title}>
                    <img src={photoSrc(photo.image)} alt={photo.note} />
                    <span className={styles.photoCaption}><span>{photo.title}</span><small>{photo.collection}</small></span>
                </button>
                <button className={photo.favorite ? styles.favoriteOn : styles.favoriteOff} type="button" onClick={() => toggleFavorite(photo.id)} aria-label={(photo.favorite ? "Remove " : "Add ") + photo.title + (photo.favorite ? " from" : " to") + " favorites"} aria-pressed={photo.favorite}><FiHeart aria-hidden="true" /></button>
            </article>)}
        </section>
        {!visiblePhotos.length && <p className={styles.empty}>No photos fit those filters. Try another collection.</p>}
        <p className={styles.localNote}>Photos are bundled with the app. Favorite choices stay in this browser.</p>
        {activePhoto && <div className={styles.lightbox} onMouseDown={(event) => { if (event.target === event.currentTarget) setActivePhotoId(null); }}>
            <section className={styles.lightboxPanel} ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="photo-title">
                <button className={styles.closeLightbox} type="button" ref={closeButtonRef} onClick={() => setActivePhotoId(null)} aria-label="Close photo"><FiX aria-hidden="true" /></button>
                <img className={styles.largeImage} src={photoSrc(activePhoto.image)} alt={activePhoto.note} />
                <div className={styles.photoDetails}>
                    <div><span>{activePhoto.collection}</span><h2 id="photo-title">{activePhoto.title}</h2><p>{activePhoto.note}</p></div>
                    <div>
                        <button type="button" className={activePhoto.favorite ? styles.favoriteActive : styles.favoriteFilter} onClick={() => toggleFavorite(activePhoto.id)} aria-pressed={activePhoto.favorite}><FiHeart aria-hidden="true" /> {activePhoto.favorite ? "Saved" : "Save"}</button>
                        <a href={photoSrc(activePhoto.image)} download={activePhoto.image} aria-label={"Download " + activePhoto.title}><FiArrowDown aria-hidden="true" /> Download</a>
                    </div>
                </div>
            </section>
        </div>}
    </div>;
};

export default PhotoGalleryViewer;
