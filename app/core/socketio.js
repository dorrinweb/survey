import {log,getEnv} from './utils.js';
import { createServer } from "http";
import { Server } from "socket.io";
import { Redis } from "../global.js";
import crypto from '../core/crypto.js'

import { LogTimings } from 'concurrently';
import http  from '../core/http.js';
import xml2js from 'xml2js'
import datetime from './datetime.js';
import UserModel from '../services/users/userModel.js';





export default class SocketIOServer
{

    async init(app){
        try{
            const httpServer = createServer(app);
            this.io = new Server(httpServer,{
                cors: {
                    origin: "*",
                    allowedHeaders: ["my-custom-header"],
                    Credentials: true
                },
                cookie: true,

            });
            httpServer.listen(3001,async () => {
                log('io bind successfully!');
            });
            this.io.use(async (socket, next) => {
                try {
                    log('soket middleware')
                    /**
                     * let token = '';
                    if(req.cookies.accessToken)
                    token = req.cookies.accessToken;
                    else if(req.headers['x-token'])
                    token = req.headers['x-token'];
                     */
                    const token = socket.handshake.auth?.token;
                    const userFirstName = socket.handshake.auth?.userFirstName;
                    const botId = socket.handshake.auth?.botId;
                    const productId = socket.handshake.auth?.productId;
                    const testMode = socket.handshake.auth?.testMode;
                    // log(socket.request.headers.cookie)
                    // log(socket.handshake.headers.cookie)
                    log(socket.handshake.auth)
                    if(!token){
                        socket.error = { 'code': -1, 'msg': 'token not send!', 'isAuth': -4 }
                        return next();
                    }
                    const resultAuth = await this.Auth(token);
                    if(resultAuth?.userId){
                        if(productId == '')//This prevents it from being run from paths outside of the product paths or the batty teacher test
                            socket.error = { 'code': -6,"msg" : translate.t('socket.can_not_run_bot_from_this_route'),"delay" : 1  ,'isAuth' : 0}
                        else {
                            const userHasAccessRunBot = await this.userHasAccessRunBot(resultAuth?.userId,botId,testMode,productId);
                            if (!userHasAccessRunBot) {                            
                                socket.error = { 'code': -6,"msg" : translate.t('socket.requester_has_not_access_to_run_this_bot'),"delay" : 0  ,'isAuth' : 0}
                            }
                            else{
                                socket.userToken = resultAuth;
                                socket.userFirstName = userFirstName;
                                socket.botId = botId;
                                socket.testMode = testMode;
                                socket.productId = productId;
                            }    
                        }
                        return next();
                    }else{
                        socket.error = { 'code': -4, 'msg': 'token is not valid!', 'isAuth': -4 };
                        switch(resultAuth.code){
                            case -1 :
                                socket.error = { 'code': -1, 'msg': 'token not send!', 'isAuth': -4 }
                            break;
                            case -2 : 
                                socket.error ={ 'code': -4, 'msg': 'token is not valid!', 'isAuth': -4 };
                            break;
                            case -4 : 
                                socket.error = {'code':-4,'msg':'token is not valid!','isAuth':-4};
                            default :
                                socket.error = {'code':-5,'msg':'An error occurred in authentication','isAuth':-4};
                            }
                        return next()
                        }
                    
                } catch (err) {
                    next(err);
                }
            });    
            this.io.on('connection', async (socket) => {
                log('socket connected!');
                const currentTime = datetime.toString(); // Store the connection start time
                socket.emit('getServerTime', { time: currentTime });
                
                // Save the starting time of the connection
                socket.startingTime = currentTime;
                socket.isDisconnected = false; // Flag to indicate disconnection
                
                socket.on('disconnect', async () => {
                    log('user is disconnected!');
                    socket.isDisconnected = true; // Change the flag
                
                    // Record the disconnection time
                    const endingTime = datetime.toString(); // or new Date().toString() if you prefer
                
                    // Calculate the duration of the connection (optional)
                    const runningTime = (new Date(endingTime) - new Date(socket.startingTime))/1000; // Duration in seconds
                
                    // Send disconnection time to nextStep
                    const disconnectData = {
                        endingTime: endingTime,
                        runningTime: runningTime // You can also send the duration
                    };
                
                    // If the user has disconnected, call nextStep with the new data
                    await clientChatBot.nextStep(socket, disconnectData);
                });
                
                socket.on('nextStep', async (data) => {
                    await clientChatBot.nextStep(socket, data);
                });
            
                socket.on('connection_error', this.onError);
            });
            
        }
        catch(e){
            log(e);
        }
    }

    async onError(error){
        log('error is call!');
        log(error);
    }
  
    /**
     * 
     * @param {*} token 
     * @returns * negative numbers code for unvalid or not sending token
                * accessToken if success   

     */
    async Auth(token){
        try{
            if(token !== ''){
                token = token.trim();
                const accessTokenKey = getEnv('ACCESS_TOKEN_KEY') + token;
                const accessToken = await Redis.getHash(accessTokenKey);
                if(accessToken?.userId){
                    if(accessToken?.ssoToken){
                        const ssoTicket = accessToken?.ssoToken
                        let ssoTokenService = accessToken?.ssoTokenService;
                        const validateSsoUrl = getEnv('SSO_IDENTITY_PROVIDER_SERVICE_VALIDATE')
                        const params = {
                            service: ssoTokenService,
                            ticket:ssoTicket
                        }
                        const ssoXmlResponse = await http.get(validateSsoUrl,{params});
                        let userNationalId = null;

                        const parseXml = (xmlData) => {
                            return new Promise((resolve, reject) => {
                                xml2js.parseString(xmlData, (err, result) => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(result);
                                    }
                                });
                            });
                        };
                        const result = await parseXml(ssoXmlResponse.data);
                        if (result['cas:serviceResponse']['cas:authenticationFailure']){
                            const loginError = result['cas:serviceResponse']['cas:authenticationFailure'][0]['$']['code'];
                            return { 'code': -5, 'msg': loginError, 'isAuth': -4 };
                            //An error occurred in central authentication(SSO)
                        } else if (result['cas:serviceResponse']['cas:authenticationSuccess']){
                            userNationalId = result['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:user'][0];
                            if (!userNationalId){
                                return { 'code': -4, 'msg': 'token is not valid!', 'isAuth': -4 };
                            }
                        }
                    }
                    return accessToken;
                } else {
                    const refreshTockenKey = getEnv('REFRESH_TOKEN_KEY') + crypto.hash(token);
                    const refreshTocken = await Redis.getHash(refreshTockenKey);
                    
                    if(refreshTocken?.userId && refreshTocken?.active){
                        return { 'code': -2, 'msg': 'token is not valid!', 'isAuth': -2 };
                    } else {
                        return { 'code': -4, 'msg': 'token is not valid!', 'isAuth': -4 };
                    }
                }
            } else {
                return { 'code': -1, 'msg': 'token not send!', 'isAuth': -1 };
            }
        } catch(e){
            return e;
        }
    }

    async userHasAccessRunBot(userId,botId,testMode,productId = null){
        try{
            //if the requester is Dorsangi, she can view and run all bots for debuging:)
            const userModelClass = new UserModel();
            const isRequesterDorsnagi = await userModelClass.isRequesterDorsnagi({ '_id': userId });
            if(isRequesterDorsnagi)
                return true;
            let userHasAccess = false;
            const botModelCalass = new BotModel();
            const curentBot = await botModelCalass.view(botId);
            if(curentBot?.isFree)
                userHasAccess = true;
            else{
                if( testMode == 1 && curentBot?.createdById?._id + '' == userId)
                    userHasAccess = true;
                else{
                    const userModelCalass = new UserModel();
                    const curentUser = await userModelCalass.getProfile(userId);
                    userHasAccess = curentUser?.accessToBots.some(item => item.botId.equals(botId));
                }
                
            }
            return userHasAccess;
        } catch(e){
            return e;
        }
    }
}