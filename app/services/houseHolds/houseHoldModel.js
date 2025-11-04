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
            const userHousehold =  await this.model.findOne({'createdById' : userId});
            if (userHousehold?._id) 
                return userHousehold
            
            // Step 1: Get the last householdCode
            let newHouseholdCode = 10001; // Default starting value for householdCode
            // Step 2: Add householdCode and create household
            householdData.householdCode = newHouseholdCode;
            householdData.createdAt = datetime.toJalaali();
            householdData.createdById = userId;
            const row = new this.model(householdData);
            const newHousehold = await row.save(/*{ session }*/);

            // Step 3: Update user's householdId
            const resultUpdateUser = await this.userModel.updateHouseholdId(userId,newHousehold?.id/*,session*/);
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

async updateMembers(householdId, userIds, session){
    try{
        // Update the household's members and membersCount using the session
        const updatedHousehold = await this.findByIdAndUpdate(
            householdId,
            {
                $addToSet: { members: { $each: userIds } }, // Add user IDs to 'members' array (prevent duplicates)
                // $set: { membersCount: userIds.length }, // Update the members count
            },
            { new: true, session } // Use the session for transaction
        );

        // Return the updated household
        return updatedHousehold;

    }catch (e) {
        log(e); // Log the error for debugging
        return -2;

    }
}



async addUsersToHousehold(householdId, users){
    //     const session = await this.model.startSession();
    //     session.startTransaction();
        try {
    //         // Prepare bulk operations for inserting users
            const usersBulkWriteResult = await this.userModel.usersBulkWrite(householdId,users/*, { session }*/);
    
    //         // Extract inserted user IDs
    //         const insertedUserIds = bulkWriteResult.insertedIds.map((id) => id._id);
    //         const resultUpdateHouseHold = await this.houseHoldModel.updateMembers(householdId, insertedUserIds, session)
    //         // Commit the transaction
    //         await session.commitTransaction();
    //         session.endSession();
            return usersBulkWriteResult
    
     
        } catch (e) {
    //         // Rollback transaction in case of error
    //         await session.abortTransaction();
    //         session.endSession();
            log(e); // Log the error for debugging
            return -2;
    
            }
    }


}


