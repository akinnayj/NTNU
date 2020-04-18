import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, NavBar } from '../widgets';
import { NavLink } from 'react-router-dom';

class Kunde extends Component {
  render() {
    return (
      <div>
        {/* Linker til å legge til/søke opp kunder */}
        <br />
        <div className="lenke lenke1 brBottom">
          <Card>
            <NavBar.Link to="/registrerKunde">Registrer kunde</NavBar.Link>
          </Card>
        </div>

        <div className="lenke lenke2">
          <Card>
            <NavBar.Link to="/kundesøk">Kundesøk</NavBar.Link>
          </Card>
        </div>
      </div>
    );
  }
}

export { Kunde };
