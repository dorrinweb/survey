import mongoose from 'mongoose';
import { MongoDB, Redis } from '../../global.js';
import Token from '../../core/token.js';
import { getEnv, log, random, toObjectId } from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';
import UserModel from '../users/userModel.js'
import HouseHoldModel from '../houseHolds/houseHoldModel.js'
import TripModel from '../trips/tripModel.js'

export default class AdminModel {
    constructor() {
        
        this.userModel = new UserModel()
        this.houseHoldModel = new HouseHoldModel()
        this.tripModel = new TripModel()


    }



/**
 * This method checks whether Dorsangi is the requester (myself!) or not
 * I wrote this method temporarily 
 * so that I can access all cases and handle the debugging process better:) 
 * @param {*} requesterId 
 * @returns 
 */


async getHouseholds({ page, limit, skip }) {
    try {
        const allHouseholds = await  this.houseHoldModel.findHouseholds({ page, limit, skip })
        return allHouseholds
    } catch (e) {
        console.error(e);
        return {
            data: [],
            total: 0
        };
    }
}

async getTrips({ page, limit, skip }) {
    try {
        const allTrips = await  this.tripModel.findTrips({ page, limit, skip })
        return allTrips
    } catch (e) {
        console.error(e);
        return {
            data: [],
            total: 0
        };
    }
}

async getUsers({ page, limit, skip }) {
    try {
            const allUsers = await  this.userModel.findUsers({ page, limit, skip })
            return allUsers
     
    } catch (e) {
        console.error(e);
        return {
            data: [],
            total: 0
        };
    }
}

async getStats() {
    try {
        const [
            usersCount,
            householdsCount,
            tripsCount
        ] = await Promise.all([
            this.userModel.model.countDocuments(),
            this.houseHoldModel.model.countDocuments(),
            this.tripModel.model.countDocuments()
        ]);

        return {
            usersCount,
            householdsCount,
            tripsCount
        };

    } catch (e) {
        console.error(e);
        return {
            usersCount: 0,
            householdsCount: 0,
            tripsCount: 0
        };
    }
}


}


