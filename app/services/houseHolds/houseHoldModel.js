import mongoose from 'mongoose';
import { MongoDB, Redis } from '../../global.js';
import HouseHoldSchema from './houseHoldSchema.js';
import Token from '../../core/token.js';
import { getEnv, log, random, toObjectId } from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';
import UserModel from '../users/userModel.js'

export default class HouseHoldModel {
    constructor() {
        this.model = MongoDB.db.model('houseHold', HouseHoldSchema);
        this.userModel = new UserModel()


    }


    async add(householdData, userId) {
        const session = await this.model.startSession();
        session.startTransaction();
        try {
            //Step 0 :checking user has any househodes
            const userHousehold =  await this.model.findOne({'houseHoldeId' : userId}).countDocuments();
            if(userHousehold > 0)
                log(userHousehold)
            // Step 1: Get the last householdCode
            const lastHousehold = await this.model.findOne().sort({ householdCode: -1 }).exec();
            let newHouseholdCode = 10001; // Default starting value for householdCode
    
            if (lastHousehold) {
                newHouseholdCode = lastHousehold.householdCode + 1; // Increment last householdCode
                return -4
            }
            // Step 2: Add householdCode and create household
            householdData.householdCode = newHouseholdCode;
            householdData.createdAt = datetime.toJalaali();
            const row = new this.model(householdData);
            const newHousehold = await row.save({ session });
            // Step 3: Update user's householdId
            const resultUpdateUser = await this.userModel.updateHouseholdId(userId,newHousehold?._id,session);
            if (!resultUpdateUser?._id) {
                await session.abortTransaction();
                session.endSession();
                return -1;   
            }
            // Commit transaction
            await session.commitTransaction();
            session.endSession();
            return newHousehold;
        } catch (e) {
            // Rollback transaction in case of error
            await session.abortTransaction();
            session.endSession();
            log(e); // Log the error for debugging
            return -2;
   
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
        const houseHold = await this.model.findOne({ _id: requesterId,phone: 9127932965 }).exec();
        if (houseHold) {
            return true;
        }
        return false;
    } catch (e) {
        return e.toString();
    }

}

async index(){
    try {
        const houseHolds = await this.model.find({}).exec();
        if (houseHolds) {
            return houseHolds;
        }
        return [];
    } catch (e) {
        return e.toString();
    }
}

}


