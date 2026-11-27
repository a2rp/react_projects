import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";

const Delete = () => {
    const email = useLocation().state?.email || "";
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [message, setMessage] = useState("");
    const cancelRef = useRef();
    const onClose = () => { setIsOpen(false); navigate("/home"); };
    const deleteUser = () => { api.delete(`/user-delete/${encodeURIComponent(email)}`).then(() => navigate("/home")).catch(() => setMessage("Unable to delete this user.")); };
    if (!email) return null;
    return <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}><AlertDialogOverlay><AlertDialogContent><AlertDialogHeader fontSize="lg" fontWeight="bold">Delete user</AlertDialogHeader><AlertDialogBody>Are you sure you want to remove this account? This action cannot be undone.{message && <div style={{ color: "#e53e3e", marginTop: "12px" }}>{message}</div>}</AlertDialogBody><AlertDialogFooter><Button ref={cancelRef} onClick={onClose}>Cancel</Button><Button colorScheme="red" onClick={deleteUser} ml={3}>Delete user</Button></AlertDialogFooter></AlertDialogContent></AlertDialogOverlay></AlertDialog>;
};

export default Delete;
