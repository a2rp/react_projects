import { createElement, useState } from "react";
import { FiBookOpen, FiCheckCircle, FiCopy, FiRefreshCw, FiSmile, FiZap } from "react-icons/fi";
import { Styled } from "./styled";

const categories = ["Programming", "Misc", "Dark", "Pun", "Spooky", "Christmas"];

const highlights = [
    { icon: FiZap, title: "Quick laughs", text: "Fetch a fresh one-liner in a single click." },
    { icon: FiBookOpen, title: "Easy to explore", text: "Switch categories whenever the mood changes." },
    { icon: FiCheckCircle, title: "Clear feedback", text: "Loading, success, and error states stay visible." },
];

const JokesGenerator = () => {
    const [joke, setJoke] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [category, setCategory] = useState("Programming");
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState("");

    const fetchJoke = async () => {
        setLoading(true);
        setError("");
        setCopied(false);
        setCopyError("");
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 15000);

        try {
            const response = await fetch(
                `https://v2.jokeapi.dev/joke/${category}?type=single`,
                { signal: controller.signal },
            );
            const data = await response.json().catch(() => null);

            if (!response.ok || !data || data.error || typeof data.joke !== "string") {
                throw new Error(data?.message || "No joke found for this category.");
            }

            setJoke(data.joke);
        } catch (fetchError) {
            setJoke("");
            setError(fetchError.name === "AbortError"
                ? "The request timed out. Please try again."
                : fetchError.message || "Unable to fetch a joke. Check your connection and try again.");
        } finally {
            window.clearTimeout(timeoutId);
            setLoading(false);
        }
    };

    const copyJoke = async () => {
        if (!joke) return;
        setCopyError("");

        try {
            await navigator.clipboard.writeText(joke);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
            setCopyError("Clipboard access is unavailable in this browser.");
        }
    };

    return (
        <Styled.Page>
            <Styled.Hero>
                <Styled.HeroCopy>
                    <Styled.Eyebrow><FiSmile /> JokeAPI powered</Styled.Eyebrow>
                    <Styled.Heading>Make room for a better laugh.</Styled.Heading>
                    <Styled.Description>
                        Pick a category, fetch a fresh joke, and keep the conversation light
                        with a small, responsive React experience.
                    </Styled.Description>
                    <Styled.Badges>
                        <span><FiCheckCircle /> Fast feedback</span>
                        <span><FiCheckCircle /> Responsive layout</span>
                    </Styled.Badges>
                </Styled.HeroCopy>

                <Styled.JokePanel>
                    <Styled.PanelTopline>
                        <span className="panel-label">Your next laugh</span>
                        <span className="panel-status" role="status"><span /> {loading ? "Loading" : error ? "Unavailable" : joke ? "Joke ready" : "Ready"}</span>
                    </Styled.PanelTopline>
                    <Styled.Controls>
                        <label htmlFor="category">Choose a category</label>
                        <Styled.Select
                            id="category"
                            value={category}
                            disabled={loading}
                            onChange={(event) => setCategory(event.target.value)}
                        >
                            {categories.map((item) => <option key={item}>{item}</option>)}
                        </Styled.Select>
                        <Styled.Button type="button" onClick={fetchJoke} disabled={loading}>
                            {loading ? <span className="spinner" aria-hidden="true" /> : <FiRefreshCw />}
                            {loading ? "Finding a joke" : "Get a joke"}
                        </Styled.Button>
                    </Styled.Controls>

                    {error && <Styled.Message className="error" role="alert">{error}</Styled.Message>}

                    {joke ? (
                        <Styled.JokeCard aria-live="polite" aria-atomic="true">
                            <FiSmile className="joke-icon" aria-hidden="true" />
                            <p>{joke}</p>
                            <Styled.CopyButton type="button" onClick={copyJoke}>
                                <FiCopy /> {copied ? "Copied" : "Copy joke"}
                            </Styled.CopyButton>
                            {copyError && <Styled.Message role="status">{copyError}</Styled.Message>}
                        </Styled.JokeCard>
                    ) : !loading && !error ? (
                        <Styled.EmptyState>
                            <FiSmile aria-hidden="true" />
                            <p>Your joke will appear here.</p>
                            <span>Choose a category and press the button to begin.</span>
                        </Styled.EmptyState>
                    ) : null}
                </Styled.JokePanel>
            </Styled.Hero>

            <Styled.Section>
                <Styled.SectionIntro>
                    <Styled.Eyebrow>Simple by design</Styled.Eyebrow>
                    <h2>A tiny app with a clear purpose.</h2>
                    <p>JokesterX keeps the interaction focused so you can spend less time waiting and more time smiling.</p>
                </Styled.SectionIntro>
                <Styled.HighlightGrid>
                    {highlights.map(({ icon, title, text }) => (
                        <Styled.Highlight key={title}>
                            <span className="highlight-icon">{createElement(icon, { "aria-hidden": true })}</span>
                            <h3>{title}</h3>
                            <p>{text}</p>
                        </Styled.Highlight>
                    ))}
                </Styled.HighlightGrid>
            </Styled.Section>
        </Styled.Page>
    );
};

export default JokesGenerator;
