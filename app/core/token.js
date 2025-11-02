import { getEnv,log,toNumber,toObjectId} from './utils.js';
import crypto from './crypto.js'
import { Redis } from '../global.js';


 class Token{
    constructor(){
   
    }

    async generate(userId,active,role,ssoToken = null,ssoTokenService = null,ssoExpireTimeToken = null){
    try{
        userId = userId + '';
        const accessToken = ssoToken ? ssoToken : crypto.encryption(getEnv('SECRET_KEY')+userId,userId);
        const refreshToken = crypto.hash(accessToken);
        let data = {
            'accessToken' : accessToken ,
            'role' : role,
            'userId' : userId ,
            'active' : active,
        }

        let expiretimeToken = ssoExpireTimeToken ? ssoExpireTimeToken : getEnv('ACCESS_TOKEN_EXPIRE_TIME')
        let expiretimeRToken = ssoExpireTimeToken ? ssoExpireTimeToken : getEnv('REFRESH_TOKEN_EXPIRE_TIME')
      
        if(ssoToken){
            data['ssoToken'] = ssoToken;
            data['ssoTokenService'] = ssoTokenService;
            const keyExists = await Redis.keyExists(getEnv('ACCESS_TOKEN_KEY')+ssoToken);
            if (!keyExists) 
                await Redis.setHash(getEnv('ACCESS_TOKEN_KEY')+ssoToken,data,expiretimeToken)
        }
        else{
            data['refreshToken'] = refreshToken ;
            await Redis.setHash(getEnv('ACCESS_TOKEN_KEY')+accessToken,data,expiretimeToken)
            await Redis.setHash(getEnv('REFRESH_TOKEN_KEY')+refreshToken,data,expiretimeRToken)
        }
        return data
    }
    catch(e){
        return e.toString();
    }
}

}
export default new Token;