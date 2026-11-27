import { Button, FormControl, FormLabel, Heading, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import styles from "./styles.module.scss";

const Login = () => {
    const navigate = useNavigate();
    const [response, setResponse] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputs, setInputs] = useState({ email: "", password: "" });
    useEffect(() => { if (window.sessionStorage.getItem("token")) navigate("/home", { replace: true }); }, [navigate]);
    const handleInputChange = (event) => setInputs((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    const handleLoginSubmit = (event) => {
        event.preventDefault();
        setResponse("");
        setIsSubmitting(true);
        api.post("/login", inputs)
            .then(({ data }) => { setResponse(data.message || ""); if (data.success) { window.sessionStorage.setItem("token", data.token); window.sessionStorage.setItem("email", data.email); window.sessionStorage.setItem("role", data.role); navigate("/home", { replace: true }); } })
            .catch((error) => setResponse(error.response?.data?.message || "Unable to connect to the service."))
            .finally(() => setIsSubmitting(false));
    };
    return <section className={styles.container}><div className={styles.card}><span className={styles.kicker}>SECURE ACCESS</span><Heading size="lg" marginTop="10px">Welcome back</Heading><Text color="gray.500" marginTop="8px">Sign in to open your user management workspace.</Text><form onSubmit={handleLoginSubmit}><FormControl marginTop="24px"><FormLabel htmlFor="email">Email address</FormLabel><Input type="email" id="email" name="email" onChange={handleInputChange} required value={inputs.email} placeholder="you@example.com" /></FormControl><FormControl marginTop="18px"><FormLabel htmlFor="password">Password</FormLabel><Input type="password" id="password" name="password" onChange={handleInputChange} required value={inputs.password} placeholder="Your password" /></FormControl><Button marginTop="22px" colorScheme="blue" isLoading={isSubmitting} type="submit">Sign in</Button></form>{response && <Text marginTop="18px" color="red.400">{response}</Text>}</div></section>;
};

export default Login;
