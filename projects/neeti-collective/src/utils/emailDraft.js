export const CONTACT_EMAIL = "hello@neeticollective.org";

export function createEmailDraftUrl(subject, body) {
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
