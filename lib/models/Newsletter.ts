import mongoose, { Schema, Document } from "mongoose";

export interface INewsletter extends Document {
    email: string;
    createdAt: Date;
}

const NewsletterSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true, index: true },
    },
    { timestamps: true }
);

export default mongoose.models.Newsletter || mongoose.model<INewsletter>("Newsletter", NewsletterSchema);
