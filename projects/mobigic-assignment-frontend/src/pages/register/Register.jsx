import { useEffect, useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { api, hasAuthToken } from "../../api";
import styles from "./styles.module.scss";

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [inputs, setInputs] = useState({ username: "", password: "", confirmPassword: "" });
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const username = inputs.username.trim().toLowerCase();
        if (!/^[a-z0-9_-]{3,15}$/.test(username)) {
            setResponse("Use 3-15 lowercase letters, numbers, underscores, or hyphens for your username.");
            return;
        }
        const passwordBytes = new TextEncoder().encode(inputs.password).length;
        if (inputs.password.length < 12 || passwordBytes > 72) {
            setResponse("Use a password of at least 12 characters and no more than 72 bytes.");
            return;
        }
        if (inputs.password !== inputs.confirmPassword) {
            setResponse("Passwords do not match.");
            return;
        }

        setLoading(true);
        setResponse("");
        try {
            const result = await api.post("/register", { ...inputs, username });
            navigate("/login", { state: { notice: result.data.message } });
        } catch (error) {
            setResponse(error.response?.data?.message || "Unable to create your account right now.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasAuthToken()) navigate("/dashboard", { replace: true });
    }, [location.pathname, navigate]);

    return (
        <section className={styles.container}>
            <form className={styles.formCard} onSubmit={handleSubmit}>
                <h1 className={styles.title}>Create an account</h1>
                <p className={styles.subtitle}>Start sharing files from one simple workspace.</p>
                <div className={styles.field}>
                    <label htmlFor="username">Username</label>
                    <input className={styles.input} id="username" type="text" name="username" autoComplete="username" minLength={3} maxLength={15} placeholder="Choose username" onChange={(event) => setInputs((prev) => ({ ...prev, username: event.target.value }))} value={inputs.username} required />
                </div>
                <div className={styles.field}>
                    <label htmlFor="password">Password</label>
                    <input className={styles.input} id="password" type="password" name="password" autoComplete="new-password" minLength={12} maxLength={72} placeholder="At least 12 characters" onChange={(event) => setInputs((prev) => ({ ...prev, password: event.target.value }))} value={inputs.password} required />
                </div>
                <div className={styles.field}>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input className={styles.input} id="confirmPassword" type="password" name="confirmPassword" autoComplete="new-password" minLength={12} maxLength={72} placeholder="Repeat password" onChange={(event) => setInputs((prev) => ({ ...prev, confirmPassword: event.target.value }))} value={inputs.confirmPassword} required />
                </div>
                <div className={styles.response} role="alert" aria-live="polite">{response}</div>
                <button className={styles.submitButton} type="submit" disabled={loading}><FiUserPlus /> {loading ? "Creating..." : "Create account"}</button>
                <p className={styles.note}>Already registered? <NavLink to="/login">Sign in</NavLink></p>
            </form>
        </section>
    );
};

export default Register;
