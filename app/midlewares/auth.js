import BaseMiddleware from "../core/BaseMiddleware.js";
import {log,getEnv, toJSON} from '../core/utils.js';
import translate from "../core/translate.js";
import { login } from "../services/users/userValidations.js";
import { Redis } from "../global.js";
import crypto from '../core/crypto.js'
import http  from '../core/http.js';
import xml2js from 'xml2js'

export default class AuthMiddleware extends BaseMiddleware{

    constructor(){
        super();
    }

    
    async Auth(req, res, next) {
        try {
            const targetDomain = getEnv('DOMAIN_TO_SET_COOKIE');
    log('here')
    log(targetDomain)
            // Extract the accessToken cookie for the target domain
            const cookieHeader = req.headers.cookie || '';
            const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
                return acc;
            }, {});
            let token = cookies['accessToken'] || req.headers['x-token'] || '';
    
            if (token !== '') {
                token = token.trim();
                const accessTokenKey = getEnv('ACCESS_TOKEN_KEY') + token;
                const accessToken = await Redis.getHash(accessTokenKey);
    
                if (accessToken?.userId) {
                    if (accessToken?.ssoToken) {
                        const ssoTicket = accessToken?.ssoToken;
                        const ssoTokenService = accessToken?.ssoTokenService;
                        const validateSsoUrl = getEnv('SSO_IDENTITY_PROVIDER_SERVICE_VALIDATE');
                        const params = { service: ssoTokenService, ticket: ssoTicket };
                        const ssoXmlResponse = await http.get(validateSsoUrl, { params });
    
                        if (!ssoXmlResponse.data) {
                            return res.json({
                                code: -3,
                                msg: translate.t('user.sso_service_connection_error'),
                                isAuth: -1,
                            });
                        }
    
                        let userNationalId = null;
                        const parseXml = (xmlData) => {
                            return new Promise((resolve, reject) => {
                                xml2js.parseString(xmlData, (err, result) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(result);
                                    }
                                });
                            });
                        };
    
                        const result = await parseXml(ssoXmlResponse.data);
    
                        if (result['cas:serviceResponse']['cas:authenticationFailure']) {
                            const loginError =
                                result['cas:serviceResponse']['cas:authenticationFailure'][0]['$']['code'];
                            res.clearCookie('accessToken', {
                                ...this.accessTokenCookieOptions,
                                domain: targetDomain,
                            });
                            await Redis.del(accessTokenKey);
                            return res.json({ code: -6, msg: loginError, isAuth: -4 });
                        } else if (result['cas:serviceResponse']['cas:authenticationSuccess']) {
                            userNationalId =
                                result['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:user'][0];
                            if (!userNationalId) {
                                res.clearCookie('accessToken', {
                                    ...this.accessTokenCookieOptions,
                                    domain: targetDomain,
                                });
                                await Redis.del(accessTokenKey);
                                return res.json({ code: -2, msg: 'token is not valid!', isAuth: -4 });
                            }
                        }
                    }
                    req.userToken = accessToken;
                    return next();
                } else {
                    res.clearCookie('accessToken', {
                        ...this.accessTokenCookieOptions,
                        domain: targetDomain,
                    });
                    return res.json({ code: -4, msg: 'token is not valid!', isAuth: -4 });
                }
            } else {
                return res.json({ code: -1, msg: 'token not send!', isAuth: -4 });
            }
        } catch (e) {
            return super.toError(e, req, res);
        }
    }
        async AccessToPanel(req,res,next){
        try{
            const baseUrl = req.baseUrl;
            const baseUrlArray = baseUrl.split("/");
            const requestedPanel = baseUrlArray[1];
            const userRole = req.userToken.role;
            const allowedPanel = toJSON(getEnv('ROLE_ALLOWED_PANEL'));
            const userHasAccessToPanel = allowedPanel[userRole].includes(requestedPanel)
            if(userHasAccessToPanel)
                return next();
            else
                return res.json({ 'code': -100, 'msg': translate.t('You_do_not_have_access_to_this_request') , 'isAuth': 0 });
        }catch(e){
            // If an error occurs, an appropriate response is sent
            return super.toError(e, req, res);
        }
    }

    async checkApiKey(req, res, next){
        try {
            
        } catch (e) {
            return super.toError(e, req, res);
        }
    }
}
