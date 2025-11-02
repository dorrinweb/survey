import BaseController from '../../core/BaseController.js'
import { log, getEnv, sleep, random, getPath, toObjectId, normalizePersianString } from '../../core/utils.js'
import translate from '../../core/translate.js'
import { Redis, Logger } from '../../global.js'
import crypto from '../../core/crypto.js'
import datetime from '../../core/datetime.js'
import TagModel from './tagModel.js';
import * as tagValidation from './tagValidations.js'
import { fileExists, unlink } from '../../core/fs.js'
import { ResultWithContext } from 'express-validator/src/chain/context-runner-impl.js'
import { uploadFile, removeFileFromServer, getFilePath } from '../../core/uploader.js';

export default class TagController extends BaseController {
    #currentUrl = getEnv('APP_URL') + 'tag/';
    constructor() {
        super();
        this.model = new TagModel();
    }

    /**
 * @param {lawyerId,title} req
 * @param {*} res
 * @return positive numbers code for validation errors;
 * negative numbers code for model errors; 
 * zero code and successfuly_add massage for success;
 * @memberof TagController
 */
    async add(req, res) {
        try {
            const requesterId = this.safeString(req.headers['x-token']);
            //cheking lawyerId is a mongoos id
            if (this.toObjectId(requesterId) === '')
                return res.status(203).json({ "code": 2, "msg": translate.t('id_is_invalid'), 'isAuth': 0 });
            const title = normalizePersianString((this.safeString(req.body?.title)));
            const validationErrors = await tagValidation.add(req);
            if (!validationErrors.isEmpty()) {
                const errorMessage = validationErrors?.errors[0].msg;
                return res.status(203).json(errorMessage)
            }
            const data = {
                "requesterId": requesterId,
                "title": title,
            };
            let newTag = [];
            let duplicatedTages = [];

            const resultAddTag = await this.model.add(data);
            if (typeof resultAddTag === 'number') {
                switch (resultAddTag) {
                    case -1:
                        return res.status(501).json({ "code": -1, "msg": translate.t('add_record_faild'), "data": { duplicatedTages, newTag }, 'isAuth': 0 });
                    break;
                    case -2:
                        return res.status(501).json({ "code": -2, "msg": translate.t('add_record_faild'), "data": { duplicatedTages, newTag }, 'isAuth': 0 });
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

    /**
* 
* @param {userId,titlesortType,sortField} req 
* @param {*} res 
* @returns 
*/
    async myTags(req, res) {
        try {
        const allowedSortFields = ['_id', 'title', 'createdAt'];
        const requesterId = this.safeString(req.headers['x-token']);
        const lawyerId = requesterId;
        const title = normalizePersianString(this.safeString(req?.query?.title));
        if (this.toObjectId(requesterId) === '')
        return res.status(203).json({ "code": 2, "msg": translate.t('id_is_invalid'), 'isAuth': 0 });
        const sortType = (req.query?.sortType && req.query?.sortType === 'asc') ? 1 : -1;
        const sortField = (req?.query?.sortField && allowedSortFields.includes(req?.query?.sortField)) ? req?.query?.sortField : '_id';
        const myTagData = {
        requesterId,
        lawyerId,
        title,
        sortType,
        sortField
        }
        const resultIndex = await this.model.index(myTagData);
        if (resultIndex?.tags) {
            if (!resultIndex?.tags.length)
                return res.json({ "code": 0, "msg": translate.t('any_records_does_not_exist'), 'data': resultIndex, 'isAuth': 0 });
            else
                return res.json({ 'code': 0, 'data': resultIndex, 'isAuth': 0 });
        } else
        return res.status(501).json({ "code": -1, "msg": translate.t('index_records_faild'), "data": {}, 'isAuth': 0 });
        
        } catch (e) {
        super.toError(e, req, res);
        }
        }


}


