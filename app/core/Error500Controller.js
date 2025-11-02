import BaseController from './BaseController.js'


export default class Error500Controller extends BaseController
{
    constructor(){
        super();
    }
    
    async handle(error,req,res,next){

        try{
           return super.toError(error,req,res)

        }catch(e){
          super.toError(e,req,res);  
        }
    }
    
}
