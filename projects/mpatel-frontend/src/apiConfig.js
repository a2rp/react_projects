const DEFAULT_API_URL = "http://localhost:1198/api/v1";

export function resolveApiBaseUrl(value) {
    return (value?.trim() || DEFAULT_API_URL).replace(/\/+$/, "");
}
