import { Button, FormControl, FormLabel, Input, Select, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";

const EditUser = () => {
    const { state } = useLocation();
    const email = state?.email || "";
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({ name: "", email, role: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    useEffect(() => {
        if (!email) { navigate("/home", { replace: true }); return; }
        api.post("/user", { email }).then(({ data }) => setInputs({ name: data.name || "", email: data.email || email, role: data.role || "" })).catch(() => setMessage("Unable to load this user."));
    }, [email, navigate]);
    const handleChange = (event) => setInputs((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!inputs.role) { setMessage("Select a role before saving."); return; }
        setMessage("");
        setIsSubmitting(true);
        api.patch("/user-update", inputs).then(({ data }) => { if (data.success) navigate("/home"); else setMessage(data.message || "Unable to update this user."); }).catch(() => setMessage("Unable to connect to the service.")).finally(() => setIsSubmitting(false));
    };
    return <section className="formPage"><div className="formCard"><span className="eyebrow">USER DIRECTORY</span><h1 className="pageTitle">Update user</h1><p className="pageIntro">Change the name or role for this account.</p><form onSubmit={handleSubmit}><FormControl marginTop="24px"><FormLabel htmlFor="name">Name</FormLabel><Input id="name" name="name" onChange={handleChange} required value={inputs.name} placeholder="Full name" /></FormControl><FormControl marginTop="18px"><FormLabel htmlFor="role">Role</FormLabel><Select id="role" name="role" onChange={handleChange} value={inputs.role} placeholder="Select role"><option value="administrator">Administrator</option><option value="viewer">Viewer</option><option value="editor">Editor</option></Select></FormControl><div className="formActions"><Button colorScheme="blue" isLoading={isSubmitting} type="submit">Save changes</Button><Button variant="outline" onClick={() => navigate("/home")} type="button">Cancel</Button></div></form>{message && <Text marginTop="18px" color="red.400">{message}</Text>}</div></section>;
};

export default EditUser;
