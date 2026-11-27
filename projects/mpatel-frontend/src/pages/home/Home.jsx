import { Button } from "@chakra-ui/react";
import { useState } from "react";
import AddUser from "../../components/addUser/AddUser";
import DisplayAllUsers from "../../components/displayAllUsers/DisplayAllUsers";
import styles from "./styles.module.scss";

const Home = () => {
    const role = window.sessionStorage.getItem("role") || "";
    const [section, setSection] = useState("display-all-users");
    const canAdd = role === "administrator";
    const canView = role === "administrator" || role === "editor";
    return (
        <section className={styles.container}>
            <div className={styles.hero}>
                <span className={styles.kicker}>ADMIN WORKSPACE</span>
                <h1 className={styles.title}>Manage your user directory.</h1>
                <p className={styles.subtitle}>Review access, add team members and keep account details organised.</p>
                <div className={styles.actions}>
                    {canAdd && <Button colorScheme="blue" onClick={() => setSection("add-user")}>Add user</Button>}
                    {canView && <Button variant="outline" colorScheme="blue" onClick={() => setSection("display-all-users")}>View users</Button>}
                </div>
            </div>
            {canAdd && section === "add-user" && <AddUser />}
            {canView && section === "display-all-users" && <DisplayAllUsers />}
            {!canView && <p className={styles.notice}>Your account does not have permission to view the user directory.</p>}
        </section>
    );
};

export default Home;
