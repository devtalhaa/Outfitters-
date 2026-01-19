import mongoose, { Schema, Document } from "mongoose";

export interface IWishlist extends Document {
    userId: string; // Can be a guestId or real UserId
    products: mongoose.Types.ObjectId[];
}

const WishlistSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, unique: true },
        products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true }
);

export default mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema);
