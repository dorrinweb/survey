import {Router} from 'express';

import userRoute from '../services/users/userRoute.js';
import carRoute from '../services/cars/carRoute.js';
import householdRoute from '../services/houseHolds/houseHoldRoute.js';

const route = Router();

//User rotes:
route.use('/user',userRoute);

//car routes:
route.use('/car',carRoute);

//Tag routes:
route.use('/household',householdRoute);

export default route;
