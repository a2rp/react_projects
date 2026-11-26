import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiRefreshCw, FiShoppingBag } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import styled from "styled-components";
import ProductCard from "../components/ProductCard";
import { api } from "../api";

const ProductList = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/api/products");
            setProducts(response.data.products ?? []);
        } catch {
            toast.error("Products could not be loaded. Check the backend connection.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <Page>
            <Heading>
                <div>
                    <span className="eyebrow"><FiShoppingBag /> CATALOGUE</span>
                    <h1>Product list</h1>
                    <p>Review products already added to the store.</p>
                </div>
                <div className="actions">
                    <button type="button" onClick={fetchProducts} disabled={isLoading} aria-label="Refresh products">
                        <FiRefreshCw />
                        Refresh
                    </button>
                    <NavLink to="/add">
                        <FiPlus />
                        Add product
                    </NavLink>
                </div>
            </Heading>

            {isLoading ? (
                <Loading aria-live="polite">
                    <CircularProgress size={32} />
                    Loading products...
                </Loading>
            ) : products.length ? (
                <Grid>
                    {products.map((product) => <ProductCard key={product._id} product={product} />)}
                </Grid>
            ) : (
                <EmptyState>
                    <FiShoppingBag />
                    <h2>No products yet</h2>
                    <p>Add the first product to start building the catalogue.</p>
                    <NavLink to="/add">Add a product</NavLink>
                </EmptyState>
            )}
        </Page>
    );
};

export default ProductList;

const Page = styled.section`
    padding: 0;
`;

const Heading = styled.header`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 30px;

    .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        color: #1271bf;
        font-size: 0.75rem;
        font-weight: 800;
        letter-spacing: 0.14em;
    }

    h1 {
        margin: 8px 0 5px;
        color: #10223a;
        font-size: clamp(2rem, 4vw, 3.2rem);
        line-height: 1.05;
    }

    p {
        margin: 0;
        color: #6b7e93;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 10px;
    }

    button,
    a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 42px;
        padding: 0 15px;
        border: 1px solid #c6d7e7;
        border-radius: 11px;
        background: #fff;
        color: #184b78;
        font: inherit;
        font-weight: 700;
        text-decoration: none;
        cursor: pointer;
        transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
    }

    a {
        border-color: #1474c4;
        background: #1474c4;
        color: #fff;
    }

    button:hover,
    button:focus-visible,
    a:hover,
    a:focus-visible {
        border-color: #1474c4;
        box-shadow: 0 0 0 4px rgba(20, 116, 196, 0.12);
        outline: none;
    }

    button:disabled {
        cursor: wait;
        opacity: 0.65;
    }

    @media (max-width: 680px) {
        align-items: flex-start;
        flex-direction: column;

        .actions {
            width: 100%;
            justify-content: flex-start;
        }
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
`;

const Loading = styled.div`
    display: grid;
    place-items: center;
    gap: 12px;
    min-height: 260px;
    border: 1px solid #dbe5ef;
    border-radius: 18px;
    background: #fff;
    color: #60758d;
`;

const EmptyState = styled.div`
    display: grid;
    place-items: center;
    gap: 10px;
    min-height: 300px;
    padding: 30px;
    border: 1px dashed #b9ccdf;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.7);
    text-align: center;

    svg {
        width: 34px;
        height: 34px;
        color: #1474c4;
    }

    h2,
    p {
        margin: 0;
    }

    p {
        color: #6b7e93;
    }

    a {
        margin-top: 10px;
        padding: 10px 15px;
        border-radius: 10px;
        background: #1474c4;
        color: #fff;
        font-weight: 700;
        text-decoration: none;
    }
`;
