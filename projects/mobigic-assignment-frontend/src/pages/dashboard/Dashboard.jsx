import { useEffect, useRef, useState } from "react";
import { FiCopy, FiDownload, FiTrash2, FiUpload, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { api, getPublicDownloadUrl, hasAuthToken } from "../../api";
import styles from "./styles.module.scss";

const Dashboard = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [user, setUser] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        let active = true;
        if (!hasAuthToken()) {
            navigate("/login", { replace: true });
            return undefined;
        }

        api.post("/user")
            .then((response) => { if (active) setUser(response.data.user); })
            .catch(() => { if (active) navigate("/login", { replace: true }); });
        return () => { active = false; };
    }, [navigate]);

    useEffect(() => {
        let active = true;
        if (!user) return undefined;

        setLoading(true);
        api.post("/file/files")
            .then((response) => { if (active) setFiles(response.data.files || []); })
            .catch((error) => {
                if (active) setMessage(error.response?.data?.message || "Unable to load your files.");
            })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [user]);

    const uploadFile = async (event) => {
        event.preventDefault();
        const selectedFile = fileInputRef.current?.files?.[0];
        if (!selectedFile) {
            setMessage("Choose a JPEG, PNG, or PDF file first.");
            return;
        }

        setUploading(true);
        setMessage("");
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            const response = await api.post("/file/upload", formData);
            setFiles((currentFiles) => [response.data.file, ...currentFiles]);
            setMessage("File uploaded. Copy its download link to share it.");
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            setMessage(error.response?.data?.message || "Unable to upload this file.");
        } finally {
            setUploading(false);
        }
    };

    const deleteFile = async (file) => {
        if (!window.confirm(`Delete ${file.name}? Anyone with its share link will lose access.`)) return;
        setMessage("");
        try {
            await api.post(`/file/delete/${encodeURIComponent(file.id)}`);
            setFiles((currentFiles) => currentFiles.filter((item) => item.id !== file.id));
            setMessage("File deleted.");
        } catch (error) {
            setMessage(error.response?.data?.message || "Unable to delete this file.");
        }
    };

    const copyShareLink = async (file) => {
        const url = getPublicDownloadUrl(file.downloadPath);
        try {
            await navigator.clipboard.writeText(url);
            setMessage("Download link copied to clipboard.");
        } catch {
            setMessage(url);
        }
    };

    if (!user) return <section className={styles.container}><div className={styles.empty}>Loading your account...</div></section>;

    return (
        <section className={styles.container}>
            <div className={styles.userContent}>
                <div className={styles.greeting}><FiUser /> Hi, {user.username}</div>
                <p className={styles.intro}>Your files are private. Share a download link only with people who should have access.</p>
                <hr className={styles.divider} />
                <form className={styles.uploadFile} onSubmit={uploadFile}>
                    <input className={styles.fileInput} type="file" ref={fileInputRef} accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" aria-label="Choose a JPEG, PNG, or PDF file" />
                    <button className={styles.uploadSubmit} type="submit" disabled={uploading}><FiUpload /> {uploading ? "Uploading..." : "Upload file"}</button>
                </form>
                {message && <p className={styles.message} role="status" aria-live="polite">{message}</p>}
                <div className={styles.files}>
                    {loading ? <div className={styles.empty}>Loading your files...</div> : files.length === 0 ? <div className={styles.empty}>No files uploaded yet.</div> : (
                        <table>
                            <thead><tr><th>File name</th><th>Share code</th><th>Actions</th></tr></thead>
                            <tbody>{files.map((file) => (
                                <tr key={file.id}>
                                    <td>{file.name}</td>
                                    <td><code>{file.shareCode}</code></td>
                                    <td className={styles.fileActions}>
                                        <a className={styles.download} href={getPublicDownloadUrl(file.downloadPath)}><FiDownload /> Download</a>
                                        <button className={styles.share} type="button" onClick={() => copyShareLink(file)}><FiCopy /> Copy link</button>
                                        <button className={styles.delete} type="button" onClick={() => deleteFile(file)}><FiTrash2 /> Delete</button>
                                    </td>
                                </tr>
                            ))}</tbody>
                        </table>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
