const feather = require('feather-icons');

/**
 * Create Feather Icon SVG Background Image CSS
 * @description Generates a Feather Icon SVG background image based on name input
 * @param {string} iconName name
 * @param {object} svg options, i.e.: { fill: #FFF; stroke: #FFF; }
 * @returns {string} backgroundSVG
 */
export function createSVGBackground(iconName, opts) {
    let icon = feather.icons[iconName];
    
    if (!icon) {
        return '';
    }

    // create bg SVG
    let bgStart = 'url(data:image/svg+xml;charset=UTF-8,'
    let bgEnd = ')';
    let bgImg =  icon.toSvg();

    // add color opts
    if (!!opts) {
        if (opts.fill) {
            bgImg = bgImg.replace('fill="none"', 'fill="' + opts.fill + '"');
        }
        if (opts.stroke) {
            bgImg = bgImg.replace('stroke="currentColor"', 'stroke="' + opts.stroke + '"');
        }
    }

    return bgStart + encodeURIComponent(bgImg).replace(/'/g,"%27").replace(/"/g,"%22") + bgEnd;
}

export const calMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export const calDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

/**
 * Generate Month Data
 * @description Takes in month and year and returns month data for state
 * @param {number} month 00
 * @param {number} year YYYY
 * @returns {object}
 */
export function genMonthData(month, year) {
    return {
        mName: calMonths[month],
        numDays: new Date(year, month + 1, 0).getDate(),
        prevM: (month === 0) ? 11 : month - 1,
        nextM: (month === 11) ? 0 : month + 1,
        startDay: new Date(calMonths[month] + ' 1, ' + year).getDay()
    }
}

/**
 * Route the user somewhere
 * @param {string} loc 
 */
export function routeTo(loc) {
    let route = window.location.protocol + '//';
    route = route + window.location.hostname;
    if (window.location.port) {
        route = route + ':' + window.location.port;
    }
    route = route + '/' + loc;
    window.location.assign(route);
}

/**
 * Handle Notifications
 * @param {type} type (success, warning, error)
 * @param {int} displayTiming (ms)
 * @param {string} message
 */
export function notificationHandler(type, displayTiming, message) {
    let elem = document.getElementsByClassName('notification');

    // no-op when there is an active notification
    if (elem[0].classList.contains('visible')) {
        return
    }

    if (!!message) {
        let acceptableTypes = ['success', 'warning', 'error'];
        if (acceptableTypes.indexOf(type) === -1) {
            type = 'success';
        }

        displayTiming = displayTiming || 2500;
        
        elem[0].innerHTML = message;
        elem[0].classList.add('visible', type);

        window.setTimeout(() => {
            elem[0].classList.remove('visible', type);
            elem[0].innerHTML = '';
        }, displayTiming);
    }
}
