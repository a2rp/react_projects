import { useRef } from "react";
import { useDialogFocus } from "../../../hooks/useDialogFocus.js";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const PollDeleteModal = ({ question, onCancel, onConfirm, fallbackFocusRef }) => {
    const dialogRef = useRef(null);

    useDialogFocus(dialogRef, {
        onEscape: onCancel,
        initialFocusSelector: '[data-dialog-initial-focus]',
        fallbackFocusRef,
    });

    return (
        <div
            className={styles.backdrop}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onCancel();
            }}
        >
            <section
                className={styles.dialog}
                ref={dialogRef}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-poll-title"
                aria-describedby="delete-poll-description"
            >
                <div className={styles.dialogTop}>
                    <span className={styles.warningIcon}>
                        <FiAlertTriangle aria-hidden="true" />
                    </span>
                    <button
                        className={styles.closeButton}
                        type="button"
                        aria-label="Close delete confirmation"
                        onClick={onCancel}
                    >
                        <FiX aria-hidden="true" />
                    </button>
                </div>
                <h2 id="delete-poll-title">Delete this poll?</h2>
                <p id="delete-poll-description">
                    <strong>{question}</strong> and its votes will be removed
                    from this browser. This cannot be undone.
                </p>
                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        data-dialog-initial-focus
                        type="button"
                        onClick={onCancel}
                    >
                        Keep poll
                    </button>
                    <button
                        className={styles.deleteButton}
                        type="button"
                        onClick={onConfirm}
                    >
                        Delete poll
                    </button>
                </div>
            </section>
        </div>
    );
};

export { PollDeleteModal };
