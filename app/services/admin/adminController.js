import BaseController from '../../core/BaseController.js'
import { log, getEnv, sleep, random, getPath, toJSON, convertToEnglishNumber,toObjectId } from '../../core/utils.js'
import { uploadFile , removeFileFromServer } from '../../core/uploader.js'
import translate from '../../core/translate.js'
import { Redis,io,Logger } from '../../global.js'
import crypto from '../../core/crypto.js'
import datetime from '../../core/datetime.js'
import AdminModel from './adminModel.js';
// import * as houseHoldValidation from './houseHoldValidations.js'
import { fileExists, unlink,mkDir } from '../../core/fs.js'
import Token from '../../core/token.js'
import sms from '../../core/sms.js'
import http from '../../core/http.js'
import cookieParser from 'cookie-parser'
import xml2js from 'xml2js'

export default class HouseHoldController extends BaseController {
    #currentUrl = getEnv('APP_URL') + 'admin/';
    constructor() {
        super();
        this.model = new AdminModel();

        
    }
    async getStats(req, res) {
        try {
            const stats = await this.model.getStats();
    
            return res.json({
                code: 0,
                data: stats,
                isAuth: 0
            });
    
        } catch (e) {
            super.toError(e, req, res);
        }
    }
    
    async getHouseholds(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const result = await this.model.getHouseholds({ page, limit, skip });

            if (result && result.data) {
                return res.json({
                    code: 0,
                    data: result.data,
                    total: result.total,
                    page,
                    limit,
                    isAuth: 0
                });
            } else {
                return res.status(404).json({
                    code: 9,
                    msg: translate.t('houseHold.process_failed'),
                    isAuth: 0
                });
            }

        } catch (e) {
            super.toError(e, req, res);
        }
    }

    async getTrips(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
    
            const result = await this.model.getTrips({ page, limit, skip });
    
            if (result && result.data) {
                return res.json({
                    code: 0,
                    data: result.data,
                    total: result.total,
                    page,
                    limit,
                    isAuth: 0
                });
            } else {
                return res.status(404).json({
                    code: 9,
                    msg: translate.t('Trips..process_failed'),
                    isAuth: 0
                });
            }
    
        } catch (e) {
            super.toError(e, req, res);
        }
    }

    async getUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
    
            const result = await this.model.getUsers({ page, limit, skip });
    
            if (result && result.data ) {
                return res.json({
                    code: 0,
                    data: result.data,
                    total: result.total,
                    page,
                    limit,
                    isAuth: 0
                });
            } else {
                return res.status(404).json({
                    code: 9,
                    msg: translate.t('user..process_failed'),
                    isAuth: 0
                });
            }
    
        } catch (e) {
            super.toError(e, req, res);
        }
    }
}