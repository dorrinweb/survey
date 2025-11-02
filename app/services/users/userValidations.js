import {validationResult,body,query,param,header} from 'express-validator';
import translate from '../../core/translate.js';
import { getEnv, input, log } from '../../core/utils.js';



export async function register(req,res){
        await body('phone').not().isEmpty().withMessage({"code" : 1 ,"msg" :translate.t('user.validation.phone_required')}).isNumeric().withMessage({"code" : 2 ,"msg" :translate.t('validation.phone_format')}).run(req);
        return validationResult(req);  

}
export async function login(req,res){
        await body('phone').not().isEmpty().withMessage({"code" : 1 ,"msg" :translate.t('user.validation.phone_required')}).isNumeric().withMessage({"code" : 2 ,"msg" :translate.t('validation.phone_format')}).run(req);
        await body('password').not().isEmpty().withMessage({"code" : 3 ,"msg" :translate.t('user.validation.password_required')}).run(req);
        return validationResult(req);  

}

export async function getPassword(req,res){
        await body('phone').not().isEmpty().withMessage({"code" : 1 ,"msg" :translate.t('user.validation.phone_required')}).isNumeric().withMessage({"code" : 2 ,"msg" :translate.t('validation.phone_format')}).run(req);
        return validationResult(req);  

}


