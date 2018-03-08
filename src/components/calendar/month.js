import React from 'react';
import '../../css/index.css';
import { createSVGBackground, notificationHandler } from '../../utils/utils';
import { appStrings } from '../../strings/strings';
import { storeTimecardData } from '../../session/session';
  
/**
 * @description Renders a calendar month
 */
class Month extends React.Component {
    constructor(props) {
        super(props);

        // create state
        this.state = {
            userHours: {}
        };
    }

    componentDidMount() {
        // reset the save button and form
        this.resetForm({
            saveButton: true,
            formInputs: true
        });
    }

    componentWillReceiveProps(nextProps) {
        // reset the save button and form
        this.resetForm({
            saveButton: true,
            formInputs: true
        });
        this.setState({
            userHours: {}
        });
    }

    /** Reset component items
     * @description Pass in items to reset in the compoenent
     *              Example: { saveButton: true } will reset
     *                  the state of the save button
     * @param {object} resetItems
     */
    resetForm(resetItems) {
        if (!!resetItems.saveButton) {
            let saveElem = document.getElementsByClassName('saveChanges');
            saveElem[0].classList.add('unavailable');
            saveElem[0].classList.remove('saving');
        }

        if (!!resetItems.formInputs) {
            let form = document.getElementById('monthDays');
            form.reset();
        }
    }

    /** Validate input is a number
     * @param event 
     */
    handleChangeHours (event) {
        let dayNum = event.target.id,
            dayVal = parseFloat(event.target.value).toFixed(2);

        if (!isNaN(dayVal) && dayVal >= 0 && dayVal <= 24) {
            this.setState({
                userHours: Object.assign(this.state.userHours, {
                    [dayNum]: parseFloat(dayVal)
                })
            });
            
            // show save buttons
            let saveElem = document.getElementsByClassName('saveChanges');
            saveElem[0].classList.remove('unavailable');
        } else {
            this.setState({
                userHours: Object.assign(this.state.userHours, {
                    [dayNum]: 0
                })
            });
        }
    }

    /**
     * Save Data Changes
     * @description Will save the hours logged by the user in the current month
     */
    saveChanges() {
        let saveElem = document.getElementsByClassName('saveChanges');
        
        if (saveElem[0].classList.contains('unavailable')) return;

        // if user has made hours changes
        if (this.state.userHours && Object.keys(this.state.userHours).length > 0) {
            // add `unavailable` class to save buttons
            
                saveElem[0].classList.add('unavailable');

            storeTimecardData(this.props.y, this.props.m, this.state.userHours)
                .then(() => {
                    notificationHandler('success', 2000, 'Changes saved!');
                })
                .catch((err) => {
                    notificationHandler('error', 5000, `An error occurred: ${err}`);
                })
                .finally(() => {
                    // reset the save button
                    this.resetForm({
                        saveButton: true
                    });
                });
        }
    }

    showSubmitted() {
        document.querySelectorAll('.day.numbered:not(.submitted)').forEach((node) => {
            node.classList.add('hidden');
        });
        document.querySelectorAll('.day.numbered.submitted').forEach((node) => {
            node.classList.remove('hidden');
        });
    }
    showApproved() {
        document.querySelectorAll('.day.numbered:not(.approved)').forEach((node) => {
            node.classList.add('hidden');
        });
        document.querySelectorAll('.day.numbered.approved').forEach((node) => {
            node.classList.remove('hidden');
        });
    }
    resetSelection() {
        document.querySelectorAll('.day.numbered').forEach((node) => {
            node.classList.remove('hidden');
        });
    }

    render() {
        // construct the days of the week
        let daysBody = [];
        let dayCounter = 0;
        if (this.props.startDay > 0) {
            for (let x=this.props.startDay; x--;) {
                daysBody.push(<div className='day' key={x + '_1'}></div>);
                dayCounter += 1;
            }
        }
        
        let groups = ['A', 'B', 'C', 'D', 'E', 'F']; // groups days in the same week
        let groupIndex = -1;
        let partialFlag = 0;
        for (let x=1; x<=this.props.numDays; x++) {
            /*
                if we're starting a new week
                    OR
                if we're rendering a partial week
                    THEN
                update our group index and flip the partial flag
            */
            if ((dayCounter % 7 === 0) || (dayCounter < 7 && partialFlag === 0)) {
                groupIndex += 1;
                partialFlag = 1;
            }

            let dayGroup = groups[groupIndex];

            // populate input value from hours logged
            let hoursLogged = (!!this.props.hoursLogged && this.props.hoursLogged[x] >= 0) ?
                                this.props.hoursLogged[x] : 0;

            // are hours approved?
            let hoursApproved = !!this.props.hoursApproved[x];
            
            // TODO
            // are hours submitted?
            let hoursSubmitted = false;

            // add `current` class to current day
            let currentDayClass = (`${this.props.m}-${x}-${this.props.y}` === this.props.current) ? 'current' : '';

            // add `approved` class to day with approved hours
            let approvedDayClass = (!!this.props.hoursApproved[x]) ? 'approved' : ''

            let hoursDisplay = 
                (approvedDayClass) ? 
                <div aria-label={ appStrings.timecards.statusSubmitted }>{hoursLogged}</div>
                :
                <input  type='text'
                        id={x}
                        pattern='^\d+(\.\d{0,2})?$'
                        maxLength='4'
                        placeholder={hoursLogged}
                        { ...(hoursApproved ? {className: 'approved'} : {}) }
                        onChange={this.handleChangeHours.bind(this)} />
            daysBody.push(
                <div className={`day numbered ${dayGroup} ${currentDayClass} ${approvedDayClass}`}
                     style={{backgroundImage: (approvedDayClass) ? createSVGBackground('check') : ''}}
                     key={x}>
                    <span>{x}</span>
                    <div className='dayDetails'>
                        <div className='dayHours'>
                            <label htmlFor={x}>
                                { appStrings.common.hours }
                            </label>
                            { hoursDisplay }
                            {
                                ((hoursSubmitted && !approvedDayClass) ? <div>{ appStrings.timecards.statusSubmitted }</div> : '')
                            }
                        </div>
                    </div>
                </div>);
            dayCounter += 1;
        }

        return (
            <div>
                <form id='monthDays'>
                    {daysBody}
                </form>
                <div className='monthActions'>
                    <button
                        className='saveChanges'
                        onClick={() => this.saveChanges()}>{ appStrings.buttons.saveChanges }</button>
                    <button
                        className='secondary'
                        onClick={() => this.showSubmitted()}>{ appStrings.buttons.showSubmitted }</button>
                    <button
                        className='secondary'
                        onClick={() => this.showApproved()}>{ appStrings.buttons.showApproved }</button>
                    <button
                        className='secondary'
                        onClick={() => this.resetSelection()}>{ appStrings.buttons.resetSelection }</button>
                </div>
            </div>
        );
    }
}

export default Month;
  