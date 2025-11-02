
import Redis from "./core/redis.js";
import MongoDB from "./core/mongodb.js";
import SocketIOServer from "./core/socketio.js";
import Logger from "./core/logger.js";

const RedisObject = new Redis();
const MongoObject = new MongoDB();
const IOObject = new SocketIOServer();
const LoggerObject = new Logger();

export {
    RedisObject as Redis,
    MongoObject as MongoDB,
    IOObject as io,
    LoggerObject as Logger,
};