import {validationResult,body,query,param,header} from 'express-validator';
import translate from '../../core/translate.js';
import { input ,log ,hasDuplicates,normalizePersianString} from '../../core/utils.js';
import validator from 'validator';


const validSubjects = [
    "حقوقی",
    "مدنی",
    "کیفری",
    "اداری",
    "تجاری",
    "ثبتی",
    "رقابت",
    "بین‌المللی",
    "کار و کارگر",
    "مالیاتی",
    "داوری"
];

const validStatuses =  [
    "تحقیقات",
    "رسیدگی بدوی",
    "صدور رأی بدوی و پیش از قطعیت",
    "رسیدگی تجدیدنظر",
    "مختومه",
    "رسیدگی دیوان عالی",
    "اجرای حکم",
];

export async function add(req) {

    // Validation for userId
    await body('userId')
        .not().isEmpty()
        .withMessage({ "code": 1, "msg": translate.t('case.validation.userId_required'), 'isAuth': 0 })
        .run(req);
    // Validation for title
     await body('title')
        .not().isEmpty()
        .withMessage({ "code": 3, "msg": translate.t('case.validation.title_required'), 'isAuth': 0 })
        .run(req);
        // Validation for clientsName
     await body('clientsName')
        .not().isEmpty()
        .withMessage({ "code": 4, "msg": translate.t('case.validation.clientsName_required'), 'isAuth': 0 })
        .run(req);
     // Validate subject (only allow predefined values)
     await body('subject')
     .optional()
     .trim()
     .customSanitizer(value => normalizePersianString(value))
     .isIn(validSubjects)
     .withMessage({ "code": 5, "msg": translate.t('case.validation.invalid_subject'), 'isAuth': 0 })
     .run(req);
     // Validate status (only allow predefined values)
     await body('status')
     .optional()
     .trim()
     .customSanitizer(value => normalizePersianString(value))
     .isIn(validStatuses)
     .withMessage({ "code": 6, "msg": translate.t('case.validation.invalid_status'), 'isAuth': 0 })   
     .run(req); 

    return validationResult(req);  
}

export async function myCases(req) {

    // Validation for userId
    await query('userId')
        .not().isEmpty()
        .withMessage({ "code": 1, "msg": translate.t('case.validation.userId_required'), 'isAuth': 0 })
        .run(req);
     // Validate subject (only allow predefined values)
     await query('subject')
     .optional()
     .trim()
     .customSanitizer(value => normalizePersianString(value))
     .isIn(validSubjects)
     .withMessage({ "code": 2, "msg": translate.t('case.validation.invalid_subject'), 'isAuth': 0 })
     .run(req);
     // Validate status (only allow predefined values)
     await query('status')
     .optional()
     .trim()
     .customSanitizer(value => normalizePersianString(value))
     .isIn(validStatuses)
     .withMessage({ "code": 3, "msg": translate.t('case.validation.invalid_status'), 'isAuth': 0 })   
     .run(req);

    return validationResult(req);  
}

export async function edit(req) {
    // Validate caseId in params
    await param('id')
        .not().isEmpty()
        .withMessage({ code: 2, msg: translate.t('case.validation.caseId_required'), isAuth: 0 })
        .run(req);
     // Validate subject (only allow predefined values)
     await body('subject')
     .optional()
     .trim()
     .customSanitizer(value => normalizePersianString(value))
     .isIn(validSubjects)
     .withMessage({ "code": 5, "msg": translate.t('case.validation.invalid_subject'), 'isAuth': 0 })
     .run(req);
     // Validate status (only allow predefined values)
     await body('status')
     .optional()
     .trim()
     .customSanitizer(value => normalizePersianString(value))
     .isIn(validStatuses)
     .withMessage({ "code": 6, "msg": translate.t('case.validation.invalid_status'), 'isAuth': 0 })   
     .run(req); 

    return validationResult(req);  
}
