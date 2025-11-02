import { Schema } from 'mongoose';
import datetime from '../../core/datetime.js';

// Define UserTag Schema
const userTagSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    tagId: {
        type: Schema.Types.ObjectId,
        ref: 'tag',
        required: true,
    },
    assignedAt: {
        type: Date,
        default: Date.now,
        get: (date) => (date ? datetime.toJalaali(date) : null),
    },
});

// Add plugin to enable getters by default
userTagSchema.set('toJSON', { getters: true, virtuals: true });
userTagSchema.set('toObject', { getters: true, virtuals: true });

// Ensure unique user-tag combinations
userTagSchema.index({ userId: 1, tagId: 1 }, { unique: true });

export default userTagSchema;