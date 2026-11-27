import { useState } from "react";
import { FiLogOut, FiMenu, FiUsers, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import styles from "./styles.module.scss";

const Header = () => {
    const email = window.sessionStorage.getItem("email") || "";
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);
    const handleLogout = () => {
        ["token", "email", "role"].forEach((key) => window.sessionStorage.removeItem(key));
        window.location.assign(`${import.meta.env.BASE_URL.replace(/\/$/, "")}/login`);
    };

    return (
        <header className={styles.container}>
            <NavLink className={styles.brand} to="/home" onClick={closeMenu}>
                <img src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/logo.png`} alt="Ashish Ranjan logo" />
                <span><small>ADMIN WORKSPACE</small><strong>User Management</strong></span>
            </NavLink>
            <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`} aria-label="Main navigation">
                <NavLink className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`} to="/home" onClick={closeMenu}><FiUsers /> Users</NavLink>
                {!email && <NavLink className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`} to="/login" onClick={closeMenu}>Login</NavLink>}
                {email && <div className={styles.account}><span title={email}>{email}</span><button type="button" onClick={handleLogout}><FiLogOut /> Logout</button></div>}
            </nav>
            <button className={styles.menuButton} type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <FiX /> : <FiMenu />}</button>
        </header>
    );
};

export default Header;
