import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ScrollToTopButton from "./components/scrollToTopButton/ScrollToTopButton";
import Edit from "./pages/edit";
import Home from "./pages/home";
import Login from "./pages/login";
import Delete from "./pages/delete";
import styles from "./styles.module.scss";

function App() {
    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.contentContainer}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/edit" element={<Edit />} />
                    <Route path="/delete" element={<Delete />} />
                </Routes>
            </main>
            <Footer />
            <ScrollToTopButton />
        </div>
    );
}

export default App;