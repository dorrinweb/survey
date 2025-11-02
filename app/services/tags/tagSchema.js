import { Schema } from 'mongoose';
import withBaseUserInfoSchema from "../../core/baseEntityWithUserInfoSchema.js";
import { decode } from 'html-entities';
import datetime from '../../core/datetime.js';

// A plugin to automatically set getters
function applyGetters(schema) {
    schema.set('toObject', { getters: true, virtuals: true });
    schema.set('toJSON', { getters: true, virtuals: true });
}


const tagSchema = new Schema(
    withBaseUserInfoSchema(
        {
            title: {
                type: String,
                required: true,
                get: (value) => decode(value),
            },
            createdAt: {
                type: Date,
                default: Date.now,
                get: (date) => (date ? datetime.toJalaali(date) : null),
            },
        }
    )
);
// Add plugin to enable getters by default
tagSchema.set('toJSON', { getters: true, virtuals: true });
tagSchema.set('toObject', { getters: true, virtuals: true });
tagSchema.index({title: 1});

export default tagSchema;
