import {Router} from 'express';
import TripController from './tripConrtoller.js';
import { getEnv,log } from '../../core/utils.js';
import AuthMiddleware from '../../midlewares/auth.js';


 

const tripController = new TripController();
const route = Router();
try{
    route.post('/add',new AuthMiddleware().Auth,tripController.add);
    route.get('/user-trips/:id',new AuthMiddleware().Auth,tripController.userTrips);



}catch(e){
     route.use(tripController.errorHandling(e))
}


export default route;