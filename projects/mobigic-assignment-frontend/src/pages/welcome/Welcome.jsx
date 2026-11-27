import { FiLock, FiShare2, FiUploadCloud } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import styles from "./styles.module.scss";

const Welcome = () => (
    <section className={styles.container}>
        <div className={styles.hero}>
            <span className={styles.eyebrow}><FiLock /> Private file storage</span>
            <h1 className={styles.title}>Your files. Your links. Your choice.</h1>
            <p className={styles.subtitle}>Upload images and PDFs to your private workspace, then share an individual download link when you are ready.</p>
            <div className={styles.actions}>
                <NavLink className={styles.primaryAction} to="/register">Create an account</NavLink>
                <NavLink className={styles.secondaryAction} to="/login">Sign in</NavLink>
            </div>
        </div>
        <div className={styles.features}>
            <article><FiUploadCloud /><h2>Upload privately</h2><p>Your dashboard lists only files attached to your account.</p></article>
            <article><FiShare2 /><h2>Share one file</h2><p>Each upload gets a long random download link you can copy and send.</p></article>
            <article><FiLock /><h2>Control access</h2><p>Delete a file from your dashboard to disable its download link.</p></article>
        </div>
    </section>
);

export default Welcome;
