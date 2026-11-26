import { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import styles from "./styles.module.css";

const ConfirmDialog = ({ title, description, confirmLabel = "Delete", onCancel, onConfirm }) => {
    const cancelRef = useRef(null);
    const dialogRef = useRef(null);
    const onCancelRef = useRef(onCancel);

    useEffect(() => {
        onCancelRef.current = onCancel;
    }, [onCancel]);

    useEffect(() => {
        const previouslyFocused = document.activeElement;
        cancelRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onCancelRef.current?.();
                return;
            }

            if (event.key !== "Tab") return;

            const focusable = dialogRef.current?.querySelectorAll("button:not([disabled])");
            if (!focusable?.length) {
                event.preventDefault();
                dialogRef.current?.focus();
                return;
            }

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

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);

            if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
                previouslyFocused.focus();
            } else {
                document.getElementById("task-title")?.focus();
            }
        };
    }, []);

    return (
        <div
            className={styles.overlay}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onCancelRef.current?.();
            }}
        >
            <section
                ref={dialogRef}
                className={styles.dialog}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-description"
                tabIndex={-1}
            >
                <span className={styles.icon}><FiAlertTriangle aria-hidden="true" /></span>
                <h2 id="confirm-title">{title}</h2>
                <p id="confirm-description">{description}</p>
                <div className={styles.actions}>
                    <button type="button" ref={cancelRef} onClick={onCancel}>Cancel</button>
                    <button type="button" className={styles.confirm} onClick={onConfirm}>{confirmLabel}</button>
                </div>
            </section>
        </div>
    );
};

export default ConfirmDialog;
