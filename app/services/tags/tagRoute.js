import {Router} from 'express';
import TagController from './tagConrtoller.js';
import { getEnv,log } from '../../core/utils.js';
import AuthMiddleware from '../../midlewares/auth.js';


 

const tagController = new TagController();
const route = Router();
try{
    route.post('/add',tagController.add);
    route.get('/my-tags',tagController.myTags);
    // route.get('/view/:id',tagController.view);
    // route.patch('/edit/:id',tagController.edit);


}catch(e){
     route.use(tagController.errorHandling(e))
}


export default route;