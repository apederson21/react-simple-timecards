import React from 'react';
import '../../css/index.css';
  
let currYear = new Date().getFullYear();

class Footer extends React.Component {
  render() {
    return (
      <ul>
          <li>Copyright {currYear}</li>
      </ul>
    )
  };
};

export default Footer;