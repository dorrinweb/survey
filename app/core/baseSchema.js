import {Schema} from 'mongoose';
import datetime from './datetime.js';


const toJalali = (date) => {
  return date ? datetime.toJalaali(date) : null;
}
 const withBaseSchema = (schema) => {
  return Object.assign(schema, {
    createdAt: { 
        type: Date, 
        required: true,
        get: toJalali, // getter
    },
    modifiedById: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    modifiedAt: { 
      type: Date,
      get: toJalali, // getter
       },
    active: { type: Boolean, required: true, default: true },
    deleted: { type: Boolean, required: true, default: false },
  });
  // Enabling getters when using toObject or toJSON
  schema.set('toObject', { getters: true });
  schema.set('toJSON', { getters: true });
};



       
export default withBaseSchema;