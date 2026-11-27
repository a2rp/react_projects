import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle } from "react-icons/fi";
import styles from "./styles.module.css";

const ConfirmDialog = ({
    title,
    description,
    confirmLabel = "Delete",
    fallbackFocusId,
    onCancel,
    onConfirm,
}) => {
    const cancelRef = useRef(null);
    const dialogRef = useRef(null);

    useEffect(() => {
        const previousFocus = document.activeElement;
        const appRoot = document.getElementById("root");
        const previousAriaHidden = appRoot?.getAttribute("aria-hidden");
        const previousInert = appRoot?.hasAttribute("inert") ?? false;
        const previousBodyOverflow = document.body.style.overflow;

        if (appRoot) {
            appRoot.setAttribute("inert", "");
            appRoot.setAttribute("aria-hidden", "true");
        }

        document.body.style.overflow = "hidden";
        cancelRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onCancel();
                return;
            }

            if (event.key !== "Tab") return;

            const dialog = dialogRef.current;
            const focusable = Array.from(
                dialog?.querySelectorAll("button:not(:disabled), [href], [tabindex]:not([tabindex='-1'])") ?? [],
            ).filter((element) => element.getClientRects().length > 0);
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (!first || !last) {
                event.preventDefault();
                dialog?.focus();
            } else if (
                event.shiftKey &&
                (document.activeElement === first ||
                    !dialog.contains(document.activeElement))
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                (document.activeElement === last ||
                    !dialog.contains(document.activeElement))
            ) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousBodyOverflow;

            if (appRoot) {
                if (!previousInert) appRoot.removeAttribute("inert");
                if (previousAriaHidden === null) {
                    appRoot.removeAttribute("aria-hidden");
                } else {
                    appRoot.setAttribute("aria-hidden", previousAriaHidden);
                }
            }

            if (previousFocus?.isConnected) {
                previousFocus.focus?.();
            } else {
                document.getElementById(fallbackFocusId)?.focus?.();
            }
        };
    }, [fallbackFocusId, onCancel]);

    return createPortal(
        <div
            className={styles.overlay}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onCancel();
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
                <span className={styles.icon}>
                    <FiAlertTriangle aria-hidden="true" />
                </span>
                <h2 id="confirm-title">{title}</h2>
                <p id="confirm-description">{description}</p>
                <div className={styles.actions}>
                    <button type="button" ref={cancelRef} onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={styles.confirm}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </section>
        </div>,
        document.body,
    );
};

export default ConfirmDialog;
