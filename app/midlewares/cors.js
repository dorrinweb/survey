import BaseMiddleware from "../core/BaseMiddleware.js";
import {log,getEnv} from "../core/utils.js"


class CORSMiddleware extends BaseMiddleware{

    constructor(){
        super();
    }

    async handle(req,res,next){
        try{
            const ALLOW_ORIGINS = getEnv('ALLOW_ORIGIN').split(',');
            const requestOrigin = req.headers.origin ?? '';
            if(requestOrigin != ""){
                const origin = ALLOW_ORIGINS.findIndex((item) => item == requestOrigin);
                if(origin >= 0){
                    res.set({
                        'Access-Control-Allow-Origin' : ALLOW_ORIGINS[origin],
                        'Access-Control-Allow-Methods' : 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
                        'Access-Control-Allow-Headers' : 'Content-Type, x-token',
                        'Access-Control-Allow-Credentials': true
                    })
                }else{
                    // res.sendStatus(401);
                    // return;
                }
            }
            next();

        }catch(e){
            next();
        }
    }
}
export default CORSMiddleware;