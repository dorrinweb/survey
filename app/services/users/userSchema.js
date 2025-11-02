import { Schema } from 'mongoose';
import withBaseSchema from "../../core/baseSchema.js";

const UserSchema = new Schema(
    withBaseSchema(
        {
            userCode:{
                type: Number,
                required: true, 
            },
            fullName: {
                type: String,
            },
            description: {
                type: String,
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
            address: {
                type: String,
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
                enum: ['male', 'female','null'], // Only specified options are allowed

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
            monthlyIncome: {
                type: String, // Average monthly income in million Toman
                enum: [
                    '0-3',
                    '3-6',
                    '6-10',
                    '10-15',
                    'up 15'
                ], // Only specified options are allowed
            },
            monthlyExpenses: {
                type: String, // Average monthly expenses in million Toman
                enum: [
                    '0-3',
                    '3-6',
                    '6-10',
                    '10-15',
                    'up 15'
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
                type: String, // Work start time in HH:mm format (e.g., "08:00")
            },

        }
    )
);

export default UserSchema;