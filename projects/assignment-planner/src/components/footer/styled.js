import styled from "styled-components";

export const Styled = {
    Wrapper: styled.footer`
        width: 100%;

        margin-top: auto;

        border-top: 1px solid var(--border-color);

        background: var(--surface-color);

        .content {
            width: min(100%, 1500px);

            margin: 0 auto;
            padding: 20px;

            display: grid;
            grid-template-columns: minmax(220px, 1fr) minmax(0, 2fr);

            align-items: center;
            gap: 22px;
        }

        .brand {
            min-width: 0;

            display: flex;
            align-items: center;
            gap: 11px;
        }

        .brandIcon {
            width: 40px;
            height: 40px;

            flex-shrink: 0;

            display: grid;
            place-items: center;

            border: 1px solid var(--border-color);
            border-radius: 11px;

            background: var(--surface-soft-color);

            color: var(--text-color);

            font-family: Antonio, Verdana, sans-serif;

            font-size: 0.9rem;
            font-weight: 700;

            letter-spacing: 0.04em;
        }

        .brandText {
            min-width: 0;

            strong {
                display: block;

                color: var(--text-color);

                font-size: 0.72rem;
            }

            p {
                margin-top: 3px;

                color: var(--text-muted-color);

                font-size: 0.61rem;
                line-height: 1.45;
            }
        }

        .links {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 7px;

            flex-wrap: wrap;

            a {
                width: 34px;
                height: 34px;

                display: grid;
                place-items: center;

                border: 1px solid var(--border-color);
                border-radius: 9px;

                color: var(--text-muted-color);

                transition: box-shadow 160ms ease, text-shadow 160ms ease;

                svg {
                    width: 14px;
                    height: 14px;
                }

                &:hover {
                    box-shadow: 0 10px 24px var(--shadow-color);
                }
            }
        }

        .bottom {
            width: min(100%, 1500px);

            margin: 0 auto;
            padding: 12px 20px 16px;

            border-top: 1px solid var(--border-color);

            color: var(--text-muted-color);

            font-size: 0.6rem;

            a {
                color: var(--text-soft-color);

                font-weight: 700;

                transition: box-shadow 160ms ease, text-shadow 160ms ease;

                &:hover {
                    box-shadow: 0 10px 24px var(--shadow-color);
                }
            }
        }

        @media (max-width: 760px) {
            .content {
                padding: 18px 14px;

                grid-template-columns: 1fr;
            }

            .links {
                justify-content: flex-start;
            }

            .bottom {
                padding: 12px 14px 15px;
            }
        }

        @media (max-width: 480px) {
            .links {
                display: grid;
                grid-template-columns: repeat(5, minmax(0, 1fr));

                width: 100%;

                a {
                    width: 100%;
                }
            }
        }

        @media print {
            display: none;
        }
    `,
};
