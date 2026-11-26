// App.jsx
import React, { useEffect, useRef, useState } from "react";
import { Styled } from "./App.styled";
import Header from "./components/header";
import Footer from "./components/footer";
import About from "./components/about";
import ExecutionContext from "./topics/executionContext";
import CallStack from "./topics/callStack";
import EventLoop from "./topics/eventLoop";
import MicrotaskVsMacrotask from "./topics/microtaskVsMacrotask";
import Closures from "./topics/closures";
import Prototypes from "./topics/prototypes";
import ThisKeyword from "./topics/thisKeyword";
import MemoryManagement from "./topics/memoryManagement";
import GarbageCollection from "./topics/garbageCollection";
import AsyncPatterns from "./topics/asyncPatterns";
import Promises from "./topics/promises";
import Generators from "./topics/generators";
import Es6PlusFeatures from "./topics/es6PlusFeatures";

const App = () => {
    const mainRef = useRef(null);
    const [showGoToTop, setShowGoToTop] = useState(false);

    useEffect(() => {
        const main = mainRef.current;
        if (!main) return undefined;
        const handleScroll = () => setShowGoToTop(main.scrollTop > 280);
        main.addEventListener("scroll", handleScroll, { passive: true });
        return () => main.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Styled.Wrapper>
            <Styled.Header>
                <Header />
            </Styled.Header>
            <Styled.Main ref={mainRef}>
                <div className="contentWrapper">
                    <About />

                    <ExecutionContext />
                    <CallStack />
                    <EventLoop />
                    <MicrotaskVsMacrotask />
                    <Closures />
                    <Prototypes />
                    <ThisKeyword />
                    <MemoryManagement />
                    <GarbageCollection />
                    <AsyncPatterns />
                    <Promises />
                    <Generators />
                    <Es6PlusFeatures />
                </div>

                <div className="footerWrapper">
                    <Footer />
                </div>

                {showGoToTop && (
                    <button
                        className="goToTop"
                        type="button"
                        onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
                        aria-label="Scroll to top"
                        title="Scroll to top"
                    >
                        ↑
                    </button>
                )}
            </Styled.Main>
        </Styled.Wrapper>
    );
};

export default App;
