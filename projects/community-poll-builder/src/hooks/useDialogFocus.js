import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(",");

const useDialogFocus = (
    dialogRef,
    { onEscape, initialFocusSelector, fallbackFocusRef } = {},
) => {
    const onEscapeRef = useRef(onEscape);
    useEffect(() => {
        onEscapeRef.current = onEscape;
    }, [onEscape]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return undefined;

        const previousFocus = document.activeElement;
        const fallbackFocus = fallbackFocusRef?.current;
        const getFocusable = () =>
            Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
                (element) => !element.hidden && element.getAttribute("aria-hidden") !== "true",
            );
        const focusInitial = () => {
            const target =
                (initialFocusSelector &&
                    dialog.querySelector(initialFocusSelector)) ||
                getFocusable()[0];
            target?.focus();
        };

        focusInitial();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onEscapeRef.current?.();
                return;
            }

            if (event.key !== "Tab") return;

            const focusable = getFocusable();
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (!dialog.contains(document.activeElement)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            } else if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        const handleFocusIn = (event) => {
            if (!dialog.contains(event.target)) focusInitial();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("focusin", handleFocusIn);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("focusin", handleFocusIn);

            if (previousFocus?.isConnected) {
                previousFocus.focus();
            } else {
                fallbackFocus?.focus();
            }
        };
    }, [dialogRef, initialFocusSelector, fallbackFocusRef]);
};

export { useDialogFocus };