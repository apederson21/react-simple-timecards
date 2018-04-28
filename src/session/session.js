import { routeTo } from '../utils/utils';

const identifier = 'simpleCard';
const cookies = [
    {
        key: 'un',
        prop: 'username'
    },
    {
        key: 'id',
        prop: 'id'
    }
];

/**
 * Get current user session (if exists)
 * @description Once called, this will check browser cookies
 *              for the presence of 'simpleCard' ui and id values
 * @returns {object} User session data { username, id }
*/
export function sessionGet() {
    let userData = {};
    cookies.forEach((item) => {
        let name = identifier + '.' + item.key;
        let regexp = new RegExp("(?:" + name + "|;s*"+ name + ")=(.*?)(?:;|$)", "g");
        let result = regexp.exec(document.cookie);
        if(result !== null) {
            userData[item.prop] = result[1];
        }
    });

    return userData;
}

/**
 * Set user session data
 * @description Takes in user data object and creates
 *              browser cookie, which expires in 3 days
 * @param {object} userData
 * @returns {boolean} success
 */
export function sessionSet(userData) {
    if (!userData) {
        return false;
    } else {
        try {
            let d = new Date();
            d.setTime(d.getTime() + (3*24*60*60*1000)); // 3 day cookie
            cookies.forEach(function(item) {
                document.cookie = identifier + '.' + item.key + '=' + userData[item.prop] + '; expires=' + d.toUTCString();
            });
            return true;
        } catch (e) {
            /**
             * @TODO
             *  Handle error more elegantly
             */
            console.log('Error creating session. Details: ', e);
            return false;
        }
    }
}

/**
 * Clear user session (logout)
 * @description Clears out user session cookies
 *              then routes back to home /
 */
export function sessionClear() {
    cookies.forEach((item) => {
        let name = identifier + '.' + item.key;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    });
    routeTo('');
}

/**
 * Store timecard data in browser session storage (since there is no database)
 * @description Store user's timecard data
 * @param {number} Year
 * @param {number} Month
 * @param {object} Timecard (day as key) {1: { hours: , notes: , etc... } }
 * 
 * @returns {promise}
 */
export function storeTimecardData(year, month, timecard) {
    return new Promise((resolve, reject) => {
        if (!month || !year || !timecard) {
            reject('Missing one or more required pieces of data.');
        } else {
            // if existing month data saved, merge
            let existingHours = getTimecardData(year, month);
            if (!!existingHours.hoursLogged) {
                let targetObj = Object.assign(existingHours.hoursLogged, timecard);
                sessionStorage.setItem(`${year}-${month}`, JSON.stringify(targetObj));
            } else {
                sessionStorage.setItem(`${year}-${month}`, JSON.stringify(timecard));
            }
            resolve();
        }
    });
}

/**
 * Submit timecard data in browser as session storage (since there is no database)
 * @description Submit user's hours
 * @param {number} Year
 * @param {number} Month
 * @param {object} Timecard (day as key) {1: { hours: , notes: , etc... } }
 * 
 * @returns {promise}
 */
export function submitTimecardData(year, month, timecard) {
    return new Promise((resolve, reject) => {
        if (!month || !year || !timecard) {
            reject('Missing one or more required pieces of data.');
        } else {
            // if existing month data saved, merge
            let existingHours = getTimecardData(year, month, 'submit_');
            if (!!existingHours.hoursSubmitted) {
                let targetObj = Object.assign(existingHours.hoursSubmitted, timecard);
                sessionStorage.setItem(`submit_${year}-${month}`, JSON.stringify(targetObj));
            } else {
                sessionStorage.setItem(`submit_${year}-${month}`, JSON.stringify(timecard));
            }
            resolve();
        }
    });
}

/**
 * Get timecard data from browser session storage
 * @description Gets all timecard data for the user
 *              Approved hours are TBD for now and always return  {}
 * 
 * @param {string} year
 * @param {string} month
 * @returns {object} 
 */
export function getTimecardData(year, month) {
    return {
        hoursApproved: {},
        hoursLogged: JSON.parse(sessionStorage.getItem(`${year}-${month}`)),
        hoursSubmitted: JSON.parse(sessionStorage.getItem(`submit_${year}-${month}`)),
    }
}