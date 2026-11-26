import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Styled } from "./styled";

const STORAGE_KEY = "calorie-counter.v1";
const GOAL_KEY_V2 = "calorie-counter.goal.v2";      // new key to avoid stale values on deploy
const GOAL_KEY_LEGACY = "calorie-counter.goal";     // old key (fallback)
const DEFAULT_GOAL = 2000;
const UNIT = "kcal";
const MEAL_TYPES = new Set(["Breakfast", "Lunch", "Dinner", "Snack", "Other"]);

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

const todayISO = () => {
    const t = new Date();
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const fmtDateNice = (iso) => {
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};

const isValidDate = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00`);
    return !Number.isNaN(date.getTime()) && todayISOFromDate(date) === value;
};

const todayISOFromDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const isValidCalories = (value) => (
    value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0
);

const loadMeals = () => {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        if (!Array.isArray(stored)) return [];

        return stored
            .filter((meal) => (
                meal &&
                typeof meal.id === "string" &&
                typeof meal.name === "string" &&
                meal.name.trim() &&
                Number.isFinite(Number(meal.kcal)) &&
                Number(meal.kcal) >= 0 &&
                isValidDate(meal.date)
            ))
            .map((meal) => ({
                ...meal,
                name: meal.name.trim(),
                kcal: Number(meal.kcal),
                mealType: MEAL_TYPES.has(meal.mealType) ? meal.mealType : "Other",
                createdAt: Number.isFinite(Number(meal.createdAt)) ? Number(meal.createdAt) : 0,
            }));
    }
    catch { return []; }
};

const loadGoal = () => {
    try {
        const v2 = Number(localStorage.getItem(GOAL_KEY_V2));
        if (Number.isFinite(v2) && v2 > 0) return v2;
        const legacy = Number(localStorage.getItem(GOAL_KEY_LEGACY));
        if (Number.isFinite(legacy) && legacy > 0) return legacy;
        return DEFAULT_GOAL;
    } catch {
        return DEFAULT_GOAL;
    }
};

export default function CalorieCounter() {
    // data
    const [meals, setMeals] = useState(loadMeals);
    const [goal, setGoal] = useState(loadGoal);

    // add form
    const [name, setName] = useState("");
    const [kcal, setKcal] = useState("");
    const [mealType, setMealType] = useState("Breakfast");
    const [date, setDate] = useState(todayISO());

    // filters/ui
    const [selectedDate, setSelectedDate] = useState(todayISO());
    const [query, setQuery] = useState("");
    const [editing, setEditing] = useState(null);

    // goal input (editable) mirrors current goal
    const [newGoal, setNewGoal] = useState(goal);

    // confirm modal
    const [confirm, setConfirm] = useState(null); // {title, message, confirmText, cancelText, tone, onConfirm}
    const confirmDialogRef = useRef(null);
    const confirmCancelRef = useRef(null);
    const confirmTriggerRef = useRef(null);
    const closeConfirm = useCallback(() => {
        setConfirm(null);
        window.requestAnimationFrame(() => {
            if (confirmTriggerRef.current?.isConnected) confirmTriggerRef.current.focus();
            else document.getElementById("calorie-counter-heading")?.focus();
        });
    }, []);
    const askConfirm = (opts) => {
        confirmTriggerRef.current = document.activeElement;
        setConfirm({ title: "Are you sure?", message: "", confirmText: "Confirm", cancelText: "Cancel", tone: "default", ...opts });
    };
    const handleConfirm = () => {
        const fn = confirm?.onConfirm;
        closeConfirm();
        if (typeof fn === "function") fn();
    };
    useEffect(() => {
        if (!confirm) return;
        confirmCancelRef.current?.focus();
        const onKey = (event) => {
            if (event.key === "Escape") {
                closeConfirm();
                return;
            }
            if (event.key !== "Tab") return;

            const focusable = [...(confirmDialogRef.current?.querySelectorAll("button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])") ?? [])];
            if (focusable.length === 0) {
                event.preventDefault();
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [confirm, closeConfirm]);

    // persist
    useEffect(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(meals)); } catch { /* Storage can be blocked by browser settings. */ }
    }, [meals]);
    useEffect(() => {
        try { localStorage.setItem(GOAL_KEY_V2, String(goal)); } catch { /* Storage can be blocked by browser settings. */ }
    }, [goal]);

    // derived
    const mealsForDay = useMemo(() => {
        let list = meals.filter((m) => m.date === selectedDate);
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter((m) => m.name.toLowerCase().includes(q));
        }
        const order = ["Breakfast", "Lunch", "Dinner", "Snack", "Other"];
        return [...list].sort((a, b) => {
            const oa = order.indexOf(a.mealType);
            const ob = order.indexOf(b.mealType);
            return oa !== ob ? oa - ob : b.createdAt - a.createdAt;
        });
    }, [meals, selectedDate, query]);

    const grouped = useMemo(() => {
        const map = new Map();
        for (const m of mealsForDay) {
            const key = m.mealType || "Other";
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(m);
        }
        return Array.from(map.entries());
    }, [mealsForDay]);

    const totalKcal = useMemo(
        () => meals.filter((m) => m.date === selectedDate).reduce((sum, m) => sum + (Number(m.kcal) || 0), 0),
        [meals, selectedDate]
    );
    const pctOfGoal = goal > 0 ? Math.round((totalKcal / goal) * 100) : 0;
    const remaining = Math.max(0, goal - totalKcal);
    const over = Math.max(0, totalKcal - goal);

    // actions
    const addMeal = (e) => {
        e.preventDefault();
        const n = name.trim();
        if (!n || !isValidCalories(kcal)) return;
        const cals = Number(kcal);
        const newMeal = { id: uid(), name: n, kcal: cals, mealType: mealType || "Other", date: date || todayISO(), createdAt: Date.now() };
        setMeals((prev) => [newMeal, ...prev]);
        setName(""); setKcal(""); setMealType("Breakfast"); setDate(selectedDate);
    };
    const removeMeal = (id) => setMeals((prev) => prev.filter((m) => m.id !== id));
    const startEdit = (id) => setEditing(id);
    const saveEdit = (id, patch) => { setMeals((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m))); setEditing(null); };
    const cancelEdit = () => setEditing(null);
    const clearDay = () => setMeals((prev) => prev.filter((m) => m.date !== selectedDate));
    const updateGoal = (value) => {
        const nextGoal = Number(value);
        if (!Number.isFinite(nextGoal) || nextGoal <= 0) return;
        setGoal(nextGoal);
        setNewGoal(nextGoal);
    };

    const shiftDay = (delta) => {
        const d = new Date(`${selectedDate}T00:00:00`);
        d.setDate(d.getDate() + delta);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        setSelectedDate(`${yyyy}-${mm}-${dd}`);
    };

    return (
        <Styled.Page>
            <Styled.Container>
                <Styled.Header>
                    <div>
                        <Styled.Title id="calorie-counter-heading" tabIndex={-1}>Calorie Counter</Styled.Title>
                        <Styled.Sub>Log meals • Track daily calories • LocalStorage</Styled.Sub>
                    </div>

                    <div style={{ textAlign: "right" }}>
                        <Styled.Badge>{totalKcal} {UNIT} on {fmtDateNice(selectedDate)}</Styled.Badge>{" "}
                        <Styled.Badge tone="muted">Goal: {goal} {UNIT} ({pctOfGoal}%)</Styled.Badge>
                        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
                            {over > 0 ? `Over by ${over} ${UNIT}` : `Remaining ${remaining} ${UNIT}`}
                        </div>
                    </div>
                </Styled.Header>

                {/* Add meal */}
                <Styled.Card as="form" onSubmit={addMeal}>
                    <Styled.FormRow>
                        <Styled.Input
                            placeholder="Meal name *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            aria-label="Meal name"
                            required
                        />
                        <Styled.Input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            step="1"
                            placeholder={`Calories * (${UNIT})`}
                            value={kcal}
                            onChange={(e) => setKcal(e.target.value)}
                            aria-label="Calories"
                            required
                        />
                        <Styled.Select value={mealType} onChange={(e) => setMealType(e.target.value)} aria-label="Meal type">
                            <option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option><option>Other</option>
                        </Styled.Select>
                        <Styled.Input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Log date" />
                        <Styled.PrimaryButton type="submit" disabled={!name.trim() || !isValidCalories(kcal)}>Add</Styled.PrimaryButton>
                    </Styled.FormRow>
                    {(!name.trim() || !isValidCalories(kcal)) && <Styled.Helper>Tip: Enter a meal name and calories.</Styled.Helper>}
                </Styled.Card>

                {/* Toolbar */}
                <Styled.Toolbar>
                    <Styled.RowWrap>
                        <Styled.Button type="button" onClick={() => shiftDay(-1)}>◀ Prev</Styled.Button>
                        <Styled.Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value || todayISO())} aria-label="Selected date" style={{ width: 160 }} />
                        <Styled.Button type="button" onClick={() => setSelectedDate(todayISO())}>Today</Styled.Button>
                        <Styled.Button type="button" onClick={() => shiftDay(1)}>Next ▶</Styled.Button>
                    </Styled.RowWrap>

                    <Styled.RowWrap>
                        <Styled.Input
                            placeholder={`Search meals on ${fmtDateNice(selectedDate)}…`}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Search meals"
                            style={{ minWidth: 220 }}
                        />

                        {/* Goal controls */}
                        <Styled.Input
                            type="number"
                            inputMode="numeric"
                            min="1"
                            step="50"
                            value={newGoal}
                            onChange={(e) => {
                                const value = e.target.value;
                                const numericValue = Number(value);
                                setNewGoal(value === "" ? "" : Number.isFinite(numericValue) ? Math.max(1, numericValue) : goal);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && Number(newGoal) && newGoal !== goal) {
                                    askConfirm({
                                        title: "Update daily goal?",
                                        message: `Set goal to ${newGoal} ${UNIT}?`,
                                        confirmText: "Set goal",
                                        onConfirm: () => updateGoal(newGoal),
                                    });
                                }
                            }}
                            aria-label={`Daily goal (${UNIT})`}
                            style={{ width: 160 }}
                        />
                        <Styled.Button
                            type="button"
                            onClick={() => {
                                if (!Number(newGoal) || newGoal === goal) return;
                                askConfirm({
                                    title: "Update daily goal?",
                                    message: `Set goal to ${newGoal} ${UNIT}?`,
                                    confirmText: "Set goal",
                                    onConfirm: () => updateGoal(newGoal),
                                });
                            }}
                        >
                            Set goal
                        </Styled.Button>
                        <Styled.DangerButton
                            type="button"
                            onClick={() =>
                                askConfirm({
                                    title: "Reset goal?",
                                    message: `Reset goal to ${DEFAULT_GOAL} ${UNIT}?`,
                                    confirmText: "Reset",
                                    tone: "danger",
                                    onConfirm: () => updateGoal(DEFAULT_GOAL),
                                })
                            }
                        >
                            Reset
                        </Styled.DangerButton>
                    </Styled.RowWrap>

                    <Styled.RowWrap>
                        <Styled.DangerButton
                            type="button"
                            onClick={() =>
                                askConfirm({
                                    title: "Clear this day?",
                                    message: `Remove all meals on ${fmtDateNice(selectedDate)}?`,
                                    confirmText: "Clear day",
                                    tone: "danger",
                                    onConfirm: clearDay,
                                })
                            }
                        >
                            Clear day
                        </Styled.DangerButton>
                    </Styled.RowWrap>
                </Styled.Toolbar>

                {/* Meals list */}
                <Styled.List>
                    {mealsForDay.length === 0 && <Styled.Empty>No meals logged on {fmtDateNice(selectedDate)}.</Styled.Empty>}

                    {grouped.map(([type, arr]) => (
                        <div key={type}>
                            <Styled.GroupHeader>#{type}</Styled.GroupHeader>
                            {arr.map((m) =>
                                editing === m.id ? (
                                    <EditRow key={m.id} item={m} onCancel={cancelEdit} onSave={saveEdit} />
                                ) : (
                                    <Styled.Item key={m.id}>
                                        <Styled.ItemLeft>
                                            <div>
                                                <Styled.ItemTitle>{m.name}</Styled.ItemTitle>
                                                <Styled.ItemMeta>
                                                    <Styled.Tag>#{m.mealType}</Styled.Tag>
                                                    <span>•</span>
                                                    <span>{m.kcal} {UNIT}</span>
                                                    <span>•</span>
                                                    <span>{fmtDateNice(m.date)}</span>
                                                </Styled.ItemMeta>
                                            </div>
                                        </Styled.ItemLeft>

                                        <Styled.ItemRight>
                                            <Styled.IconButton type="button" onClick={() => startEdit(m.id)} aria-label="Edit" title="Edit"><FiEdit2 aria-hidden="true" /></Styled.IconButton>
                                            <Styled.IconButton
                                                onClick={() =>
                                                    askConfirm({
                                                        title: "Delete meal?",
                                                        message: `Delete “${m.name}” (${m.kcal} ${UNIT})?`,
                                                        confirmText: "Delete",
                                                        tone: "danger",
                                                        onConfirm: () => removeMeal(m.id),
                                                    })
                                                }
                                                type="button"
                                                aria-label="Delete"
                                                title="Delete"
                                            >
                                                <FiTrash2 aria-hidden="true" />
                                            </Styled.IconButton>
                                        </Styled.ItemRight>
                                    </Styled.Item>
                                )
                            )}
                        </div>
                    ))}
                </Styled.List>

                <Styled.FooterNote>Meals and goals are stored locally in this browser when storage is available.</Styled.FooterNote>

                {/* Confirm Modal */}
                {confirm && (
                    <Styled.ModalOverlay onClick={closeConfirm}>
                        <Styled.ModalCard ref={confirmDialogRef} role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby={confirm.message ? "confirm-message" : undefined} onClick={(e) => e.stopPropagation()}>
                            <Styled.ModalTitle id="confirm-title">{confirm.title}</Styled.ModalTitle>
                            {confirm.message ? <Styled.ModalMessage id="confirm-message">{confirm.message}</Styled.ModalMessage> : null}
                            <Styled.ModalActions>
                                <Styled.Button type="button" ref={confirmCancelRef} onClick={closeConfirm}>{confirm.cancelText || "Cancel"}</Styled.Button>
                                {confirm.tone === "danger" ? (
                                    <Styled.DangerButton type="button" onClick={handleConfirm}>{confirm.confirmText || "Confirm"}</Styled.DangerButton>
                                ) : (
                                    <Styled.PrimaryButton type="button" onClick={handleConfirm}>{confirm.confirmText || "Confirm"}</Styled.PrimaryButton>
                                )}
                            </Styled.ModalActions>
                        </Styled.ModalCard>
                    </Styled.ModalOverlay>
                )}
            </Styled.Container>
        </Styled.Page>
    );
}

function EditRow({ item, onCancel, onSave }) {
    const [n, setN] = useState(item.name);
    const [k, setK] = useState(item.kcal);
    const [t, setT] = useState(item.mealType || "Other");

    return (
        <Styled.Item
            as="form"
            onSubmit={(e) => {
                e.preventDefault();
                const name = n.trim();
                if (!name || !isValidCalories(k)) return;
                const kcal = Number(k);
                onSave(item.id, { name, kcal, mealType: t });
            }}
        >
            <Styled.ItemLeft style={{ alignItems: "center" }}>
                <Styled.Input value={n} onChange={(e) => setN(e.target.value)} aria-label="Edit meal" placeholder="Meal name *" required />
                <Styled.Input type="number" min="0" step="1" value={k} onChange={(e) => setK(e.target.value)} aria-label="Edit calories" required style={{ maxWidth: 140 }} />
                <Styled.Select value={t} onChange={(e) => setT(e.target.value)} aria-label="Edit type" style={{ maxWidth: 160 }}>
                    <option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option><option>Other</option>
                </Styled.Select>
            </Styled.ItemLeft>
            <Styled.ItemRight>
                <Styled.PrimaryButton type="submit">Save</Styled.PrimaryButton>
                <Styled.Button type="button" onClick={onCancel}>Cancel</Styled.Button>
            </Styled.ItemRight>
        </Styled.Item>
    );
}
