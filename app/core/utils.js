import dotenv from 'dotenv';
import dotenvExpand from "dotenv-expand";
import mongoose from 'mongoose';
import process from 'process';
import crypto from './crypto.js';
import datetime from './datetime.js';
import slugify from 'slugify';

const env = dotenv.config();
dotenvExpand.expand(env)

export function getEnv(key,cast='string')
{
    let ret = '';
    switch(cast)
    {
        case 'number':
            ret = toNumber(process.env[key]);
        break;
        case 'bool':
            ret = (process.env[key] === 'true') ? true : false;
        break;
        case 'json':
            ret = JSON.parse(process.env[key]);
        break;
        default:
            ret = process.env[key];
        break;
        
    }
    return ret ?? '';
}

export function log(obj){
    console.log(obj);
}

export function toNumber(str){
    try{
        const ret = Number(str);
        return isNaN(ret) ? 0 : ret;
    }
    catch(e){
        return 0;
    }
}

export function isNumber(field){
    return !isNaN(field)
}

export function sleep(ms){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(true);
        },ms)
    })

}

export function random(min,max){
    try{
        return Math.floor(
            Math.random()*(max - min + 1) + min
        )
    }catch(e){
        return 0;
    }
}
 
export function stringify(obj){
    try{
        return JSON.stringify(obj);
    }catch(e){
        return '';
    }
}

export function toJSON(str){
    try{
        return JSON.parse(str);  
    }catch(e){
        return {};
}
}

export function isJSON(str){
    try{
        JSON.parse(str)
    }catch(e){
        return false;
    }
    return true;
}
 
export function toObjectId(str,returnStringMode = false){
    try{
        if(mongoose.Types.ObjectId.isValid(str))
            return (returnStringMode) ? mongoose.Types.ObjectId(str) + '' : mongoose.Types.ObjectId(str);
        else
            return '';
    }
    catch(e){
        return '';
    }

}

export function getPath(){
    return process.cwd() + '/';
}

export function addRowNumbers(rows,skip,sortMode){
    try{
        let n = (sortMode === -1) ? skip + 2 : skip + 1;
        rows.map(function(itm){
            if(sortMode === -1){
                itm.number = n;
                n--;
            } 
           else {
            itm.number = n;
            n++;
           }
           });
           return rows;
    }catch(e){
        return rows;
    }
    
}

export function input(field)
{
    try{
        if(!Array.isArray(field))
        {
            if(typeof field === 'string')
                    return field.trim();
            else if(typeof field === 'number')
                    return toNumber(field)   
            else    
                return '';
        }
        else    
            return '';
    }
    catch(e){
        return '';
    }
}

export function generateSlug(text) {
    const slug = text
        .toString() // Ensure the input is a string
        .toLowerCase() // Convert the string to lowercase
        .trim() // Remove leading and trailing whitespaces
        .replace(/\s+/g, '-') // Replace all whitespaces with a single hyphen
        .replace(/[^a-zA-Z0-9\u0600-\u06FF-]+/g, '') // Remove any non-alphanumeric characters except letters, numbers, and hyphens
        .replace(/^-+|-+$/g, '') // Remove hyphens at the beginning and end of the string
        .replace(/[^a-zA-Z0-9\u0600-\u06FF-]/g, '') // Remove any remaining non-alphanumeric characters (including special symbols)
        .replace(/--+/g, '-') // Replace consecutive hyphens with a single hyphen
        .replace(/^-+|-+$/g, ''); // Final cleanup: Remove hyphens at the beginning and end of the string

    return slug; // Return the final slug
}

export function normalizePersianString(text) {
    if (typeof text !== 'string') return undefined;
  
    const cleaned = text
      .trim()
      .replace(/ي/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/٠/g, "۰")
      .replace(/١/g, "۱")
      .replace(/٢/g, "۲")
      .replace(/٣/g, "۳")
      .replace(/٤/g, "۴")
      .replace(/٥/g, "۵")
      .replace(/٦/g, "۶")
      .replace(/٧/g, "۷")
      .replace(/٨/g, "۸")
      .replace(/٩/g, "۹")
      .replace(/٬/g, "،")
      .replace(/؛/g, "؛")
      .replace(/؟/g, "؟")
      .replace(/\s{2,}/g, " ")
      .replace(/\u200C{2,}/g, "\u200C")
      .replace(/ ?\u200C ?/g, "\u200C");
  
    return cleaned === '' ? undefined : cleaned;
  }
  











/**
 * This function checks whether two arrays have the same elements or not. 
 * It is also that all the elements are the same and the order of the elements is not important
 */
export function  arraysContainSameValues(arr1, arr2) {
    return arr1.every(value => arr2.includes(value)) && arr2.every(value => arr1.includes(value));
  }

/**
 * This function checks whether two arrays are exactly the same, 
 * both in terms of elements and in terms of the order of elements
 */
export function arraysEqual(arr1, arr2) {
    // Check if arrays have the same length
    if (arr1.length !== arr2.length) return false;

    // Compare each element in both arrays
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true; // Arrays are equal
} 
  
export function convertToEnglishNumber(number) {
    const regex = /^[-+]?[۰-۹]+([.۰-۹]+)?$/;
    if (regex.test(number)) {
        const persianNumbers = "۰۱۲۳۴۵۶۷۸۹";
        const englishNumbers = "0123456789";
        for (let i = 0; i < 10; i++) {
            number = number.replace(new RegExp(persianNumbers[i], "g"), englishNumbers[i]);
        }
        number = number.replace(/۔/g, '.');
        return parseFloat(number);
    } else {
        return number;
    }
}

export function removeKeysFromObject(obj, keysToRemove) {
    const result = { ...obj };
    keysToRemove.forEach(key => delete result[key]);
    return result;
}

export function hasDuplicates(array) {
    let seen = {};
    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (seen[item]) {
            return true;
        } else {
            seen[item] = true;
        }
    }
    return false;
}

export function convertPersianNumberToEnglish(str) {
    let persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    let englishNumbers  = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g];

    if(typeof str === 'string')
    {
        for(let i= 0; i < 10; i++)
        {
            str = str.replace(persianNumbers[i], i).replace(englishNumbers[i], i);
        }
    }
    return str;
}

