import { Schema } from 'mongoose';
import withBaseSchema from "../../core/baseSchema.js";

const HouseholdSchema = new Schema(
    withBaseSchema(
        {
            householdCode: {
                type: Number, // Number of members in the household
                required: true,
            },
            address: {
                type: String, // Address of the household
                required: true
            },
            householdCount: {
                type: Number, // Number of members in the household
                required: true,
                min: 1
            },
            carCount: {
                type: Number, // Total number of cars in the household
                default: 0
            },

            parkingSpacesCount: {
                type: Number, // Number of cars parked in the household's parking space
                default: 0
            },
            members: [
                {
                    type: Schema.Types.ObjectId, // List of users (members of the household)
                    ref: "user"
                }
            ]
        }
    )
);

export default HouseholdSchema;