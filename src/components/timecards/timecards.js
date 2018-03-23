import React from 'react';
import Month from '../calendar/month';

import { calDays, createSVGBackground, genMonthData } from '../../utils/utils';
import { getTimecardData } from '../../session/session';
import { appStrings } from '../../strings/strings';

let days = calDays;

class Timecards extends React.Component {
    constructor() {
        super();

        // start with a fresh date
        let d = new Date();

        // declare month/date basics
        let monthBasics = {
            y: d.getFullYear(),
            m: d.getMonth()
        };

        // get more data from basics (month name, next month, previous month, etc...)
        let monthData = genMonthData(monthBasics.m, monthBasics.y);

        let monthsTimecardData = getTimecardData(monthBasics.y, monthBasics.m);

        // create state
        this.state = Object.assign(monthBasics, monthData, {
            hoursLogged: monthsTimecardData.hoursLogged,
            hoursApproved: monthsTimecardData.hoursApproved,
            hoursSubmitted: monthsTimecardData.hoursSubmitted,
            current: `${monthBasics.m}-${d.getDate()}-${monthBasics.y}`
        });
    }

    /**
      * Change the calendar month
      * @description Increments or decrements the calendar month
      * @param {boolean} increment
      */
     changeMonth (increment) {
        // calculate our new month and year (increase or decrease)
        let targetState = {};
        if (increment) {
            targetState.y = (this.state.m === 11) ? this.state.y + 1 : this.state.y;
            targetState.m = (this.state.m === 11) ? 0 : this.state.m + 1;
        } else {
            targetState.y = (this.state.m === 0) ? this.state.y - 1 : this.state.y;
            targetState.m = (this.state.m === 0) ? 11 : this.state.m - 1;
        }

        let monthsTimecardData = getTimecardData(targetState.y, targetState.m);
        targetState.hoursLogged = monthsTimecardData.hoursLogged;
        targetState.hoursApproved = monthsTimecardData.hoursApproved;
        targetState.hoursSubmitted = monthsTimecardData.hoursSubmitted;

        Object.assign(targetState, genMonthData(
            targetState.m, targetState.y
        ));

        this.setState(targetState);
    }

    render() {
        // construct days of week heading
        let daysHeading = [];
        days.forEach(function (item) {
            daysHeading.push(<div className='day'>{item}</div>);
        });

        return (
            <main>
                <h3>{ appStrings.timecards.heading }</h3>
                <div className='month'>
                    <div className='monthNavigation'>
                        <div onClick={() => this.changeMonth(false)} className='prev' style={{backgroundImage: createSVGBackground('arrow-left')}}></div>
                        <div className='title'>{ appStrings.timecards.months[this.state.mName.toUpperCase()]} {this.state.y}</div>
                        <div onClick={() => this.changeMonth(true)} className='next' style={{backgroundImage: createSVGBackground('arrow-right')}}></div>
                    </div>
                    <div className='monthHeadings'>
                        { days.map((day, i) => <div className='day' key={i}>{day}</div>) }
                    </div>
                    <Month  m={this.state.m}
                            y={this.state.y}
                            hoursLogged={this.state.hoursLogged}
                            hoursApproved={this.state.hoursApproved}
                            hoursSubmitted={this.state.hoursSubmitted}
                            mName={this.state.mName}
                            numDays={this.state.numDays}
                            nextM={this.state.nextM}
                            prevM={this.state.prevM}
                            startDay={this.state.startDay}
                            current={this.state.current} />
                </div>
            </main>
        )
    }
};

export default Timecards;