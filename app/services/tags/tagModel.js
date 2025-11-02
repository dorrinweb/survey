import mongoose from 'mongoose';
import { MongoDB, Redis } from '../../global.js'
import TagSchema from './tagSchema.js';
import { getEnv, log, random, toObjectId, removeKeysFromObject } from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import UserTagModel from './userTagModel.js';
import UserModel from '../users/userModel.js';

import { decode } from 'html-entities';

export default class TagModel {
    constructor() {
        this.model = MongoDB.db.model('tag', TagSchema);
        this.collation = { locale: 'fa', strength: 2 }

    }
    

/**
 * Adds a new tag or assigns a user to an existing tag.
 * 
 * 1. Checks if a tag with the same title already exists.
 * 2. If the tag exists, it checks whether the user is already assigned to that tag. If not, the user is added to the tag.
 * 3. If the tag doesn't exist, a new tag is created and the user is assigned to it.
 * 
 * @param {Object} data - The data required to add a tag.
 * @param {string} data.requesterId - The ID of the user requesting the tag creation.
 * @param {string} data.title - The title of the tag.
 * @returns {Promise<Object|string>} - Returns the existing tag if found, the newly created tag if added, or an error message.
 * 
 * @throws {Error} - Throws an error if the database operation fails.
 */    
async add(data) {
    const session = await this.model.startSession();
    session.startTransaction();
    try {
        const { requesterId, title } = data;
        const userTagModelClass = new UserTagModel();
        // Check if a tag with the same title already exists
        const existingTag = await this.isDupTitle(title);

        let assignmentId;
        if(typeof existingTag == 'string') { //It means that we have an error in isDupTitle methode!
            await session.abortTransaction();
            session.endSession();
            return -1;     
        }
        if (existingTag?._id) {
            // If the tag exists, assign the user to it
            assignmentId = await userTagModelClass.assignUserToTag(requesterId, existingTag._id, session);
            if(typeof assignmentId == 'string') { //It means that we have an error in assignUserToTag methode!
                await session.abortTransaction();
                session.endSession();
                return -2;     
            }
            if(assignmentId == 1){// tag is already exists and requester is already tag user.
                await session.commitTransaction();
                session.endSession();
                return [existingTag]
            }
            if(toObjectId(assignmentId)){
                await session.commitTransaction();
                session.endSession();
                return existingTag
            }
        } else {
            // If the tag doesn't exist, create a new tag
            const tagData = {
                title,
                createdById: requesterId,
                createdAt: new Date(),
            };
            const newTag = await this.model.create([tagData], { session });
            assignmentId = await userTagModelClass.assignUserToTag(requesterId, newTag[0]._id, session);
            if(typeof assignmentId == 'string') { //It means that we have an error in assignUserToTag methode!
                await session.abortTransaction();
                session.endSession();
                return -2;     
            }
              // Commit the transaction and return the tag
            await session.commitTransaction();
            session.endSession();
            return newTag[0];
        }
    } catch (e) {
        // Handle error: abort the transaction and return the error
        await session.abortTransaction();
        session.endSession();
        log(e);
        return e.toString();
    }
}

   /**
 * Checks if a tag with the same title already exists.
 * 
 * @param {string} title - The title of the tag to check for duplicates.
 * @returns {Object|null} - The existing tag object if found, otherwise null.
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
 * Retrieve tags assigned to a specific user, leveraging the userTags model for optimized performance.
 *
 * @param {Object} data - Parameters for filtering and sorting tags.
 * @param {string} data.requesterId - The ID of the user whose tags are retrieved.
 * @param {string} [data.title] - Optional title filter for tags (case-insensitive partial match).
 * @param {string} [data.sortField='createdAt'] - Field to sort the results by (default is 'createdAt').
 * @param {number} [data.sortType=-1] - Sort order: -1 for descending, 1 for ascending (default is -1).
 * @returns {Promise<Object>} - An object containing filtered and sorted tags with their titles and IDs.
 *
 * Note: To enhance performance, the tag fetching logic is implemented in the userTags model 
 * (indexTagsByUser method) and called here for reusability and efficiency.
 */
    async index(data) {
        try {
            const userTagModelClass = new UserTagModel();
            const result = await userTagModelClass.indexTagsByUser(data); // Fetch data from userTags model
            return result;
        } catch (error) {
            log(error); // Log any errors for debugging
            return error.toString(); // Return error as a string
        }
    }     
}
