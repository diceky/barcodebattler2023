import React from 'react';
import MonsterStats from './MonsterStats';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { firestore } from './firebase';

var cardStyle = {
  backgroundColor:'#F5F5F5'
}

const imgStyle = {
  width:'80%',
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
      //var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + url + '"') + '&format=json';
      
      // new Yahoo API endpoint
      var url = "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=dj00aiZpPTBmZ3FvZkNCSzAweSZzPWNvbnN1bWVyc2VjcmV0Jng9YjA-&jan_code=" + this.props.code;
      var cors = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      
      fetch(cors, {
        method: 'GET',
        dataType: 'json',
       })
      .then(res => res.json())
      .then(data => {
          var obj = JSON.parse(data.contents);
          if(obj.totalResultsAvailable > 0){ //yahoo API has a hit
            var splitName = obj.hits[0].name.split(" ");//hankaku space
            if(splitName.length===1) splitName = obj.hits[0].name.split("　");//zenkaku space
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
              this.setState({name:obj.hits[0].name});
            }
            this.setState({
              manufacturer:obj.hits[0].brand.name,
              image:obj.hits[0].image.medium,
              price:obj.hits[0].price,
              hits:obj.totalResultsAvailable,
              review:obj.hits[0].review.rate,
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
          //console.log(this.props.code+' already exists in firestore');
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
          <Card style={cardStyle}>
            <CardContent>
              <Typography type='h5' color='inherit' style={{ fontSize: '18px', marginTop:'10px', marginBottom:'10px', fontWeight:'600', textAlign:'center'}}>
                {this.state.name}
              </Typography>
              <div style={{textAlign:'center'}}>
                <img src={this.state.image} style={imgStyle} className='scanImg' alt="product"/>
              </div>
              <MonsterStats name={this.state.name} price={this.state.price} janTotal={statsJanTotal}　hits={statsHits}/>
            </CardContent>
          </Card>
        </div>
      );
    }
  }
};
