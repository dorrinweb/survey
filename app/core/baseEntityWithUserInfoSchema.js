import { Schema } from "mongoose";
import  withBaseSchema from "./baseSchema.js";

const withBaseUserInfSchema = (schema) => {
  return withBaseSchema(
    Object.assign(schema, {
      createdById: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
      },
    })
  );
};
export default withBaseUserInfSchema;
