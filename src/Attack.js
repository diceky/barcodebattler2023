import React from 'react';
import Button from '@mui/material/Button';

const attackBtn={
  marginTop:'5px',
  marginBottom:'5px'
}

export default class Attack extends React.Component {

  constructor(){
    super();
    this.state = {
    };
    this.setHp=this.setHp.bind(this);
    this.setPotion=this.setPotion.bind(this);
  }

  setHp(){
    //calculate enemy index
    let enemy=0;
    this.props.player===0 ? enemy=1 : enemy=0;

    //calculate attack value
    //console.log("player"+this.props.player+' attacking with value '+ this.props.janTotal[this.props.player]);
    //console.log("player"+enemy+' defending with value ' + this.props.hits[enemy]);
    let defence=this.props.hits[enemy];
    let attack = this.props.janTotal[this.props.player];
    let attackValue = (attack)-(defence);
    if (attackValue < 0) attackValue = 15;
    //console.log("attackValue:"+attackValue);

    //apply attack
    const enemyPriceBeforeAttack = this.props.price[enemy];
    let enemyPriceAfterAttack = enemyPriceBeforeAttack - attackValue;
    if(enemyPriceAfterAttack < 0) enemyPriceAfterAttack=0;
    //console.log('initialPrice:'+this.props.initialPrice[enemy]);
    //console.log('enemyPriceBeforeAttack:'+enemyPriceBeforeAttack);
    //console.log('enemyPriceAfterAttack:'+enemyPriceAfterAttack);
    const enemyHp = enemyPriceAfterAttack / this.props.initialPrice[enemy] * 100;
    //console.log('enemyHp:'+enemyHp);

    //set state
    let newHp = this.props.hp;
    let newPrice = this.props.price;
    newHp[enemy]=enemyHp;
    newPrice[enemy]=enemyPriceAfterAttack;
    this.props.setHp(newHp,newPrice);
  }

  setPotion(){
    let review=this.props.review[this.props.player];
    let janTotal=this.props.janTotal[this.props.player];
    let newJanTotal = this.props.janTotal;
    newJanTotal[this.props.player]=janTotal*review;
    if((janTotal*review)===0) newJanTotal[this.props.player]=30;
    this.props.setPotion(newJanTotal);
  }

  render() {

    return (
      <div>
      {this.props.attackTurn === this.props.player
         ? <Button variant='contained' color='secondary' onClick={this.setHp} size='small' fullWidth='true' style={attackBtn}>BARCODE ATTACK {this.props.janTotal[this.props.player]}</Button>
         : <Button variant='contained' color='secondary' onClick={this.setHp} size='small' fullWidth='true' style={attackBtn} disabled>BARCODE ATTACK {this.props.janTotal[this.props.player]}</Button>
       }
       {this.props.attackTurn === this.props.player
          ? <Button variant='contained' color='primary' onClick={this.setPotion} size='small' fullWidth='true' style={attackBtn}>YAHOO POTION　x{this.props.review[this.props.player]}</Button>
          : <Button variant='contained' color='primary' onClick={this.setPotion} size='small' fullWidth='true' style={attackBtn} disabled>YAHOO POTION x{this.props.review[this.props.player]}</Button>
        }
      </div>
    );
  }
};
