import mongoose, { Schema, Document } from "mongoose";

export interface ISlider extends Document {
    imageUrl: string;
    publicId: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
}

const SliderSchema: Schema = new Schema(
    {
        imageUrl: { type: String, required: true },
        publicId: { type: String, required: true },
        order: { type: Number, required: true, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Slider || mongoose.model<ISlider>("Slider", SliderSchema);
