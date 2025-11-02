import mongoose from 'mongoose';
import { MongoDB, Redis } from '../../global.js'
import UserTagSchema from './userTagSchema.js';
import { getEnv, log, random, toObjectId, removeKeysFromObject } from '../../core/utils.js';
import datetime from '../../core/datetime.js';


export default class UserTagModel {
    constructor() {
        this.model = MongoDB.db.model('userTag', UserTagSchema);
        this.collation = { locale: 'fa', strength: 2 }

    }
/**
 * Assign a user to an existing tag if not already assigned.
 *
 * @param {string} userId - The ID of the user to assign.
 * @param {string} tagId - The ID of the tag to assign the user to.
 * @param {Object} session - Mongoose session object for transaction handling.
 * @returns {Promise} - Resolves when the user is assigned to the tag.
 */
async assignUserToTag(userId, tagId, session) {
    try {
        // Check if the user is already assigned to this tag
        const existingAssignment = await this.model.findOne({ userId, tagId }).session(session);
        if (!existingAssignment) {
            // Assign user to the tag if not already assigned
            const [newAssignment] = await this.model.create([{ userId, tagId }], { session });
            return newAssignment._id; // Return the _id of the new assignment
        }else
            return 1; // Return the _id of the existing assignment
    } catch (e) {
        log(e)
            return e.toString();
    }
}

/**
 * Retrieve tags assigned to a specific user with optional filtering by title.
 *
 * @param {Object} data - Parameters for filtering and sorting tags.
 * @param {string} data.requesterId - The ID of the user whose tags are retrieved.
 * @param {string} [data.title] - Optional title filter for tags (case-insensitive partial match).
 * @param {string} [data.sortField='createdAt'] - Field to sort the results by (default is 'createdAt').
 * @param {number} [data.sortType=-1] - Sort order: -1 for descending, 1 for ascending (default is -1).
 * @returns {Promise<Object>} - An object containing an array of filtered and sorted tags with their titles and IDs.
 */
    async indexTagsByUser(data) {
        try {
            const { requesterId, title, sortField = 'createdAt', sortType = -1 } = data;

            // Match conditions for filtering by title
            const matchConditions = {};
            if (title && title.trim() !== '') {
                matchConditions['tags.title'] = { $regex: '.*' + title + '.*', $options: 'i' };
            }

            // Aggregation pipeline to retrieve and filter user tags
            const aggregationPipeline = [
                {
                    $match: {
                        userId: toObjectId(requesterId), // Filter userTags by userId
                    },
                },
                {
                    $lookup: {
                        from: 'tags', // Target collection (tags)
                        localField: 'tagId', // Field in userTags referencing tagId
                        foreignField: '_id', // Field in tags referencing _id
                        as: 'tags', // Resulting field with matched tags
                    },
                },
                {
                    $unwind: '$tags', // Decompose the tags array into individual documents
                },
                {
                    $match: {
                        ...matchConditions, // Apply title filter if provided
                    },
                },
                {
                    $sort: { [`tags.${sortField}`]: sortType }, // Sort by the specified field and order
                },
                {
                    $project: {
                        _id: '$tags._id', // Only return tag ID
                        title: '$tags.title', // Only return tag title
                    },
                },
            ];

            const result = await this.model.aggregate(aggregationPipeline).exec(); // Execute aggregation pipeline
            return { tags: result }; // Return tags in the desired format
        } catch (error) {
            log(error); // Log any errors for debugging
            return error.toString(); // Return error as a string
        }
    }
/**
 * This method checks whether the requesting user is a user of this tag or not.
 * @param {*} requesterId 
 * @param {*} tagId 
 * @returns true or false
 */
    async isTagOwner(requesterId,tagId) {
        const tagCount = await this.model.findOne({ $and: [{ 'tagId': tagId }, { 'userId': requesterId }] }).countDocuments();
        return (tagCount > 0) ? true : false;
    }


}
