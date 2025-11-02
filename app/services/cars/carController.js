import BaseController from '../../core/BaseController.js'
import { log, getEnv, sleep, random, getPath, toObjectId, normalizePersianString } from '../../core/utils.js'
import translate from '../../core/translate.js'
import { Redis, Logger } from '../../global.js'
import crypto from '../../core/crypto.js'
import datetime from '../../core/datetime.js'
import CarModel from './carModel.js';
import * as carValidation from './carValidations.js'
import { fileExists, unlink } from '../../core/fs.js'
import { ResultWithContext } from 'express-validator/src/chain/context-runner-impl.js'
import { uploadFile, removeFileFromServer, getFilePath } from '../../core/uploader.js';

export default class CarController extends BaseController {
    #currentUrl = getEnv('APP_URL') + 'car/';
    constructor() {
        super();
        this.model = new CarModel();
    }

    /**
 * @param {lawyerId,title,description,carClass,reference,clientsName,clientsPhone,status,subject} req
 * @param {*} res
 * @return positive numbers code for validation errors;
 * negative numbers code for model errors; 
 * zero code and successfuly_add massage for success;
 * @memberof CarController
 */
    async add(req, res) {
        try {
            const lawyerId = this.safeString(req.body?.userId);
            //cheking lawyerId is a mongoos id
            if (this.toObjectId(lawyerId) === '')
                return res.status(203).json({ "code": 2, "msg": translate.t('id_is_invalid'), 'isAuth': 0 });
            const title = normalizePersianString((this.safeString(req.body?.title)));
            const description = normalizePersianString(this.safeString(req.body?.description));
            const carClass = normalizePersianString(this.safeString(req.body?.carClass));
            const reference = normalizePersianString(this.safeString(req.body?.reference));
            let clientsName = req.body?.clientsName;
            if (typeof clientsName === 'string') {
                clientsName = (clientsName.split(","));
                clientsName = clientsName.map((item) => {
                    item = normalizePersianString(this.safeString(item))
                    return item
                })
                req.body.clientsName = clientsName; //for check in validation!

            }
            const clientsPhone = req.body?.clientsPhone;
            if (typeof clientsPhone === 'string') {
                clientsPhone = (clientsPhone.split(","));
                clientsPhone = clientsPhone.map((item) => {
                    item = normalizePersianString(this.safeString(item))
                    return item
                })
                req.body.clientsPhone = clientsPhone; //for check in validation!
            }
            const status = normalizePersianString(this.safeString(req.body?.status));
            const subject = normalizePersianString(this.safeString(req.body?.subject));

            const createdById = normalizePersianString(this.safeString(req.body?.userId));
            const validationErrors = await carValidation.add(req);
            if (!validationErrors.isEmpty()) {
                const errorMessage = validationErrors?.errors[0].msg;
                return res.status(203).json(errorMessage)
            }
            const data = {
                "lawyerId": lawyerId,
                "carClass": carClass,
                "carClass": carClass,
                "title": title,
                "description": description,
                "status": status,
                "subject": subject,
                "reference": reference,
                "createdById": lawyerId,
                "clientsName": clientsName,
                "clientsPhone": clientsPhone,

            };
            let newCar = [];
            let duplicatedCars = [];

            const resultAddCar = await this.model.add(data);
            if (Array.isArray(resultAddCar)) {
                duplicatedCars = resultAddCar;
                return res.status(406).json({ "code": -1, "msg": translate.t('car.already_car'), "data": { duplicatedCars, newCar }, 'isAuth': 0 });
            }
            if (resultAddCar?._id) {
                newCar = resultAddCar;
                Logger.logToFile('car.log', req.originalUrl, req.method, 'The user by Id : ' + createdById + ' created a new car by Id : .' + resultAddCar?._id);
                return res.json({ "code": 0, "msg": translate.t('successfuly_add'), "data": { duplicatedCars, newCar }, 'isAuth': 0 });
            }
            else {
                return res.status(501).json({ "code": -2, "msg": translate.t('add_record_faild'), "data": { duplicatedCars, newCar }, 'isAuth': 0 });
            }

        } catch (e) {
            super.toError(e, req, res);
        }
    }
    /**
     * 
     * @param {userId,title,carClass,carCode,reference,status,subject,clientsName,sortType,sortField} req 
     * @param {*} res 
     * @returns 
     */
    async myCars(req, res) {
        try {
            const allowedSortFields = ['_id', 'title', 'createdAt', 'reference'];
            const requesterId = this.safeString(req?.query?.userId)
            const lawyerId = requesterId;
            const title = normalizePersianString(this.safeString(req?.query?.title));
            const carClass = normalizePersianString(this.safeString(req?.query?.carClass));
            const carCode = normalizePersianString(this.safeString(req?.query?.carCode));
            const reference = normalizePersianString(this.safeString(req?.query?.reference));
            const status = normalizePersianString(this.safeString(req?.query?.status));
            const subject = normalizePersianString(this.safeString(req?.query?.subject));
            let clientsName = req.query?.clientsName;
            if (typeof clientsName === 'string') {
                clientsName = (clientsName.split(","));
                clientsName = clientsName.map((item) => {
                    item = normalizePersianString(this.safeString(item))
                    return item
                })
            }
            const validationErrors = await carValidation.myCars(req);
            if (!validationErrors.isEmpty()) {
                const errorMessage = validationErrors?.errors[0].msg;
                return res.status(203).json(errorMessage)
            }
            if (this.toObjectId(requesterId) === '')
                return res.status(203).json({ "code": 2, "msg": translate.t('id_is_invalid'), 'isAuth': 0 });
            const sortType = (req.query?.sortType && req.query?.sortType === 'asc') ? 1 : -1;
            const sortField = (req?.query?.sortField && allowedSortFields.includes(req?.query?.sortField)) ? req?.query?.sortField : '_id';
            const myCarData = {
                requesterId,
                lawyerId,
                title,
                carClass,
                carCode,
                reference,
                status,
                clientsName,
                subject,
                sortType,
                sortField
            }
            const resultIndex = await this.model.index(myCarData);

            if (resultIndex?.cars) {
                if (!resultIndex?.cars.length)
                    return res.json({ "code": 0, "msg": translate.t('any_records_does_not_exist'), 'data': resultIndex, 'isAuth': 0 });
                else
                    return res.json({ 'code': 0, 'data': resultIndex, 'isAuth': 0 });
            } else
                return res.status(501).json({ "code": -1, "msg": translate.t('index_records_faild'), "data": {}, 'isAuth': 0 });

        } catch (e) {
            super.toError(e, req, res);
        }
    }
    /**
     * 
     * @param {id , userId} req 
     * @param {*} res 
     * @returns 
     */
    async view(req, res) {
        try {
            const carId = this.safeString(req?.params?.id);
            const requesterId = this.safeString(req?.query?.userId);
            if (this.toObjectId(requesterId) === '')
                return res.json({ "code": 1, "msg": translate.t('id_is_invalid'), 'isAuth': 0 });

            const resultCurrentCar = await this.model.view(carId, requesterId);
            if (typeof resultCurrentCar === 'number') {
                switch (resultCurrentCar) {
                    case -1:
                        return res.status(203).json({ "code": -1, "msg": translate.t('rows_not_found'), 'isAuth': 0 });
                        break;
                }
            }
            const data = {
                "car": resultCurrentCar,
            }
            return res.json({ 'code': 0, 'data': data, 'isAuth': 0 });
        } catch (e) {
            super.toError(e, req, res);
        }
    }

    async edit(req, res) {
        try {
            const carId = this.safeString(req?.params?.id);
            const requesterId = this.safeString(req.headers['x-token']);
            const title = normalizePersianString((this.safeString(req.body?.title)));
            const description = normalizePersianString(this.safeString(req.body?.description));
            const carClass = normalizePersianString(this.safeString(req.body?.carClass));
            const reference = normalizePersianString(this.safeString(req.body?.reference));
            let clientsName = req.body?.clientsName;
            if (typeof clientsName === 'string') {
                clientsName = (clientsName.split(","));
                clientsName = clientsName.map((item) => {
                    item = normalizePersianString(this.safeString(item))
                    return item
                })
                req.body.clientsName = clientsName; //for check in validation!
            }
            const clientsPhone = req.body?.clientsPhone;
            if (typeof clientsPhone === 'string') {
                clientsPhone = (clientsPhone.split(","));
                clientsPhone = clientsPhone.map((item) => {
                    item = normalizePersianString(this.safeString(item))
                    return item
                })
                req.body.clientsPhone = clientsPhone; //for check in validation!
            }
            const status = normalizePersianString(this.safeString(req.body?.status));
            const subject = normalizePersianString(this.safeString(req.body?.subject));
            if (this.toObjectId(requesterId) === '') {
                return res.json({ "code": 2, "msg": translate.t('requester_id_is_invalid'), 'isAuth': 0 });
            }
            const validationErrors = await carValidation.edit(req);
                if(!validationErrors.isEmpty()){
                    const errorMessage = validationErrors?.errors[0].msg;
                    return res.json(errorMessage)
                }

            const data = {
                "carId": carId,
                "requesterId": requesterId,
                "carClass": carClass,
                "title": title,
                "description": description,
                "status": status,
                "subject": subject,
                "reference": reference,
                "clientsName": clientsName,
                "clientsPhone": clientsPhone,

            };

            const resultEditCar = await this.model.edit(data);
            let updatedCar = []
            let duplicatedCars = []
            if (typeof resultEditCar === 'number') {
                switch (resultEditCar) {
                    case -1:
                        return res.json({ "code": -1, "msg": translate.t('record_does_not_exist'), 'isAuth': 0 });
                        break;
                }
            } else if (resultEditCar?.carIsDup.length > 0) {
                duplicatedCars = resultEditCar?.carIsDup;
                return res.status(406).json({ "code": -1, "msg": translate.t('car.already_car'), "data": { duplicatedCars, updatedCar }, 'isAuth': 0 });
            } 
            if (resultEditCar?.updatedCar?._id) {
                updatedCar = resultEditCar?.updatedCar
                Logger.logToFile('car.log', req.originalUrl, req.method, 'The car by Id : ' + carId + ' was edited by user : ' + requesterId);
                return res.json({ "code": 0, "msg": translate.t('edit_record_success'), "date": {updatedCar,duplicatedCars}, 'isAuth': 0 });
            } else {
                Logger.logToFile('error.log', req.originalUrl, req.method, resultEditCar);
                return res.json({ "code": -5, "msg": translate.t('edit_record_failed'), 'isAuth': 0 });
            }
        } catch (e) {
            super.toError(e, req, res);
        }
    }


}


