import { useEffect } from "react";
import { clearAuthToken } from "../../api";

const Logout = () => {
    useEffect(() => {
        clearAuthToken();
    }, []);

    return <div style={{ maxWidth: "600px", margin: "0 auto", color: "#c6d8e8" }}>You have signed out.</div>;
};

export default Logout;
