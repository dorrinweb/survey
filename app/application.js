import {log,getEnv,sleep,random} from './core/utils.js';
import express from 'express';
import Error500 from './core/Error500Controller.js';
import Error404 from './core/Error404Controller.js';
import translate from './core/translate.js';
import * as fs from './core/fs.js'
import DateTime from './core/datetime.js'
import {MongoDB, Redis,io} from './global.js';
import CORSMiddleware from './midlewares/cors.js';
import FileUploadMiddleware from './midlewares/fileUpload.js';
import swaggerUi from 'swagger-ui-express';
import swagger from './core/swagger.js';
import cookieParser from 'cookie-parser';


class application {

    #app = null;


async run(){
try{
    const redisStatus =  await Redis.connect(getEnv('REDIS_URI'));
    if(!redisStatus)
    {
        log('Redis Can not Connect');
        process.exit(-1);
    }
    const mongodbStatus = await MongoDB.connect(getEnv('MONGODB_URI'));

        if(!mongodbStatus)
        {
            log(`monogdb Can not Connect!`);
            process.exit(-1);
        }
    this.#initExpress();
    this.#initRoute();
    const PORT = getEnv('PORT','number')
    this.#app.listen(PORT,async()=>{
        log(`app listening on the port ${PORT}`);
        await io.init(this.#app);
    })

}catch(e){
    log(`error in run : ${e.toString()}`)
} 
}

async #initExpress(){
    try{
        // translate.changeLanguage('en');
        this.#app = express();          
        this.#app.use(express.static('assets'));
        this.#app.use(express.static(getEnv('UPLOAD_FOLDER') + 'images'));
        this.#app.use(express.static(getEnv('UPLOAD_FOLDER') + 'videos'));
        this.#app.use(express.static(getEnv('UPLOAD_FOLDER') + 'audios'));
        this.#app.use(express.static(getEnv('UPLOAD_FOLDER') + 'texts'));
        this.#app.use(express.static(getEnv('UPLOAD_FOLDER') + 'rayman_info_files'));

        this.#app.use(cookieParser());
        this.#app.use(express.urlencoded({extended:true,limit:'10mb'}));
        this.#app.use(express.json({limit:'10mb'}));
        this.#app.locals.BASE_URL = getEnv('URL');
        this.#app.use(new CORSMiddleware().handle);
        this.#app.use(new FileUploadMiddleware().handle);
        this.#app.use(async(error,req,res,next)=>{
            try{
                return res.status(500).json({"error":"invalid json"});
            }catch(e){
                if(getEnv('DEBUG','bool'))
                    {
                        return res.status(500).json({"error":e.toString()});   
                    }
                    else
                    {
                        return res.status(500).json({"error":"Server Internal Error"});   
                    }
            }
        })
        if(getEnv('DEBUG','bool'))
            {
                this.#app.use(
                    getEnv('SWAGGER_ROUTE'),
                    swaggerUi.serve,
                    swaggerUi.setup(swagger)
                );
            }

        
    }catch(e){
        log(`error in initExpress : ${e.toString()}`)
    }
   
}
async #initRoute(){
    try{
        const route = await import ('./core/appRoutes.js');
        this.#app.use('/',route.default);
        this.#app.use(new Error500().handle);
        this.#app.use(new Error404().handle);
    }catch(e){
        log(`error in initRoute : ${e.toString()}`)
    }
    

}


}
export default new application()