import {Router} from 'express';
import userRoute from '../services/users/userRoute.js';
import householdRoute from '../services/houseHolds/houseHoldRoute.js';
import tripRoute from '../services/trips/tripRoute.js';
import adminRoute from '../services/admin/adminRoute.js';

const route = Router();

//User rotes:
route.use('/user',userRoute);

//Tag household:
route.use('/household',householdRoute);

//Trip routes:
route.use('/trip',tripRoute);

route.use('/admin',adminRoute)
export default route;
