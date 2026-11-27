import React, { useEffect, useMemo, useRef, useState } from "react";
import { Styled } from "./styled";

/** -------------------------
 *  Storage & Crypto helpers
 *  ------------------------- */
const STORAGE_KEY = "journal.v1"; // { meta:{salt,iter,verifier:{iv,ct}}, data:{[date]:{iv,ct,updatedAt}} }
const ITER = 600_000;
const LEGACY_ITER = 120_000;

const enc = new TextEncoder();
const dec = new TextDecoder();

const bufToB64 = (buf) => {
    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
};
const b64ToBuf = (b64) => {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
};

const isEncryptedRecord = (record) => record
    && typeof record === "object"
    && typeof record.iv === "string"
    && typeof record.ct === "string";

const isJournalDatabase = (value) => value
    && typeof value === "object"
    && value.meta
    && typeof value.meta.salt === "string"
    && isEncryptedRecord(value.meta.verifier)
    && (value.meta.iter === undefined || (Number.isSafeInteger(value.meta.iter)
        && value.meta.iter >= LEGACY_ITER && value.meta.iter <= ITER))
    && value.data
    && typeof value.data === "object"
    && !Array.isArray(value.data);

const loadDB = () => {
    try {
        const storedDB = localStorage.getItem(STORAGE_KEY);
        if (storedDB === null) return { db: null, error: "" };

        const parsedDB = JSON.parse(storedDB);
        return isJournalDatabase(parsedDB)
            ? { db: parsedDB, error: "" }
            : { db: null, error: "Saved journal data is unreadable. It has not been replaced; reset storage only if you want to erase it." };
    } catch {
        return { db: null, error: "Journal storage could not be read. It has not been replaced; reset storage only if you want to erase it." };
    }
};
const saveDB = (db) => localStorage.setItem(STORAGE_KEY, JSON.stringify(db));

const todayISO = () => {
    const t = new Date();
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};
const fmtNice = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

async function deriveKey(password, saltB64, iterations = ITER) {
    const salt = saltB64 ? b64ToBuf(saltB64) : crypto.getRandomValues(new Uint8Array(16)).buffer;
    const baseKey = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
    return { key, saltB64: bufToB64(salt) };
}
async function encryptString(key, plaintext) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext));
    return { iv: bufToB64(iv), ct: bufToB64(ct) };
}
async function decryptString(key, ctB64, ivB64) {
    const pt = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(b64ToBuf(ivB64)) },
        key,
        b64ToBuf(ctB64)
    );
    return dec.decode(pt);
}

/** -------------------------
 *  Main component
 *  ------------------------- */
export default function Journal() {
    const [loadedDB] = useState(loadDB);
    const [db, setDb] = useState(loadedDB.db);
    const [loadError, setLoadError] = useState(loadedDB.error);
    const [storageError, setStorageError] = useState("");
    const [key, setKey] = useState(null);    // CryptoKey when unlocked
    const [unlocked, setUnlocked] = useState(false);

    // UI state
    const [selectedDate, setSelectedDate] = useState(todayISO());
    const [entry, setEntry] = useState("");
    const [loadingEntry, setLoadingEntry] = useState(false);
    const [entryError, setEntryError] = useState("");
    const [editPasswordOpen, setEditPasswordOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const entriesCount = useMemo(() => Object.keys(db?.data || {}).length, [db]);

    const persistDatabase = (nextDB) => {
        try {
            saveDB(nextDB);
            setDb(nextDB);
            setStorageError("");
            return true;
        } catch {
            setStorageError("Could not save the journal to this browser. Free storage space before continuing.");
            return false;
        }
    };

    // confirm modal
    const [confirm, setConfirm] = useState(null);
    const askConfirm = (opts) =>
        setConfirm({
            title: "Are you sure?",
            message: "",
            confirmText: "Confirm",
            cancelText: "Cancel",
            tone: "default",
            hideCancel: false,
            ...opts,
        });
    const handleConfirm = () => { const fn = confirm?.onConfirm; setConfirm(null); if (typeof fn === "function") fn(); };

    // load entry
    useEffect(() => {
        let active = true;

        (async () => {
            if (!unlocked || !key) {
                setEntry("");
                setEntryError("");
                setLoadingEntry(false);
                return;
            }
            const rec = db?.data?.[selectedDate];
            if (!rec) {
                setEntry("");
                setEntryError("");
                setLoadingEntry(false);
                return;
            }
            try {
                setLoadingEntry(true);
                setEntryError("");
                const txt = await decryptString(key, rec.ct, rec.iv);
                if (active) setEntry(txt);
            } catch {
                if (active) {
                    setEntry("");
                    setEntryError("This entry could not be decrypted. It has been left unchanged.");
                }
            } finally {
                if (active) setLoadingEntry(false);
            }
        })();

        return () => { active = false; };
    }, [selectedDate, unlocked, key, db]);

    /** ----------- Auth flows ----------- */
    const setupPassword = async (password) => {
        const { key, saltB64 } = await deriveKey(password);
        const verifier = await encryptString(key, "ok");
        const newDB = { meta: { salt: saltB64, iter: ITER, verifier }, data: {} };
        if (!persistDatabase(newDB)) throw new Error("Could not save journal data in this browser.");
        setKey(key);
        setUnlocked(true);
    };

    const unlock = async (password) => {
        if (!db?.meta?.salt) throw new Error("Journal not initialized.");
        try {
            const storedIterations = db.meta.iter;
            const iterations = Number.isSafeInteger(storedIterations)
                && storedIterations >= LEGACY_ITER
                && storedIterations <= ITER
                ? storedIterations
                : LEGACY_ITER;
            const { key } = await deriveKey(password, db.meta.salt, iterations);
            const ok = await decryptString(key, db.meta.verifier.ct, db.meta.verifier.iv);
            if (ok !== "ok") throw new Error("Invalid password.");
            setKey(key);
            setUnlocked(true);
            return true;
        } catch {
            return false;
        }
    };

    const lock = () => {
        setKey(null);
        setUnlocked(false);
        setEntry("");
    };

    const changePassword = async (newPassword) => {
        if (!unlocked || !key) return;
        setBusy(true);
        try {
            const plainByDate = {};
            for (const [date, rec] of Object.entries(db.data || {})) {
                plainByDate[date] = await decryptString(key, rec.ct, rec.iv);
            }
            const { key: newKey, saltB64 } = await deriveKey(newPassword);
            const newData = {};
            for (const [date, text] of Object.entries(plainByDate)) {
                const encRec = await encryptString(newKey, text);
                newData[date] = { ...encRec, updatedAt: Date.now() };
            }
            const verifier = await encryptString(newKey, "ok");
            const newDB = { meta: { salt: saltB64, iter: ITER, verifier }, data: newData };
            if (!persistDatabase(newDB)) throw new Error("Could not save the new encrypted journal. The existing password is unchanged.");
            setKey(newKey);
            setUnlocked(true);
            setEditPasswordOpen(false);
        } finally {
            setBusy(false);
        }
    };

    /** ----------- Project reset (declare BEFORE use) ----------- */
    function resetProjectStorage() {
        askConfirm({
            title: "Reset all journal data?",
            message: "This clears all encrypted entries and settings from this browser. This cannot be undone.",
            confirmText: "Erase & start fresh",
            tone: "danger",
            onConfirm: () => {
                try {
                    localStorage.removeItem(STORAGE_KEY);
                } catch {
                    setStorageError("Could not clear journal storage in this browser.");
                    return;
                }
                setDb(null);
                setKey(null);
                setUnlocked(false);
                setEntry("");
                setEntryError("");
                setLoadError("");
                setStorageError("");
            },
        });
    }

    /** ----------- Entry actions ----------- */
    const saveEntry = async () => {
        if (!unlocked || !key || loadingEntry || entryError) return;
        try {
            const encRec = await encryptString(key, entry);
            const next = {
                ...db,
                data: { ...(db?.data || {}), [selectedDate]: { ...encRec, updatedAt: Date.now() } },
            };
            if (!persistDatabase(next)) return;

            setConfirm({
                title: "Saved",
                message: `Entry for ${fmtNice(selectedDate)} saved.`,
                confirmText: "OK",
                hideCancel: true,
            });
        } catch {
            setStorageError("Could not encrypt this entry. Your existing saved entry has not changed.");
        }
    };

    const deleteEntry = () => {
        askConfirm({
            title: "Delete today’s entry?",
            message: `Remove the entry for ${fmtNice(selectedDate)}?`,
            confirmText: "Delete",
            tone: "danger",
            onConfirm: () => {
                const next = { ...db, data: { ...(db?.data || {}) } };
                delete next.data[selectedDate];
                if (persistDatabase(next)) {
                    setEntry("");
                    setEntryError("");
                }
            },
        });
    };

    const clearAll = () => {
        askConfirm({
            title: "Clear ALL entries?",
            message: "This removes every saved entry permanently (but keeps your password).",
            confirmText: "Clear all",
            tone: "danger",
            onConfirm: () => persistDatabase({ ...db, data: {} }),
        });
    };

    /** ----------- UI blocks ----------- */
    if (!db && loadError) {
        return (
            <Styled.Page>
                <Styled.Container>
                    <Styled.Header>
                        <Styled.Title>Journal storage needs attention</Styled.Title>
                    </Styled.Header>
                    <Styled.Helper role="alert">{loadError}</Styled.Helper>
                    {storageError && <Styled.Helper role="alert">{storageError}</Styled.Helper>}
                    <Styled.DangerButton type="button" onClick={resetProjectStorage}>
                        Erase unreadable storage and start fresh
                    </Styled.DangerButton>
                    {confirm && <ConfirmModal confirm={confirm} onCancel={() => setConfirm(null)} onConfirm={handleConfirm} />}
                </Styled.Container>
            </Styled.Page>
        );
    }

    // 0) Onboarding: no DB yet → set password
    if (!db) {
        return (
            <Styled.Page>
                <Styled.Container>
                    <Styled.Header>
                        <div>
                            <Styled.Title>Journal / Diary</Styled.Title>
                            <Styled.Sub>Password-protected • AES-GCM • LocalStorage</Styled.Sub>
                        </div>
                    </Styled.Header>

                    <PasswordSetup onSubmit={setupPassword} />
                    {storageError && <Styled.Helper role="alert">{storageError}</Styled.Helper>}
                    <Styled.FooterNote>Data is encrypted in your browser. Keep your password safe.</Styled.FooterNote>

                    {confirm && <ConfirmModal confirm={confirm} onCancel={() => setConfirm(null)} onConfirm={handleConfirm} />}
                </Styled.Container>
            </Styled.Page>
        );
    }

    // 1) Locked view
    if (!unlocked) {
        return (
            <Styled.Page>
                <Styled.Container>
                    <Styled.Header>
                        <div>
                            <Styled.Title>Journal / Diary</Styled.Title>
                            <Styled.Sub>Enter password to unlock • {entriesCount} saved day(s)</Styled.Sub>
                        </div>
                    </Styled.Header>

                    <UnlockCard onUnlock={unlock} />
                    {storageError && <Styled.Helper role="alert">{storageError}</Styled.Helper>}

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                        <Styled.DangerButton type="button" onClick={resetProjectStorage}>
                            Reset storage (erase all)
                        </Styled.DangerButton>
                    </div>

                    <Styled.FooterNote>
                        Forgot your password? There is no recovery. Resetting storage permanently erases the journal.
                    </Styled.FooterNote>

                    {confirm && <ConfirmModal confirm={confirm} onCancel={() => setConfirm(null)} onConfirm={handleConfirm} />}
                </Styled.Container>
            </Styled.Page>
        );
    }

    // 2) Unlocked view
    return (
        <Styled.Page>
            <Styled.Container>
                <Styled.Header>
                    <div>
                        <Styled.Title>Journal / Diary</Styled.Title>
                        <Styled.Sub>{entriesCount} saved day(s) • AES-GCM encrypted at rest</Styled.Sub>
                    </div>
                    <Styled.BadgeRow>
                        <Styled.Badge>Unlocked</Styled.Badge>
                        <Styled.Button onClick={lock}>Lock</Styled.Button>
                    </Styled.BadgeRow>
                </Styled.Header>

                {/* Date & actions */}
                <Styled.Toolbar>
                    <Styled.RowWrap>
                        <Styled.Button type="button" onClick={() => setSelectedDate(shiftDay(selectedDate, -1))}>◀ Prev</Styled.Button>
                        <Styled.Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value || todayISO())}
                            aria-label="Selected date"
                            style={{ width: 160 }}
                        />
                        <Styled.Button type="button" onClick={() => setSelectedDate(todayISO())}>Today</Styled.Button>
                        <Styled.Button type="button" onClick={() => setSelectedDate(shiftDay(selectedDate, +1))}>Next ▶</Styled.Button>
                    </Styled.RowWrap>

                    <Styled.RowWrap>
                        <Styled.PrimaryButton onClick={saveEntry} disabled={busy || loadingEntry || Boolean(entryError)}>Save</Styled.PrimaryButton>
                        <Styled.DangerButton onClick={deleteEntry} disabled={busy || loadingEntry}>Delete</Styled.DangerButton>
                    </Styled.RowWrap>
                </Styled.Toolbar>

                {/* Editor */}
                <Styled.Card>
                    <Styled.ItemMeta style={{ marginBottom: 10 }}>
                        <Styled.Tag>#{fmtNice(selectedDate)}</Styled.Tag>
                        <span>•</span>
                        <span>{loadingEntry ? "Decrypting…" : "Write your entry below"}</span>
                    </Styled.ItemMeta>

                    <Styled.TextArea
                        aria-label={`Journal entry for ${fmtNice(selectedDate)}`}
                        placeholder="Start typing your thoughts…"
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        spellCheck="false"
                    />
                    {entryError && <Styled.Helper role="alert">{entryError}</Styled.Helper>}
                </Styled.Card>

                {/* Change password panel */}
                <Styled.Card style={{ marginTop: 14 }}>
                    <Styled.RowWrap style={{ justifyContent: "space-between" }}>
                        <div>
                            <strong>Security</strong>
                            <div style={{ opacity: 0.8, fontSize: 12, marginTop: 4 }}>
                                Change password (re-encrypts all entries in your browser).
                            </div>
                        </div>
                        <Styled.Button onClick={() => setEditPasswordOpen((v) => !v)}>
                            {editPasswordOpen ? "Close" : "Change password"}
                        </Styled.Button>
                    </Styled.RowWrap>

                    {editPasswordOpen && (
                        <PasswordChange busy={busy} onChangePassword={changePassword} />
                    )}
                </Styled.Card>

                <Styled.RowWrap style={{ marginTop: 14 }}>
                    <Styled.DangerButton onClick={clearAll}>Clear ALL entries</Styled.DangerButton>
                </Styled.RowWrap>

                {storageError && <Styled.Helper role="alert">{storageError}</Styled.Helper>}
                <Styled.FooterNote>Your password and entries stay in this browser; this does not protect against malicious scripts or access to an unlocked device.</Styled.FooterNote>

                {confirm && <ConfirmModal confirm={confirm} onCancel={() => setConfirm(null)} onConfirm={handleConfirm} />}
            </Styled.Container>
        </Styled.Page>
    );
}

/** -------------------------
 *  Subcomponents
 *  ------------------------- */

function ConfirmModal({ confirm, onCancel, onConfirm }) {
    const dialogRef = useRef(null);
    const cancelRef = useRef(null);
    const confirmRef = useRef(null);
    const onCancelRef = useRef(onCancel);

    useEffect(() => {
        onCancelRef.current = onCancel;
    }, [onCancel]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return undefined;

        const previousFocus = document.activeElement;
        const getFocusable = () => Array.from(dialog.querySelectorAll(
            "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]",
        ));
        (cancelRef.current || confirmRef.current || dialog).focus();

        const handleKeys = (keyEvent) => {
            if (keyEvent.key === "Escape") {
                keyEvent.preventDefault();
                onCancelRef.current();
                return;
            }
            if (keyEvent.key !== "Tab") return;

            const focusable = getFocusable();
            if (!focusable.length) {
                keyEvent.preventDefault();
                dialog.focus();
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!dialog.contains(document.activeElement)) {
                keyEvent.preventDefault();
                (keyEvent.shiftKey ? last : first).focus();
            } else if (keyEvent.shiftKey && document.activeElement === first) {
                keyEvent.preventDefault();
                last.focus();
            } else if (!keyEvent.shiftKey && document.activeElement === last) {
                keyEvent.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeys);
        return () => {
            document.removeEventListener("keydown", handleKeys);
            const returnFocus = previousFocus instanceof HTMLElement && previousFocus.isConnected
                ? previousFocus
                : document.getElementById("journal");
            returnFocus?.focus();
        };
    }, []);

    return (
        <Styled.ModalOverlay onClick={onCancel}>
            <Styled.ModalCard
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby={confirm.message ? "confirm-message" : undefined}
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
            >
                <Styled.ModalTitle id="confirm-title">{confirm.title}</Styled.ModalTitle>
                {confirm.message ? <Styled.ModalMessage id="confirm-message">{confirm.message}</Styled.ModalMessage> : null}
                <Styled.ModalActions>
                    {!confirm.hideCancel && (
                        <Styled.Button ref={cancelRef} type="button" onClick={onCancel}>
                            {confirm.cancelText || "Cancel"}
                        </Styled.Button>
                    )}
                    {confirm.tone === "danger" ? (
                        <Styled.DangerButton ref={confirmRef} type="button" onClick={onConfirm}>
                            {confirm.confirmText || "Confirm"}
                        </Styled.DangerButton>
                    ) : (
                        <Styled.PrimaryButton ref={confirmRef} type="button" onClick={onConfirm}>
                            {confirm.confirmText || "Confirm"}
                        </Styled.PrimaryButton>
                    )}
                </Styled.ModalActions>
            </Styled.ModalCard>
        </Styled.ModalOverlay>
    );
}

function PasswordSetup({ onSubmit }) {
    const [p1, setP1] = useState("");
    const [p2, setP2] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const create = async (e) => {
        e.preventDefault();
        setError("");
        if (p1.length < 12) { setError("Password must be at least 12 characters."); return; }
        if (p1 !== p2) { setError("Passwords do not match."); return; }
        setBusy(true);
        try {
            await onSubmit(p1);
            setP1(""); setP2("");
        } catch (submitError) {
            setError(submitError.message || "Could not create the journal in this browser.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <Styled.Card as="form" onSubmit={create}>
            <Styled.FormRow>
                <Styled.Input aria-label="Create password" type="password" placeholder="Create password *" value={p1} onChange={(e) => setP1(e.target.value)} minLength={12} maxLength={128} autoComplete="new-password" required />
                <Styled.Input aria-label="Confirm password" type="password" placeholder="Confirm password *" value={p2} onChange={(e) => setP2(e.target.value)} minLength={12} maxLength={128} autoComplete="new-password" required />
                <Styled.PrimaryButton type="submit" disabled={busy}>{busy ? "Creating journal…" : "Set password"}</Styled.PrimaryButton>
            </Styled.FormRow>
            <Styled.Helper>Use at least 12 characters. This password cannot be recovered if lost.</Styled.Helper>
            {error && <Styled.Helper style={{ color: "hsl(0 70% 70% / 0.9)" }}>{error}</Styled.Helper>}
        </Styled.Card>
    );
}

function UnlockCard({ onUnlock }) {
    const [pw, setPw] = useState("");
    const [msg, setMsg] = useState("");
    const [busy, setBusy] = useState(false);

    const unlockNow = async (e) => {
        e.preventDefault();
        setMsg("");
        setBusy(true);
        try {
            const ok = await onUnlock(pw);
            if (!ok) setMsg("Wrong password or the journal could not be decrypted.");
            else setPw("");
        } catch {
            setMsg("This browser could not unlock the journal. Check that secure browser encryption is available.");
        } finally {
            setPw("");
            setBusy(false);
        }
    };

    return (
        <Styled.Card as="form" onSubmit={unlockNow}>
            <Styled.FormRow>
                <Styled.Input aria-label="Journal password" type="password" placeholder="Enter password *" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" required />
                <Styled.PrimaryButton type="submit" disabled={busy}>{busy ? "Unlocking…" : "Unlock"}</Styled.PrimaryButton>
            </Styled.FormRow>
            {msg && <Styled.Helper style={{ color: "hsl(0 70% 70% / 0.9)" }}>{msg}</Styled.Helper>}
        </Styled.Card>
    );
}

function PasswordChange({ busy, onChangePassword }) {
    const [p1, setP1] = useState("");
    const [p2, setP2] = useState("");
    const [err, setErr] = useState("");

    const go = async (e) => {
        e.preventDefault();
        setErr("");
        if (p1.length < 12) { setErr("Password must be at least 12 characters."); return; }
        if (p1 !== p2) { setErr("Passwords do not match."); return; }
        try {
            await onChangePassword(p1);
            setP1(""); setP2("");
        } catch (changeError) {
            setErr(changeError.message || "Could not change the password.");
        }
    };

    return (
        <Styled.Card as="form" onSubmit={go} style={{ marginTop: 12 }}>
            <Styled.FormRow>
                <Styled.Input aria-label="New password" type="password" placeholder="New password *" value={p1} onChange={(e) => setP1(e.target.value)} minLength={12} maxLength={128} autoComplete="new-password" required />
                <Styled.Input aria-label="Confirm new password" type="password" placeholder="Confirm new password *" value={p2} onChange={(e) => setP2(e.target.value)} minLength={12} maxLength={128} autoComplete="new-password" required />
                <Styled.PrimaryButton type="submit" disabled={busy}>{busy ? "Re-encrypting…" : "Change password"}</Styled.PrimaryButton>
            </Styled.FormRow>
            {err && <Styled.Helper style={{ color: "hsl(0 70% 70% / 0.9)" }}>{err}</Styled.Helper>}
        </Styled.Card>
    );
}

/** -------------------------
 *  Small date helper
 *  ------------------------- */
function shiftDay(iso, delta) {
    const d = new Date(`${iso}T00:00:00`);
    d.setDate(d.getDate() + delta);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}
