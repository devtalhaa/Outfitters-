import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    productId: mongoose.Types.ObjectId;
    user: string;
    rating: number;
    content: string;
    helpful: number;
    createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        user: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        content: { type: String, required: true },
        helpful: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
