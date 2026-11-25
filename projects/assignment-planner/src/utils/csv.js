import { CSV_HEADERS } from "../data/constants";

import { createAssignmentId } from "./assignmentUtils";

const escapeCsvValue = (value) => {
    const text = String(value ?? "");

    if (
        text.includes('"') ||
        text.includes(",") ||
        text.includes("\n") ||
        text.includes("\r")
    ) {
        return `"${text.replaceAll('"', '""')}"`;
    }

    return text;
};

const parseCsvRecords = (text) => {
    const records = [];
    let record = [];
    let field = "";
    let inQuotes = false;

    const finishRecord = () => {
        record.push(field);

        if (record.some((value) => value.trim())) {
            records.push(record);
        }

        record = [];
        field = "";
    };

    for (let index = 0; index < text.length; index += 1) {
        const character = text[index];

        if (inQuotes) {
            if (character === '"') {
                if (text[index + 1] === '"') {
                    field += '"';
                    index += 1;
                } else {
                    inQuotes = false;
                }
            } else {
                field += character;
            }

            continue;
        }

        if (character === '"' && field.length === 0) {
            inQuotes = true;
        } else if (character === ",") {
            record.push(field);
            field = "";
        } else if (character === "\r" || character === "\n") {
            finishRecord();

            if (character === "\r" && text[index + 1] === "\n") {
                index += 1;
            }
        } else {
            field += character;
        }
    }

    if (inQuotes) {
        return [];
    }

    if (field.length || record.length) {
        finishRecord();
    }

    return records;
};

export const assignmentsToCsv = (assignments) => {
    const header = CSV_HEADERS.join(",");

    const rows = assignments.map((assignment) =>
        CSV_HEADERS.map((field) => escapeCsvValue(assignment[field])).join(","),
    );

    return [header, ...rows].join("\n");
};

export const csvToAssignments = (text) => {
    const records = parseCsvRecords(String(text ?? "").replace(/^\uFEFF/, ""));

    if (!records.length) {
        return [];
    }

    const headers = records[0].map((header) => header.trim());

    const fieldIndexes = CSV_HEADERS.reduce((map, field) => {
        map[field] = headers.indexOf(field);

        return map;
    }, {});

    const importedAssignments = [];

    for (let index = 1; index < records.length; index += 1) {
        const columns = records[index];

        const record = {};

        CSV_HEADERS.forEach((field) => {
            const fieldIndex = fieldIndexes[field];

            record[field] = fieldIndex >= 0 ? (columns[fieldIndex] ?? "") : "";
        });

        if (!record.title?.trim() || !record.dueDate?.trim()) {
            continue;
        }

        const now = Date.now();

        importedAssignments.push({
            id: createAssignmentId(),

            title: record.title.trim(),

            course: record.course?.trim() || "",

            dueDate: record.dueDate,

            dueTime: record.dueTime || "",

            priority: ["High", "Medium", "Low"].includes(record.priority)
                ? record.priority
                : "Medium",

            estimateHours: Number(record.estimateHours) || 0,

            status: ["todo", "doing", "done"].includes(record.status)
                ? record.status
                : "todo",

            notes: record.notes || "",

            createdAt: now,
            updatedAt: now,
        });
    }

    return importedAssignments;
};
