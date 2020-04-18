import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, List, Row, Column, NavBar, Button, Form } from '../widgets';
import Iframe from 'react-iframe';
import { cartService } from '../services/CartService';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      useURL: ''
    };
    this.urlArr = [];
    this.urlArr[1] = 'https://www.yr.no/sted/Norge/Tr%c3%b8ndelag/Trondheim/Trondheim/ekstern_boks_tre_dager.html'; //trøndelag
    this.urlArr[2] = 'https://www.yr.no/sted/Norge/Oslo/Oslo/Oslo/ekstern_boks_tre_dager.html'; //oslo
    this.urlArr[3] = 'https://www.yr.no/sted/Norge/Svalbard/Isbj%c3%b8rnhamna/ekstern_boks_tre_dager.html'; //isbjørn
  }

  mounted() {
    let id = cartService.getAvdeling();
    if (id != -1 && id <= 3) {
      this.setState({ useURL: this.urlArr[id] });
    } else {
      this.setState({ useURL: this.urlArr[1] });
    }
  }

  render() {
    return (
      <div className="main">
        <Card>
          <div className="col-md-4">
            <h4>Hovedside </h4>
          </div>
          <div style={{ margin: '50px' }}>
            <h5>Værmelding:</h5>
            <Row>
              <div id="here" className="vaermelding">
                <Iframe height="300px" width="100%" url={this.state.useURL} sandbox="allow-scripts" />
                <div className="coverWeather">
                  <div className="coverWeather2" />
                </div>
              </div>
            </Row>
            <h5>Årets ansatt: Rikard Erlend Gjelsvik </h5>
            <Row>
              <div className="col-md-4">
                <img
                  className="shadow"
                  style={{
                    width: '200px',
                    height: '250px',
                    opacity: '1.0'
                  }}
                  src="images/aaretsAnsatt.jpg"
                />
              </div>
              <div className="col-md-8">
                <b>Om meg:</b>
                <p>
                  {' '}
                  Jeg er 22 år gammel og kommer fra Sandnes, Rogaland. Nå bor jeg i Trondheim sammen med min forlovede,
                  som i likhet med meg studerer ved NTNU. Noen av interessene mine er friluftsliv, diverse håndverk, å
                  spille eufonium og brettspill. Bildet av meg er fra en langtur i sommer, da jeg kom meg opp på
                  Hardangervidda. Det skal også nevnes at jeg er et kaffe-menneske – selv om jeg greier meg fint uten er
                  det alltid godt med. Før jeg begynte på studiene mine gjennomførte jeg førstegangstjenesten i
                  Forsvaret. Det var en lærerik prosess som jeg har hatt mye igjen for, spesielt med tanke på min
                  interesse for friluftsliv. Videre tok jeg opp fag fra videregående skole som privatist her i
                  Trondheim. Blant fagene var IT-1 og IT-2 som begge var med på å gi meg en økt interesse for IT-faget.
                  Etter et halvt år på linjen “Matteknologi” ved NTNU, bestemte jeg meg for å søke et mer data-relatert
                  studium. Dette førte til at jeg nå er førsteårsstudent på studiet "Informatikk: Drift av datasystem".
                  I fremtiden kunne jeg tenkt meg å nytte kompetansen min til å løse sikkerhetsrelaterte problemer i
                  IT-verdenen.
                </p>{' '}
              </div>
            </Row>
          </div>
        </Card>
      </div>
    );
  }
}
export default Home;
