import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    description: string;
    images: string[];
    colors: { name: string; value: string }[];
    sizes: { value: string; stock: number }[];
    category: string;
    composition?: string;
    care?: string;
    sizeChart?: string;
    articleCode: string;
    createdAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number },
        description: { type: String, required: true },
        images: [{ type: String, required: true }],
        colors: [
            {
                name: { type: String, required: true },
                value: { type: String, required: true },
            },
        ],
        sizes: [
            {
                value: { type: String, required: true },
                stock: { type: Number, required: true, default: 0 },
            },
        ],
        category: {
            type: String,
            required: true,
            enum: ["Sneakers", "Loafers", "Sandals", "Slides", "Sports Shoes", "Formal"],
        },
        composition: { type: String },
        care: { type: String },
        sizeChart: { type: String },
        articleCode: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
