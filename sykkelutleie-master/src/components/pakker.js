import * as React from 'react';
import { Component } from 'react-simplified';
import { pakkeService } from '../services/PakkeService.js';
import { Row, Column } from '../widgets';
import { history } from '../index.js';
import ReactLoading from 'react-loading';
import { cartService } from '../services/CartService';

class Pakketilbud extends Component {
  pakke = null;

  render() {
    if (!this.pakke)
      return (
        <ReactLoading className="spinner fade-in" type="spinningBubbles" color="lightgrey" height="20%" width="20%" />
      );
    return (
      <div>
        {/*Pakketilbud som kan bestilles*/}

        <br />
        <div className="col-md-4">
          <h4>Velg pakketilbud</h4>
        </div>
        <br />

        <div className="img">
          <ul className="flex-container wrap" style={{ fontWeight: 'bold', textAlign: 'center' }}>
            {this.pakke.map(pakke => (
              <li className="flex-item" key={pakke.pakke_id}>
                <img
                  src={'images/pakker/' + pakke.pakkenavn + '.jpg'}
                  onClick={() => history.push('/pakker/' + pakke.pakke_id)}
                  alt={pakke.pakkenavn}
                  width="180px"
                  height="180px"
                />
                <div style={{ overflow: 'hidden', width: '100%', height: '22.5px' }}>{pakke.pakkenavn}</div>

                {'Pris: ' + pakke.pris}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  mounted() {
    pakkeService.getPakker(pakke => {
      this.pakke = pakke;
    });
  }
}

export { Pakketilbud };
