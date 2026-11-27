export function prepareTrailerQuery(value) {
    const title = String(value ?? "").trim();
    return { title, isValid: title.length >= 2 };
}
