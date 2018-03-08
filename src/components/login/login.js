import React from 'react';
import '../../css/index.css';
import { sessionGet, sessionSet } from '../../session/session';
import { appStrings } from '../../strings/strings';
import { routeTo } from '../../utils/utils';

const redirectToAfterSuccess = '';

class Login extends React.Component {
    constructor() {
        super();

        this.state = {
          loginValue: '',
          password: ''
        };

        this.handleChangeLoginvalue = this.handleChangeLoginvalue.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.validateLogin = this.validateLogin.bind(this);
    }

    componentWillMount() {
        // check for existing session
        if (!!sessionGet().username) {
            routeTo(redirectToAfterSuccess);
        }
    }

    /**
     * Validate login submission
     */
    validateLogin (event) {
        event.preventDefault();
        
        // validate username
        let validUsername = false;
        let un = document.querySelector('.login .loginValue');
        if (!this.state.loginValue) {
            un.classList.add('error');
        } else {
            un.classList.remove('error');
            validUsername = true;
        }

        // validate password
        let validPassword = false;
        let pass = document.querySelector('.login .password');
        if (!this.state.password || this.state.password.length < 6) {
            pass.classList.add('error');
        } else {
            pass.classList.remove('error');
            validPassword = true;
        }

        // create session
        if (!!validUsername && !!validPassword) {
            let userSessionSuccess = sessionSet({
                username: this.state.loginValue,
                id: Math.floor(Math.random()*900000) + 100000 + '-' + Math.floor(Math.random()*900000) + 100000
            });

            /**
             * @TODO
             *  Error handling
             */
            if (!!userSessionSuccess) {
                // route to home after successful login
                routeTo(redirectToAfterSuccess);
            }
        }
    }

    handleChangeLoginvalue (event) {
        this.setState({
            loginValue: event.target.value
        });
    }
    handleChangePassword (event) {
        this.setState({
            password: event.target.value
        })
    }

    render() {
    return (
        <form className='login' onSubmit={this.validateLogin}>
            <div className='loginValue'>
                <label>
                    {appStrings.login.loginValue}
                    <input
                        type='text'
                        maxLength='100'
                        value={this.state.loginValue}
                        onChange={this.handleChangeLoginvalue}
                        aria-label={appStrings.login.loginValue} />
                </label>
            </div>
            <div className='password'>
                <label>
                    {appStrings.login.password}
                    <input
                        type='password'
                        autoComplete='off'
                        maxLength='20'
                        pattern=".{6,}"
                        onChange={this.handleChangePassword}
                        aria-label={appStrings.login.password} />
                </label>
            </div>
            <div>
                <input
                    type='submit'
                    aria-label={appStrings.login.submit}
                    label={appStrings.login.submit}/>
            </div>
        </form>
    );
  }
}
  
export default Login;