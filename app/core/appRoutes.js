import {Router} from 'express';
import userRoute from '../services/users/userRoute.js';
import householdRoute from '../services/houseHolds/houseHoldRoute.js';

const route = Router();

//User rotes:
route.use('/user',userRoute);

//Tag routes:
route.use('/household',householdRoute);

export default route;
