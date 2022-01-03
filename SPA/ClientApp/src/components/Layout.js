import React, { Component } from 'react';
import NavMenu from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        <NavMenu />
        <div style={{marginLeft:"30px", marginRight:"30px"}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
