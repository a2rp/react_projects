import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicDownloadUrl } from "../../api";

const DownloadFile = () => {
    const { id, code } = useParams();
    const [status, setStatus] = useState("Opening the secure download...");

    useEffect(() => {
        const shareCode = code || window.prompt("Enter the file's share code:", "");
        if (!shareCode) {
            setStatus("A share code is required to download this file.");
            return;
        }

        const downloadPath = `/api/file/url-download/${encodeURIComponent(id)}/${encodeURIComponent(shareCode.trim())}`;
        window.location.assign(getPublicDownloadUrl(downloadPath));
    }, [id, code]);

    return <div style={{ maxWidth: "600px", margin: "0 auto", color: "#c6d8e8" }}>{status}</div>;
};

export default DownloadFile;
