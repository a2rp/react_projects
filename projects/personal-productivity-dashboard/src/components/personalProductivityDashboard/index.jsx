import { useEffect, useMemo, useState } from "react";
import { FiArrowUpRight, FiCheck, FiClock, FiPlus, FiTarget } from "react-icons/fi";
import styles from "./styles.module.css";
const key = "productivity-overview-tasks";
const dateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const today = () => dateKey();
const seed = [{ id: "t1", title: "Review the project brief", priority: "High", done: false }, { id: "t2", title: "Send the weekly update", priority: "Medium", done: true, doneAt: today() }, { id: "t3", title: "Read for twenty minutes", priority: "Low", done: false }, { id: "t4", title: "Plan tomorrow's first block", priority: "Medium", done: false }];
const defaultNote = "Leave a little room between meetings.";
const priorities = new Set(["High", "Medium", "Low"]);
const isTask = (task) => task && typeof task === "object" &&
    (typeof task.id === "string" || typeof task.id === "number") &&
    typeof task.title === "string" && priorities.has(task.priority) && typeof task.done === "boolean" &&
    (task.doneAt === undefined || task.doneAt === null || typeof task.doneAt === "string");
const load = () => {
    try {
        const savedTasks = localStorage.getItem(key);
        const parsedTasks = savedTasks === null ? seed : JSON.parse(savedTasks);
        const tasksValid = Array.isArray(parsedTasks) && parsedTasks.every(isTask);
        const savedSessions = localStorage.getItem(key + "-sessions");
        const parsedSessions = savedSessions === null ? null : JSON.parse(savedSessions);
        let session = { date: today(), count: 0 };
        if (typeof parsedSessions === "number" && Number.isFinite(parsedSessions)) {
            session.count = 0;
        } else if (parsedSessions && typeof parsedSessions === "object" && typeof parsedSessions.date === "string" && Number.isFinite(parsedSessions.count)) {
            session.count = parsedSessions.date === today() ? Math.max(0, parsedSessions.count) : 0;
        }
        return {
            tasks: tasksValid ? parsedTasks : seed,
            session,
            note: localStorage.getItem(key + "-note") ?? defaultNote,
            warning: tasksValid ? "" : "Saved tasks could not be read. Example tasks are shown; later changes may replace the unreadable data.",
        };
    } catch {
        return { tasks: seed, session: { date: today(), count: 0 }, note: defaultNote, warning: "Browser storage is unavailable. Changes may not persist after you leave or refresh." };
    }
};
const createId = () => typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
const PersonalProductivityDashboard = () => {
    const [initialData] = useState(load);
    const [tasks, setTasks] = useState(initialData.tasks);
    const [newTask, setNewTask] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [taskError, setTaskError] = useState("");
    const [seconds, setSeconds] = useState(25 * 60);
    const [running, setRunning] = useState(false);
    const [session, setSession] = useState(initialData.session);
    const [note, setNote] = useState(initialData.note);
    const [storageWarning, setStorageWarning] = useState(initialData.warning);
    const saveTasks = (nextTasks) => {
        setTasks(nextTasks);
        try { localStorage.setItem(key, JSON.stringify(nextTasks)); setStorageWarning(""); }
        catch { setStorageWarning("Browser storage is unavailable. Changes will not persist after you leave or refresh."); }
    };
    const saveNote = (nextNote) => {
        setNote(nextNote);
        try { localStorage.setItem(key + "-note", nextNote); setStorageWarning(""); }
        catch { setStorageWarning("Browser storage is unavailable. Changes will not persist after you leave or refresh."); }
    };
    useEffect(() => {
        if (!running) return undefined;
        const timer = window.setTimeout(() => {
            if (seconds <= 1) {
                setRunning(false);
                setSeconds(25 * 60);
                const currentDate = today();
                const nextSession = { date: currentDate, count: session.date === currentDate ? session.count + 1 : 1 };
                setSession(nextSession);
                try { localStorage.setItem(key + "-sessions", JSON.stringify(nextSession)); setStorageWarning(""); }
                catch { setStorageWarning("Browser storage is unavailable. Changes will not persist after you leave or refresh."); }
            } else {
                setSeconds(seconds - 1);
            }
        }, 1000);
        return () => window.clearTimeout(timer);
    }, [running, seconds, session]);
    const openTasks = tasks.filter((task) => !task.done);
    const doneCount = tasks.filter((task) => task.done && task.doneAt === today()).length;
    const days = useMemo(() => Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setHours(12, 0, 0, 0); date.setDate(date.getDate() - 6 + index); const value = dateKey(date); return { value, label: date.toLocaleDateString("en", { weekday: "short" }), count: tasks.filter((task) => task.done && task.doneAt === value).length }; }), [tasks]);
    const max = Math.max(1, ...days.map((day) => day.count));
    const addTask = (event) => { event.preventDefault(); if (!newTask.trim()) { setTaskError("Enter a task to add it to your day."); return; } saveTasks([...tasks, { id: createId(), title: newTask.trim(), priority, done: false }]); setNewTask(""); setTaskError(""); };
    const toggle = (task) => saveTasks(tasks.map((item) => item.id === task.id ? { ...item, done: !item.done, doneAt: !item.done ? today() : null } : item));
    const clock = String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
    const greeting = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
    return <section className={styles.dashboard} id="today">
        {storageWarning && <p className={styles.storageNotice} role="status">{storageWarning}</p>}
        <div className={styles.welcome}><div><p className={styles.label}>{greeting}</p><h1>Make space for good work.</h1><p>A practical view of what's next, without the noise.</p></div><span className={styles.dayMark}>TODAY<br /><strong>{new Date().getDate()}</strong></span></div>
        <div className={styles.metricRow}><article><span><FiTarget />Open tasks</span><strong>{openTasks.length.toString().padStart(2, "0")}</strong><small>Ready when you are</small></article><article><span><FiCheck />Done today</span><strong>{doneCount.toString().padStart(2, "0")}</strong><small>Small wins count</small></article><article><span><FiClock />Focus sessions</span><strong>{session.count.toString().padStart(2, "0")}</strong><small>Today on this device</small></article></div>
        <div className={styles.mainGrid}>
            <section className={styles.taskPanel}><header><div><span className={styles.panelIndex}>01 / AGENDA</span><h2>Next up</h2></div><small>{openTasks.length} open</small></header><form onSubmit={addTask}><input value={newTask} onChange={(event) => { setNewTask(event.target.value); setTaskError(""); }} placeholder="Add a task to today" aria-label="New task" required /><select value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Task priority"><option>High</option><option>Medium</option><option>Low</option></select><button aria-label="Add task"><FiPlus /></button></form>{taskError && <p className={styles.taskError} role="alert">{taskError}</p>}<div className={styles.tasks}>{tasks.map((task) => <label className={task.done ? styles.done : ""} key={task.id}><input type="checkbox" checked={task.done} onChange={() => toggle(task)} /><span className={styles.taskText}>{task.title}</span><small className={styles[task.priority.toLowerCase()]}>{task.priority}</small></label>)}</div><a className={styles.seeAll} href="#insights">Look at your week <FiArrowUpRight /></a></section>
            <section className={styles.focusPanel}><header><span className={styles.panelIndex}>02 / FOCUS</span><h2>One thing at a time.</h2></header><p>Take a short sprint on your current priority.</p><div className={styles.timer}>{clock}</div><div className={styles.timerActions}><button onClick={() => setRunning((current) => !current)}>{running ? "Pause focus" : "Start 25 min"}</button><button onClick={() => { setRunning(false); setSeconds(25 * 60); }} aria-label="Reset focus timer">Reset</button></div><small>{running ? "Timer is running" : "A focus session is ready"}</small></section>
        </div>
        <div className={styles.bottomGrid} id="insights"><section className={styles.weekPanel}><header><div><span className={styles.panelIndex}>03 / RHYTHM</span><h2>Completed this week</h2></div><span>Tasks</span></header><div className={styles.chart}>{days.map((day) => <div key={day.value}><span>{day.count}</span><i><b style={{ height: (day.count ? Math.max(12, day.count / max * 100) : 3) + "%" }} /></i><small>{day.label}</small></div>)}</div></section><section className={styles.notePanel}><span className={styles.panelIndex}>A NOTE TO SELF</span><textarea value={note} onChange={(event) => saveNote(event.target.value)} aria-label="Personal reminder" placeholder="Leave a reminder for the day..." /><small>{storageWarning ? "Session only; refresh will discard changes" : "Saved locally as you type"}</small></section></div>
    </section>;
};
export default PersonalProductivityDashboard;
