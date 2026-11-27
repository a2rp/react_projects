import { useState } from "react";
import { FiGithub, FiMenu, FiX } from "react-icons/fi";
import styled from "styled-components";

const Header = styled.header`
    position: fixed;
    z-index: 20;
    top: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #1b2a39;
    background: rgba(5, 12, 19, 0.92);
    backdrop-filter: blur(16px);
`;

const Inner = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: min(1180px, calc(100% - 40px));
    min-height: 78px;
    margin: 0 auto;
`;

const Brand = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: #f7fbff;
    text-decoration: none;
    img { width: 40px; height: 40px; object-fit: contain; border: 1px solid #36516a; border-radius: 10px; }
    span { display: grid; gap: 2px; }
    small { color: #72e0bd; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
    strong { font-size: 1.05rem; }
`;

const Actions = styled.nav`
    display: flex;
    align-items: center;
    gap: 12px;
    a, button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 40px; padding: 9px 13px; border: 1px solid #2b4357; border-radius: 10px; background: transparent; color: #c6d3df; font: inherit; font-size: 0.8rem; text-decoration: none; cursor: pointer; transition: border-color 180ms ease, box-shadow 180ms ease, color 180ms ease; }
    a:hover, button:hover { border-color: #72e0bd; box-shadow: 0 0 16px rgba(114, 224, 189, 0.12); color: #72e0bd; }
    .menu-button { display: none; }
    .mobile-links { display: flex; gap: 12px; }
    @media (max-width: 620px) {
        .menu-button { display: inline-flex; }
        .github-link { display: none; }
        .mobile-links { position: absolute; top: 76px; left: 20px; right: 20px; display: ${({ open }) => open ? "grid" : "none"}; gap: 8px; padding: 12px; border: 1px solid #2b4357; border-radius: 14px; background: #0d1826; box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35); }
    }
`;

const SiteHeader = () => {
    const [open, setOpen] = useState(false);

    return (
        <Header>
            <Inner>
                <Brand href="#top" onClick={() => setOpen(false)}>
                    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ashish Ranjan logo" />
                    <span><small>React app</small><strong>JokesterX</strong></span>
                </Brand>
                <Actions open={open} aria-label="Primary navigation">
                    <div className="mobile-links">
                        <a href="#joke-generator" onClick={() => setOpen(false)}>Joke generator</a>
                        <a href="#about" onClick={() => setOpen(false)}>About</a>
                    </div>
                    <a className="github-link" href="https://github.com/a2rp/jokesterx" target="_blank" rel="noopener noreferrer" aria-label="Open JokesterX on GitHub"><FiGithub /> GitHub</a>
                    <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
                        {open ? <FiX /> : <FiMenu />}
                    </button>
                </Actions>
            </Inner>
        </Header>
    );
};

export default SiteHeader;
