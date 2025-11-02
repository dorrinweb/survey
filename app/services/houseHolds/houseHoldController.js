import BaseController from '../../core/BaseController.js'
import { log, getEnv, sleep, random, getPath, toJSON, convertToEnglishNumber,toObjectId } from '../../core/utils.js'
import { uploadFile , removeFileFromServer } from '../../core/uploader.js'
import translate from '../../core/translate.js'
import { Redis,io,Logger } from '../../global.js'
import crypto from '../../core/crypto.js'
import datetime from '../../core/datetime.js'
import HouseHoldModel from './houseHoldModel.js';
import * as houseHoldValidation from './houseHoldValidations.js'
import { fileExists, unlink,mkDir } from '../../core/fs.js'
import Token from '../../core/token.js'
import sms from '../../core/sms.js'
import http from '../../core/http.js'
import cookieParser from 'cookie-parser'
import xml2js from 'xml2js'

export default class HouseHoldController extends BaseController {
    #currentUrl = getEnv('APP_URL') + 'houseHold/';
    constructor() {
        super();
        this.model = new HouseHoldModel();

        
    }
    async add(req, res) {
        try {
            const requesterId = this.safeString(this.input(req?.userToken?.userId));
            if (this.toObjectId(requesterId) === '') {
                return res.status(203).json({ "code": 2, "msg": translate.t('id_is_invalid'), 'isAuth': 0 });
            }
    
            const address = this.safeString(req.body?.address);
            const monthlyIncome = this.safeString(req.body?.monthlyIncome);
            const monthlyExpenses = this.safeString(req.body?.monthlyExpenses);
            const parkingCarCount = this.toNumber(req.body?.parkingCarCount);
            const carCount = this.toNumber(req.body?.carCount);
            const householdCount = this.toNumber(req.body?.householdCount);
            const hasParking = req.body?.hasParking;
    
            // Create household data
            const householdData = {
                address,
                householdCount,
                carCount: carCount,
                monthlyIncome: monthlyIncome || null,
                monthlyExpenses: monthlyExpenses || null,
                hasParking: hasParking || false,
                parkingCarCount: parkingCarCount || null,
                members: [requesterId] // Add the current user as the first member
            };
    
            // Call model to add household and update user's householdId
            const resultAdd = await this.model.add(householdData, requesterId);
    
            // Handle response based on model return value
             if (resultAdd === -4) {
                return res.status(403).json({ "code": -4, "msg": translate.t('household_already_exists'), 'isAuth': 0 });
            } else if (resultAdd === -1) {
                return res.status(400).json({ "code": -5, "msg": translate.t('update_user_faild'), 'isAuth': 0 });
            } else if (resultAdd === -2) {
                return res.status(500).json({ "code": -500, "msg": translate.t('add_record_faild'), 'isAuth': 0 });
            } else if (resultAdd?._id) {
                return res.status(201).json({ "code": 0, "msg": translate.t('successfuly_add'), "data": resultAdd, 'isAuth': 0 });
            } else {
                return res.status(500).json({ "code": -500, "msg": translate.t('unknown_error'), 'isAuth': 0 });
            }
    
        } catch (e) {
            super.toError(e, req, res);
        }
    }
    async addOld(req, res) {
        try {
            const requesterId = this.safeString(req.headers['x-token']);
            //cheking lawyerId is a mongoos id
            if (this.toObjectId(requesterId) === '')
                return res.status(203).json({ "code": 2, "msg": translate.t('id_is_invalid'), 'isAuth': 0 });
            // const title = normalizePersianString((this.safeString(req.body?.title)));
            const address = (this.safeString(req.body?.address));
// 
            const validationErrors = await tagValidation.add(req);
            if (!validationErrors.isEmpty()) {
                const errorMessage = validationErrors?.errors[0].msg;
                return res.status(203).json(errorMessage)
            }
            const data = {
                "requesterId": requesterId,
                "address": address,
            };

            const resultAddTag = await this.model.add(data);
            if (typeof resultAddTag === 'number') {
                switch (resultAddTag) {
                    case -1:
                        return res.status(501).json({ "code": -1, "msg": translate.t('add_record_faild'), "data": 'duplicatedTages' , 'isAuth': 0 });
                    break;
                    case -2:
                        return res.status(501).json({ "code": -2, "msg": translate.t('add_record_faild'), "data":  'duplicatedTages' , 'isAuth': 0 });
                        break;
                }
            }
            if (Array.isArray(resultAddTag)) {
                duplicatedTages = resultAddTag;
                return res.status(406).json({ "code": -3, "msg": translate.t('tag.already_tag'), "data": { duplicatedTages, newTag }, 'isAuth': 0 });
            }
            if (resultAddTag?._id) {
                newTag = resultAddTag;
                Logger.logToFile('tag.log', req.originalUrl, req.method, 'The user by Id : ' + requesterId + ' created a new tag by Id : .' + resultAddTag?._id);
                return res.json({ "code": 0, "msg": translate.t('successfuly_add'), "data": { duplicatedTages, newTag }, 'isAuth': 0 });
            }
            else {
                return res.status(501).json({ "code": -4, "msg": translate.t('add_record_faild'), "data": { duplicatedTages, newTag }, 'isAuth': 0 });
            }

        } catch (e) {
            super.toError(e, req, res);
        }
    }
    async index(req, res) {
        try {
            const resultHouseHoldList = await this.model.index();            
            if (typeof resultHouseHoldList === 'number') {
                switch (resultHouseHoldList) {
                    case -1:
                        return res.status(406).json({ "code": 7, "msg": translate.t('houseHold.duplicate_phone'), 'isAuth': 0 });
                        break;
                }
            }
            else {
                if (resultHouseHoldList.length > 0) {
                    return res.json({ "code": 0,"data": resultHouseHoldList,'isAuth': 0 });
                }
                else {
                    return res.status(501).json({ "code": 9, "msg": translate.t('houseHold.rigister_faild'), 'isAuth': 0 });
                }
            }

        } catch (e) {
            super.toError(e, req, res);
        }
    }




}