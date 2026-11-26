import { FaArrowUp } from "react-icons/fa";
import styles from "./styles.module.css";
const BackToTop = ({ visible }) => visible ? (
    <button
        className={styles.backToTop}
        type="button"
        onClick={() => {
            const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
        }}
        aria-label="Back to top"
    >
        <FaArrowUp aria-hidden="true" /><span>Top</span>
    </button>
) : null;
export default BackToTop;
