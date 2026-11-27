import { useMemo, useState } from "react";
import { FiActivity, FiArrowDownRight, FiArrowUpRight, FiBriefcase, FiHome, FiPlus, FiShield, FiTrash2, FiTruck } from "react-icons/fi";
import ConfirmDialog from "../confirmDialog";
import styles from "./styles.module.css";

const storageKey = "meridian-net-worth";
const starterItems = [
    { id: 1, name: "Primary home", category: "Property", type: "asset", value: 5500000 },
    { id: 2, name: "Long-term investments", category: "Investments", type: "asset", value: 480000 },
    { id: 3, name: "Savings account", category: "Cash", type: "asset", value: 250000 },
    { id: 4, name: "Emergency savings", category: "Cash", type: "asset", value: 150000 },
    { id: 5, name: "Family car", category: "Vehicles", type: "asset", value: 700000 },
    { id: 6, name: "Home loan", category: "Home loan", type: "liability", value: 3200000 },
    { id: 7, name: "Education loan", category: "Other debt", type: "liability", value: 75000 },
];
const assetCategories = ["Cash", "Investments", "Property", "Vehicles", "Other assets"];
const debtCategories = ["Home loan", "Education loan", "Credit card", "Other debt"];
const iconByCategory = { Cash: FiShield, Investments: FiActivity, Property: FiHome, Vehicles: FiTruck, "Home loan": FiHome, "Education loan": FiBriefcase, "Credit card": FiBriefcase, "Other debt": FiBriefcase };
const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value) || 0);
const isItem = (item) => item && typeof item === "object" &&
    (typeof item.id === "string" || typeof item.id === "number") &&
    typeof item.name === "string" && typeof item.category === "string" &&
    ["asset", "liability"].includes(item.type) && Number.isFinite(Number(item.value)) && Number(item.value) >= 0;
const readItems = () => {
    try {
        const saved = localStorage.getItem(storageKey);
        if (saved === null) return { items: starterItems, warning: "" };
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed) || !parsed.every(isItem)) {
            return { items: starterItems, warning: "Saved balances could not be read. Example balances are shown; later changes may replace the unreadable data." };
        }
        return { items: parsed, warning: "" };
    } catch {
        return { items: starterItems, warning: "Browser storage is unavailable. Changes may not persist after you leave or refresh." };
    }
};

const NetWorthDashboard = () => {
    const [initialItems] = useState(readItems);
    const [items, setItems] = useState(initialItems.items);
    const [storageWarning, setStorageWarning] = useState(initialItems.warning);
    const [filter, setFilter] = useState("All");
    const [type, setType] = useState("asset");
    const [draft, setDraft] = useState({ name: "", category: "Cash", value: "" });
    const [formError, setFormError] = useState("");
    const [pendingDelete, setPendingDelete] = useState(null);
    const saveItems = (nextItems) => {
        setItems(nextItems);
        try {
            localStorage.setItem(storageKey, JSON.stringify(nextItems));
            setStorageWarning("");
        } catch {
            setStorageWarning("Browser storage is unavailable. Changes will not persist after you leave or refresh.");
        }
    };

    const assets = items.filter((item) => item.type === "asset").reduce((sum, item) => sum + Number(item.value), 0);
    const liabilities = items.filter((item) => item.type === "liability").reduce((sum, item) => sum + Number(item.value), 0);
    const netWorth = assets - liabilities;
    const visible = useMemo(() => items.filter((item) => filter === "All" || (filter === "Assets" ? item.type === "asset" : item.type === "liability")), [items, filter]);
    const groupedAssets = assetCategories.map((category) => ({ category, value: items.filter((item) => item.type === "asset" && item.category === category).reduce((sum, item) => sum + Number(item.value), 0) })).filter((item) => item.value > 0);
    const addItem = (event) => {
        event.preventDefault();
        if (!draft.name.trim()) { setFormError("Enter a name for this balance."); return; }
        if (!Number.isFinite(Number(draft.value)) || Number(draft.value) <= 0) { setFormError("Enter a value greater than zero."); return; }
        saveItems([...items, { ...draft, id: Date.now(), name: draft.name.trim(), type, value: Number(draft.value) }]);
        setDraft({ name: "", category: type === "asset" ? "Cash" : "Home loan", value: "" });
        setFormError("");
    };
    const updateItem = (id, value) => saveItems(items.map((item) => item.id === id ? { ...item, value: Math.max(0, Number(value)) } : item));
    const removeItem = () => {
        saveItems(items.filter((item) => item.id !== pendingDelete.id));
        setPendingDelete(null);
    };
    const categories = type === "asset" ? assetCategories : debtCategories;

    return <section className={styles.netWorthDashboard} id="workspace">
        {storageWarning && <p className={styles.storageNotice} role="status">{storageWarning}</p>}
        <div className={styles.pageHeading}><div><p className={styles.context}>YOUR HOUSEHOLD BALANCE SHEET</p><h1>See the whole<br /><span>financial picture.</span></h1><p className={styles.description}>Bring what you own and what you owe into one calm view.</p></div><div className={styles.asOf}><span>ESTIMATED AS OF</span><strong>{new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date())}</strong><small>Update values when they change</small></div></div>
        <div className={styles.heroStats}>
            <article className={styles.netWorthCard}><div><span>Estimated net worth</span><strong>{money(netWorth)}</strong><small>Total assets less total liabilities</small></div><div className={styles.balanceVisual}><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article>
            <article><span>Assets</span><strong className={styles.assetValue}>{money(assets)}</strong><small>{items.filter((item) => item.type === "asset").length} accounts and valuables</small></article>
            <article><span>Liabilities</span><strong className={styles.debtValue}>{money(liabilities)}</strong><small>{items.filter((item) => item.type === "liability").length} balances owed</small></article>
        </div>
        <div className={styles.contentGrid}>
            <section className={styles.accountPanel} id="accounts">
                <div className={styles.panelHeading}><div><h2>Accounts and valuables</h2><p>Add current estimates, not purchase prices.</p></div><span className={styles.editingNote}>Stored in this browser</span></div>
                <div className={styles.filters} role="group" aria-label="Filter accounts">{["All", "Assets", "Liabilities"].map((item) => <button type="button" key={item} className={filter === item ? styles.activeFilter : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
                <div className={styles.accountList}>{visible.map((item) => {
                    const Icon = iconByCategory[item.category] || FiBriefcase;
                    return <article className={styles.accountRow} key={item.id}>
                        <span className={item.type === "asset" ? styles.assetIcon : styles.debtIcon}><Icon aria-hidden="true" /></span>
                        <div className={styles.accountName}><strong>{item.name}</strong><span>{item.category}</span></div>
                        <span className={item.type === "asset" ? styles.typeAsset : styles.typeDebt}>{item.type === "asset" ? <FiArrowUpRight aria-hidden="true" /> : <FiArrowDownRight aria-hidden="true" />}{item.type === "asset" ? "Asset" : "Debt"}</span>
                        <label className={styles.valueInput}><span>₹</span><input type="number" min="0" value={item.value} aria-label={item.name + " current value"} onChange={(event) => updateItem(item.id, event.target.value)} /></label>
                        <button type="button" className={styles.deleteButton} aria-label={"Remove " + item.name} onClick={() => setPendingDelete(item)}><FiTrash2 aria-hidden="true" /></button>
                    </article>;
                })}{visible.length === 0 && <p className={styles.empty}>No accounts in this view yet.</p>}</div>
                <form className={styles.addForm} id="add" onSubmit={addItem}>
                    <div className={styles.formHeading}><span><FiPlus aria-hidden="true" /></span><div><h3>Add a balance</h3><p>Use today's approximate value.</p></div></div>
                    <div className={styles.typeSwitch} role="group" aria-label="Balance type"><button type="button" className={type === "asset" ? styles.assetSelected : ""} aria-pressed={type === "asset"} onClick={() => { setType("asset"); setDraft((current) => ({ ...current, category: "Cash" })); }}><FiArrowUpRight aria-hidden="true" /> Asset</button><button type="button" className={type === "liability" ? styles.debtSelected : ""} aria-pressed={type === "liability"} onClick={() => { setType("liability"); setDraft((current) => ({ ...current, category: "Home loan" })); }}><FiArrowDownRight aria-hidden="true" /> Liability</button></div>
                    <div className={styles.formFields}><label>Name<input required value={draft.name} onChange={(event) => { setDraft({ ...draft, name: event.target.value }); setFormError(""); }} placeholder={type === "asset" ? "e.g. Savings account" : "e.g. Credit card"} /></label><label>Category<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Current value<div><span>₹</span><input required min="0.01" type="number" value={draft.value} onChange={(event) => { setDraft({ ...draft, value: event.target.value }); setFormError(""); }} placeholder="0" /></div></label><button type="submit">Add balance <FiPlus aria-hidden="true" /></button>{formError && <p className={styles.formError} role="alert">{formError}</p>}</div>
                </form>
            </section>
            <aside className={styles.sidebar}>
                <section className={styles.mixPanel}><div className={styles.panelHeading}><div><h2>Asset mix</h2><p>What makes up your assets</p></div></div>{groupedAssets.map((item, index) => {
                    const Icon = iconByCategory[item.category] || FiBriefcase;
                    return <div className={styles.mixRow} key={item.category}><div><span><i className={styles["mixColor" + (index % 4)]}><Icon aria-hidden="true" /></i>{item.category}</span><strong>{money(item.value)}</strong></div><div className={styles.mixBar}><i className={styles["mixBarColor" + (index % 4)]} style={{ width: assets ? item.value / assets * 100 + "%" : "0%" }} /></div></div>;
                })}{groupedAssets.length === 0 && <p className={styles.empty}>Add assets to see how they are distributed.</p>}</section>
                <section className={styles.ratioCard}><span>LIABILITIES / ASSETS</span><strong>{assets ? Math.round(liabilities / assets * 100) : 0}%</strong><p>Lower means a smaller share of your listed assets is matched by debt. This is a simple snapshot, not a lending score.</p></section>
                <p className={styles.note}>Values are estimates you enter. Meridian does not connect to financial accounts, verify balances, or provide tax advice.</p>
            </aside>
        </div>
        {pendingDelete && <ConfirmDialog title="Remove this balance?" description={'"' + pendingDelete.name + '" will be removed from your balance sheet.'} confirmLabel="Remove balance" onCancel={() => setPendingDelete(null)} onConfirm={removeItem} />}
    </section>;
};
export default NetWorthDashboard;
