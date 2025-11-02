import mongoose from 'mongoose';
import { MongoDB, Redis } from '../../global.js';
import CarSchema from './carSchema.js';
import { getEnv, log, random, toObjectId, removeKeysFromObject } from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import UserModel from '../users/userModel.js';

import { uploadFile, removeFileFromServer, getFilePath } from '../../core/uploader.js';
import { decode } from 'html-entities';

export default class CarModel {
    constructor() {
        this.model = MongoDB.db.model('car', CarSchema);
        this.collation = { locale: 'fa', strength: 2 }

    }
    /**
     * 
     * @param {lawyerId,title,description,status,subject,reference,clientsName,carClass,createdById,} data 
     * @returns 
     * If there is a duplicate or similar cars 
     *   (based on the similarity of the file class or the simultaneous similarity of the file title and client names), 
     *   it returns similar cars Array.
     * If there is a problem inserting the car, the error is returned.
     * If the car is successful, the saved car information
     */
    async add(data) {
        const session = await this.model.startSession();
        session.startTransaction();
        try {
            const lawyerId = data?.lawyerId;
            const title = data?.title;
            const description = data?.description;
            const status = data.status;
            const subject = data?.subject;
            const reference = data?.reference;
            const clientsName = data?.clientsName;
            const carClass = data?.carClass;
            const createdById = data?.createdById;
            

            if (duplicatedCarClass.length > 0)
                return duplicatedCarClass;// car is already exists
            const carData = {
                "lawyerId": lawyerId,
                "title": title,
                "description": description,
                "subject": subject,
                "reference": reference,
                "status": status,
                "clientsName": clientsName,
                "carCode": randomCode,
                "carClass": carClass,
                "createdById": createdById,
                "createdAt": datetime,
            };
            const row = await new this.model(carData);
            const result = await row.save({ session });
            await session.commitTransaction();
            session.endSession();
            return result;
        } catch (e) {
            await session.abortTransaction();
            session.endSession();
            log(e)
            return e.toString();
        }
    }
  
    async index(data) {
        try {
            const title = data?.title;
            const caseCode = data?.caseCode;
            const caseClass = data?.caseClass;
            const reference = data?.reference;
            const status = data?.status;
            const subject = data?.subject;
            const clientsName = data?.clientsName;
            const sortBy = data?.sortField;
            const sortMode = data?.sortType;
            let finalResult = {}
            let where = {};
            if (title !== '' && title !== undefined) {
                where['title'] = { $regex: '.*' + title + '.*', "$options": "i" };
            }
            if (caseCode !== '' && caseCode !== undefined) {
                where['caseCode'] = { $regex: '.*' + caseCode + '.*', "$options": "i" };
            }
            if (caseClass !== '' && caseClass !== undefined) {
                where['caseClass'] = { $regex: '.*' + caseClass + '.*', "$options": "i" };
            }

            if (reference !== '' && reference !== undefined) {
                where['reference'] = { $regex: '.*' + reference + '.*', "$options": "i" };
            }

            if (status !== '' && status !== undefined) {
                where['status'] = status;
            }

            if (subject !== '' && subject !== undefined) {
                where['subject'] = subject;
            }

            if (Array.isArray(clientsName) && clientsName.length > 0) {
                where['$and'] = clientsName.map(name => ({
                    'clientsName': { $regex: '.*' + name + '.*', "$options": "i" }
                }));
            }
            //if the requester is Dorsangi, she can view all cases for debuging
            const userModelClass = new UserModel();
            const isRequesterDorsnagi = await userModelClass.isRequesterDorsnagi(data?.requesterId);
            if (!isRequesterDorsnagi) {
                where['createdById'] = data?.requesterId;
            }
            const result = await this.model.find(where)
                .sort([[sortBy, sortMode]]);
            finalResult['cases'] = result;
            finalResult['numOfEmptyCaseClass'] = await this.countRecordsWithEmptyField(data?.requesterId, isRequesterDorsnagi, 'caseClass');
            finalResult['numOfEmptyReference'] = await this.countRecordsWithEmptyField(data?.requesterId, isRequesterDorsnagi, 'reference');
            finalResult['numOfEmptyStatus'] = await this.countRecordsWithEmptyField(data?.requesterId, isRequesterDorsnagi, 'status');
            finalResult['numOfEmptySubject'] = await this.countRecordsWithEmptyField(data?.requesterId, isRequesterDorsnagi, 'subject');

            return finalResult;
        } catch (e) {
            log(e)
            return e.toString();
        }
    }



    /**
     * Cases can be fetched based on their "id" and "slug"; 
     * This method used in add method in step model.If you change it check that! 
     * @param {*} id or slug 
     * @param {*} requesterId 
     * @returns  If record not found -1; 
               * If record is available but the requester is not owner and not allowed to view -2;
               * If everything is correct general case informations and first name and last name of its creator;
     */
    async view(id, requesterId) {
        try {
            let query = { $or: [{ 'caseCode': id }] };
            //if the requester is Dorsangi, she can view all cases for debuging
            const userModelClass = new UserModel();
            const isRequesterDorsnagi = await userModelClass.isRequesterDorsnagi(requesterId);
            if (!isRequesterDorsnagi)
                query['createdById'] = requesterId;
            // Check if slug is a valid ObjectId
            if (toObjectId(id) !== '') {
                query.$or.push({ '_id': id });
            }
            let currentCase = await this.model.findOne(query)
            if (!currentCase?._id)
                return -1; //case not found;
            return currentCase;
        } catch (e) {

            return e.toString();
        }
    }

    async edit(data, options = {}) {
        try {
            const session = options.session;
            const requesterId = data?.requesterId;
            let caseId = data?.caseId;
            let query = { 'createdById': requesterId, $or: [{ 'caseCode': caseId }] };
            // Check if slug is a valid ObjectId
            if (toObjectId(caseId) !== '') {
                query.$or.push({ '_id': caseId });
            }
            const currentCase = await this.model.findOne(query).session(session);
            if (!currentCase?._id)
                return -1; // bot not found
            caseId = currentCase?._id;

            let caseNewData = {
                "modifiedAt" : datetime
            }
            if (data?.title !== undefined)
                caseNewData['title'] = data?.title;
            if (data?.description !== undefined)
                caseNewData['description'] = data?.description;
            if (data?.caseClass !== undefined)
                caseNewData['caseClass'] = data?.caseClass;
            if (data?.status !== undefined)
                caseNewData['status'] = data?.status;
            if (data?.subject !== undefined)
                caseNewData['subject'] = data?.subject;
            if (data?.reference !== undefined)
                caseNewData['reference'] = data?.reference;
            if (data?.clientsName !== undefined)
                caseNewData['clientsName'] = data?.clientsName;
            if (data?.clientsPhone !== undefined)
                caseNewData['clientsPhone'] = data?.clientsPhone;
    
            const resultUpdate = await this.model.findOneAndUpdate(
                { '_id': caseId },
                { '$set': caseNewData },
                { returnOriginal: false, session }
            )
            return {'updatedCase':resultUpdate,caseIsDup};
        } catch (e) {
            return e.toString();
        }
    }
/**
 * This method checks whether the requesting user is the owner of the file or not.
 * @param {*} requesterId 
 * @param {*} caseId 
 * @returns true or false
 */
    async isCaseOwner(requesterId,caseId) {
        const caseCount = await this.model.findOne({ $and: [{ '_id': caseId }, { 'createdById': requesterId }] }).countDocuments();
        return (caseCount > 0) ? true : false;
    }

}


