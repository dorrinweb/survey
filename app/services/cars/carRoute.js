import {Router} from 'express';
import CarController from './carController.js';
import { getEnv,log } from '../../core/utils.js';
import AuthMiddleware from '../../midlewares/auth.js';

 

const carController = new CarController();
const route = Router();
try{
    route.post('/add',carController.add);
    route.get('/my-cars',carController.myCars);
    route.get('/view/:id',carController.view);
    route.patch('/edit/:id',carController.edit);


}catch(e){
     route.use(carController.errorHandling(e))
}


export default route;