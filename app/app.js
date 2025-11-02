import application from './application.js'
import {log} from './core/utils.js'
async function main(){
    try {
        await application.run();
    }
    catch(e){
        log(`error in main : ${e.toString()}`)
    }
    
}
main();
