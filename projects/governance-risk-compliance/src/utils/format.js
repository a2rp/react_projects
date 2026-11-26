export const formatDate = (value, options = { month: "short", day: "numeric", year: "numeric" }) => {
    if (!value) return "Not set";
    return new Intl.DateTimeFormat("en-US", options).format(new Date(value + "T12:00:00"));
};

export const dateOffset = (days = 0, from = new Date()) => {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const daysUntil = (value) => {
    const target = new Date(value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / 86400000);
};

export const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

export const nextRecordId = (prefix, records) => {
    const highest = records.reduce((current, item) => {
        const value = Number(item.id.replace(prefix + "-", ""));
        return Number.isFinite(value) ? Math.max(current, value) : current;
    }, 0);
    return prefix + "-" + String(highest + 1).padStart(3, "0");
};
