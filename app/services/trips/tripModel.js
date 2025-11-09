import mongoose from 'mongoose';
import { MongoDB, Redis } from '../../global.js'
import TripSchema from './tripSchema.js';
import { getEnv, log, random, toObjectId, removeKeysFromObject } from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import UserModel from '../users/userModel.js';

import { decode } from 'html-entities';

export default class TripModel {
    constructor() {
        this.model = MongoDB.db.model('trip', TripSchema);
        this.collation = { locale: 'fa', strength: 2 };
        this.userModel = new UserModel()


    }
    

/**
 * Adds a new trip or assigns a user to an existing trip.
 * 
 * 1. Checks if a trip with the same title already exists.
 * 2. If the trip exists, it checks whether the user is already assigned to that trip. If not, the user is added to the trip.
 * 3. If the trip doesn't exist, a new trip is created and the user is assigned to it.
 * 
 * @param {Object} data - The data required to add a trip.
 * @param {string} data.requesterId - The ID of the user requesting the trip creation.
 * @param {string} data.title - The title of the trip.
 * @returns {Promise<Object|string>} - Returns the existing trip if found, the newly created trip if added, or an error message.
 * 
 * @throws {Error} - Throws an error if the database operation fails.
 */    
async add(data) {
    const session = await this.model.startSession(); // Start a transaction session
    session.startTransaction();
    try {
        // Get userId and trips from the input data
        const { userId, requesterId, trips } = data;
        // Validate trips array
        if (!Array.isArray(trips) || trips.length === 0) {
            // Invalid trips array
            return -1;
        }

        // Delete existing trips for the user
        await this.model.deleteMany({ userId }, { session });

        // Variable to keep track of the previous trip's destination
        let previousDestination = null;

        // Prepare trips data with auto-generated trip numbers and userId
        const userInfo = await this.userModel.getProfile(userId)
        const userCode = userInfo?.userCode;
        const householdCode = userInfo?.householdCode;
        const tripsToInsert = trips.map((trip, index) => {
            // Check and set departure for trips (from the second trip onward)
            if (index > 0 && (!trip.departure.location || trip.departure.location == '') && previousDestination) {
                trip.departure = previousDestination; // Use previous destination as departure
            }

            // Update previous destination for the next trip
            previousDestination = trip.destination;

            return {
                ...trip, // Include all trip data from the input
                tripNumber: 1 + index, // Auto-generate trip number starting from 1
                userId, // Set the userId from input data
                userCode,
                householdCode,
                createdById: requesterId, // Set the ID of the requester who is creating the trips
                createdAt: datetime.toJalaali(), // Set the creation date in Jalaali format
            };
        });
        // Insert all trips at once using insertMany
        const newTrips = await this.model.insertMany(tripsToInsert, { session });
        const updateUserHasTrip = this.userModel.updateUserHasTrip(userId,true)
        // Commit the transaction and return the inserted trips
        await session.commitTransaction();
        session.endSession();

        return newTrips; // Return the newly inserted trips
    } catch (e) {
        // Rollback the transaction and return the error
        await session.abortTransaction();
        session.endSession();
        log(e); // Log the error for debugging
        return -2; // Return error code -2 for failure
    }
}
   /**
 * Checks if a trip with the same title already exists.
 * 
 * @param {string} title - The title of the trip to check for duplicates.
 * @returns {Object|null} - The existing trip object if found, otherwise null.
 */
    async isDupTitle(title) {
        try{
            return await this.model.findOne({ title }).exec();
        }catch(e){
            log(e)
            return e.toString();

        }
    }
/**
 * Retrieve trips assigned to a specific user, leveraging the userTrips model for optimized performance.
 *
 * @param {Object} data - Parameters for filtering and sorting trips.
 * @param {string} data.requesterId - The ID of the user whose trips are retrieved.
 * @param {string} [data.title] - Optional title filter for trips (case-insensitive partial match).
 * @param {string} [data.sortField='createdAt'] - Field to sort the results by (default is 'createdAt').
 * @param {number} [data.sortType=-1] - Sort order: -1 for descending, 1 for ascending (default is -1).
 * @returns {Promise<Object>} - An object containing filtered and sorted trips with their titles and IDs.
 *
 * Note: To enhance performance, the trip fetching logic is implemented in the userTrips model 
 * (indexTripsByUser method) and called here for reusability and efficiency.
 */
    async index(userId) {
        try {
            const result = await this.model.find({'userId' : userId}); // Fetch data from userTrips model
            return result;
        } catch (error) {
            log(error); // Log any errors for debugging
            return -1; // Return error as a string
        }
    }     
}
