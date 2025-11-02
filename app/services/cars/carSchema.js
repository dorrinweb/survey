import { Schema } from 'mongoose';
import withBaseUserInfoSchema from "../../core/baseEntityWithUserInfoSchema.js";
import { decode } from 'html-entities';
import datetime from '../../core/datetime.js'

// A plugin to automatically set getters
function applyGetters(schema) {
    schema.set('toObject', { getters: true, virtuals: true });
    schema.set('toJSON', { getters: true, virtuals: true });
}

const carSchema = new Schema(
    withBaseUserInfoSchema(
        {
            owner: {
                type: Schema.Types.ObjectId, // Refers to the user who owns the car
                ref: "user",
                required: true
            },
            carType: {
                type: String, // Type of the car
                enum: ['سواری', 'وانت', 'کامیون', 'موتور سیکلت', 'اتوبوس', 'مینی‌بوس', 'تراکتور', 'کامیونت','سایر'], // Only specified car types are allowed
            },
            carName: {
                type: String, // Name of the car
            },
            carAge: {
                type: Number, // Age of the car model
            },
            fuelType: {
                type: String, // Type of fuel used in the car
                enum:  ['بنزینی', 'گازوئیلی', 'برقی', 'گازسوز', 'هیبریدی'], // Only specified fuel types are allowed
            },
        }
    )
);

// Add plugin to enable getters by default
carSchema.plugin(applyGetters);
carSchema.index({ carAge: 1 });

export default carSchema;