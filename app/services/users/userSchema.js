import { Schema } from 'mongoose';
import withBaseSchema from "../../core/baseSchema.js";

// A plugin to automatically set getters
function applyGetters(schema) {
    schema.set('toObject', { getters: true, virtuals: true });
    schema.set('toJSON', { getters: true, virtuals: true });
}

const CarSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId, // Refers to the user who owns the car
        ref: "user",
        required: true
    },
    carType: {
        type: String, // Type of the car
        enum: ['سواری', 'وانت', 'کامیون', 'موتور سیکلت', 'اتوبوس', 'مینی‌بوس', 'تراکتور', 'کامیونت', 'سایر'], // Only specified car types are allowed
    },
    carName: {
        type: String, // Name of the car
    },
    carYear: {
        type: Number, // Age of the car model
    },
    fuelType: {
        type: String, // Type of fuel used in the car
        enum: ['بنزینی', 'گازوئیلی', 'برقی', 'گازسوز', 'هیبریدی'], // Only specified fuel types are allowed
    },
});

const UserSchema = new Schema(
    withBaseSchema(
        {
            userCode: {
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
            householdCode :{
                type : Number,
                default : null
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
            },
            expenses: {
                type: String, // Average monthly expenses in million Toman

            },
            hasDrivingLicense: {
                type: Boolean, // Whether the user has a driving license
            },
            noTrip: {
                type: Boolean,
                default : false // Whether the user has a driving license
            },
            noInCity: {
                type: Boolean,
                default: false // Whether the user has a driving license
            },
            tripReviewed: {
                type: Boolean,
                default: false // Whether the user has a driving license
            },
            hasCarOwnership: {
                type: Boolean, // Whether the user owns a car
            },
            carDetails: {
                type: [CarSchema], // List of cars owned by the user
                default: [] // Default to an empty array
            },
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
UserSchema.index({ householdId: 1 });

export default UserSchema;