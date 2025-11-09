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
            // Step 0: Checking if the user has any households
            const userHousehold = await this.model.findOne({ 'createdById': userId });
            if (userHousehold?._id) 
                return userHousehold;
    
            // Step 1: Get the last householdCode
            const lastHousehold = await this.model.findOne({}, 'householdCode').sort({ householdCode: -1 }); // جستجوی آخرین householdCode
            const newHouseholdCode = lastHousehold ? lastHousehold.householdCode + 1 : 10001; // افزایش 1 یا استفاده از 10001
    
            // Step 2: Add householdCode and create household
            householdData.householdCode = newHouseholdCode;
            householdData.createdAt = datetime.toJalaali();
            householdData.createdById = userId;
            const newHousehold = new this.model(householdData);
            await newHousehold.save(); // می‌توانید session را در اینجا فعال کنید
    
            // Step 3: Update user's householdId

            const resultUpdateUser = await this.userModel.updateHouseholdId(userId, newHousehold._id); // استفاده از _id به جای id
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


    async view(requesterId) {
        try {
            // Query household based on requesterId
            let query = { 'createdById': requesterId };
    
            // Find the household created by the requester
            let currentHousehold = await this.model.findOne(query)
                .populate({
                    path: 'createdById',
                    select: ['firstName', 'lastName']
                });
    
            // Check if household was found
            if (!currentHousehold?._id) {
                return -1; // Household not found
            }
    
            // Use the findUsersOfHousehold method to get household members
            const householdMembers = await this.userModel.findUsersOfHousehold(currentHousehold._id);
    
            // Add individuals key to currentHousehold
            currentHousehold.individuals = householdMembers;
    
            // Format the output for household data
            const householdData = {
                address: currentHousehold.address,
                householdCount: currentHousehold.householdCount,
                carCount: currentHousehold.carCount,
                parkingSpacesCount: currentHousehold.parkingSpacesCount,
                postCode: currentHousehold.postCode,

            };
    
            // Return the formatted output
            return {
                householdData,
                individuals: currentHousehold.individuals // Return the individuals array
            };
        } catch (e) {
            return e.toString(); // Return the error as a string
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


async findHouseholds({ page, limit, skip }) {
    try {
        const [ouseholds, total] = await Promise.all([
            this.model.find({})
                .skip(skip)
                .limit(limit)
                .exec(),
            this.model.countDocuments()
        ]);

        return {
            data: ouseholds,
            total
        };
    } catch (e) {
        console.error(e);
        return {
            data: [],
            total: 0
        };
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



async addUsersToHousehold(householdInfo, users){
    //     const session = await this.model.startSession();
    //     session.startTransaction();
        try {
            const householdId = householdInfo?._id
            const householdCode = householdInfo?.householdCode

    //         // Prepare bulk operations for inserting users
            const usersBulkWriteResult = await this.userModel.usersBulkWrite(householdId,householdCode,users/*, { session }*/);
    
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


