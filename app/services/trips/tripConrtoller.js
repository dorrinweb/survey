import BaseController from '../../core/BaseController.js'
import { log, getEnv, sleep, random, getPath, toObjectId, normalizePersianString } from '../../core/utils.js'
import translate from '../../core/translate.js'
import { Redis, Logger } from '../../global.js'
import crypto from '../../core/crypto.js'
import datetime from '../../core/datetime.js'
import TripModel from './tripModel.js';
import * as tripValidation from './tripValidations.js'
import { fileExists, unlink } from '../../core/fs.js'
import { ResultWithContext } from 'express-validator/src/chain/context-runner-impl.js'
import { uploadFile, removeFileFromServer, getFilePath } from '../../core/uploader.js';

export default class TripController extends BaseController {
    #currentUrl = getEnv('APP_URL') + 'trip/';
    constructor() {
        super();
        this.model = new TripModel();
    }

    /**
 * @param {lawyerId,title} req
 * @param {*} res
 * @return positive numbers code for validation errors;
 * negative numbers code for model errors; 
 * zero code and successfuly_add massage for success;
 * @memberof TripController
 */
    async add(req, res) {
        try {
            const requesterId = this.safeString(this.input(req?.userToken?.userId));            
            const userId = this.safeString(req.body?.userId); // Get userId for each body

            // Validate requesterId (from token)
            // if (this.toObjectId(requesterId) === '') {
            //     return res.status(400).json({
            //         code: 2,
            //         msg: translate.t('id_is_invalid'),
            //         isAuth: 0
            //     });
            // }
    
            // Get trips array from the request body
            const trips = req.body?.trips;
    
            // Validate that trips is an array
            if (!Array.isArray(trips) || trips.length === 0) {
                return res.status(400).json({
                    code: 3,
                    msg: translate.t('trips_data_is_invalid'),
                    isAuth: 0
                });
            }
                // const validationErrors = await tripValidation.add({ body: trip });
                // if (!validationErrors.isEmpty()) {
                //     const errorMessage = validationErrors.errors[0].msg;
                //     return res.status(400).json({
                //         code: 5,
                //         msg: errorMessage
                //     });
                // }
    
                // Build trip data based on schema
                const data = {
                    userId, // Passenger's user ID from body
                    requesterId, // ID of the user adding the trip (from token)
                    trips : trips
                };
                const resultAddTrip = await this.model.add(data);

                if (typeof resultAddTrip === 'number') {
                    switch (resultAddTrip) {
                        case -1:
                            return res.status(500).json({
                                code: -1,
                                msg: translate.t('add_record_faild'),
                                isAuth: 0
                            });
                        case -2:
                            return res.status(500).json({
                                code: -2,
                                msg: translate.t('add_record_faild'),
                                isAuth: 0
                            });
                    }
                }

                if (Array.isArray(resultAddTrip)) {
                    Logger.logToFile(
                        'trip.log',
                        req.originalUrl,
                        req.method,
                        `The user by Id : ${requesterId} created new trips`
                    );

                    return res.status(201).json({ "code": 0, "msg": translate.t('successfuly_add'), "data": resultAddTrip, 'isAuth': 0 });

                }
                return resultAddTrip
        } catch (e) {
            super.toError(e, req, res);
        }
    }

    /**
* 
* @param {userId,titlesortType,sortField} req 
* @param {*} res 
* @returns 
*/
    async userTrips(req, res) {
        try {
            const requesterId = this.safeString(req.headers['x-token']);
            const userId = this.safeString(this.input(req?.params?.id));
            // if (this.toObjectId(requesterId) === '')
            // return res.status(203).json({ "code": 2, "msg": translate.t('id_is_invalid'), 'isAuth': 0 });
            
            const resultIndex = await this.model.index(userId);
            const data = {
                "trips" : resultIndex,
            }       
            if (Array.isArray(resultIndex)) {
                if (!resultIndex?.length)
                    return res.json({ "code": 0, "msg": translate.t('any_records_does_not_exist'), 'data': data, 'isAuth': 0 });
                else
                    return res.json({ 'code': 0, 'data': data, 'isAuth': 0 });
            } else
            return res.status(501).json({ "code": -1, "msg": translate.t('index_records_faild'), "data": {}, 'isAuth': 0 });
        
        } catch (e) {
        super.toError(e, req, res);
        }
    }

}


