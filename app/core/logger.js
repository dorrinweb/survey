import winston, { transports } from 'winston';
import path from 'path';
import { getEnv, log } from './utils.js';
import datetime from './datetime.js';

class Logger {
  constructor() {
    
  }

  log(logger,route, method, message, logLevel = 'info') {

    logger.transports[0].level = logLevel;
    switch (logLevel) {
      case 'error' :
        logger.error(logLevel,{ route, method, message })
      break;
      case 'warning' :
        if(['high','medium'].includes(getEnv('URGENCY_LEVEL_LOGS')))
          logger.warn(logLevel,{ route, method, message })
      break
      case 'info' :
        if(getEnv('URGENCY_LEVEL_LOGS') === 'high')
          logger.info({ route, method, message })
      break;
    } 
  }

  logToFile(logFileName, route, method, message, logLevel = 'info') {
    try{
      const logger = winston.createLogger({
        format: winston.format.combine(
          winston.format.printf(info => {
            const jalaliDate = datetime.toJalaali();
            return `${jalaliDate} ${info.level}: ${info.message} [Route: ${info.route}] [Method: ${info.method}]`;
          })
        ),
        transports: [
          new winston.transports.Console(),
        ]
      });
      const logPath = getEnv('LOG_PATH');
      const logFilePath = path.join(path.dirname(new URL(import.meta.url).pathname), logPath + logFileName);
      logger.transports[0].level = logLevel;
      logger.add(new winston.transports.File({ filename: logFilePath }));
      this.log(logger,route, method, message, logLevel);
      logger.remove(logFilePath);
    }catch(e){
      log(e)
    }
  }
}

export default Logger;
