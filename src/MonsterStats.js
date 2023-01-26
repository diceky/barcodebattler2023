import React from 'react';
import {Radar} from 'react-chartjs-2'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const statsText = {
  padding:'20px 20px',
  borderStyle:'solid',
  borderWidth:'1px'
}

export default class MonsterStats extends React.Component {

  constructor(){
    super();
    this.state = {
    };
  }

  render() {

    const data = {
      labels: ['Price', 'JAN', 'Yahoo'],
      datasets: [
        {
          label: this.props.name,
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          pointBackgroundColor: 'rgba(255,99,132,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255,99,132,1)',
          data: [this.props.price, this.props.janTotal, this.props.hits]
        }
      ]
    };

    return(
      <div>
        <Grid container spacing={24}>
              <Grid item xs={8}>
                <Radar data={data} options={{legend: {display: false}}} />
              </Grid>
              <Grid item xs={4}>
                <div style={statsText}>
                  <Typography color="inherit" style={{fontSize:'0.7rem'}}>
                    <b>HP:</b> {this.props.price}
                  </Typography>
                  <Typography color="inherit" style={{fontSize:'0.7rem'}}>
                    <b>ATK:</b> {this.props.janTotal}
                  </Typography>
                  <Typography color="inherit" style={{fontSize:'0.7rem'}}>
                    <b>DEF:</b> {this.props.hits}
                  </Typography>
                </div>
              </Grid>
        </Grid>
      </div>
    );
  }
};
