import { Button, Input, InputGroup, InputLeftElement, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiRefreshCw, FiSearch, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const DisplayAllUsers = () => {
    const navigate = useNavigate();
    const userEmail = window.sessionStorage.getItem("email") || "";
    const role = window.sessionStorage.getItem("role") || "";
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const canEdit = role === "administrator" || role === "editor";
    const canDelete = role === "administrator";
    const loadUsers = useCallback(() => {
        api.get("/user-all")
            .then(({ data }) => {
                setUsers(Array.isArray(data) ? data : []);
                setMessage("");
            })
            .catch(() => setMessage("Unable to load users. Check that the service is running."));
    }, []);
    useEffect(() => {
        if (!userEmail) navigate("/login", { replace: true });
        else loadUsers();
    }, [userEmail, navigate, loadUsers]);
    const visibleUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return users;
        return users.filter((user) => [user.name, user.userid, user.role, user.email].some((value) => String(value || "").toLowerCase().includes(query)));
    }, [search, users]);
    return <section className="usersSection"><div className="sectionHeading"><div><span className="eyebrow">DIRECTORY</span><h2 className="sectionTitle">All users <span>{users.length}</span></h2><p className="sectionText">Search accounts and manage access according to your role.</p></div><Button variant="outline" colorScheme="blue" onClick={loadUsers}><FiRefreshCw />&nbsp; Refresh</Button></div><InputGroup className="userSearch"><InputLeftElement pointerEvents="none"><FiSearch color="#5d84a5" /></InputLeftElement><Input name="search" placeholder="Search by name, email, ID or role" onChange={(event) => setSearch(event.target.value)} value={search} /></InputGroup>{message && <Text color="red.300" marginTop="16px">{message}</Text>}<TableContainer className="userTableWrap"><Table variant="simple"><Thead><Tr><Th>User ID</Th><Th>Name</Th><Th>Email</Th><Th>Role</Th><Th textAlign="right">Actions</Th></Tr></Thead><Tbody>{visibleUsers.map((user) => <Tr key={user.userid || user.email}><Td>{user.userid}</Td><Td fontWeight="700">{user.name}</Td><Td>{user.email}</Td><Td><span className="roleBadge">{user.role}</span></Td><Td><div className="tableActions">{user.email !== userEmail && canEdit && <Button size="sm" variant="outline" colorScheme="blue" onClick={() => navigate("/edit", { replace: true, state: { email: user.email } })}><FiEdit2 />&nbsp; Edit</Button>}{user.email !== userEmail && canDelete && <Button size="sm" variant="outline" colorScheme="red" onClick={() => navigate("/delete", { replace: true, state: { email: user.email } })}><FiTrash2 />&nbsp; Delete</Button>}</div></Td></Tr>)}{visibleUsers.length === 0 && <Tr><Td colSpan={5}><div className="emptyState">No users match this search.</div></Td></Tr>}</Tbody></Table></TableContainer></section>;
};

export default DisplayAllUsers;
