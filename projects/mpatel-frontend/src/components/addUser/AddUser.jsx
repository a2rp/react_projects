import { Button, FormControl, FormLabel, Input, Select, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const AddUser = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [inputs, setInputs] = useState({ name: "", email: "", password: "", password_confirm: "", role: "" });
    useEffect(() => { if (window.sessionStorage.getItem("role") !== "administrator") navigate("/home", { replace: true }); }, [navigate]);
    const handleChange = (event) => setInputs((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!inputs.role) { setMessage("Select a role before submitting."); return; }
        setMessage("");
        setIsSubmitting(true);
        api.post("/user-add", inputs).then(({ data }) => { if (data.success) window.location.reload(); else setMessage(data.message || "Unable to add this user."); }).catch(() => setMessage("Unable to connect to the service.")).finally(() => setIsSubmitting(false));
    };
    return <section className="formPage"><div className="formCard"><span className="eyebrow">USER DIRECTORY</span><h2 className="pageTitle">Add a user</h2><p className="pageIntro">Create an account and assign the right access level.</p><form onSubmit={handleSubmit}><FormControl marginTop="24px"><FormLabel htmlFor="name">Name</FormLabel><Input id="name" name="name" onChange={handleChange} required value={inputs.name} placeholder="Full name" /></FormControl><FormControl marginTop="18px"><FormLabel htmlFor="email">Email address</FormLabel><Input id="email" name="email" type="email" onChange={handleChange} required value={inputs.email} placeholder="you@example.com" /></FormControl><FormControl marginTop="18px"><FormLabel htmlFor="password">Password</FormLabel><Input id="password" name="password" type="password" onChange={handleChange} required value={inputs.password} placeholder="Password" /></FormControl><FormControl marginTop="18px"><FormLabel htmlFor="password_confirm">Confirm password</FormLabel><Input id="password_confirm" name="password_confirm" type="password" onChange={handleChange} required value={inputs.password_confirm} placeholder="Confirm password" /></FormControl><FormControl marginTop="18px"><FormLabel htmlFor="role">Role</FormLabel><Select id="role" name="role" onChange={handleChange} value={inputs.role} placeholder="Select role"><option value="administrator">Administrator</option><option value="viewer">Viewer</option><option value="editor">Editor</option></Select></FormControl><div className="formActions"><Button colorScheme="blue" isLoading={isSubmitting} type="submit">Create user</Button><Button variant="outline" type="button" onClick={() => window.location.reload()}>Cancel</Button></div></form>{message && <Text marginTop="18px" color="red.400">{message}</Text>}</div></section>;
};

export default AddUser;
