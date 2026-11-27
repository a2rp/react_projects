import { useEffect, useState } from "react";
import styles from "./App.module.css";
import SiteHeader from "./components/siteHeader";
import SiteFooter from "./components/siteFooter";
import BackToTop from "./components/backToTop";
import NetWorthDashboard from "./components/netWorthDashboard";

const repository = "https://github.com/a2rp/react_projects/tree/main/projects/personal-net-worth-dashboard";
const App = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);
    useEffect(() => {
        const onScroll = () => setShowBackToTop(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return <div className={styles["app-shell"]} id="top">
        <SiteHeader title="Meridian" mark="M" navItems={[["Overview", "#workspace"], ["Accounts", "#accounts"], ["Add entry", "#add"]]} repoUrl={repository} />
        <main className={styles["page-content"]}><NetWorthDashboard /></main>
        <SiteFooter repoUrl={repository} />
        <BackToTop visible={showBackToTop} />
    </div>;
};
export default App;
