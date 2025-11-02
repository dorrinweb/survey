import {Router} from 'express';
import Auth from '../../midlewares/auth.js';
import RateLimit from '../../midlewares/rateLimit.js'
import HouseHoldController from './houseHoldController.js';
import { getEnv,log } from '../../core/utils.js';
import AuthMiddleware from '../../midlewares/auth.js';


const houseHoldController = new HouseHoldController();
const route = Router();
try{
     
     route.get('/index',new AuthMiddleware().Auth ,houseHoldController.index);
     route.post('/add',new AuthMiddleware().Auth ,houseHoldController.add);

    
}catch(e){
     route.use(houseHoldController.errorHandling(e))
}


export default route;