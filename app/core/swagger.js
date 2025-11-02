import BaseMiddleware from '../core/BaseMiddleware.js';
import {getEnv, log} from '../core/utils.js';
import swaggerJsdoc from 'swagger-jsdoc';

import user from '../services/users/userSwagger.js';
import Car from '../services/cars/carSwagger.js';
import HouseHold from '../services/houseHolds/houseHoldSwagger.js';



const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: getEnv('SWAGGER_TITLE'),
        version: getEnv('SWAGGER_VERSION'),
      },
      servers: [
        {
          url: getEnv('API_URL'),
        },
      ],
    },
    apis:[],
    swaggerDefinition:{
      paths : {
        ...HouseHold,
        ...user,
        ...Car,
      }
    }
};

export default swaggerJsdoc(options);
