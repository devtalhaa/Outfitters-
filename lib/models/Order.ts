import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
    };
    items: [
        {
            productId: mongoose.Types.ObjectId;
            name: string;
            price: number;
            quantity: number;
            size: string;
            color: string;
            image: string;
        }
    ];
    totalAmount: number;
    paymentMethod: "COD" | "Card";
    status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    createdAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        customer: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
        },
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                size: { type: String, required: true },
                color: { type: String, required: true },
                image: { type: String, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        paymentMethod: { type: String, default: "COD", enum: ["COD", "Card"] },
        status: {
            type: String,
            default: "Pending",
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
