import React from 'react';
import Scanner from './Scanner';
import Result from './Result';
import Battle from './Battle';
import Ranking from './Ranking';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';

const scanBtn = {
  margin: '40px auto',
  height:'50px',
  fontSize:'15px'
  };

const menuText = {
  marginLeft:'auto',
  marginRight:'auto',
  };

const modalStyle = {
    position: 'absolute',
    padding: '40px',
    transform: 'translate(0%, 0%)'
  };

const modalText = {
    color:'white',
    marginTop:'20px',
    marginBottom:'20px'
  };

const footerStyle = {
  position:'fixed',
  bottom:'0',
  textAlign:'center',
}

  export default class App extends React.Component {
    constructor(){
      super();
      this.state = {
        scanning1: false,
        scanned1:false,
        results1: [],
        results2:[],
        scanning2: false,
        scanned2:false,
        stats1:[],
        stats2:[],
        name1:null,
        name2:null,
        table:false,
        battle:false,
        help:false
      };
      this._scan1=this._scan1.bind(this);
      this._scan2=this._scan2.bind(this);
      this._onDetected1=this._onDetected1.bind(this);
      this._onDetected2=this._onDetected2.bind(this);
      this.registerTotal=this.registerTotal.bind(this);
      this.resetScan=this.resetScan.bind(this);
      this.showTable=this.showTable.bind(this);
      this.showHelp=this.showHelp.bind(this);
      this.closeModal=this.closeModal.bind(this);
    }

    render() {
        return (
          <div>
            <AppBar position="static" color="default">
              <Toolbar>
                <Button color="inherit" aria-label="Menu" onClick={this.showTable}>
                  <BarChartIcon />
                </Button>
                  <Typography variant="h6" color="inherit" style={menuText}>
                    Barcode Battler
                  </Typography>
                <Button color="inherit" aria-label="Menu" onClick={this.showHelp}>
                  <HelpIcon />
                </Button>
               </Toolbar>
              </AppBar>
            <div>
              {this.state.table? <Ranking /> : null}
            </div>
            <Grid container spacing={0}>
              <Grid item xs={4}>
              </Grid>
              <Grid item xs={4}>
                <div id="scan-area">
                    <Button variant='contained' color='primary' size='small' onClick={this._scan1} style={scanBtn} fullWidth={true}>{this.state.scanning1 ? 'Stop' : 'PLAYER1'}</Button>
                </div>
              </Grid>
              <Grid item xs={4}>
              </Grid>
              <Grid item xs={12}>
                {this.state.results1.map((result) => (<Result key={result.codeResult.code} player={1} result={result} registerTotal={this.registerTotal}/>))}
                {this.state.scanning1 ? <Scanner onDetected={this._onDetected1} /> : null}
              </Grid>


              <Grid item xs={4}>
              </Grid>
              <Grid item xs={4}>
                <div id="scan-area">
                  <Button variant='contained' color='secondary' size='small' onClick={this._scan2} style={scanBtn} fullWidth={true}>{this.state.scanning2 ? 'Stop' : 'PLAYER2'}</Button>
                </div>
              </Grid>
              <Grid item xs={4}>
              </Grid>
              <Grid item xs={12}>
                {this.state.results2.map((result) => (<Result key={result.codeResult.code} player={2} result={result} registerTotal={this.registerTotal}/>))}
                {this.state.scanning2 ? <Scanner onDetected={this._onDetected2} /> : null}
              </Grid>
            </Grid>
            <div>
              {this.state.scanned1&&this.state.scanned2 ? <Battle result1={this.state.results1} result2={this.state.results2} stats1={this.state.stats1} stats2={this.state.stats2} name1={this.state.name1} name2={this.state.name2} resetScan={this.resetScan}/> : null}
            </div>

            <Grid container spacing={0} style={footerStyle}>
              <Grid item xs={12}>
                <Typography style={{fontSize:'14px'}}>
                Made with ❤️ by <a href="https://daisukeyukita.com" style={{textDecoration:'none'}}>Dice Yukita</a>
                </Typography>
              </Grid>
            </Grid>

            <Modal
              aria-labelledby="help-modal-title"
              aria-describedby="help-modal-description"
              open={this.state.help}
              onBackdropClick={this.closeModal}
              disableAutoFocus={true}
              BackdropProps={{style: {backgroundColor: 'rgba(0, 0, 0, 0.9 )'}}}
            >
              <div style={modalStyle}>
                <Typography variant="h5" id="help-modal-title" style={modalText}>
                  What is Barcode Battler?
                </Typography>
                <Typography variant="subtitle1" id="help-modal-description" style={modalText} component="p">
                  Barcode Battler is a battle game where players fight with existing products. Be it chewing gums, bicycles or vacuum machines, scan in any product via the camera using the barcodes.
                </Typography>
                <Typography variant="subtitle1" id="help-modal-description" style={modalText} component="p">
                  Join the adventure to find the strongest product in the market!
                </Typography>
                <Typography variant="subtitle1" id="help-modal-description" style={modalText} component="p">
                   (NOTE: items which are not listed in Yahoo Shopping will not be eligible for the battle)
                </Typography>
                <div style={{textAlign:'center', marginTop:'40px'}}>
                  <Button fontSize="large" onClick={this.closeModal} style={{color:'black', border:'1px solid white', borderRadius:'50px', backgroundColor:'white'}}>
                    <CloseIcon />
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        );
    };

    _scan1() {
        this.setState({
          scanning1: !this.state.scanning1,
          results1:[]
        });
      };

      _scan2() {
          this.setState({
            scanning2: !this.state.scanning2,
            results2:[]
          });
        };

    _onDetected1(result) {
        //this.setState({results: this.state.results.concat([result])});
        this.setState({
          results1: [result]
        });
    };

    _onDetected2(result) {
        //this.setState({results: this.state.results.concat([result])});
        this.setState({
          results2: [result],
          scanned2: true
        });
    };

    registerTotal(price, hits, janTotal, player, name, image,review) {
        //check if review is null
        if(review===null) review=0;

        if(player===1&&this.state.scanning1!==false){
          this.setState({
            scanning1: false,
            stats1:[price,hits,janTotal,image,review],
            name1:name,
            scanned1:true
          });
        }
        else if(player===2&&this.state.scanning2!==false){
          this.setState({
            scanning2: false,
            stats2:[price,hits,janTotal,image,review],
            name2:name,
            scanned2:true
          });
        }
    };

    resetScan(){
      this.setState({
        results1: [],
        scanned1: false,
        results2: [],
        scanned2: false,
        name1:null,
        name2:null,
        stats1:[],
        stats2:[]
      });
    }

    showTable(){
      this.setState({ table: !this.state.table });
    }

    showHelp(){
      this.setState({ help: !this.state.help });
    }

    closeModal(){
      this.setState({ help: false });
    }
};
