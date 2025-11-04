import { Schema } from 'mongoose';
import withBaseSchema from "../../core/baseSchema.js";


// A plugin to automatically set getters
function applyGetters(schema) {
    schema.set('toObject', { getters: true, virtuals: true });
    schema.set('toJSON', { getters: true, virtuals: true });
}

const UserSchema = new Schema(
    withBaseSchema(
        {
            userCode:{
                type: Number,
                required: true, 
            },
            phone: {
                type: Number,
            },
            role: {
                type: Schema.Types.ObjectId,
                ref: "role",
            },
            householdId: {
                type: Schema.Types.ObjectId, // Reference to the household the user belongs to
                ref: "household",
            },
            isHeadOfHousehold: {
                type: Boolean, // Whether the user is the head of the household (the one who fills general household info)
                default: false
            },
            education: {
                type: String, // User's education level
                enum: ['بی‌سواد', 'ابتدایی', 'سیکل', 'دیپلم', 'فوق دیپلم', 'لیسانس', 'فوق لیسانس', 'دکترا'], // Only specified options are allowed
            },
            birthYear: {
                type: Number, // Year of birth
            },
            gender: {
                type: String, // User's gender
                enum: ['زن', 'مرد'], // Only specified options are allowed

            },
            job: {
                type: String, // User's occupation
                enum: [
                    'نیروی نظامی انتظامی',
                    'کارمند',
                    'کارگر ساده',
                    'کارگر ماهر',
                    'معلم/استاد/محقق/دانشمند',
                    'کاسب/تاجر/صاحب مشاغل',
                    'کشاورز/دامدار/شیلات',
                    'راننده وسایل نقلیه عمومی',
                    'استاد کار/کارگر مشاغل تولیدی',
                    'بیکار',
                    'محصل',
                    'خانه‌دار',
                    'سایر',
                    'null'
                ], // Only specified options are allowed
            },
            income: {
                type: String, // Average monthly income in million Toman
                enum: [
                    '0-3',
                    '3-6',
                    '6-10',
                    '10-15',
                    'up-15'
                ], // Only specified options are allowed
            },
            expenses: {
                type: String, // Average monthly expenses in million Toman
                enum: [
                    '0-3',
                    '3-6',
                    '6-10',
                    '10-15',
                    'up-15'
                ], // Only specified options are allowed
            },
            hasDrivingLicense: {
                type: Boolean, // Whether the user has a driving license
            },
            hasCarOwnership: {
                type: Boolean, // Whether the user owns a car
            },
            cars: [
                {
                    type: Schema.Types.ObjectId, // List of cars owned by the user
                    ref: "car"
                }
            ],
            workStartHour: {
                hour: {
                    type: Number,
                },
                minute: {
                    type: Number,
                },
                period: {
                    type: String,
                    enum: ['صبح', 'عصر'], // دوره AM/PM
                }
            },
            relationWithHouseHold: {
                type: String, 
            },

        }
    )
);
 // Add plugin to enable getters by default
 UserSchema.plugin(applyGetters);
export default UserSchema;