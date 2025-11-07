import BaseController from '../../core/BaseController.js'
import { log, getEnv, sleep, random, getPath, toJSON, convertToEnglishNumber,removeKeysFromObject } from '../../core/utils.js'
import { uploadFile , removeFileFromServer } from '../../core/uploader.js'
import translate from '../../core/translate.js'
import { Redis,io,Logger } from '../../global.js'
import crypto from '../../core/crypto.js'
import datetime from '../../core/datetime.js'
import UserModel from './userModel.js';
import * as userValidation from './userValidations.js'
import { fileExists, unlink,mkDir } from '../../core/fs.js'
import Token from '../../core/token.js'
import sms from '../../core/sms.js'
import http from '../../core/http.js'
import cookieParser from 'cookie-parser'
import xml2js from 'xml2js'
import RoleModel from '../roles/roleModel.js'

export default class UserController extends BaseController {
    #currentUrl = getEnv('APP_URL') + 'user/';
    constructor() {
        super();
        this.model = new UserModel();
        this.roleModel = new RoleModel();

        
    }

    async index(req, res) {
        try {
            const resultUsersList = await this.model.index();            
            if (typeof resultUsersList === 'number') {
                switch (resultUsersList) {
                    case -1:
                        return res.status(406).json({ "code": 7, "msg": translate.t('user.duplicate_phone'), 'isAuth': 0 });
                        break;
                }
            }
            else {
                if (resultUsersList.length > 0) {
                    return res.json({ "code": 0,"data": resultUsersList,'isAuth': 0 });
                }
                else {
                    return res.status(501).json({ "code": 9, "msg": translate.t('user.rigister_faild'), 'isAuth': 0 });
                }
            }

        } catch (e) {
            super.toError(e, req, res);
        }
    }

    async getPassword(req, res) {
        try {
            log('ddddddd')

            const phone = this.toNumber(convertToEnglishNumber(this.input(req.body.phone)));
            req.body.phone = phone;
            const validationErrors = await userValidation.getPassword(req, res);
            if (!validationErrors.isEmpty()) {
                let errorMessage = validationErrors?.errors[0].msg;
                return res.json(errorMessage)
            }
            let resultModel = await this.model.getPassword(phone);
            let resultSms = null
            switch (resultModel) {
                case -1:
                    //This is the first time that a user sends us a request with this phone number and
                    //we can tell him that his phone number is invalid an account :
                    //return res.json({ 'code': -1, 'msg': translate.t('user.phone_is_invalid') })
                    //or create an account for him , and then send him an SMS.:
                    const roleId = await  this.roleModel.getRoleId('head');
                    let newUserData = {
                        'phone' : phone,
                        'roleId' : roleId,
                        'userCode' : 1,
                        'isHeadOfHousehold' : true,
                    }

                    const resultAddUser = await this.model.add(newUserData);
                    if(resultAddUser?._id)
                    resultModel = await this.model.getPassword(phone);
                    resultSms = await sms.verify(phone + '', resultModel + '');
                    if (resultSms === -1)
                        return res.json({ 'code': -1, 'msg': 'no api for sending sms for such country was implemented yet!' })
                    if (resultSms === 0)
                        return res.json({ 'code': -2, 'msg': translate.t('sms_web_servis_error') })
                    return res.json({ 'code': 0, 'msg': translate.t('user.password_sms_send') })
                    break;
                case -2:
                    return res.json({ 'code': -2, 'msg': translate.t('user.sms_password_is_already') })
                    break;
                default:
                    resultSms = await sms.verify(phone + '', resultModel + '');
                    if (resultSms === -1)
                        return res.json({ 'code': -1, 'msg': 'no api for sending sms for such country was implemented yet!' })
                    if (resultSms === 0)
                        return res.json({ 'code': -2, 'msg': translate.t('sms_web_servis_error') })

                    Logger.logToFile('user.log',req.originalUrl, req.method,'The user : '+ phone + ' received a password.');
                    return res.json({ 'code': 0, 'msg': translate.t('user.password_sms_send') })
                    break;
            }

        } catch (e) {
            super.toError(e, req, res);
        }
    }

    async otpLogin(req, res) {
        try {
            const phone = this.toNumber(convertToEnglishNumber(this.input(req.body.phone)));
            const password = this.toNumber(convertToEnglishNumber(this.input(req.body.password)));
            // const loginRoleRequest = ['regular','teacher','superAdmin'].includes(this.safeString(this.input(req.body.role))) ? this.safeString(this.input(req.body.role)) : 'regular';
            req.body.phone = phone;
            req.body.password = password;
            const validationErrors = await userValidation.login(req, res);
            if (!validationErrors.isEmpty()) {
                let errorMessage = validationErrors?.errors[0].msg;
                return res.json(errorMessage)
            }
            // const resultModel = await this.model.login(phone, password,loginRoleRequest);
            const resultModel = await this.model.otpLogin(phone, password);
            if (resultModel?._id) {
                // const token = await Token.generate(resultModel?._id, resultModel?.active,loginRoleRequest);
                const token = await Token.generate(resultModel?._id, resultModel?.active,resultModel?.role?.name);
                if (typeof (token) === 'string') {
                    return res.json({ 'code': -1, 'msg': 'Token generation failed!', })
                } else {
                    let currentService = req.headers.origin;
                    let newUserData ={};
                    switch(currentService){
                        case getEnv('SUPER_ADMIN_PANEL_URL'):
                            if(resultModel['firstLoginAsSuperAdmin'] == true)
                                newUserData['firstLoginAsSuperAdmin'] = false;
                        break;
                        case getEnv('TEACHER_PANEL_URL'):
                            if(resultModel['firstLoginAsTeacher'] == true)
                                newUserData['firstLoginAsTeacher'] = false;
                        break;
                        case getEnv('STUDENT_PANEL_URL'):
                            if(resultModel['firstLoginAsStudent'] == true)
                                newUserData['firstLoginAsStudent'] = false;
                        break;
                        default:
                            if(resultModel['firstLoginAsStudent'] == true && resultModel['firstLoginAsTeacher'] == true && resultModel['firstLoginAsSuperAdmin'] == true)
                                newUserData['firstLoginAsStudent'] = false;
                        break;
                    }
                    if(Object.keys(newUserData).length > 0){
                        const resultUpdateUser = await this.model.updateProfile(resultModel?._id,newUserData);
                    }
                    const userData = await this.model.getUserData(resultModel);
                    let data = {
                        'userInfo': userData,
                        'accessToken': token?.accessToken,
                        'refreshToken': token?.refreshToken,
                    }
                    res.cookie('accessToken', token?.accessToken,this.accessTokenCookieOptions);
                    Logger.logToFile('user.log',req.originalUrl, req.method,'The user : '+ userData.phone + ' is loged in.');
                    return res.json({ 'code': 0, 'msg': translate.t('user.login_success'), 'data': data })
                }
            }
            else {
                let message = '';
                switch (resultModel) {
                    case -1:
                        message = translate.t('user.login_failed');
                        return res.json({ 'code': 4, 'msg': message, })
                    break;
                    case -2:
                        message = translate.t('user.login_account_disabled');
                        return res.json({ 'code': 5, 'msg': message, })
                    break;
                    // case -3:
                    //     message = translate.t('user.user_has_not_access_this_panel');
                    //     return res.json({ 'code': 6, 'msg': message, })
                    // break;
                    // case -4:
                    //     message = translate.t('user.user_has_not_access_this_panel');
                    //     return res.json({ 'code': 7, 'msg': message, })
                    // break;
                }
            }
        } catch (e) {

            super.toError(e, req, res);
        }
    }


       /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async addUsersToHousehold(req, res) {
        try {

            // const validationErrors = await userValidation.addUsersToHousehold(req);
            // if (!validationErrors.isEmpty()) {
            //     const errorMessage = validationErrors?.errors[0].msg;
            //     return res.status(203).json(errorMessage)
            // }
            
            // const phone = this.toNumber(this.input(req.body.phone));
            // const userData = {
            //     'phone' : phone
            // }
            const { householdId, users } = req.body;
            if (!householdId || !users || !Array.isArray(users) || users.length === 0) {
                return res.status(400).json({ status: -1, message: "Invalid inputs. Please provide a householdId and an array of users." });
            }
            const resultAddUsersToHousehold = await this.model.addUsersToHousehold(householdId, users);
            
            if (typeof resultAddUsersToHousehold === 'number') {
                switch (resultAddUsersToHousehold) {
                    case -2:
                        return res.status(500).json({ "code": 2, "msg": translate.t('user.An error occurred while adding users to the household.'), 'isAuth': 0 });
                    break;
                }
            }
            else {
                // if (resultAddUsersToHousehold?._id) {
                    return res.json({ "code": 0, "msg": translate.t('user.successfuly_register'),"data": resultAddUsersToHousehold,'isAuth': 0 });
                // }
                // else {
                //     return res.status(501).json({ "code": 9, "msg": translate.t('user.rigister_faild'), 'isAuth': 0 });
                // }
            }

        } catch (e) {
            super.toError(e, req, res);
        }
    }    


    async refreshToken(req, res) {
        try {
            const refreshToken = this.safeString(this.input(req.body.refreshToken));
            const accessToken = this.safeString(this.input(req.body.accessToken));
            const REFRESH_TOKEN_KEY = getEnv('REFRESH_TOKEN_KEY') + refreshToken;
            const accessTokenKey = getEnv('ACCESS_TOKEN_KEY') + accessToken;
            const resultRedis = await Redis.getHash(REFRESH_TOKEN_KEY);
            if (resultRedis?.accessToken && resultRedis?.accessToken == accessToken) {
                const newToken = await Token.generate(resultRedis?.userId, resultRedis?.active,resultRedis?.role)
                if (typeof (newToken) == 'string') {
                    return res.json({ 'code': -1, 'msg': 'Token generation failed!', })
                }
                else {
                    let resultGetProfile = await this.model.getProfile(resultRedis?.userId);
                    const userInfo = await this.model.getUserData(resultGetProfile);
                    await Redis.del(REFRESH_TOKEN_KEY);
                    await Redis.del(accessTokenKey);
                    let data = {
                        'userInfo': userInfo,
                        'accessToken': newToken?.accessToken,
                        'refreshToken': newToken?.refreshToken,
                    }
                    res.cookie('accessToken', newToken?.accessToken,this.accessTokenCookieOptions);
                    return res.json({ 'code': 0, 'msg': 'success', 'data': data })
                }
            } else {
                return res.json({ 'code': 1, 'msg': 'refresh token is invalid!', })
            }
            return res.json({ 'msg': 'success' })
        } catch (e) {
            super.toError(e, req, res)
        }
    }


}
