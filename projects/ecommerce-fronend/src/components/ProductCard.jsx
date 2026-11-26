import styled from "styled-components";

const priceFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
});

const ProductCard = ({ product }) => (
    <Card>
        <ProductImage src={product.image} alt={product.name} loading="lazy" />
        <Content>
            <div className="title-row">
                <h3>{product.name}</h3>
                <strong>{priceFormatter.format(Number(product.price))}</strong>
            </div>
            <p>{product.description}</p>
            <span>{product.category}</span>
        </Content>
    </Card>
);

export default ProductCard;

const Card = styled.article`
    overflow: hidden;
    border: 1px solid #dbe5ef;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 10px 26px rgba(21, 48, 79, 0.08);
    transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;

    &:hover {
        border-color: #79b7e8;
        box-shadow: 0 16px 30px rgba(21, 80, 132, 0.14);
        transform: translateY(-3px);
    }
`;

const ProductImage = styled.img`
    display: block;
    width: 100%;
    height: 220px;
    object-fit: cover;
    background: #edf3f8;
`;

const Content = styled.div`
    padding: 18px;

    .title-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
    }

    h3 {
        margin: 0;
        color: #162033;
        font-size: 1.05rem;
    }

    strong {
        color: #1267ac;
        white-space: nowrap;
    }

    p {
        min-height: 48px;
        margin: 12px 0 16px;
        color: #61748b;
        font-size: 0.9rem;
        line-height: 1.6;
    }

    span {
        display: inline-flex;
        padding: 5px 10px;
        border-radius: 999px;
        background: #eaf4ff;
        color: #1267ac;
        font-size: 0.78rem;
        font-weight: 700;
    }
`;
