import {Schema} from 'mongoose';
import { decode } from 'html-entities';



// A plugin to automatically set getters
function applyGetters(schema) {
    schema.set('toObject', { getters: true, virtuals: true });
    schema.set('toJSON', { getters: true, virtuals: true });
}
const roleSchema = new Schema(
    {
        name : {
            type : String,
            required : true,
            get: (value) => decode(value),
        },
        permissions : {
            type: Array,
            // Getter to decode each element in the array
            get: (values) => Array.isArray(values) ? values.map(value => decode(value)) : values
        },
        modifiedAt : {
            type : Date,
        },
        }
);
// Add plugin to enable getters by default
roleSchema.set('toJSON', { getters: true, virtuals: true });
roleSchema.set('toObject', { getters: true, virtuals: true });
export default roleSchema