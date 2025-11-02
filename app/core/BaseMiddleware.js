import autoBind from 'auto-bind';
import { getEnv,log } from './utils.js';


export default class BaseMiddleware{
    constructor(){
        if(this.constructor === BaseMiddleware){
            throw new Error('BaseMiddleware is abstract class!')
        }
        autoBind(this);
        this.accessTokenCookieOptions = 
            { 
             domain: getEnv('DOMAIN_TO_SET_COOKIE'),
             httpOnly: true,
             secure: true,
             sameSite: 'none',
            //  maxAge: datetime.toJalaali + getEnv('ACCESS_TOKEN_EXPIRE_TIME'),
             path: "/",
            }
    }

    toError(error,req,res)
    {
        try{          
            let data =(getEnv('DEBUG','bool'))? {
                'error':error.toString(),
            } :'Internal Server Error!';
            return res.status(500).json({"msg" : data})
        }catch(e){
            let data =(getEnv('DEBUG','bool'))? {
                'error':e.toString(),
            } :'Internal Server Error!';
            return res.status(500).json({"msg" : data})
        }
    }
  


}