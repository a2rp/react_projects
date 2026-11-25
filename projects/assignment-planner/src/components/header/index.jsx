import { useEffect, useRef, useState } from "react";
import {
    FiDownload,
    FiMenu,
    FiMoon,
    FiPrinter,
    FiSun,
    FiUpload,
    FiX,
} from "react-icons/fi";

import { Styled } from "./styled";

const Header = ({
    theme,
    onToggleTheme,
    onExportCsv,
    onImportCsv,
    onPrint,
}) => {
    const isDark = theme === "dark";

    const [isHidden, setIsHidden] = useState(false);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const previousScrollTop = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollTop = window.scrollY;
            const previousScrollTopValue = previousScrollTop.current;

            if (currentScrollTop <= 8) {
                setIsHidden(false);
            } else if (currentScrollTop > previousScrollTopValue + 4) {
                setIsHidden(true);
                setIsMenuOpen(false);
            } else if (currentScrollTop < previousScrollTopValue - 4) {
                setIsHidden(false);
            }

            previousScrollTop.current = currentScrollTop;
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!isMenuOpen) {
            document.body.style.overflow = "";

            return undefined;
        }

        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMenuOpen]);

    return (
        <Styled.Wrapper className={isHidden ? "hidden" : ""}>
            <div className="content">
                <div className="brand">
                    <div className="logo">
                        <span>AP</span>
                    </div>

                    <div className="brandText">
                        <h1>Assignment Planner</h1>

                        <p>
                            Plan smarter, track deadlines, and stay on top of
                            every assignment.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="menuButton"
                    onClick={() => setIsMenuOpen((current) => !current)}
                    aria-label={
                        isMenuOpen ? "Close planner menu" : "Open planner menu"
                    }
                    aria-expanded={isMenuOpen}
                    aria-controls="planner-header-actions"
                    title={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMenuOpen ? <FiX /> : <FiMenu />}
                </button>

                <div
                    id="planner-header-actions"
                    className={`actions ${isMenuOpen ? "open" : ""}`}
                >
                    <button
                        type="button"
                        className="actionButton"
                        onClick={onExportCsv}
                    >
                        <FiDownload />
                        <span>Export CSV</span>
                    </button>

                    <label className="actionButton importButton">
                        <FiUpload />
                        <span>Import CSV</span>

                        <input
                            type="file"
                            accept=".csv,text/csv"
                            onChange={onImportCsv}
                        />
                    </label>

                    <button
                        type="button"
                        className="actionButton"
                        onClick={onPrint}
                    >
                        <FiPrinter />
                        <span>Print</span>
                    </button>

                    <button
                        type="button"
                        className="themeButton"
                        onClick={onToggleTheme}
                        aria-label={`Switch to ${
                            isDark ? "light" : "dark"
                        } theme`}
                        title={`Switch to ${isDark ? "light" : "dark"} theme`}
                    >
                        {isDark ? <FiSun /> : <FiMoon />}

                        <span>{isDark ? "Light" : "Dark"}</span>
                    </button>
                </div>
            </div>
        </Styled.Wrapper>
    );
};

export default Header;
