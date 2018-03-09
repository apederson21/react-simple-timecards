## Timecard Calendar React App

### Note
This is a WIP to explore React. I've created a couple components here to get familar with props, state, and other React basics. This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app)

### Code Structure and Functionality
 * Components are located in `src/components`
 * Session management is done via cookies `simpleCards.id` and `simpleCards.un`
 * Timecard data is stored and retrieved via browser session storage, under the key of `{yyyy}-{m}`
 * `src/utils` contains various functions used throughout the app
 * `src/strings` contains all the user text used in the app

### Code Details
 * `npm start` starts the dev server on port 3000
 * The Login component does basic input validation, but since we aren't actually hitting any server you can sign in with nonsense.
 * The `Timecard` componenet will initiate with the current month/year, pull associated month data (number of days in a month, start day, etc...), and retrieve the hours logged for that month (from session storage).
   * This component handles state for what month/year the user is viewing
   * This component passes the necessary data via props to the Month component
 * The `Month` component receives props from the Timecard component and renders the HTML for the actual days of the calendar.
   * This component handles state for hours per day
   * This component allows users to save hours (via session storage)

### Test the App
 1. Install the latest version of [Node](https://nodejs.org)
 2. Clone the repo and run `npm install`
 3. Run `npm start` (your browser should open automatically)
 4. Login with "valid" credentials, i.e. `user` `password`
    * Notice two "simpleCard" cookies were created
 5. Add hours to any day(s) and click Save.
    * Notice your session storage contains the timecard data

### TBD
 * Approved Hours
 * Submitted Hours