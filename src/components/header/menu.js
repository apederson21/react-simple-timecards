import React from 'react';
import PropTypes from 'prop-types';
import '../../css/index.css';
import { sessionGet, sessionClear } from '../../session/session';
import { createSVGBackground, routeTo } from '../../utils/utils';

class MenuItem extends React.Component {
  render() {
    return (
      <li active={(window.location.pathname === this.props.href) ? 'true' : 'false'}><a href={this.props.href}>{this.props.text}</a></li>
    );
  }
}

MenuItem.propTypes = {
  href: PropTypes.string
};

let sessionUser;

class Menu extends React.Component {
  componentWillMount() {
    sessionUser = sessionGet();
    if (Object.keys(sessionUser).length === 0 && (window.location.pathname !== '/login')) {
      routeTo('login');
    }
  }

  handleLogout() {
    sessionClear();
  }

  render() {  
    let links = [];
    if (!!sessionUser.username) {
      links.push(<li className='user' style={{backgroundImage: createSVGBackground('user', {stroke: '#E6E6E6'})}} key='userName'>{sessionUser.username}</li>);
      links.push(<li className='logout' key='logout'><a onClick={() => this.handleLogout()}>Logout</a></li>);
    } else {
      links.push(<li className='loggedOut' key='loggedOut'>Please log in below</li>);
    }
    return (
      <div>
        <ul>
            {links}
        </ul>
      </div>
    );
  }
}
  
export default Menu;
  