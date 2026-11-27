import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { createEmailDraftUrl } from "../../utils/emailDraft";
import { Styled } from "./styled";
import {
    FELLOWSHIPS_LAST_UPDATED,
    fellowshipPrograms,
} from "./insts/fellowshipsData";

import {
    FiUsers,
    FiClock,
    FiMapPin,
    FiCalendar,
    FiArrowUpRight,
    FiCheckCircle,
} from "react-icons/fi";

export default function Fellowships() {
    const programs = useMemo(() => fellowshipPrograms, []);

    return (
        <Styled.Wrapper>
            <div className="container">
                <section className="hero">
                    <div className="kicker">
                        <FiUsers />
                        <span>Fellowships</span>
                    </div>

                    <h1 className="title">
                        Structured programs for long-term builders.
                    </h1>

                    <div className="metaRow">
                        <span className="meta">
                            <FiCalendar />
                            <span>
                                Last updated: {FELLOWSHIPS_LAST_UPDATED}
                            </span>
                        </span>
                    </div>

                    <p className="sub">
                        Our fellowships support practitioners committed to
                        disciplined execution, institutional thinking, and
                        long-term impact.
                    </p>
                </section>

                <section className="grid">
                    {programs.map((p) => (
                        <article key={p.id} className="card">
                            <div className="cardHead">
                                <div className="badge">{p.cohort}</div>
                                <h2 className="cardTitle">{p.title}</h2>
                            </div>

                            <p className="summary">{p.summary}</p>

                            <div className="details">
                                <div className="detail">
                                    <FiClock />
                                    <span>{p.duration}</span>
                                </div>

                                <div className="detail">
                                    <FiMapPin />
                                    <span>{p.mode}</span>
                                </div>
                            </div>

                            <div className="actions">
                                <a
                                    href={createEmailDraftUrl(
                                        `Fellowship inquiry: ${p.title}`,
                                        `I'd like more information about the ${p.title}.`,
                                    )}
                                    className="btn primary"
                                >
                                    Ask about this fellowship <FiArrowUpRight />
                                </a>
                            </div>
                        </article>
                    ))}
                </section>

                <section className="info">
                    <div className="infoCard">
                        <div className="infoTitle">
                            <FiCheckCircle />
                            <span>Selection Principles</span>
                        </div>

                        <ul className="infoList">
                            <li>Evidence of execution, not only ideas</li>
                            <li>Clear understanding of constraints</li>
                            <li>Commitment to long-term institutional work</li>
                            <li>Ability to work across systems</li>
                        </ul>

                        <Link to="/contact" className="btn ghost">
                            Inquire <FiArrowUpRight />
                        </Link>
                    </div>
                </section>
            </div>
        </Styled.Wrapper>
    );
}
