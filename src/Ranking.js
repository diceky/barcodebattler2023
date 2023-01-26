import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { firestore } from './firebase';

export default class Ranking extends React.Component {

  constructor(){
    super();
    this.state = {
      wins:[]
    };
  }
  
  render() {

    let wins = [];

    firestore.collection('barcodes')
    .orderBy('wins','desc')
    .limit(10)
    .get()
    .then(snapShot=>{
      snapShot.forEach(doc => {
        wins.push({
          id:doc.id,
          name:doc.data().name,
          wins:doc.data().wins
        });
      });
      this.setState({
        wins:wins
      })
    });

    return (
      <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '10%', padding:'4px 15px'}}>#</TableCell>
            <TableCell  style={{ width: '80%', padding:'4px 15px'}}>Product</TableCell>
            <TableCell numeric style={{ width: '10%',padding:'4px 15px'}}>Wins</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.wins.map((row,i) => {
            return (
              <TableRow key={i}>
                <TableCell component="th" scope="row" style={{ width: '10%',padding:'4px 15px'}}>
                  {i+1}
                </TableCell>
                <TableCell style={{ width: '80%',padding:'4px 15px'}}>{row.name}</TableCell>
                <TableCell numeric style={{ width: '10%',padding:'4px 15px'}}>{row.wins}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
    );
  }
};
