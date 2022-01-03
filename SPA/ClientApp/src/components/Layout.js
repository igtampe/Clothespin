import { Divider } from '@material-ui/core';
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
          <Divider style={{marginTop:"20px"}}/>
          <div style={{color:"#B0B0B0", fontSize:".7em", marginTop:"20px", marginLeft:"25px", marginRight:"25px", textAlign:'center'}}>
            ©2022 <a href='https://sites.google.com/view/igtampe' style={{color:"#B0B0B0"}}>Igtampe</a>, no rights reserved<br/>
            Built using ReactJS and ASP.NET<br/>
            See the <a href='https://www.github.com/igtampe/clothespin' style={{color:"#B0B0B0"}}>Github</a>
            </div>
        </div>
      </div>
    );
  }
}
