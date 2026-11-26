import { createElement, useEffect, useRef, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import {
    FiArrowUp,
    FiCodepen,
    FiCoffee,
    FiFacebook,
    FiGithub,
    FiGlobe,
    FiHeart,
    FiLinkedin,
    FiMail,
    FiMenu,
    FiPackage,
    FiPlus,
    FiStar,
    FiX,
    FiYoutube,
} from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";

const footerLinks = [
    { label: "Portfolio", href: "https://www.ashishranjan.net/", icon: FiGlobe },
    { label: "GitHub", href: "https://github.com/a2rp", icon: FiGithub },
    { label: "CodePen", href: "https://codepen.io/ash1198", icon: FiCodepen },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", icon: FiLinkedin },
    { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", icon: FiFacebook },
    { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", icon: FiYoutube },
    { label: "Email", href: "mailto:ash.ranjan09@gmail.com", icon: FiMail },
    { label: "Support", href: "https://a2rp-donation-page.netlify.app/", icon: FiHeart },
    { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/a2rp", icon: FiCoffee },
    { label: "Patreon", href: "https://www.patreon.com/a2rp", icon: FiStar },
];

const App = () => {
    const [menuIsActive, setMenuIsActive] = useState(false);
    const [showGoToTop, setShowGoToTop] = useState(false);
    const menuButtonRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setShowGoToTop(window.scrollY > 280);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!menuIsActive) return undefined;

        const closeOnEscape = (event) => {
            if (event.key === "Escape") {
                setMenuIsActive(false);
                menuButtonRef.current?.focus();
            }
        };

        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [menuIsActive]);

    const closeMenu = () => {
        setMenuIsActive(false);
        menuButtonRef.current?.focus();
    };

    const scrollToPageTop = () => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    };

    return (
        <Styled.Wrapper>
            <Styled.Header>
                <Styled.HeaderContent>
                    <Styled.MenuButton
                        ref={menuButtonRef}
                        type="button"
                        aria-controls="primary-navigation"
                        aria-label={menuIsActive ? "Close navigation" : "Open navigation"}
                        aria-expanded={menuIsActive}
                        onClick={() => setMenuIsActive((current) => !current)}
                    >
                        {menuIsActive ? <FiX /> : <FiMenu />}
                    </Styled.MenuButton>

                    <NavLink to="/" className="brand" onClick={closeMenu}>
                        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ashish Ranjan logo" />
                        <span>
                            <small>A2RP STORE</small>
                            Ecommerce product manager
                        </span>
                    </NavLink>
                </Styled.HeaderContent>
            </Styled.Header>

            <Styled.Navbar
                id="primary-navigation"
                className={menuIsActive ? "active" : ""}
                aria-label="Primary navigation"
                aria-hidden={!menuIsActive}
            >
                <div className="nav-heading">
                    <span>Workspace</span>
                    <FiPackage aria-hidden="true" />
                </div>
                <NavLink to="/" end onClick={closeMenu}>
                    Product List
                </NavLink>
                <NavLink to="/add" onClick={closeMenu}>
                    <FiPlus aria-hidden="true" />
                    Add Product
                </NavLink>
            </Styled.Navbar>

            {menuIsActive && <Styled.MenuOverlay aria-hidden="true" onClick={closeMenu} />}

            <Styled.Main>
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/add" element={<AddProduct />} />
                </Routes>
            </Styled.Main>

            <Styled.Footer>
                <div className="footer-content">
                    <p>
                        Copyright &copy; {new Date().getFullYear()} {" "}
                        <a href="https://www.ashishranjan.net" target="_blank" rel="noopener noreferrer">
                            Ashish Ranjan
                        </a>
                    </p>
                    <nav aria-label="Social and support links">
                        {footerLinks.map(({ label, href, icon }) => (
                            <a
                                key={label}
                                href={href}
                                target={href.startsWith("mailto:") ? undefined : "_blank"}
                                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                                aria-label={label}
                                title={label}
                            >
                                {createElement(icon, { "aria-hidden": true })}
                            </a>
                        ))}
                    </nav>
                </div>
            </Styled.Footer>

            {showGoToTop && (
                <Styled.GoToTop
                    type="button"
                    aria-label="Scroll to top"
                    title="Scroll to top"
                    onClick={scrollToPageTop}
                >
                    <FiArrowUp aria-hidden="true" />
                </Styled.GoToTop>
            )}

            <ToastContainer position="bottom-right" autoClose={3200} />
        </Styled.Wrapper>
    );
};

export default App;

const Styled = {
    Wrapper: styled.div`
        min-height: 100vh;
        background: #f4f7fb;
        color: #162033;
    `,
    Header: styled.header`
        position: fixed;
        inset: 0 0 auto;
        height: 76px;
        z-index: 1200;
        background: rgba(9, 27, 48, 0.96);
        border-bottom: 1px solid rgba(164, 188, 215, 0.18);
        backdrop-filter: blur(16px);
    `,
    HeaderContent: styled.div`
        width: min(1180px, calc(100% - 32px));
        height: 100%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 16px;

        .brand {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            color: #f7fbff;
            text-decoration: none;
            font-weight: 700;
            letter-spacing: 0.01em;
        }

        .brand img {
            width: 42px;
            height: 42px;
            object-fit: contain;
            border-radius: 12px;
            background: #132b49;
            border: 1px solid rgba(255, 255, 255, 0.16);
        }

        .brand span {
            display: grid;
            gap: 2px;
        }

        .brand small {
            color: #75b9ff;
            font-size: 0.67rem;
            letter-spacing: 0.16em;
        }
    `,
    MenuButton: styled.button`
        width: 42px;
        height: 42px;
        display: inline-grid;
        place-items: center;
        border: 1px solid rgba(160, 190, 220, 0.3);
        border-radius: 12px;
        background: transparent;
        color: #f7fbff;
        cursor: pointer;
        transition: border-color 180ms ease, box-shadow 180ms ease;

        svg {
            width: 21px;
            height: 21px;
        }

        &:hover,
        &:focus-visible {
            border-color: #71b6ff;
            box-shadow: 0 0 0 4px rgba(73, 153, 255, 0.15);
            outline: none;
        }
    `,
    Navbar: styled.nav`
        position: fixed;
        top: 76px;
        left: 0;
        bottom: 0;
        z-index: 1100;
        width: min(290px, calc(100vw - 36px));
        padding: 26px 18px;
        background: #0c2139;
        border-right: 1px solid rgba(164, 188, 215, 0.18);
        transform: translateX(-102%);
        visibility: hidden;
        transition: transform 180ms ease, visibility 0s linear 180ms;
        box-shadow: 18px 0 38px rgba(5, 16, 29, 0.18);

        &.active {
            transform: translateX(0);
            visibility: visible;
            transition: transform 180ms ease, visibility 0s;
        }

        .nav-heading {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 18px;
            color: #8eb3d5;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
        }

        a {
            display: flex;
            align-items: center;
            gap: 10px;
            min-height: 46px;
            padding: 0 14px;
            margin-bottom: 8px;
            border: 1px solid transparent;
            border-radius: 12px;
            color: #e9f3ff;
            text-decoration: none;
            transition: border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
        }

        a:hover,
        a:focus-visible,
        a.active {
            background: #173b61;
            border-color: #3b8fdf;
            box-shadow: 0 8px 22px rgba(2, 11, 24, 0.2);
            outline: none;
        }

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }
    `,
    MenuOverlay: styled.div`
        position: fixed;
        inset: 76px 0 0;
        z-index: 1000;
        background: rgba(4, 13, 24, 0.42);
    `,
    Main: styled.main`
        width: min(1180px, calc(100% - 32px));
        min-height: calc(100vh - 76px);
        margin: 0 auto;
        padding: 108px 0 42px;
    `,
    Footer: styled.footer`
        background: #091b30;
        color: #acc2d9;
        border-top: 1px solid rgba(164, 188, 215, 0.18);

        .footer-content {
            width: min(1180px, calc(100% - 32px));
            min-height: 84px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }

        p {
            margin: 0;
            font-size: 0.86rem;
        }

        p a {
            color: #f7fbff;
            font-weight: 700;
        }

        nav {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-end;
            gap: 8px;
        }

        nav a {
            width: 34px;
            height: 34px;
            display: inline-grid;
            place-items: center;
            border: 1px solid rgba(164, 188, 215, 0.24);
            border-radius: 10px;
            color: #dcecff;
            transition: border-color 180ms ease, box-shadow 180ms ease, color 180ms ease;
        }

        nav a:hover,
        nav a:focus-visible {
            color: #7ac0ff;
            border-color: #5aa9ed;
            box-shadow: 0 0 0 4px rgba(73, 153, 255, 0.12);
            outline: none;
        }

        nav svg {
            width: 16px;
            height: 16px;
        }

        @media (max-width: 680px) {
            .footer-content {
                padding: 24px 0;
                align-items: flex-start;
                flex-direction: column;
            }

            nav {
                justify-content: flex-start;
            }
        }
    `,
    GoToTop: styled.button`
        position: fixed;
        right: 22px;
        bottom: 22px;
        z-index: 1250;
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        border: 1px solid #3b8fdf;
        border-radius: 50%;
        background: #1474c4;
        color: #fff;
        cursor: pointer;
        box-shadow: 0 10px 24px rgba(9, 63, 112, 0.25);
        transition: border-color 180ms ease, box-shadow 180ms ease;

        &:hover,
        &:focus-visible {
            border-color: #b7ddff;
            box-shadow: 0 0 0 5px rgba(73, 153, 255, 0.16);
            outline: none;
        }
    `,
};
