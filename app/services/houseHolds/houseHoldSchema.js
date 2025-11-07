import { Schema } from 'mongoose';
import withBaseSchema from "../../core/baseSchema.js";
import withBaseUserInfoSchema from "../../core/baseEntityWithUserInfoSchema.js";

// A plugin to automatically set getters
function applyGetters(schema) {
    schema.set('toObject', { getters: true, virtuals: true });
    schema.set('toJSON', { getters: true, virtuals: true });
}

const HouseholdSchema = new Schema(
    withBaseUserInfoSchema(
        {
            householdCode: {
                type: Number, // Number of members in the household
                required: true,
            },
            postCode: {
                type: Number, // Number of members in the household
                default : null
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
            
        }
    )
);
 // Add plugin to enable getters by default
 HouseholdSchema.plugin(applyGetters);

export default HouseholdSchema;