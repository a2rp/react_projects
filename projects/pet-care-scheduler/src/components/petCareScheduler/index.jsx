import { useMemo, useState } from "react";
import { FiCalendar, FiCheck, FiPlus, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../confirmDialog";
import styles from "./styles.module.css";

const petKey = "good-paws-pets";
const taskKey = "good-paws-tasks";
const dateAfter = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
const initialPets = [{ id: "milo", name: "Milo", kind: "Dog", detail: "Golden retriever · 4 years", mark: "M" }, { id: "pippa", name: "Pippa", kind: "Cat", detail: "Tabby · 2 years", mark: "P" }];
const initialTasks = [
    { id: 1, petId: "milo", title: "Evening walk", kind: "Walk", date: dateAfter(0), time: "17:30", done: false },
    { id: 2, petId: "pippa", title: "Top up dry food", kind: "Feeding", date: dateAfter(0), time: "18:00", done: false },
    { id: 3, petId: "milo", title: "Heartworm tablet", kind: "Medicine", date: dateAfter(1), time: "08:00", done: false },
    { id: 4, petId: "pippa", title: "Brush and check coat", kind: "Grooming", date: dateAfter(3), time: "10:00", done: false },
    { id: 5, petId: "milo", title: "Annual checkup", kind: "Vet", date: dateAfter(9), time: "14:15", done: false },
];
const normalizeTime = (value) => {
    if (typeof value !== "string") return null;
    const twentyFourHourTime = value.match(/^(\d{1,2}):(\d{2})$/);
    if (twentyFourHourTime) {
        const hours = Number(twentyFourHourTime[1]);
        const minutes = Number(twentyFourHourTime[2]);
        if (hours > 23 || minutes > 59) return null;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }

    const twelveHourTime = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!twelveHourTime) return null;
    const hour = Number(twelveHourTime[1]);
    const minute = Number(twelveHourTime[2]);
    if (hour < 1 || hour > 12 || minute > 59) return null;
    const hours = (hour % 12) + (twelveHourTime[3].toUpperCase() === "PM" ? 12 : 0);
    return `${String(hours).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const isValidDate = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const normalizePets = (value) => {
    if (!Array.isArray(value)) return null;
    const pets = value.map((pet) => {
        if (!pet || typeof pet !== "object" || typeof pet.id !== "string" || typeof pet.name !== "string" || !pet.name.trim() || typeof pet.kind !== "string") return null;
        return {
            id: pet.id,
            name: pet.name.trim(),
            kind: pet.kind,
            detail: typeof pet.detail === "string" ? pet.detail : pet.kind,
            mark: typeof pet.mark === "string" && pet.mark ? pet.mark : pet.name.trim().slice(0, 1).toUpperCase(),
        };
    });
    return pets.every(Boolean) ? pets : null;
};

const normalizeTasks = (value) => {
    if (!Array.isArray(value)) return null;
    const tasks = value.map((task) => {
        if (!task || typeof task !== "object" || !(typeof task.id === "string" || typeof task.id === "number") || typeof task.petId !== "string" || typeof task.title !== "string" || !task.title.trim() || typeof task.kind !== "string" || !isValidDate(task.date) || typeof task.done !== "boolean") return null;
        const time = normalizeTime(task.time);
        if (!time) return null;
        return { ...task, title: task.title.trim(), time };
    });
    return tasks.every(Boolean) ? tasks : null;
};

const readList = (key, fallback, normalize) => {
    try {
        const saved = localStorage.getItem(key);
        if (saved === null) return { value: fallback, warning: false };
        const normalized = normalize(JSON.parse(saved));
        return normalized ? { value: normalized, warning: false } : { value: fallback, warning: true };
    } catch {
        return { value: fallback, warning: true };
    }
};
const dateLabel = (value) => new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(new Date(value + "T12:00:00"));
const timeLabel = (value) => new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(`2000-01-01T${value}:00`));

const PetCareScheduler = () => {
    const [storedLists] = useState(() => ({
        pets: readList(petKey, initialPets, normalizePets),
        tasks: readList(taskKey, initialTasks, normalizeTasks),
    }));
    const [pets, setPets] = useState(storedLists.pets.value);
    const [tasks, setTasks] = useState(storedLists.tasks.value);
    const [storageWarning, setStorageWarning] = useState(storedLists.pets.warning || storedLists.tasks.warning);
    const [selectedPet, setSelectedPet] = useState("all");
    const [view, setView] = useState("Upcoming");
    const [petDraft, setPetDraft] = useState({ name: "", kind: "Dog", detail: "" });
    const [taskDraft, setTaskDraft] = useState({ petId: initialPets[0].id, title: "", kind: "Feeding", date: dateAfter(0), time: "08:00" });
    const [pendingDelete, setPendingDelete] = useState(null);
    const persistLists = (nextPets, nextTasks) => {
        try {
            localStorage.setItem(petKey, JSON.stringify(nextPets));
            localStorage.setItem(taskKey, JSON.stringify(nextTasks));
            setStorageWarning(false);
        } catch {
            setStorageWarning(true);
        }
    };

    const openTasks = tasks.filter((task) => !task.done);
    const todayCount = openTasks.filter((task) => task.date === dateAfter(0)).length;
    const visibleTasks = useMemo(() => tasks.filter((task) => (selectedPet === "all" || task.petId === selectedPet) && (view === "Upcoming" ? !task.done : task.done)).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)), [tasks, selectedPet, view]);

    const addPet = (event) => {
        event.preventDefault();
        if (!petDraft.name.trim()) return;
        const pet = { ...petDraft, id: String(Date.now()), name: petDraft.name.trim(), detail: petDraft.detail.trim() || petDraft.kind, mark: petDraft.name.trim().slice(0, 1).toUpperCase() };
        const nextPets = [...pets, pet];
        persistLists(nextPets, tasks);
        setPets(nextPets);
        setTaskDraft((current) => ({ ...current, petId: pet.id }));
        setPetDraft({ name: "", kind: "Dog", detail: "" });
    };
    const addTask = (event) => {
        event.preventDefault();
        if (!taskDraft.title.trim() || pets.length === 0) return;
        const nextTasks = [...tasks, { ...taskDraft, id: Date.now(), title: taskDraft.title.trim(), done: false }];
        persistLists(pets, nextTasks);
        setTasks(nextTasks);
        setTaskDraft((current) => ({ ...current, title: "" }));
    };
    const toggleTask = (taskId) => {
        const nextTasks = tasks.map((task) => task.id === taskId ? { ...task, done: !task.done } : task);
        persistLists(pets, nextTasks);
        setTasks(nextTasks);
    };
    const removeTask = () => {
        const nextTasks = tasks.filter((task) => task.id !== pendingDelete.id);
        persistLists(pets, nextTasks);
        setTasks(nextTasks);
        setPendingDelete(null);
    };

    return (
        <section className={styles.petCareScheduler} id="workspace">
            <div className={styles.welcome}>
                <div><p className={styles.label}>CARE FOR EVERY PAW</p><h1>Good days start<br />with good care.</h1><p className={styles.description}>Keep the little routines in one happy place.</p></div>
                <div className={styles.todayCard}><FiCalendar aria-hidden="true" /><div><span>TODAY</span><strong>{todayCount} care {todayCount === 1 ? "reminder" : "reminders"}</strong></div><p>{dateLabel(dateAfter(0))}</p></div>
            </div>
            {storageWarning && <p className={styles.storageNotice} role="status">This browser could not save your changes. The schedule will stay available until you leave this page.</p>}
            <section className={styles.petSection} aria-label="Your pets">
                <div className={styles.sectionHeading}><div><h2>Your pets</h2><p>Choose a friend to see their care plan.</p></div><span>{pets.length} profiles</span></div>
                <div className={styles.petCards}>
                    <button type="button" className={selectedPet === "all" ? styles.selectedPet : styles.allPets} onClick={() => setSelectedPet("all")}><span className={styles.allMark}>+</span><span><strong>All pets</strong><small>See the whole household</small></span></button>
                    {pets.map((pet, index) => <button type="button" key={pet.id} className={selectedPet === pet.id ? styles.selectedPet : styles.petCard} onClick={() => { setSelectedPet(pet.id); setTaskDraft((current) => ({ ...current, petId: pet.id })); }}><span className={styles.petMark + " " + styles["petColor" + (index % 3)]}>{pet.mark}</span><span><strong>{pet.name}</strong><small>{pet.detail}</small></span><i>{pet.kind}</i></button>)}
                </div>
            </section>
            <div className={styles.scheduleLayout}>
                <section className={styles.schedulePanel} aria-label="Pet care reminders">
                    <div className={styles.scheduleHeading}><div><h2>Care schedule</h2><p>Small jobs to keep tails wagging.</p></div><div className={styles.tabs} role="group" aria-label="Care schedule view">{["Upcoming", "Done"].map((option) => <button type="button" key={option} className={view === option ? styles.activeTab : ""} onClick={() => setView(option)}>{option}</button>)}</div></div>
                    <div className={styles.taskList}>
                        {visibleTasks.map((task) => {
                            const pet = pets.find((item) => item.id === task.petId);
                            return <article className={task.done ? styles.doneTask : styles.taskRow} key={task.id}>
                                <button type="button" className={styles.taskCheck} aria-label={(task.done ? "Mark not done: " : "Mark done: ") + task.title} aria-pressed={task.done} onClick={() => toggleTask(task.id)}>{task.done && <FiCheck aria-hidden="true" />}</button>
                                <div className={styles.taskCopy}><span>{task.kind} · {pet?.name || "Pet"}</span><strong>{task.title}</strong></div>
                                <div className={styles.taskTime}><strong>{timeLabel(task.time)}</strong><small>{dateLabel(task.date)}</small></div>
                                <button type="button" className={styles.deleteButton} aria-label={"Delete " + task.title} onClick={() => setPendingDelete(task)}><FiTrash2 aria-hidden="true" /></button>
                            </article>;
                        })}
                        {visibleTasks.length === 0 && <p className={styles.emptyState}>Nothing in this schedule yet.</p>}
                    </div>
                    <form className={styles.taskForm} id="add" onSubmit={addTask}>
                        <h3>Add a care reminder</h3>
                        <label>Pet<select value={taskDraft.petId} onChange={(event) => setTaskDraft({ ...taskDraft, petId: event.target.value })}>{pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}</select></label>
                        <label>Care task<input required value={taskDraft.title} onChange={(event) => setTaskDraft({ ...taskDraft, title: event.target.value })} placeholder="A walk, meal, medicine..." /></label>
                        <label>Type<select value={taskDraft.kind} onChange={(event) => setTaskDraft({ ...taskDraft, kind: event.target.value })}>{["Feeding", "Walk", "Medicine", "Grooming", "Vet", "Other"].map((value) => <option key={value}>{value}</option>)}</select></label>
                        <label>Date<input required type="date" value={taskDraft.date} onChange={(event) => setTaskDraft({ ...taskDraft, date: event.target.value })} /></label>
                        <label>Time<input required type="time" value={taskDraft.time} onChange={(event) => setTaskDraft({ ...taskDraft, time: event.target.value })} /></label>
                        <button type="submit" className={styles.addButton} disabled={!pets.length}><FiPlus aria-hidden="true" /> Add reminder</button>
                    </form>
                </section>
                <aside className={styles.petFormPanel} aria-label="Add a pet">
                    <span className={styles.paw}>✦</span><h2>New to the family?</h2><p>Add a pet profile, then create a care plan just for them.</p>
                    <form onSubmit={addPet}>
                        <label>Name<input required value={petDraft.name} onChange={(event) => setPetDraft({ ...petDraft, name: event.target.value })} placeholder="Pet name" /></label>
                        <label>Friend<select value={petDraft.kind} onChange={(event) => setPetDraft({ ...petDraft, kind: event.target.value })}><option>Dog</option><option>Cat</option><option>Other</option></select></label>
                        <label>Details<input value={petDraft.detail} onChange={(event) => setPetDraft({ ...petDraft, detail: event.target.value })} placeholder="Breed or age" /></label>
                        <button type="submit" className={styles.petAddButton}><FiPlus aria-hidden="true" /> Add pet</button>
                    </form>
                    <small>Profiles and reminders stay in this browser and are not encrypted.</small>
                </aside>
            </div>
            {pendingDelete && <ConfirmDialog title="Remove this care reminder?" description={"“" + pendingDelete.title + "” will be deleted from the schedule."} onCancel={() => setPendingDelete(null)} onConfirm={removeTask} />}
        </section>
    );
};

export default PetCareScheduler;
