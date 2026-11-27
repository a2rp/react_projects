import JokesGenerator from "./components/JokesGenerator";
import ScrollToTop from "./components/ScrollToTop";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";

const App = () => (
    <div id="top">
        <SiteHeader />
        <div id="joke-generator"><JokesGenerator /></div>
        <div id="about"><SiteFooter /></div>
        <ScrollToTop />
    </div>
);

export default App;
