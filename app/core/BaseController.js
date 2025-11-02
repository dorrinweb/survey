import autoBind from 'auto-bind';
import {encode} from 'html-entities';
import { getEnv,log,toNumber,toObjectId,input} from './utils.js';
import { Logger } from '../global.js'



export default class BaseController{
    constructor(){
        if(this.constructor === BaseController){
            throw new Error('BaseController is abstract class!')
        }
        autoBind(this);
        this.accessTokenCookieOptions = 
        { 
         domain: getEnv('DOMAIN_TO_SET_COOKIE'),
         httpOnly: true,
         secure: true,
         sameSite: 'none',
         maxAge: getEnv('ACCESS_TOKEN_EXPIRE_TIME')* 1000, // 24 hours in milliseconds
         path: "/",
        }
    }

    toError(error, req, res) {
        try {
            if (res.headersSent) {
                return;
            }
            let data = (getEnv('DEBUG', 'bool')) ? {
                'error': error.toString(),
            } : 'Internal Server Error!';
            Logger.logToFile('error.log', req.originalUrl, req.method, error.toString(), 'error');
            return res.status(500).json({"msg": data});
        } catch (e) {
            if (res.headersSent) {
                return;
            }
            let data = (getEnv('DEBUG', 'bool')) ? {
                'error': e.toString(),
            } : 'Internal Server Error!';
    
            Logger.logToFile('error.log', req.originalUrl, req.method, e.toString(), 'error');
    
            return res.status(500).json({"msg": data});
        }
    }

    input(field)
        {
            return input(field)
        }
        
    safeString(str){
        try{
            return encode(str)
        }catch(e){
            return '';
        }
    }

    toNumber(str){
        return toNumber(str)       
    }

    errorHandling(error){
        try{
            const debug = (getEnv('DEBUG','bool'));
            return async (req,res,next)=>{
                if(debug){
                    return res.status(500).json({'msg' : error.toString()});
                }else{
                    return res.status(500).json({'msg' : 'Internal Server Error!'})
                }
            }

        }catch(e){

            throw e;

        }
    }

    toObjectId(str,returnStringMode = false){
        return toObjectId(str,returnStringMode)
    }

  

    getPage(req){
        try{
            let page = this.toNumber(this.input(req.query.page));
            return (page <= 0 || page > 100 ) ? 1 : page;
        }
            catch(e){
                return 1;
            }
    }

    handlePagination(req,sortFields){
        try{
            const sortType = (req.query?.sortType && req.query?.sortType === 'asc') ? 1 : -1;
            const sortField = (req.query?.sortField && sortFields.includes(req.query?.sortField)) ? req.query?.sortField : '_id';
            const limit = (this.toNumber(req.query?.limit )) ? this.toNumber(req.query?.limit) : getEnv("ROWS_PER_PAGE",'number');
            const page = this.getPage(req);
            return {
                limit,page,sortField,sortType
            };
        }
        catch(e){
            return {
                "limit":getEnv("ROWS_PER_PAGE",'number'),"page":1,"sortField" : "_id","sortType" : -1
            };
        }
    }

    toQuery(fields)
    {
        try{
            return new URLSearchParams(fields).toString();
        }
        catch(e){
            return '';
        }
    }

    


}