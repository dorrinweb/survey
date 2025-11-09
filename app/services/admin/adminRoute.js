import {Router} from 'express';
import Auth from '../../midlewares/auth.js';
import RateLimit from '../../midlewares/rateLimit.js'
import AdminController from './adminController.js';
import { getEnv,log } from '../../core/utils.js';
import AuthMiddleware from '../../midlewares/auth.js';


const adminController = new AdminController();
const route = Router();
try{
     route.get('/get-stats',new AuthMiddleware().Auth ,adminController.getStats);
     route.get('/get-users',new AuthMiddleware().Auth ,adminController.getUsers);
     route.get('/get-households',new AuthMiddleware().Auth ,adminController.getHouseholds);
     route.get('/get-trips',new AuthMiddleware().Auth ,adminController.getTrips);

    
}catch(e){
     route.use(adminController.errorHandling(e))
}


export default route;