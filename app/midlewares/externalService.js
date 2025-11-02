import BaseMiddleware from "../core/BaseMiddleware.js";
import {log,getEnv, toJSON} from '../core/utils.js';
import translate from "../core/translate.js";
import { login } from "../validations/userValidations.js";
import { Redis } from "../global.js";
import crypto from '../core/crypto.js'
import http  from '../core/http.js';
import xml2js from 'xml2js'

export default class AuthMiddleware extends BaseMiddleware{

    constructor(){
        super();
    }

    async checkApiKey(req, res, next){
        try {
            if (!req.headers['x-api-key']) {
                return res.json({ 'code': -1, 'msg': translate.t('access_product_failed.'), 'isAuth': 0 });
            }
            let validApiKeys = toJSON(getEnv('COMPANY_API_KEY'));
            const appUrl =  getEnv('API_URL')
            const normalizedAppUrl = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl; //removing "/" 
            if(req.headers?.origin == normalizedAppUrl){
                return next();

            }

            if (validApiKeys.find((item)=> item.external_service_ip == req.headers['x-forwarded-for'] && item.api_key == req.headers['x-api-key'])) {
                 return next();
            } else {
                return res.json({ 'code': -1, 'msg': translate.t('access_product_failed.'), 'isAuth': 0 });
            }
        } catch (e) {
            return super.toError(e, req, res);
        }
    }
}
