import { Schema } from 'mongoose';
import withBaseSchema from "../../core/baseSchema.js";
import withBaseUserInfoSchema from "../../core/baseEntityWithUserInfoSchema.js";

// A plugin to automatically set getters
function applyGetters(schema) {
    schema.set('toObject', { getters: true, virtuals: true });
    schema.set('toJSON', { getters: true, virtuals: true });
}

const tripSchema = new Schema(
    withBaseUserInfoSchema(
        {
            tripNumber: {
                type: Number, // Number of the trip (e.g., سفر اول، سفر دوم)
                required: true
            },
            userId: {
                type: Schema.Types.ObjectId, // Reference to User model
                ref: 'user', // Name of the User model
                required: true // User ID is mandatory
            },
            userCode :{
                type : Number,
                default : null
            },
            householdCode :{
                type : Number,
                default : null
            },
            departure: {
                time:  {
                    hour: {
                        type: String,
                    },
                    minute: {
                        type: String,
                    },
                    period: {
                        type: String,
                        enum: ['صبح', 'عصر'], // دوره AM/PM
                    }
                },
                location: {
                    type: String, // Address of the household
                    required: true
                },
            },
            destination: {
                time: {
                    hour: {
                        type: String,
                    },
                    minute: {
                        type: String,
                    },
                    period: {
                        type: String,
                        enum: ['صبح', 'عصر'], // دوره AM/PM
                    }
                },
                location: {
                    type: String, // Address of the household
                    required: true
                },
            },
            purpose: {
                type: String, // Purpose of the trip (list of selected purposes)
                required: true
            },
            parking: {
                type: String, // Parking 
                enum: [
                    "در کنار خیابان",
                    "پارکینگ شخصی",
                    "پارکینگ عمومی",
                    "پارکینگ محل کار",
                    ''
                ],
            },
            parkingFee: {
                type: Number, // Parking fee (in Toman)
            },
            tripFee: {
                type: Number, // Trip fee (in Toman)
            },
            
        }
    )
);

// Add plugin to enable getters by default
tripSchema.plugin(applyGetters);

// Define indexes for userId, departure.location, destination.location, departure.time, and destination.time
tripSchema.index({ userId: 1 }); // Index for user ID
tripSchema.index({ 'departure.location': 1 }); // Index for departure location
tripSchema.index({ 'destination.location': 1 }); // Index for destination location
tripSchema.index({ 'departure.time.hour': 1, 'departure.time.minute': 1 }); // Compound index for departure time
tripSchema.index({ 'destination.time.hour': 1, 'destination.time.minute': 1 }); // Compound index for destination time

export default tripSchema;