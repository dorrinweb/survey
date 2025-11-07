import mongoose from 'mongoose';
import { MongoDB, Redis } from '../../global.js';
import UserSchema from './userSchema.js';
import Token from '../../core/token.js';
import { getEnv, log, random, toObjectId } from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';
import RoleModel from '../roles/roleModel.js'
import HouseHoldModel from '../houseHolds/houseHoldModel.js';

export default class UserModel {
    constructor() {
        this.model = MongoDB.db.model('user', UserSchema);
        // this.houseHoldModel = new HouseHoldModel()

    }
    async add(data/*,firstName,lastName,phone,roleId,nationalId*/) {
        try{
            if(data?.phone){
                const resultCheckPhone = await this.checkPhone(data?.phone);
                if(resultCheckPhone > 0){
                    return -1;
                }
            }
            let newUserData = {
                "firstName": data?.firstName,
                "lastName": data?.lastName,
                "phone": data?.phone,
                'userCode' : 1,
                'isHeadOfHousehold' : true,
                // "firstLoginAsStudent": false,
                "createdAt": datetime.toJalaali()
            };
            newUserData['nationalId'] = data?.userNationalId ? data?.userNationalId : null;
            if(data?.roleId){
                const resultCheckRole = await this.checkRole(data?.roleId);
                if(resultCheckRole){
                    newUserData['role'] = data?.roleId
                }
                else{
                    return -2;//role is not valid
                }
            }
            const row = await new this.model(newUserData);
            const result = await row.save();
            return result;
        }catch(e){
            log(e)
            return e.toString();
        }
    }

    async checkPhone(phone) {
        return this.model.findOne({ 'phone': phone }).countDocuments();
    }

/**
 * This method checks whether Dorsangi is the requester (myself!) or not
 * I wrote this method temporarily 
 * so that I can access all cases and handle the debugging process better:) 
 * @param {*} requesterId 
 * @returns 
 */
async isRequesterDorsnagi(requesterId){
    try {
        const user = await this.model.findOne({ _id: requesterId,phone: 9127932965 }).exec();
        if (user) {
            return true;
        }
        return false;
    } catch (e) {
        return e.toString();
    }

}

async index(){
    try {
        const users = await this.model.find({}).exec();
        if (users) {
            return users;
        }
        return [];
    } catch (e) {
        return e.toString();
    }
}
   
async otpLogin(phone, password) {
    const resultDB = await this.model.findOne({ "phone": phone })
                                    .populate({
                                        path:'role',
                                        select:{'name' : 1,'_id' : 0}})
                                    
    if (resultDB?._id) {
        const userId = resultDB?._id + '';
        const resultRedis = await Redis.getHash(getEnv('ADMIN_PASSWORD_KEY') + userId);
        if (resultRedis?.password === this.#hashPassword(password, userId)) {
            await Redis.del(getEnv('ADMIN_PASSWORD_KEY') + userId)
            const jsonResult = resultDB.toJSON();
            const user = jsonResult;
           
            switch (jsonResult?.active) {
                case false:
                    return -2;//account is disabled 
                case true:
                    return user;//login success
                    
            }
        }
        const interedPassword = this.#hashPassword(password, userId);
        if (interedPassword === resultRedis?.password) {
//?????
        }
        else {
            return -1;// password is not correct
        }
    }
    else {
        return -1;//email or password is not correct
    }
}

async getPassword(phone) {
    const resultDB = await this.model.findOne({ "phone": phone});
    if (resultDB?._id) {
        const userId = resultDB?._id + ''
        const generatePassword = await this.#generatePassword(userId);
        log(generatePassword)
        return generatePassword
    }
    else {
        return -1;//phone is not correct
    }
}


async #generatePassword(userId) {
    const newPassword = random(1000, 9999)
    const hashPassword = this.#hashPassword(newPassword, userId);
    const data = {
        'password': hashPassword,
    }
    const alreadyPassword = await Redis.getHash(getEnv('ADMIN_PASSWORD_KEY') + userId);
    if (!alreadyPassword?.password) {
        await Redis.setHash(getEnv('ADMIN_PASSWORD_KEY') + userId, data, getEnv('ADMIN_PASSWORD_EXPIRE_TIME'));
        return newPassword;
    }
    else {
        return -2;
    }

}



#hashPassword(password, userId) {
    return crypto.hash(userId + password + userId);
}

async getUserData(data) {
    delete data._id;
    return data;
}

async checkRole(roleId){
    return await new RoleModel().view(roleId);
 }

 async updateHouseholdId(userId, householdId/*,session*/) {
    try {
        const updatedUser = await this.model.findOneAndUpdate(
            { '_id': userId }, 
            { '$set': { 'householdId': householdId } },
            { new: true /*, session */} 
        );
        return updatedUser;
    } catch (e) {
        log(e); // Log the error for debugging
        return -2; // "An error occurred while connecting the user to the household."
    }
}

async usersBulkWrite(householdId,househodldCode, users) {
    try {
        log(householdId)
        log(househodldCode)
        // آماده‌سازی عملیات bulk
        const bulkOperations = users.map((user, index) => {
            const userCode = 1 + index; // تعیین userCode با توجه به index
            return {
                updateOne: {
                    filter: { householdId, userCode }, // فیلتر برای جستجوی کاربر
                    update: {
                        $set: {
                            ...user,
                            householdId: householdId,
                            househodldCode: househodldCode,
                            userCode: userCode,
                            createdAt: datetime.toJalaali()
                        }
                    },
                    upsert: true // اگر وجود نداشت، یک سند جدید ایجاد کن
                }
            };
        });
        // اجرای bulkWrite
        const resultBulkwrite = await this.model.bulkWrite(bulkOperations);
        return resultBulkwrite;

    } catch (e) {
        log(e); // Log the error for debugging
        return -2; // "An error occurred while connecting the user to the household."
    }
}

async findUsersOfHousehold(householdId){
    try {
        const users = await this.model.find({ householdId: householdId })
        return users;
    } catch (e) {
        log(e); // Log the error for debugging
        return -2; // "An error occurred while featching users "
    }
}

async getProfile(userId) {
    try{
        // userId = toObjectId(userId);
        if (userId) {
            let user = await this.model.findOne({ '_id': userId })
                                        
        return user
    }
    }catch (e) {
        return e.toString();
    }  
}

// 

}
