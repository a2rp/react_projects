import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import noReply from "../assets/images/noReply.png";
import { api } from "../api";

const emptyForm = {
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    preview: "",
};

const AddProduct = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const imageInputRef = useRef(null);

    useEffect(() => {
        const previewUrl = form.preview;
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [form.preview]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("price", form.price);
        formData.append("category", form.category);
        formData.append("image", form.image);

        setIsLoading(true);
        try {
            await api.post("/api/products", formData);
            toast.success("Product added successfully!");
            setForm(emptyForm);
            if (imageInputRef.current) imageInputRef.current.value = "";
        } catch (err) {
            console.error("Client error:", err);
            const errorMsg =
                err.response?.data?.message || "Something went wrong while submitting!";
            toast.error(`${errorMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image") {
            const file = files?.[0];
            if (!file) return;

            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            const maxFileSize = 5 * 1024 * 1024;
            if (!allowedTypes.includes(file.type) || file.size > maxFileSize) {
                setForm((current) => ({ ...current, image: null, preview: "" }));
                if (imageInputRef.current) imageInputRef.current.value = "";
                toast.error("Choose a JPG, PNG, or WEBP image up to 5 MB.");
                return;
            }

            const previewUrl = URL.createObjectURL(file);
            setForm((current) => ({ ...current, image: file, preview: previewUrl }));
        } else {
            setForm((current) => ({ ...current, [name]: value }));
        }
    };

    const resetForm = () => {
        setForm(emptyForm);
        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    return (
        <Styled.Wrapper>
            <Styled.Heading>Add A Product</Styled.Heading>
            <Styled.Form onSubmit={handleSubmit}>
                <label className="field">
                    Product name
                    <input
                        className="text"
                        type="text"
                        name="name"
                        autoComplete="off"
                        maxLength={120}
                        onChange={handleChange}
                        required
                        value={form.name}
                    />
                </label>
                <label className="field">
                    Description
                    <input
                        className="text"
                        type="text"
                        name="description"
                        maxLength={5000}
                        onChange={handleChange}
                        required
                        value={form.description}
                    />
                </label>
                <label className="field">
                    Price (INR)
                    <input
                        className="text"
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        onChange={handleChange}
                        required
                        value={form.price}
                    />
                </label>
                <label className="field">
                    Category
                    <input
                        className="text"
                        type="text"
                        name="category"
                        maxLength={80}
                        onChange={handleChange}
                        required
                        value={form.category}
                    />
                </label>

                <Styled.ImageInputWrapper>
                    <Styled.DisplayImage
                        src={form.preview || noReply}
                        alt={form.preview ? "Selected product image preview" : "No product image selected"}
                    />
                    <div className="image-input">
                        <label htmlFor="product-image">Product image (JPG, PNG, or WEBP; up to 5 MB)</label>
                        <Styled.ImageInput
                            id="product-image"
                            ref={imageInputRef}
                            type="file"
                            name="image"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            onChange={handleChange}
                            required
                        />
                    </div>
                </Styled.ImageInputWrapper>

                <Styled.ButtonsWrapper>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                        className="submitButton"
                    >
                        {isLoading ? <CircularProgress size={20} /> : "Submit"}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        disabled={isLoading}
                        onClick={resetForm}
                        className="clearButton"
                    >
                        {isLoading ? <CircularProgress size={20} /> : "Clear Form"}
                    </Button>
                </Styled.ButtonsWrapper>
            </Styled.Form>
        </Styled.Wrapper>
    );
};

export default AddProduct;



const Styled = {
        Wrapper: styled.div`
        max-width: 900px;
        padding: 50px;
        margin: auto;
        @media (max-width: 600px) {
            padding: 15px;
        }
    `,
    Heading: styled.h2`
        margin-bottom: 15px;
    `,
    Form: styled.form`
        display: flex;
        flex-direction: column;

        .field {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 15px;
            color: #33475e;
            font-size: 0.9rem;
            font-weight: 600;
        }

        input.text {
            height: 40px;
            width: 100%;
            padding: 0 15px;
            border-radius: 6px;
            border: 1px solid #000;
        }
    `,
    ImageInputWrapper: styled.div`
        display: flex;
        gap: 15px;
        align-items: center;
        margin-bottom: 15px;
        flex-wrap: wrap;

        .image-input {
            display: grid;
            flex: 1 1 240px;
            gap: 8px;
        }

        .image-input label {
            color: #33475e;
            font-size: 0.9rem;
            font-weight: 600;
        }
    `,
    DisplayImage: styled.img`
        display: block;
        background-color: #eee;
        border-radius: 6px;
        width: 200px;
        height: 200px;
        object-fit: cover;
    `,
    ImageInput: styled.input`
        max-width: 100%;
    `,
    ButtonsWrapper: styled.div`
        display: flex;
        gap: 15px;

        .submitButton, .clearButton {
            flex: 1 1 100%;
        }
    `,
};
