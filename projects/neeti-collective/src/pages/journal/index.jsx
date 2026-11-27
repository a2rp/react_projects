import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Styled } from "./styled";
import { journalData } from "../journalDetail/insts/journalData";
import { FiArrowUpRight, FiLoader } from "react-icons/fi";

function ImageWithLoader({ src, alt }) {
    const [status, setStatus] = useState("loading");

    return (
        <div className="imgFrame">
            {status === "loading" && (
                <div className="imgLoader">
                    <FiLoader />
                </div>
            )}

            <img
                src={src}
                alt={alt}
                className="img"
                loading="lazy"
                onLoad={() => setStatus("loaded")}
                onError={() => setStatus("error")}
            />
        </div>
    );
}

export default function Journal() {
    const posts = useMemo(
        () =>
            journalData.map((post) => ({
                ...post,
                excerpt: post.subtitle,
                image: post.heroImg,
                tag: post.category,
            })),
        [],
    );

    return (
        <Styled.Wrapper>
            <div className="container">
                <section className="hero">
                    <div className="kicker">Journal</div>
                    <h1 className="title">
                        Ideas, field notes, and internal thinking.
                    </h1>
                    <p className="sub">
                        We write about systems, execution, capital discipline,
                        and what actually moves outcomes in real environments.
                    </p>
                </section>

                <section className="grid">
                    {posts.map((post) => (
                        <article key={post.slug} className="card">
                            <ImageWithLoader
                                src={post.image}
                                alt={post.title}
                            />

                            <div className="content">
                                <div className="meta">
                                    <span className="tag">{post.tag}</span>
                                    <span className="date">{post.date}</span>
                                </div>

                                <h2 className="cardTitle">{post.title}</h2>

                                <p className="excerpt">{post.excerpt}</p>

                                <Link
                                    to={`/journal/${post.slug}`}
                                    className="readMore"
                                >
                                    Read <FiArrowUpRight />
                                </Link>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </Styled.Wrapper>
    );
}
