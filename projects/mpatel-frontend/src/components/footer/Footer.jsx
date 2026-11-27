import { FiCoffee, FiFacebook, FiGithub, FiGlobe, FiHeart, FiLinkedin, FiMail, FiStar, FiYoutube } from "react-icons/fi";
import { FaCodepen } from "react-icons/fa";
import styles from "./styles.module.scss";

const links = [
    ["Portfolio", "https://www.ashishranjan.net/", FiGlobe],
    ["GitHub", "https://github.com/a2rp", FiGithub],
    ["CodePen", "https://codepen.io/ash1198", FaCodepen],
    ["LinkedIn", "https://www.linkedin.com/in/aashishranjan", FiLinkedin],
    ["Facebook", "https://www.facebook.com/theash.ashish/", FiFacebook],
    ["YouTube", "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", FiYoutube],
    ["Email", "mailto:ash.ranjan09@gmail.com", FiMail],
];
const support = [
    ["Support", "https://a2rp-donation-page.netlify.app/", FiHeart],
    ["Buy Me a Coffee", "https://buymeacoffee.com/a2rp", FiCoffee],
    ["Patreon", "https://patreon.com/a2rp", FiStar],
];

function IconLinks({ items }) {
    return <div className={styles.links}>{items.map(([label, href, Icon]) => <a key={label} href={href} aria-label={label} title={label} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}><Icon /></a>)}</div>;
}

export default function Footer() {
    return <footer className={styles.footer}>
        <div className={styles.columns}>
            <div><span className={styles.label}>User management frontend</span><p>Clear tools for reviewing and maintaining a user directory.</p></div>
            <div><span className={styles.label}>Links</span><IconLinks items={links} /></div>
            <div><span className={styles.label}>Support</span><IconLinks items={support} /></div>
        </div>
        <div className={styles.bottom}>Copyright &copy; {new Date().getFullYear()} <a href="https://www.ashishranjan.net/" target="_blank" rel="noopener noreferrer">Ashish Ranjan</a></div>
    </footer>;
}