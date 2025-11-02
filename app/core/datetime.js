import momentTimeZone from 'moment-timezone';
import momentJalaali from 'jalali-moment';
import {getEnv,log} from './utils.js'
import moment from "moment";

class DateTime{

    getTimeStamp(){
        try{
            return moment.tz(getEnv('TIME_ZONE')).unix();
        }catch(e){
            return 0;
        }
    }

    toString(format = 'YYYY-MM-DD HH:mm:ss'){
        try{
            return  moment.tz(getEnv('TIME_ZONE')).format(format);
        }catch(e){
            return '';
        }
    }

    toDateTime(dateTime = ''){
        try{
            return (dateTime === '') ? moment.tz(getEnv('TIME_ZONE')) : moment.tz(dateTime,getEnv('TIME_ZONE'));
        }catch(e){
            return null;
        }
    }

    toJalaali(str,format='jYYYY-jMM-jDD HH:mm:ss'){
        try{
            if(!str)
                str = moment.tz(getEnv('TIME_ZONE'));
            return momentJalaali(str).format(format);
        }catch(e){
            return '';
        }

    }

    getJalaaliDate(timeMode, count) {
        try {
            let date = moment.tz(getEnv('TIME_ZONE')); // تاریخ امروز بر اساس منطقه زمانی

            // براساس نوع زمان و تعداد روز، ماه یا هفته تاریخ را محاسبه می‌کنیم
            switch (timeMode) {
                case 'day':
                    date.subtract(count, 'days');
                    break;
                case 'month':
                    date.subtract(count, 'months');
                    break;
                case 'week':
                    date.subtract(count, 'weeks');
                    break;
                default:
                    throw new Error('Invalid timeMode. Use "day", "month", or "week".');
            }

            return momentJalaali(date).format('jYYYY-jMM-jDD HH:mm:ss'); // تاریخ شمسی
        } catch (e) {
            log(`Error in getJalaaliDate: ${e.message}`); // لاگ خطا
            return ''; // در صورت بروز خطا رشته خالی برمی‌گرداند
        }
    }


    toGregorian(str,format='YYYY-MM-DD'){
        try{
            return momentJalaali(str,'jYYYY-jMM-jDD').format(format);
        }catch(e){
            return '';
        }
    }

    checkDate(date, format = 'YYYY-MM-DD'){
        return moment.tz(date, format, getEnv('TIME_ZONE')).isValid();
    }

    calculateJalaliTimeDifference(time1, time2) {
        const momentTime1 = moment(time1, 'jYYYY-jMM-jDD HH:mm:ss');
        const momentTime2 = moment(time2, 'jYYYY-jMM-jDD HH:mm:ss');
        const diffInSeconds = momentTime1.diff(momentTime2, 'seconds');
        return diffInSeconds;
    }
}
export default new DateTime();