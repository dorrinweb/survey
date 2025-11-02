import BaseController from './BaseController.js'


export default class Error404Controller extends BaseController
{
    constructor(){
        super();
    }
    
    async handle(req,res){

        try{
           return res.status(404).json({"msg" : "page not found!"})

        }catch(e){
          super.toError(e,req,res);  
        }
    }
    
}
