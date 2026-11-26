import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiCalendar, FiCheck, FiFlag, FiPlus, FiTarget, FiTrash2 } from "react-icons/fi";
import styles from "./styles.module.css";

const storageKey = "goal-planner-goals";

const starterGoals = [
    { id: "g1", title: "Read 18 books", area: "Learning", due: "2026-12-31", progress: 56, milestones: ["Choose the next book", "Read for 20 minutes", "Write a short note"], done: [true, true, false] },
    { id: "g2", title: "Build a steady morning", area: "Wellbeing", due: "2026-11-15", progress: 32, milestones: ["Wake at a consistent time", "Make space for a walk"], done: [true, false] },
    { id: "g3", title: "Save for a small trip", area: "Personal", due: "2027-02-01", progress: 71, milestones: ["Set a monthly amount", "Book the first stay"], done: [true, false] },
];

const isValidDate = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const normalizeGoal = (value) => {
    if (!value || typeof value !== "object" || typeof value.id !== "string" || !value.id.trim() || typeof value.title !== "string" || !value.title.trim()) return null;
    const milestones = Array.isArray(value.milestones) ? value.milestones.filter((step) => typeof step === "string" && step.trim()).map((step) => step.trim()) : [];
    const done = milestones.map((_, index) => Array.isArray(value.done) && value.done[index] === true);
    const progress = Number(value.progress);
    return {
        id: value.id,
        title: value.title.trim().slice(0, 100),
        area: typeof value.area === "string" && value.area.trim() ? value.area.trim().slice(0, 40) : "Personal",
        due: isValidDate(value.due) ? value.due : "",
        progress: Number.isFinite(progress) ? Math.min(100, Math.max(0, Math.round(progress))) : 0,
        milestones,
        done,
    };
};

const loadGoals = () => {
    try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved === null) return starterGoals;
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map(normalizeGoal).filter(Boolean) : starterGoals;
    } catch {
        return starterGoals;
    }
};

const createId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const formatDueDate = (value) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));

const GoalPlanner = () => {
    const [goals, setGoals] = useState(loadGoals);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: "", area: "Personal", due: "" });
    const [removing, setRemoving] = useState(null);
    const [storageError, setStorageError] = useState(false);
    const cancelRef = useRef(null);
    const dialogRef = useRef(null);
    const previousFocusRef = useRef(null);
    const newGoalButtonRef = useRef(null);

    useEffect(() => {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(goals));
            // localStorage is external persistence; update the visible save-status state.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStorageError(false);
        } catch {
            setStorageError(true);
        }
    }, [goals]);

    useEffect(() => {
        if (!removing) return undefined;
        const newGoalButton = newGoalButtonRef.current;
        cancelRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setRemoving(null);
                return;
            }
            if (event.key !== "Tab") return;
            const focusable = dialogRef.current?.querySelectorAll("button:not(:disabled)");
            if (!focusable?.length) return;
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
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            requestAnimationFrame(() => {
                const previousFocus = previousFocusRef.current;
                (previousFocus?.isConnected ? previousFocus : newGoalButton)?.focus();
            });
        };
    }, [removing]);

    const addGoal = (event) => {
        event.preventDefault();
        const title = form.title.trim();
        if (!title) return;
        setGoals((items) => [...items, {
            id: createId(),
            title: title.slice(0, 100),
            area: form.area,
            due: isValidDate(form.due) ? form.due : "",
            progress: 0,
            milestones: ["Choose the next small step"],
            done: [false],
        }]);
        setForm({ title: "", area: "Personal", due: "" });
        setShowForm(false);
    };

    const updateGoal = (id, updater) => setGoals((items) => items.map((goal) => goal.id === id ? updater(goal) : goal));
    const completed = goals.filter((goal) => goal.progress === 100).length;
    const average = goals.length ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0;

    return <section className={styles.goalPage} id="goals">
        <div className={styles.hero}>
            <div><p className={styles.label}>Progress grows from small steps</p><h1>Keep your goals in reach.</h1><p>Turn an intention into a clear next action.</p></div>
            <button ref={newGoalButtonRef} className={styles.addButton} type="button" onClick={() => setShowForm((visible) => !visible)}><FiPlus />{showForm ? "Close" : "New goal"}</button>
        </div>

        {storageError && <p className={styles.storageNotice} role="status">Your browser could not save changes. Your goals will stay here until you leave this page.</p>}

        <div className={styles.summary} id="review">
            <div><FiTarget /><span><small>Active goals</small><strong>{goals.length}</strong></span></div>
            <div><FiCheck /><span><small>Completed</small><strong>{completed}</strong></span></div>
            <div className={styles.avg}><span>Overall progress</span><strong>{average}%</strong><div><i style={{ width: `${average}%` }} /></div></div>
            <p>Review your next step before the week gets busy.</p>
        </div>

        {showForm && <form className={styles.newGoal} onSubmit={addGoal}>
            <label>Goal<input required maxLength={100} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="What would you like to make happen?" /></label>
            <label>Area<select value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })}><option>Personal</option><option>Work</option><option>Learning</option><option>Wellbeing</option><option>Money</option></select></label>
            <label>Target date<input type="date" value={form.due} onChange={(event) => setForm({ ...form, due: event.target.value })} /></label>
            <button type="submit"><FiPlus /> Create goal</button>
        </form>}

        <div className={styles.goalGrid}>
            {goals.map((goal, index) => <article className={styles.goalCard} key={goal.id}>
                <div className={styles.cardTop}>
                    <span className={[styles.area, styles[`area${index % 3}`]].join(" ")}>{goal.area}</span>
                    <button type="button" onClick={(event) => { previousFocusRef.current = event.currentTarget; setRemoving(goal); }} aria-label={`Delete goal ${goal.title}`}><FiTrash2 /></button>
                </div>
                <h2>{goal.title}</h2>
                <div className={styles.due}><FiCalendar />{goal.due ? `By ${formatDueDate(goal.due)}` : "No target date"}</div>
                <div className={styles.progressLabel}><span>Progress</span><strong>{goal.progress}%</strong></div>
                <input className={styles.range} type="range" min="0" max="100" step="1" value={goal.progress} aria-label={`Goal progress for ${goal.title}`} onChange={(event) => updateGoal(goal.id, (item) => ({ ...item, progress: Number(event.target.value) }))} />
                <div className={styles.bar} aria-hidden="true"><i style={{ width: `${goal.progress}%` }} /></div>
                <div className={styles.stepsTitle}><strong>Small steps</strong><small>{goal.done.filter(Boolean).length}/{goal.done.length}</small></div>
                <ul>
                    {goal.milestones.map((step, stepIndex) => <li key={`${goal.id}-${stepIndex}`}><label><input type="checkbox" checked={goal.done[stepIndex]} onChange={() => updateGoal(goal.id, (item) => ({ ...item, done: item.done.map((done, itemIndex) => itemIndex === stepIndex ? !done : done) }))} /><span>{step}</span></label></li>)}
                </ul>
                <form className={styles.addStep} onSubmit={(event) => {
                    event.preventDefault();
                    const input = event.currentTarget.elements.step;
                    const value = input.value.trim();
                    if (!value) return;
                    updateGoal(goal.id, (item) => ({ ...item, milestones: [...item.milestones, value.slice(0, 100)], done: [...item.done, false] }));
                    input.value = "";
                }}>
                    <input name="step" maxLength={100} aria-label={`Add a small step for ${goal.title}`} placeholder="Add a small step" />
                    <button type="submit" aria-label={`Add step for ${goal.title}`}><FiPlus /></button>
                </form>
            </article>)}
        </div>

        {!goals.length && <p className={styles.empty}>No goals here yet. Add one when you are ready.</p>}

        {removing && <div className={styles.modal} onMouseDown={(event) => { if (event.target === event.currentTarget) setRemoving(null); }}>
            <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="delete-heading" aria-describedby="delete-copy">
                <FiFlag /><h2 id="delete-heading">Remove this goal?</h2><p id="delete-copy"><strong>{removing.title}</strong> and its milestones will be deleted.</p>
                <div>
                    <button ref={cancelRef} type="button" onClick={() => setRemoving(null)}>Keep goal</button>
                    <button type="button" onClick={() => { setGoals((items) => items.filter((goal) => goal.id !== removing.id)); setRemoving(null); }}>Remove goal</button>
                </div>
            </section>
        </div>}

        <div className={styles.tip}><FiArrowUpRight /><span><strong>Make the next step smaller.</strong> A clear action is easier to return to than a perfect plan.</span></div>
    </section>;
};

export default GoalPlanner;
