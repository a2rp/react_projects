import styled from "styled-components";

export const Styled = {
    Page: styled.main`
        width: min(1180px, calc(100% - 40px));
        margin: 0 auto;
        padding: 132px 0 72px;
        @media (max-width: 900px) { padding-top: 116px; }
        @media (max-width: 640px) { width: min(100% - 28px, 540px); padding-bottom: 48px; }
    `,
    Hero: styled.section`
        display: grid;
        grid-template-columns: minmax(0, 0.9fr) minmax(360px, 0.75fr);
        align-items: center;
        gap: 72px;
        min-height: 570px;
        @media (max-width: 900px) { grid-template-columns: 1fr; gap: 42px; }
    `,
    HeroCopy: styled.div`max-width: 620px;`,
    Eyebrow: styled.p`
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 20px;
        color: #72e0bd;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
    `,
    Heading: styled.h1`
        max-width: 690px;
        margin: 0;
        color: #f7fbff;
        font-size: clamp(2.8rem, 6vw, 5.8rem);
        line-height: 0.98;
        letter-spacing: -0.06em;
    `,
    Description: styled.p`
        max-width: 570px;
        margin: 26px 0 0;
        color: #9aa9ba;
        font-size: 1.08rem;
        line-height: 1.8;
    `,
    Badges: styled.div`
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 34px;
        span { display: inline-flex; align-items: center; gap: 8px; padding: 10px 13px; border: 1px solid #263a4c; border-radius: 999px; color: #b3c2d1; font-size: 0.8rem; }
        svg { color: #72e0bd; }
    `,
    JokePanel: styled.section`
        padding: 28px;
        border: 1px solid #263a4c;
        border-radius: 26px;
        background: linear-gradient(145deg, #132436, #0d1724);
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
    `,
    PanelTopline: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        .panel-label { color: #f7fbff; font-size: 1rem; font-weight: 700; }
        .panel-status { display: inline-flex; align-items: center; gap: 7px; color: #82a0b7; font-size: 0.75rem; }
        .panel-status span { width: 7px; height: 7px; border-radius: 50%; background: #72e0bd; box-shadow: 0 0 10px #72e0bd; }
    `,
    Controls: styled.div`
        display: grid;
        gap: 10px;
        label { color: #9aa9ba; font-size: 0.78rem; }
    `,
    Select: styled.select`
        width: 100%;
        padding: 14px 16px;
        border: 1px solid #36516a;
        border-radius: 12px;
        outline: none;
        background: #0a1624;
        color: #f7fbff;
        font: inherit;
        cursor: pointer;
        transition: border-color 180ms ease, box-shadow 180ms ease;
        &:hover, &:focus { border-color: #72e0bd; box-shadow: 0 0 0 3px rgba(114, 224, 189, 0.12); }
    `,
    Button: styled.button`
        display: inline-flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: 48px;
        margin-top: 8px;
        padding: 12px 18px;
        border: 1px solid #72e0bd;
        border-radius: 12px;
        background: #72e0bd;
        color: #071219;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
        transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
        &:hover:not(:disabled) { box-shadow: 0 10px 24px rgba(114, 224, 189, 0.2); transform: translateY(-2px); }
        &:focus-visible { outline: 3px solid rgba(114, 224, 189, 0.34); outline-offset: 3px; }
        &:disabled { cursor: wait; opacity: 0.75; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(7, 18, 25, 0.3); border-top-color: #071219; border-radius: 50%; animation: spin 700ms linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    `,
    JokeCard: styled.article`
        position: relative;
        margin-top: 24px;
        padding: 24px;
        border: 1px solid #36516a;
        border-radius: 16px;
        background: #0a1624;
        color: #f7fbff;
        box-shadow: 0 14px 34px rgba(0, 0, 0, 0.2);
        .joke-icon { color: #72e0bd; font-size: 1.35rem; }
        p { margin: 16px 0 22px; font-size: 1.1rem; line-height: 1.7; }
    `,
    CopyButton: styled.button`
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 11px;
        border: 1px solid #36516a;
        border-radius: 9px;
        background: transparent;
        color: #b3c2d1;
        font: inherit;
        font-size: 0.78rem;
        cursor: pointer;
        transition: border-color 180ms ease, box-shadow 180ms ease, color 180ms ease;
        &:hover { border-color: #72e0bd; box-shadow: 0 0 16px rgba(114, 224, 189, 0.12); color: #72e0bd; }
    `,
    EmptyState: styled.div`
        display: grid;
        justify-items: center;
        gap: 10px;
        margin-top: 24px;
        padding: 38px 18px;
        border: 1px dashed #36516a;
        border-radius: 16px;
        text-align: center;
        svg { color: #72e0bd; font-size: 1.5rem; }
        p { margin: 0; color: #f7fbff; font-weight: 600; }
        span { color: #8196a9; font-size: 0.8rem; }
    `,
    Message: styled.p`margin: 18px 0 0; color: #ff9b9b; font-size: 0.9rem;`,
    Section: styled.section`padding: 90px 0 20px; border-top: 1px solid #1b2a39;`,
    SectionIntro: styled.div`
        max-width: 620px;
        h2 { margin: 0; color: #f7fbff; font-size: clamp(2rem, 4vw, 3.8rem); line-height: 1.05; letter-spacing: -0.04em; }
        p { margin: 18px 0 0; color: #8fa0b1; line-height: 1.75; }
    `,
    HighlightGrid: styled.div`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-top: 40px;
        @media (max-width: 640px) { grid-template-columns: 1fr; }
    `,
    Highlight: styled.article`
        padding: 24px;
        border: 1px solid #263a4c;
        border-radius: 18px;
        background: #0d1826;
        transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
        &:hover { border-color: #72e0bd; box-shadow: 0 14px 30px rgba(0, 0, 0, 0.2); transform: translateY(-4px); }
        .highlight-icon { display: inline-grid; place-items: center; width: 38px; height: 38px; border-radius: 11px; background: #163448; color: #72e0bd; }
        h3 { margin: 20px 0 0; color: #f7fbff; font-size: 1rem; }
        p { margin: 8px 0 0; color: #8fa0b1; font-size: 0.88rem; line-height: 1.65; }
    `,
};
