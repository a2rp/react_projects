import { FaArrowUp } from "react-icons/fa";
import styles from "./styles.module.css";

const BackToTop = ({ visible }) => {
    if (!visible) return null;

    const scrollToTop = () => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth",
        });
    };

    return (
        <button
            className={styles.backToTop}
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
        >
            <FaArrowUp aria-hidden="true" />
            <span>Top</span>
        </button>
    );
};

export default BackToTop;
