import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const focusableSelector = "a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])";

const ConfirmDialog = ({ title, description, confirmLabel = "Remove", onConfirm, onClose }) => {
  const dialogRef = useRef(null);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousActiveElement = document.activeElement;
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const controls = [...dialog.querySelectorAll(focusableSelector)];
      if (controls.length === 0) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
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

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus?.();
    };
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const confirmAction = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className={styles.backdrop} onMouseDown={handleBackdropClick}>
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description" ref={dialogRef}>
        <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close confirmation">
          <FiX aria-hidden="true" />
        </button>
        <div className={styles.alertIcon}><FiAlertTriangle aria-hidden="true" /></div>
        <p className={styles.label}>Please confirm</p>
        <h2 id="confirm-title">{title}</h2>
        <p className={styles.description} id="confirm-description">{description}</p>
        <div className={styles.actions}>
          <button className={styles.cancelButton} type="button" ref={cancelButtonRef} onClick={onClose}>Keep it</button>
          <button className={styles.confirmButton} type="button" onClick={confirmAction}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmDialog;
