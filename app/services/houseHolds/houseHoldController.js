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
        
        // const session = await mongoose.startSession(); // شروع یک session برای تراکنش
        // session.startTransaction(); // شروع تراکنش
        try {
            
            const requesterId = this.safeString(this.input(req?.userToken?.userId));            
            // if (this.toObjectId(requesterId) === '') {
            //     return res.status(203).json({ "code": 2, "msg": translate.t('id_is_invalid'), 'isAuth': 0 });
            // }
    
            // // Create household data
            const householdData = {
                address: this.safeString(req.body?.householdData?.address),
                householdCount: convertToEnglishNumber(req.body?.householdData?.householdCount),
                carCount: convertToEnglishNumber(req.body?.householdData?.carCount),
                parkingSpacesCount: convertToEnglishNumber(req.body?.householdData?.parkingSpacesCount),
                hasParking: req.body?.householdData?.hasParking || false,
                members: [requesterId] // Add the current user as the first member
            };
            // // 1. ذخیره‌سازی خانوار
            const resultAdd = await this.model.add(householdData, requesterId/*, { session }*/);
            if (typeof resultAdd == 'number') {
                switch (resultAdd) {
                    case -1 :
                        return res.status(500).json({ "code": -1, "msg":  translate.t('An error occurred while adding  household'), 'isAuth': 0 });
                    case -2 :
                        return res.status(500).json({ "code": -2, "msg":  translate.t('An error occurred while adding users to the household'), 'isAuth': 0 });
                       
                    }
            }

            // // 2. ذخیره‌سازی کاربران
            const users = req.body.individuals
            const resultAddUsers = await this.model.addUsersToHousehold(resultAdd._id, users/*, { session }*/);
            if (typeof resultAddUsers == 'number') {
                switch (resultAddUsers) {
                    case -1 :
                        return res.status(500).json({ "code": -1, "msg":  translate.t('An error occurred while adding users to the household'), 'isAuth': 0 });
                    case -2 :
                        return res.status(500).json({ "code": -2, "msg":  translate.t('An error occurred while adding users to the household'), 'isAuth': 0 });
                    
                    }
            }
               
            if(resultAddUsers?.insertedCount > 0 || resultAddUsers?.matchedCount > 0 ){
                return res.status(201).json({ "code": 0, "msg": translate.t('successfuly_add'), "data": resultAdd, 'isAuth': 0 });

            }
    
            // // await session.commitTransaction(); // تأیید تراکنش
            // // session.endSession(); // پایان session
    
            // return res.status(201).json({ "code": 0, "msg": translate.t('successfuly_add'), "data": resultAdd, 'isAuth': 0 });
    
        } catch (e) {

            // await session.abortTransaction(); // در صورت خطا، تراکنش را لغو کنید
            // session.endSession(); // پایان session
            return res.status(500).json({ "code": -3, "msg": e.message || translate.t('unknown_error'), 'isAuth': 0 });
        }
    }

   /**
* 
* @param {userId,titlesortType,sortField} req 
* @param {*} res 
* @returns 
*/
async view(req, res) {
    try {
        const requesterId = this.safeString(this.input(req?.userToken?.userId));            
        // if (this.toObjectId(requesterId) === '')
    // return res.status(203).json({ "code": 2, "msg": translate.t('id_is_invalid'), 'isAuth': 0 });
    log(requesterId)
    const resultView = await this.model.view(requesterId);
    if( typeof resultView === 'number' ){
        switch(resultView){
            case -1 :
                return res.json({"code" : -1 ,"msg" : translate.t('rows_not_found'),'isAuth' : 0});
            break;
            case -2 :
                return res.json({"code" : -1 ,"msg" : translate.t('household.requester_is_not_owner_household'),'isAuth' : 0});
            break;
        }
    }
    const data = {
        "household" : resultView,
    }
    return res.json({'code' : 0 ,'data' : data , 'isAuth' : 0});
}catch(e){
    super.toError(e,req,res);
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