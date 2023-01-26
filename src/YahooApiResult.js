import React from 'react';
import MonsterStats from './MonsterStats';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { firestore } from './firebase';

var cardStyle = {
  backgroundColor:'#F5F5F5'
}

export default class YahooApiResult extends React.Component {

  constructor(){
    super();
    this.state = {
      isLoaded: false,
      name:null,
      manufacturer:null,
      image:null,
      price:null,
      hits:null,
      review:null
    };
  }

  componentDidMount(){

      // deprecated Yahoo API endpoint
      //var url =  "https://shopping.yahooapis.jp/ShoppingWebService/V1/itemSearch?appid=dj00aiZpPTBmZ3FvZkNCSzAweSZzPWNvbnN1bWVyc2VjcmV0Jng9YjA-&jan="+this.props.code;
      
      // new Yahoo API endpoint
      var url = "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=dj00aiZpPTBmZ3FvZkNCSzAweSZzPWNvbnN1bWVyc2VjcmV0Jng9YjA-&jan_code=" + this.props.code;
      var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + url + '"') + '&format=json';
      console.log(url);
      
      fetch(url, {
        method: 'GET',
        dataType: 'json',
      })
      .then(res => res.json())
      .then(data => {
          if(data.query.results.ResultSet.totalResultsAvailable != 0){ //yahoo API has a hit
            console.log("code exists in Yahoo API!");
            var splitName = data.query.results.ResultSet.Result.Hit[0].Name.split(" ");//hankaku space
            if(splitName.length==1) splitName = data.query.results.ResultSet.Result.Hit[0].Name.split("　");//zenkaku space
            console.log(splitName);
            if(splitName.length > 1){
              var filteredName = "";
              for(var k=0;k<splitName.length;k++){
                if (
                  splitName[k].includes("入荷") || splitName[k].includes("枚") ||
                  splitName[k].includes("ケース") || splitName[k].includes("パック") ||
                  splitName[k].includes("送料無料") || splitName[k].includes("×") ||
                  splitName[k].includes("袋") || splitName[k].includes("セット") ||
                  splitName[k].includes("個入") || splitName[k].includes("特価")　||
                  splitName[k].includes("訳あり") || splitName[k].includes("賞味期限") ||
                  splitName[k].includes("配送")
                ){
                  continue;//skip that element
                }
                else{
                  filteredName = filteredName + splitName[k] + " ";
                }
              }
              this.setState({name:filteredName});
            }else{
              this.setState({name:data.query.results.ResultSet.Result.Hit[0].Name});
            }
            this.setState({
              manufacturer:data.query.results.ResultSet.Result.Hit[0].Brands.Name,
              image:data.query.results.ResultSet.Result.Hit[0].Image.Medium,
              price:data.query.results.ResultSet.Result.Hit[0].Price.content,
              hits:data.query.results.ResultSet.totalResultsAvailable,
              review:data.query.results.ResultSet.Result.Hit[0].Review.Rate,
              isLoaded:true
            });
          }
      });
  }

  render() {

    if (!this.state.isLoaded) {
      return <div><Typography type='h6' color='inherit' style={{ fontSize: '15px'}}>Loading...</Typography></div>;
    }else{

      let janTotal=0;
      for (var i = 1, len = this.props.code.toString().length; i < len; i += 1) {
        janTotal += Number(this.props.code.toString().charAt(i)); //add all digits of JAN code excluding first digit (=4)
      }

      const statsJanTotal = janTotal*10;
      const statsHits = Number(this.state.hits)*10;

      // pass total value & name to parent
      this.props.registerTotal(Number(this.state.price),statsHits,statsJanTotal, this.props.player, this.state.name,this.state.image,this.state.review);

      //register to firestore
      firestore.collection('barcodes').doc(this.props.code)
      .get()
      .then(doc=>{
        if(doc.exists){
          console.log(this.props.code+' already exists in firestore');
        } else{
          firestore.collection("barcodes").doc(this.props.code).set({
            name: this.state.name,
            price: this.state.price,
            hits: statsHits,
            janTotal: statsJanTotal,
            wins:0
          },
          {merge: true})
        }
      });

      return (
        <div>
          {/*
          <ul className="results">
            <li>{this.props.code}</li>
            <li>{this.state.name}</li>
            <li>{this.state.manufacturer}</li>
            <li>{this.state.price}</li>
            <li>{this.state.hits}</li>
          </ul>
          */}
          <Card style={cardStyle}>
            <CardContent>
              <Typography type='h5' color='inherit' style={{ fontSize: '15px', marginTop:'10px', marginBottom:'10px', fontWeight:'600', textAlign:'center'}}>
                {this.state.name}
              </Typography>
              <div style={{textAlign:'center'}}>
                <img src={this.state.image} className='scanImg'/>
              </div>
              <MonsterStats name={this.state.name} price={this.state.price} janTotal={statsJanTotal}　hits={statsHits}/>
            </CardContent>
          </Card>
        </div>
      );
    }
  }
};
