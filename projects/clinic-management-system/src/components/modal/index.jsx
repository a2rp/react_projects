import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const focusableSelector = "a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])";

const Modal = ({ title, description, size = "regular", children, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousActiveElement = document.activeElement;
    const firstControl = dialog?.querySelector("[data-dialog-focus]") || dialog?.querySelector("input, select, textarea, button");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstControl?.focus();

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
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus?.();
    };
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onMouseDown={handleBackdropClick}>
      <section className={[styles.dialog, styles[size] || ""].filter(Boolean).join(" ")} role="dialog" aria-modal="true" aria-labelledby="clinic-dialog-title" aria-describedby={description ? "clinic-dialog-description" : undefined} ref={dialogRef}>
        <header className={styles.dialogHeader}>
          <div>
            <p className={styles.label}>Luma Clinic</p>
            <h2 id="clinic-dialog-title">{title}</h2>
            {description && <p className={styles.description} id="clinic-dialog-description">{description}</p>}
          </div>
          <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close dialog">
            <FiX aria-hidden="true" />
          </button>
        </header>
        <div className={styles.dialogBody}>{children}</div>
      </section>
    </div>
  );
};

export default Modal;
