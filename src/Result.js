import React from 'react';
import YahooApiResult from './YahooApiResult';

export default class Result extends React.Component {

  constructor(){
    super();
    this.state = {
      code:null
    };
    this.registerTotal = this.registerTotal.bind(this);
  }

  registerTotal(price, hits, janTotal, player, name, image,review){
    this.props.registerTotal(price, hits, janTotal, player, name, image,review);
  }

  render() {

    const result = this.props.result;
    const player = this.props.player;

    if (!result) {
      return null;
    }
    return (
      <YahooApiResult code={result.codeResult.code} player={player} switchScan={this.switchScan} registerTotal={this.registerTotal}/>
    );
  }
};
