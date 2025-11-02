import {validationResult,body,query,param,header} from 'express-validator';
import translate from '../../core/translate.js';
import { input ,log ,hasDuplicates,normalizePersianString} from '../../core/utils.js';
import validator from 'validator';

export async function add(req) {
    // Validation for title
     await body('title')
        .not().isEmpty()
        .withMessage({ "code": 3, "msg": translate.t('tag.validation.title_required'), 'isAuth': 0 })
        .run(req);
    return validationResult(req);  
}

