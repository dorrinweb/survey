import axios from 'axios'
import http from './http.js'
import { getEnv,log,toNumber } from './utils.js'

 class Sms{
    #api_key = null
    #line_number = null
    #smsWebServiceUrl = null
    #app_counrty = null;
    constructor(){
        this.#app_counrty = getEnv('COUNTRY');
        switch(this.#app_counrty){
            case 'IRN':
                this.#api_key = getEnv('SMS_CONFIG_IRN_API_KEY');
                this.#line_number = getEnv('SMS_CONFIG_IRN_LINE_NUMBER','number');
                this.#smsWebServiceUrl = getEnv('SMS_CONFIG_IRN_URL');
            break;
            case 'TUR':
                
                this.#api_key ='??';
                this.#line_number = '??';
                this.#smsWebServiceUrl = '??';
            break
            case 'UAE':
                this.#api_key ='??';
                this.#line_number = '??';
                this.#smsWebServiceUrl = '??';
            break
            case 'EN':
                this.#api_key ='??';
                this.#line_number = '??';
                this.#smsWebServiceUrl = '??';
            break
        }
         
    }
    /*
    Sending one sms to a mobile phone;
    */

   async verify(mobile,value){
        try{
            switch(this.#app_counrty){
                case 'IRN':
                    const smsHearers = {
                        'ACCEPT' : 'application/json',
                        'X-API-KEY' : this.#api_key
                 }
                 const data = {
                    "mobile": mobile,
                    "templateId": "100000",
                    "parameters": [
                    {name: 'CODE' , value: value},
                    ]

                };
                const verifyUrl = this.#smsWebServiceUrl + 'verify'
               const resultHttp = await http.post(verifyUrl,data,{
                    'headers': smsHearers
                });
                return resultHttp.data.status
                break;
                case 'TUR':
                    //no api for sending sms for such country was implemented yet!
                    return -1
                break
                case 'UAE':
                    //no api for sending sms for such country was implemented yet!
                    return -1
                break
                case 'EN':
                    //no api for sending sms for such country was implemented yet!
                    return -1
                break
            }
                    
            
        }catch(e){
            console.log(e.toString())
            return 0;
        }
    }
    /*
    Sending sms to a group of phone numbers in Mobiles array;
    */
    async bulk(MessageText,Mobiles,SendDateTime){
        try{
            switch(this.#app_counrty){
                case 'IRN':
                    const smsHearers = {
                        'ACCEPT' : 'application/json',
                        'X-API-KEY' : this.#api_key
                 }
                 const data = {
                    "lineNumber": this.#line_number,
                    "MessageText": MessageText,
                    "Mobiles": Mobiles

                };
                const sendBulkUrl = this.#smsWebServiceUrl + 'bulk'
                const resultHttp = await http.post(sendBulkUrl,data,{
                    'headers': smsHearers
                });
                return resultHttp.data.status
                break;
                case 'TUR':
                    //no api for sending sms for such country was implemented yet!
                    return -1
                break
                case 'UAE':
                    //no api for sending sms for such country was implemented yet!
                    return -1
                break
                case 'EN':
                    //no api for sending sms for such country was implemented yet!
                    return -1
                break
            }
                    
            
        }catch(e){
            console.log(e.toString())
            return 0;
        }
    }

}
export default new Sms();