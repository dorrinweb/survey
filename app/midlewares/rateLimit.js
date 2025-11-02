import BaseMiddleware from "../core/BaseMiddleware.js";
import {log} from '../core/utils.js';
import { Redis } from '../global.js';
import {RateLimiterRedis} from 'rate-limiter-flexible';

export default class RateLimitMiddleware extends BaseMiddleware
{

    #rateLimiter = null;

    constructor(key,numberRequest,durationSecond,blockDurationSecond = 60){

        super();
        const config = {
            storeClient: Redis.redis,
            keyPrefix : key,
            points : numberRequest, //Number of requests
            duration : durationSecond, //Per second(s) by IP 60 => 1 minute
            blockDuration : blockDurationSecond //Per second(s) block by IP
        };
        this.#rateLimiter = new RateLimiterRedis(config);
    }

    async handle(req,res,next){
        try{

           this.#rateLimiter.consume(req.ip)
            .then(() => {
                return next();
            })
            .catch(() => {
                return res.status(429).send('Too Many Requests');
            });
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

}
