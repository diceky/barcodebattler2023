import React from 'react';
import { Chart as ChartJS, RadialLinearScale, Tooltip, Legend, PointElement, LineElement} from "chart.js";
import {Radar} from 'react-chartjs-2'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

ChartJS.register(RadialLinearScale, Tooltip, Legend, PointElement, LineElement);

const statsText = {
  padding:'20px 20px',
  height:'60%',
  display:'flex',
  flexDirection:'column',
  justifyContent:'space-between'
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
        <Grid container spacing={2}>
              <Grid item xs={8}>
                <Radar data={data} options={{plugins:{legend: {display: false}}}} />
              </Grid>
              <Grid item xs={4}>
                <div style={statsText}>
                  <Typography color="inherit" style={{fontSize:'16px'}}>
                    <b>HP:</b> {this.props.price}
                  </Typography>
                  <Typography color="inherit" style={{fontSize:'16px'}}>
                    <b>ATK:</b> {this.props.janTotal}
                  </Typography>
                  <Typography color="inherit" style={{fontSize:'16px'}}>
                    <b>DEF:</b> {this.props.hits}
                  </Typography>
                </div>
              </Grid>
        </Grid>
      </div>
    );
  }
};
