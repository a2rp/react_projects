import {
    FiCode,
    FiCoffee,
    FiFacebook,
    FiGithub,
    FiGlobe,
    FiHeart,
    FiLinkedin,
    FiMail,
    FiStar,
    FiYoutube,
} from "react-icons/fi";

import { Styled } from "./styled";

const footerLinks = [
    {
        label: "Portfolio",
        href: "https://www.ashishranjan.net/",
        icon: FiGlobe,
    },
    { label: "GitHub", href: "https://github.com/a2rp", icon: FiGithub },
    { label: "CodePen", href: "https://codepen.io/ash1198", icon: FiCode },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/aashishranjan",
        icon: FiLinkedin,
    },
    {
        label: "Facebook",
        href: "https://www.facebook.com/theash.ashish/",
        icon: FiFacebook,
    },
    {
        label: "YouTube",
        href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1",
        icon: FiYoutube,
    },
    {
        label: "Support",
        href: "https://a2rp-donation-page.netlify.app/",
        icon: FiHeart,
    },
    {
        label: "Buy Me a Coffee",
        href: "https://buymeacoffee.com/a2rp",
        icon: FiCoffee,
    },
    { label: "Patreon", href: "https://patreon.com/a2rp", icon: FiStar },
    {
        label: "Email",
        href: "mailto:ash.ranjan09@gmail.com",
        icon: FiMail,
    },
];

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Styled.Wrapper>
            <div className="content">
                <div className="brand">
                    <div className="brandIcon" aria-hidden="true">
                        AP
                    </div>

                    <div className="brandText">
                        <strong>Assignment Planner</strong>

                        <p>Plan work, track deadlines, and stay organized.</p>
                    </div>
                </div>

                <nav className="links" aria-label="Footer links">
                    {footerLinks.map(({ label, href, icon: Icon }) => (
                        <a
                            href={href}
                            key={label}
                            target={href.startsWith("mailto:") ? undefined : "_blank"}
                            rel={
                                href.startsWith("mailto:")
                                    ? undefined
                                    : "noopener noreferrer"
                            }
                            aria-label={label}
                            title={label}
                        >
                            <Icon aria-hidden="true" />
                            <span className="visuallyHidden">{label}</span>
                        </a>
                    ))}
                </nav>
            </div>

            <div className="bottom">
                <p>
                    Copyright &copy; {currentYear}{" "}
                    <a
                        href="https://www.ashishranjan.net/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Ashish Ranjan
                    </a>
                </p>
            </div>
        </Styled.Wrapper>
    );
};

export default Footer;
