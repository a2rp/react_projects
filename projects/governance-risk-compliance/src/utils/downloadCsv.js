export const downloadCsv = (filename, headers, rows) => {
    const quote = (value) => {
        const text = String(value ?? "");
        const safeText = /^\s*[=+\-@]/.test(text) ? `'${text}` : text;
        return '"' + safeText.replaceAll('"', '""') + '"';
    };
    const contents = [headers, ...rows].map((row) => row.map(quote).join(",")).join("\r\n");
    const file = new Blob(["\uFEFF" + contents], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
};
