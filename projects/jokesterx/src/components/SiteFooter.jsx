import { createElement } from "react";
import { FiCoffee, FiCode, FiFacebook, FiGithub, FiHeart, FiLinkedin, FiMail, FiMessageCircle, FiYoutube } from "react-icons/fi";
import styled from "styled-components";

const links = [
    ["Portfolio", "https://www.ashishranjan.net/", FiCode],
    ["GitHub", "https://github.com/a2rp", FiGithub],
    ["CodePen", "https://codepen.io/ash1198", FiCode],
    ["LinkedIn", "https://www.linkedin.com/in/aashishranjan", FiLinkedin],
    ["Facebook", "https://www.facebook.com/theash.ashish/", FiFacebook],
    ["YouTube", "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", FiYoutube],
    ["Email", "mailto:ash.ranjan09@gmail.com", FiMail],
    ["Support", "https://a2rp-donation-page.netlify.app/", FiHeart],
    ["Buy Me a Coffee", "https://buymeacoffee.com/a2rp", FiCoffee],
    ["Patreon", "https://www.patreon.com/a2rp", FiMessageCircle],
];

const Footer = styled.footer`
    width: min(1180px, calc(100% - 40px));
    margin: 0 auto;
    padding: 26px 0 34px;
    border-top: 1px solid #1b2a39;
    color: #8093a5;
    .footer-row { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
    p { font-size: 0.8rem; }
    p a { color: #f7fbff; font-weight: 700; text-decoration: none; }
    p a:hover { color: #72e0bd; }
    .icons { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
    .icons a { display: grid; place-items: center; width: 34px; height: 34px; border: 1px solid #2b4357; border-radius: 9px; color: #9eb0c0; transition: border-color 180ms ease, box-shadow 180ms ease, color 180ms ease; }
    .icons a:hover { border-color: #72e0bd; box-shadow: 0 0 14px rgba(114, 224, 189, 0.12); color: #72e0bd; }
    @media (max-width: 700px) { .footer-row { align-items: flex-start; flex-direction: column; } .icons { justify-content: flex-start; } }
`;

const SiteFooter = () => (
    <Footer>
        <div className="footer-row">
            <p>Copyright &copy; {new Date().getFullYear()} <a href="https://www.ashishranjan.net/" target="_blank" rel="noopener noreferrer">Ashish Ranjan</a></p>
            <div className="icons" aria-label="Social and support links">
                {links.map(([label, href, icon]) => (
                    <a key={label} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"} aria-label={label} title={label}>{createElement(icon, { "aria-hidden": true })}</a>
                ))}
            </div>
        </div>
    </Footer>
);

export default SiteFooter;
