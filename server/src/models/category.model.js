import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true,
            unique: true,
        },
        categoryDescription: {
            type: String,
            required: true,
        },
        categoryOffer: {
            type: Number,
            default: 0,
        },
        maxRedeem: {
            type: Number,
            default: 0,
        },
        thumbnail: {
            image_url:{
                type:String,
                required:true
            },
            publicId:{
                type:String
            }
        },
        isListed: {
            type: Boolean,
            default: true,
        },
        isDeleted:{
            type:Boolean,
            default:false
        }
    },
    { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
