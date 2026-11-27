import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import styled from "styled-components";

const Button = styled.button`
    position: fixed;
    right: 22px;
    bottom: 22px;
    z-index: 15;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid #36516a;
    border-radius: 50%;
    background: #0d1826;
    color: #72e0bd;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
    transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
    &:hover { border-color: #72e0bd; box-shadow: 0 0 20px rgba(114, 224, 189, 0.2); transform: translateY(-3px); }
`;

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 320);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    return <Button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Go to top"><FiArrowUp /></Button>;
};

export default ScrollToTop;
