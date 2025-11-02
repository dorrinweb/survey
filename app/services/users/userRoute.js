import {Router} from 'express';
import Auth from '../../midlewares/auth.js';
import RateLimit from '../../midlewares/rateLimit.js'
import UserController from './userController.js';
import { getEnv,log } from '../../core/utils.js';
import AuthMiddleware from '../../midlewares/auth.js';


const userController = new UserController();
const route = Router();
try{
     
     route.post('/register',userController.register);
     route.get('/index',userController.index);
     route.post('/get-password',new RateLimit('get_admin_password',10,120,120).handle,userController.getPassword);
     route.post('/login',userController.otpLogin);

    
}catch(e){
     route.use(userController.errorHandling(e))
}


export default route;