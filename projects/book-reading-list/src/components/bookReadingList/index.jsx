import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiBookOpen, FiCheck, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Styled } from "./styled";

const STORAGE_KEY = "reading-list.v1";
const STATUSES = ["To Read", "Reading", "Read"];

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
const todayISO = () => {
    const t = new Date();
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};
const formatNice = (iso) => iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "";

const isBook = (book) => book && typeof book === "object" &&
    typeof book.id === "string" && typeof book.title === "string" &&
    typeof book.author === "string" && STATUSES.includes(book.status) &&
    Number.isFinite(Number(book.createdAt));

const load = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === null) return [];
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(isBook).map((book) => ({
            ...book,
            totalPages: book.totalPages == null ? "" : String(book.totalPages),
            currentPage: book.currentPage == null ? "" : String(book.currentPage),
            notes: typeof book.notes === "string" ? book.notes : "",
            startedAt: typeof book.startedAt === "string" ? book.startedAt : "",
            finishedAt: typeof book.finishedAt === "string" ? book.finishedAt : "",
            createdAt: Number(book.createdAt),
            updatedAt: Number(book.updatedAt ?? book.createdAt),
        }));
    }
    catch { return []; }
};

export default function BookReadingList() {
    const [books, setBooks] = useState(load);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [status, setStatus] = useState("To Read");
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("All");
    const [sortBy, setSortBy] = useState("created"); // created | title | author | status
    const [editing, setEditing] = useState(null);
    const [storageError, setStorageError] = useState(false);

    // confirm modal
    const [confirm, setConfirm] = useState(null); // {title, message, confirmText, cancelText, tone, hideCancel, onConfirm}
    const dialogRef = useRef(null);
    const cancelRef = useRef(null);
    const confirmRef = useRef(null);
    const confirmTriggerRef = useRef(null);
    const saveBooks = (nextBooks) => {
        setBooks(nextBooks);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBooks));
            setStorageError(false);
            return true;
        } catch {
            setStorageError(true);
            return false;
        }
    };
    const restoreConfirmFocus = useCallback(() => requestAnimationFrame(() => {
        if (confirmTriggerRef.current?.isConnected) confirmTriggerRef.current.focus();
        else document.getElementById("reading-list-heading")?.focus();
    }), []);
    const closeConfirm = useCallback(() => {
        setConfirm(null);
        restoreConfirmFocus();
    }, [restoreConfirmFocus]);
    const showConfirm = (nextConfirm) => {
        confirmTriggerRef.current = document.activeElement;
        setConfirm(nextConfirm);
    };
    const askConfirm = (opts) =>
        showConfirm({
            title: "Are you sure?",
            message: "",
            confirmText: "Confirm",
            cancelText: "Cancel",
            tone: "default",
            hideCancel: false,
            ...opts,
        });
    const handleConfirm = () => {
        const fn = confirm?.onConfirm;
        closeConfirm();
        if (typeof fn === "function") fn();
    };
    useEffect(() => {
        if (!confirm) return;
        const onKey = (e) => {
            if (e.key === "Escape") {
                closeConfirm();
                return;
            }
            if (e.key !== "Tab") return;

            const focusable = [...(dialogRef.current?.querySelectorAll("button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])") ?? [])];
            if (focusable.length === 0) {
                e.preventDefault();
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        (confirm.hideCancel ? confirmRef : cancelRef).current?.focus();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [confirm, closeConfirm]);

    const counts = useMemo(() => ({
        toRead: books.filter(b => b.status === "To Read").length,
        reading: books.filter(b => b.status === "Reading").length,
        read: books.filter(b => b.status === "Read").length,
    }), [books]);

    const filtered = useMemo(() => {
        let list = books;

        if (filter !== "All") list = list.filter(b => b.status === filter);

        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(b =>
                b.title.toLowerCase().includes(q) ||
                (b.author || "").toLowerCase().includes(q)
            );
        }

        if (sortBy === "title") {
            list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === "author") {
            list = [...list].sort((a, b) => (a.author || "").localeCompare(b.author || ""));
        } else if (sortBy === "status") {
            const order = { "To Read": 0, "Reading": 1, "Read": 2 };
            list = [...list].sort((a, b) => order[a.status] - order[b.status] || a.title.localeCompare(b.title));
        } else {
            list = [...list].sort((a, b) => b.createdAt - a.createdAt);
        }

        return list;
    }, [books, filter, query, sortBy]);

    const addBook = (e) => {
        e.preventDefault();
        const t = title.trim();
        if (!t) return;
        const book = {
            id: uid(),
            title: t,
            author: author.trim(),
            status,
            totalPages: "",
            currentPage: "",
            notes: "",
            startedAt: status === "Reading" ? todayISO() : "",
            finishedAt: status === "Read" ? todayISO() : "",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        saveBooks([book, ...books]);
        setTitle(""); setAuthor(""); setStatus("To Read");
        showConfirm({ title: "Saved", message: `Added "${t}".`, confirmText: "OK", hideCancel: true });
    };

    const startEdit = id => setEditing(id);
    const cancelEdit = () => setEditing(null);

    const saveEdit = (id, patch) => {
        saveBooks(books.map((book) => book.id === id ? { ...book, ...patch, updatedAt: Date.now() } : book));
        setEditing(null);
        showConfirm({ title: "Saved", message: "Book updated.", confirmText: "OK", hideCancel: true });
    };

    const removeBook = (id) => {
        askConfirm({
            title: "Delete book?",
            message: "This will remove the book from your list.",
            confirmText: "Delete",
            tone: "danger",
            onConfirm: () => saveBooks(books.filter((book) => book.id !== id)),
        });
    };

    const clearRead = () => {
        askConfirm({
            title: "Clear all 'Read' books?",
            message: "This will remove all books marked as Read.",
            confirmText: "Clear",
            tone: "danger",
            onConfirm: () => saveBooks(books.filter((book) => book.status !== "Read")),
        });
    };

    const setStatusQuick = (id, nextStatus) => {
        saveBooks(books.map((b) => {
            if (b.id !== id) return b;
            const patch = { status: nextStatus, updatedAt: Date.now() };
            if (nextStatus === "Reading" && !b.startedAt) patch.startedAt = todayISO();
            if (nextStatus === "Read") patch.finishedAt = todayISO();
            return { ...b, ...patch };
        }));
    };

    return (
        <Styled.Page>
            <Styled.Container>
                <Styled.Header>
                    <div>
                        <Styled.Title id="reading-list-heading" tabIndex={-1}>Book Reading List</Styled.Title>
                        <Styled.Sub>Track books to read, currently reading, or finished. Data stays in this browser.</Styled.Sub>
                    </div>
                    <Styled.BadgeRow>
                        <Styled.Tag>To Read: {counts.toRead}</Styled.Tag>
                        <Styled.Tag>Reading: {counts.reading}</Styled.Tag>
                        <Styled.Tag>Read: {counts.read}</Styled.Tag>
                    </Styled.BadgeRow>
                </Styled.Header>

                {/* Add form */}
                <Styled.Card as="form" onSubmit={addBook}>
                    <Styled.FormRow>
                        <Styled.Input
                            aria-label="Book title"
                            placeholder="Book title *"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <Styled.Input
                            aria-label="Author"
                            placeholder="Author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            list="author-suggestions"
                        />
                        <datalist id="author-suggestions">
                            {Array.from(new Set(books.map(b => b.author).filter(Boolean))).map(a => (
                                <option key={a} value={a} />
                            ))}
                        </datalist>
                        <Styled.Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Initial reading status">
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </Styled.Select>
                        <Styled.PrimaryButton type="submit" disabled={!title.trim()}>Add</Styled.PrimaryButton>
                    </Styled.FormRow>
                    {!title.trim() && <Styled.Helper>Tip: Title is required.</Styled.Helper>}
                </Styled.Card>

                {/* Toolbar */}
                <Styled.Toolbar>
                    <Styled.RowWrap>
                        <Styled.Select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
                            {["All", ...STATUSES].map(s => <option key={s} value={s}>{s}</option>)}
                        </Styled.Select>
                        <Styled.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort books">
                            <option value="created">Newest</option>
                            <option value="title">Title A-Z</option>
                            <option value="author">Author A-Z</option>
                            <option value="status">By status</option>
                        </Styled.Select>
                        <Styled.Input
                            placeholder="Search title/author..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Search books by title or author"
                        />
                    </Styled.RowWrap>

                    <Styled.RowWrap>
                        <Styled.DangerButton type="button" onClick={clearRead}>Clear 'Read'</Styled.DangerButton>
                    </Styled.RowWrap>
                </Styled.Toolbar>

                {/* List */}
                <Styled.List>
                    {filtered.length === 0 && <Styled.Empty>No matching books. Adjust the search or filter, or add a book.</Styled.Empty>}

                    {filtered.map(b => {
                        const hasProgress = Number(b.totalPages) > 0;
                        const pct = hasProgress ? Math.max(0, Math.min(100, Math.round((Number(b.currentPage) || 0) / Number(b.totalPages) * 100))) : null;

                        if (editing === b.id) {
                            return (
                                <EditRow
                                    key={b.id}
                                    book={b}
                                    onCancel={cancelEdit}
                                    onSave={saveEdit}
                                />
                            );
                        }

                        return (
                            <Styled.Item key={b.id}>
                                <Styled.ItemLeft>
                                    <div>
                                        <Styled.ItemTitle>{b.title}</Styled.ItemTitle>
                                        <Styled.ItemMeta>
                                            {b.author ? <Styled.Tag>by {b.author}</Styled.Tag> : <Styled.Tag tone="muted">Unknown author</Styled.Tag>}
                                            <span aria-hidden="true">•</span>
                                            <Styled.Tag>#{b.status}</Styled.Tag>
                                            {hasProgress && (
                                                <>
                                                    <span aria-hidden="true">•</span>
                                                    <Styled.DueHint>{b.currentPage}/{b.totalPages} ({pct}%)</Styled.DueHint>
                                                </>
                                            )}
                                            {b.status !== "To Read" && b.startedAt && <><span aria-hidden="true">•</span><span>Started {formatNice(b.startedAt)}</span></>}
                                            {b.status === "Read" && b.finishedAt && <><span aria-hidden="true">•</span><span>Finished {formatNice(b.finishedAt)}</span></>}
                                        </Styled.ItemMeta>
                                    </div>
                                </Styled.ItemLeft>

                                <Styled.ItemRight>
                                    {b.status !== "Reading" && <Styled.IconButton type="button" onClick={() => setStatusQuick(b.id, "Reading")} title="Mark as Reading" aria-label="Mark as Reading"><FiBookOpen aria-hidden="true" /></Styled.IconButton>}
                                    {b.status !== "Read" && <Styled.IconButton type="button" onClick={() => setStatusQuick(b.id, "Read")} title="Mark as Read" aria-label="Mark as Read"><FiCheck aria-hidden="true" /></Styled.IconButton>}
                                    <Styled.IconButton type="button" onClick={() => startEdit(b.id)} title="Edit" aria-label="Edit"><FiEdit2 aria-hidden="true" /></Styled.IconButton>
                                    <Styled.IconButton type="button" onClick={() => removeBook(b.id)} title="Delete" aria-label="Delete"><FiTrash2 aria-hidden="true" /></Styled.IconButton>
                                </Styled.ItemRight>
                            </Styled.Item>
                        );
                    })}
                </Styled.List>

                {storageError && <Styled.Helper role="status">Changes are only available in this session because browser storage is unavailable.</Styled.Helper>}
                <Styled.FooterNote>Data stays in your browser (LocalStorage). Refresh-safe.</Styled.FooterNote>

                {/* Confirm Modal */}
                {confirm && (
                    <Styled.ModalOverlay onClick={(event) => { if (event.target === event.currentTarget) closeConfirm(); }}>
                        <Styled.ModalCard ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby={confirm.message ? "confirm-message" : undefined} onClick={(e) => e.stopPropagation()}>
                            <Styled.ModalTitle id="confirm-title">{confirm.title}</Styled.ModalTitle>
                            {confirm.message ? <Styled.ModalMessage id="confirm-message">{confirm.message}</Styled.ModalMessage> : null}
                            <Styled.ModalActions>
                                {!confirm.hideCancel && (
                                    <Styled.Button type="button" ref={cancelRef} onClick={closeConfirm}>
                                        {confirm.cancelText || "Cancel"}
                                    </Styled.Button>
                                )}
                                {confirm.tone === "danger" ? (
                                    <Styled.DangerButton type="button" ref={confirmRef} onClick={handleConfirm}>
                                        {confirm.confirmText || "Confirm"}
                                    </Styled.DangerButton>
                                ) : (
                                    <Styled.PrimaryButton type="button" ref={confirmRef} onClick={handleConfirm}>
                                        {confirm.confirmText || "Confirm"}
                                    </Styled.PrimaryButton>
                                )}
                            </Styled.ModalActions>
                        </Styled.ModalCard>
                    </Styled.ModalOverlay>
                )}
            </Styled.Container>
        </Styled.Page>
    );
}

function EditRow({ book, onCancel, onSave }) {
    const [t, setT] = useState(book.title);
    const [a, setA] = useState(book.author || "");
    const [s, setS] = useState(book.status);
    const [tp, setTp] = useState(book.totalPages || "");
    const [cp, setCp] = useState(book.currentPage || "");
    const [st, setSt] = useState(book.startedAt || "");
    const [fn, setFn] = useState(book.finishedAt || "");
    const [notes, setNotes] = useState(book.notes || "");
    const [pageError, setPageError] = useState("");

    return (
        <Styled.Item as="form" onSubmit={(e) => {
            e.preventDefault();
            if (!t.trim()) return;
            const total = tp === "" ? 0 : Number(tp);
            const current = cp === "" ? 0 : Number(cp);
            if (current > 0 && total === 0) {
                setPageError("Enter total pages before recording current pages.");
                return;
            }
            if (total > 0 && current > total) {
                setPageError("Current page cannot be greater than total pages.");
                return;
            }
            setPageError("");
            const patch = {
                title: t.trim(),
                author: a.trim(),
                status: s,
                totalPages: tp,
                currentPage: cp,
                startedAt: st,
                finishedAt: fn,
                notes,
            };
            // auto-set dates
            if (s === "Reading" && !st) patch.startedAt = todayISO();
            if (s === "Read" && !fn) patch.finishedAt = todayISO();
            onSave(book.id, patch);
        }}>
            <Styled.ItemLeft style={{ flexDirection: "column", gap: 10 }}>
                <Styled.FormRow>
                    <Styled.Input value={t} onChange={(e) => setT(e.target.value)} placeholder="Title *" required />
                    <Styled.Input value={a} onChange={(e) => setA(e.target.value)} placeholder="Author" />
                    <Styled.Select value={s} onChange={(e) => setS(e.target.value)}>
                        {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                    </Styled.Select>
                </Styled.FormRow>

                <Styled.RowWrap>
                    <Styled.Input
                        type="number" inputMode="numeric" min="1" step="1"
                        aria-label="Total pages"
                        value={tp} onChange={(e) => { setTp(e.target.value); setPageError(""); }} placeholder="Total pages"
                        style={{ width: 140 }}
                    />
                    <Styled.Input
                        type="number" inputMode="numeric" min="0" max={tp ? Number(tp) : undefined} step="1"
                        aria-label="Current page"
                        aria-invalid={Boolean(pageError)}
                        aria-describedby={pageError ? "page-progress-error" : undefined}
                        value={cp} onChange={(e) => { setCp(e.target.value); setPageError(""); }} placeholder="Current page"
                        style={{ width: 140 }}
                    />
                    <Styled.Input type="date" value={st} onChange={(e) => setSt(e.target.value)} aria-label="Started date" />
                    <Styled.Input type="date" value={fn} onChange={(e) => setFn(e.target.value)} aria-label="Finished date" />
                </Styled.RowWrap>
                {pageError && <Styled.Helper id="page-progress-error" role="alert">{pageError}</Styled.Helper>}

                <Styled.TextArea
                    placeholder="Notes (optional)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </Styled.ItemLeft>

            <Styled.ItemRight>
                <Styled.PrimaryButton type="submit">Save</Styled.PrimaryButton>
                <Styled.Button type="button" onClick={onCancel}>Cancel</Styled.Button>
            </Styled.ItemRight>
        </Styled.Item>
    );
}
