import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Styled } from "./styled";
import { PRIVACY_LAST_UPDATED, privacySections } from "./insts/privacyContent";

import {
    FiShield,
    FiClock,
    FiLink,
    FiArrowUpRight,
    FiChevronUp,
} from "react-icons/fi";

export default function Privacy() {
    const toc = useMemo(() => {
        return privacySections.map((s) => ({
            id: s.id,
            title: s.title,
        }));
    }, []);

    const scrollTo = (id) => (e) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (!el) return;

        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
            top: y,
            behavior: "smooth",
        });
    };

    return (
        <Styled.Wrapper>
            <div className="container">
                <section className="hero">
                    <div className="kicker">
                        <FiShield />
                        <span>Privacy</span>
                    </div>

                    <h1 className="title">Privacy Policy</h1>

                    <div className="metaRow">
                        <span className="meta">
                            <FiClock />
                            <span>Last updated: {PRIVACY_LAST_UPDATED}</span>
                        </span>

                        <Link className="metaLink" to="/terms">
                            Terms <FiArrowUpRight />
                        </Link>
                    </div>

                    <p className="sub">
                        This page explains what the website does with form
                        entries and requests needed to display its content.
                    </p>
                </section>

                <section className="layout">
                    <aside className="side">
                        <div className="sideTitle">
                            <FiLink />
                            <span>On this page</span>
                        </div>

                        <div className="toc">
                            {toc.map((t) => (
                                <a
                                    key={t.id}
                                    href={`#${t.id}`}
                                    className="tocLink"
                                    onClick={scrollTo(t.id)}
                                >
                                    <span className="tocDot" />
                                    <span className="tocTxt">{t.title}</span>
                                </a>
                            ))}
                        </div>

                        <a
                            className="topBtn"
                            href="#top"
                            onClick={scrollTo("top")}
                        >
                            <FiChevronUp />
                            <span>Back to top</span>
                        </a>
                    </aside>

                    <div className="content">
                        <div id="top" />

                        {privacySections.map((s) => (
                            <article key={s.id} id={s.id} className="section">
                                <h2 className="h2">{s.title}</h2>

                                {s.body.map((p) => (
                                    <p key={p} className="p">
                                        {p}
                                    </p>
                                ))}
                            </article>
                        ))}

                        <div className="footerCard">
                            <div className="fcTitle">Questions about data?</div>
                            <div className="fcText">
                                Use the Contact page if you would like
                                clarification or request changes.
                            </div>

                            <div className="fcActions">
                                <Link className="btn primary" to="/contact">
                                    Contact <FiArrowUpRight />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </Styled.Wrapper>
    );
}
