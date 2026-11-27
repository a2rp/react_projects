import { useEffect, useState } from "react";
import { FiLogIn } from "react-icons/fi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { api, hasAuthToken, setAuthToken } from "../../api";
import styles from "./styles.module.scss";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [inputs, setInputs] = useState({ username: "", password: "" });
    const [response, setResponse] = useState(location.state?.notice || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const username = inputs.username.trim().toLowerCase();
        if (!/^[a-z0-9_-]{3,15}$/.test(username) || !inputs.password) {
            setResponse("Enter a valid username and password.");
            return;
        }

        setLoading(true);
        setResponse("");
        try {
            const result = await api.post("/login", { username, password: inputs.password });
            if (!result.data.token) {
                setResponse("Sign in failed. Please try again.");
                return;
            }
            setAuthToken(result.data.token);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            setResponse(error.response?.data?.message || "Unable to sign in right now.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasAuthToken()) navigate("/dashboard", { replace: true });
    }, [navigate]);

    return (
        <section className={styles.container}>
            <form className={styles.formCard} onSubmit={handleSubmit}>
                <h1 className={styles.title}>Welcome back</h1>
                <p className={styles.subtitle}>Sign in to manage your shared files.</p>
                <div className={styles.field}>
                    <label htmlFor="username">Username</label>
                    <input className={styles.input} id="username" type="text" name="username" autoComplete="username" maxLength={15} placeholder="Enter username" onChange={(event) => setInputs((prev) => ({ ...prev, username: event.target.value }))} value={inputs.username} required />
                </div>
                <div className={styles.field}>
                    <label htmlFor="password">Password</label>
                    <input className={styles.input} id="password" type="password" name="password" autoComplete="current-password" maxLength={72} placeholder="Enter password" onChange={(event) => setInputs((prev) => ({ ...prev, password: event.target.value }))} value={inputs.password} required />
                </div>
                <div className={styles.response} role="status" aria-live="polite">{response}</div>
                <button className={styles.submitButton} type="submit" disabled={loading}><FiLogIn /> {loading ? "Signing in..." : "Sign in"}</button>
                <p className={styles.note}>New here? <NavLink to="/register">Create an account</NavLink></p>
            </form>
        </section>
    );
};

export default Login;
