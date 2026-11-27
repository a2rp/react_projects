import { useEffect, useMemo, useState } from "react";
import {
  FaChartBar,
  FaCode,
  FaCoffee,
  FaFacebook,
  FaGithub,
  FaHeart,
  FaLinkedin,
  FaMailBulk,
  FaPatreon,
  FaYoutube,
} from "react-icons/fa";
import { FiArrowUp, FiBookOpen, FiDatabase, FiMenu, FiX } from "react-icons/fi";
import styles from "./App.module.scss";
import { wineDataSet } from "./files/wineDataSet";

const mean = (values) => values.reduce((total, value) => total + value, 0) / values.length;

const median = (values) => {
  const sortedValues = [...values].sort((first, second) => first - second);
  const middle = Math.floor(sortedValues.length / 2);
  return sortedValues.length % 2 === 0
    ? (sortedValues[middle - 1] + sortedValues[middle]) / 2
    : sortedValues[middle];
};

const mode = (values) => {
  const counts = new Map();
  let mostCommon = values[0];
  let highestCount = 0;

  values.forEach((value) => {
    const count = (counts.get(value) || 0) + 1;
    counts.set(value, count);
    if (count > highestCount) {
      mostCommon = value;
      highestCount = count;
    }
  });

  return mostCommon;
};

const summarize = (values) => ({
  mean: mean(values).toFixed(3),
  median: median(values).toFixed(3),
  mode: mode(values).toFixed(3),
});

const footerLinks = [
  { label: "Portfolio", href: "https://www.ashishranjan.net/", icon: FaCode },
  { label: "GitHub", href: "https://github.com/a2rp", icon: FaGithub },
  { label: "CodePen", href: "https://codepen.io/ash1198", icon: FaCode },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", icon: FaLinkedin },
  { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", icon: FaFacebook },
  { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", icon: FaYoutube },
  { label: "Email", href: "mailto:ash.ranjan09@gmail.com", icon: FaMailBulk },
  { label: "Support", href: "https://a2rp-donation-page.netlify.app/", icon: FaHeart },
  { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/a2rp", icon: FaCoffee },
  { label: "Patreon", href: "https://patreon.com/a2rp", icon: FaPatreon },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  const statistics = useMemo(() => {
    const groups = wineDataSet.reduce((result, row) => {
      const currentRows = result[row.Class] || [];
      currentRows.push(row);
      result[row.Class] = currentRows;
      return result;
    }, {});

    return Object.entries(groups)
      .sort(([first], [second]) => Number(first) - Number(second))
      .map(([wineClass, rows]) => ({
        wineClass,
        sampleCount: rows.length,
        flavanoids: summarize(rows.map((row) => Number(row.Flavanoids))),
        gamma: summarize(rows.map((row) => (Number(row.Ash) * Number(row.Hue)) / Number(row.Magnesium))),
      }));
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowTopButton(window.scrollY > 280);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <a className={styles.brand} href="#top" onClick={closeMobileMenu} aria-label="Wine data notebook home">
          <img src={process.env.PUBLIC_URL + "/logo.png"} alt="Ashish Ranjan logo" />
          <span><small>Notebook / 01</small><strong>Wine Data Notes</strong></span>
        </a>

        <button className={styles.menuButton} type="button" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-controls="main-navigation" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}>
          {mobileMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>

        <nav id="main-navigation" className={styles.navigation + (mobileMenuOpen ? " " + styles.navigationOpen : "")} aria-label="Main navigation">
          <a href="#overview" onClick={closeMobileMenu}><FiDatabase aria-hidden="true" /> Overview</a>
          <a href="#tables" onClick={closeMobileMenu}><FaChartBar aria-hidden="true" /> Tables</a>
          <a href="https://github.com/a2rp/react_projects/tree/main/projects/manufac-yarn-refactored-code" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu}><FaGithub aria-hidden="true" /> Source</a>
        </nav>
      </header>

      <main id="top">
        <section id="overview" className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>A compact data notebook</p>
            <h1>Read the shape of a wine dataset.</h1>
            <p className={styles.intro}>
              A focused JavaScript view of flavanoids and derived gamma values,
              summarized across the dataset's wine classes.
            </p>
            <a className={styles.heroLink} href="#tables"><FaChartBar aria-hidden="true" /> Open the comparison tables</a>
          </div>
          <div className={styles.heroVisual}>
            <img src={process.env.PUBLIC_URL + "/preview.png"} alt="Wine data statistics preview" />
            <div className={styles.visualNote}><FiDatabase aria-hidden="true" /> Local dataset</div>
          </div>
        </section>

        <section className={styles.overviewStrip} aria-label="Dataset overview">
          <div><span>Records</span><strong>{wineDataSet.length}</strong></div>
          <div><span>Wine classes</span><strong>{statistics.length}</strong></div>
          <div><span>Metrics</span><strong>6</strong></div>
        </section>

        <section id="tables" className={styles.tableSection} aria-labelledby="tables-title">
          <div className={styles.headingRow}>
            <div><p className={styles.eyebrow}>The numbers</p><h2 id="tables-title">Class-by-class comparison</h2></div>
            <p>Mean, median and mode are calculated independently for each wine class.</p>
          </div>

          <div className={styles.tableGrid}>
            {["flavanoids", "gamma"].map((metric) => (
              <article className={styles.tableCard} key={metric}>
                <div className={styles.tableCardTitle}><FaChartBar aria-hidden="true" /><h3>{metric[0].toUpperCase() + metric.slice(1)}</h3></div>
                <div className={styles.tableScroll}>
                  <table>
                    <thead><tr><th>Measure</th>{statistics.map(({ wineClass }) => <th key={wineClass}>Class {wineClass}</th>)}</tr></thead>
                    <tbody>
                      {["mean", "median", "mode"].map((measure) => (
                        <tr key={measure}><th scope="row">{measure[0].toUpperCase() + measure.slice(1)}</th>{statistics.map((item) => <td key={item.wineClass}>{item[metric][measure]}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.noteSection} aria-labelledby="note-title">
          <div className={styles.noteIcon}><FiBookOpen aria-hidden="true" /></div>
          <div><p className={styles.eyebrow}>Reading the result</p><h2 id="note-title">A quick reference for the next experiment.</h2><p>Use these summaries as a starting point for charting, filtering or comparing more properties from the same dataset.</p></div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div><p className={styles.eyebrow}>Keep learning</p><p className={styles.footerText}>Small datasets are a good place to practice clear data views.</p></div>
          <nav className={styles.socialLinks} aria-label="Social and support links">
            {footerLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><Icon aria-hidden="true" /><span className={styles.srOnly}>{label}</span></a>)}
          </nav>
        </div>
        <div className={styles.footerBottom}>Copyright © {new Date().getFullYear()} <a href="https://www.ashishranjan.net" target="_blank" rel="noopener noreferrer">Ashish Ranjan</a></div>
      </footer>

      <button className={styles.topButton + " " + (showTopButton ? styles.topButtonVisible : "")} type="button" onClick={scrollToTop} aria-label="Go to top"><FiArrowUp aria-hidden="true" /></button>
    </div>
  );
}

export default App;
