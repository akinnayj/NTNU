import { connection } from '../mysql_connection';
import varsel from './notifications.js';

class PakkeService {
  getVarer(success) {
    connection.query('select * from UTSTYR', (error, results) => {
      if (error) {
        varsel('Oops!', 'Det oppsto problemer med å hente data.', 'vrsl-danger');
        return console.error(error);
      }

      success(results);
    });
  }
  getSorteringer() {
    let options = [];
    options[0] = ['Alfabetisk A-Z', 'alfAZ'];
    options[1] = ['Alfabetisk Z-A', 'alfZA'];
    options[2] = ['Pris, lav-høy', 'prisLH'];
    options[3] = ['Pris, høy-lav', 'prisHL'];
    return options;
  }
  getPakker(success) {
    connection.query('select * from PAKKE', (error, results) => {
      if (error) {
        varsel('Oops!', 'Det oppsto problemer med å hente data.', 'vrsl-danger');
        return console.error(error);
      }

      success(results);
    });
  }

  getPakke(pakke_id, success) {
    connection.query('select * from PAKKE where PAKKE.pakke_id =?', [pakke_id], (error, results) => {
      if (error) {
        varsel('Oops!', 'Det oppsto problemer med å hente data.', 'vrsl-danger');
        return console.error(error);
      }

      success(results);
    });
  }
  getPakkeinnholdsykler(pakke_id, success) {
    connection.query(
      'SELECT pi.sykkelklasse_id, pi.ant, k.klassenavn, k.info FROM  PAKKE p, PAKKEINNHOLD pi, KLASSE k where p.pakke_id = ? and pi.pakke_id = p.pakke_id and k.klasse_id = pi.sykkelklasse_id',
      [pakke_id],
      (error, results) => {
        if (error) {
          varsel('Oops!', 'Det oppsto problemer med å hente data.', 'vrsl-danger');
          return console.error(error);
        }
        console.log(results);
        success(results);
      }
    );
  }
  getPakkeinnholdutstyr(pakke_id, success) {
    connection.query(
      'select * from PAKKEINNHOLD, PAKKE, UTSTYR where PAKKEINNHOLD.pakke_id = ? and PAKKEINNHOLD.pakke_id = PAKKE.pakke_id and UTSTYR.utstyr_id = PAKKEINNHOLD.utstyr_id',
      [pakke_id],
      (error, results) => {
        if (error) {
          varsel('Oops!', 'Det oppsto problemer med å hente data.', 'vrsl-danger');
          return console.error(error);
        }

        success(results);
      }
    );
  }

  getOptimalSykkeltypeTilPakke(klasse_id, startdato, sluttdato, avdeling_id, success) {
    connection.query(
      'select st.type_id, count(s.sykkel_id) AS "ant_sykler" from SYKKEL s, SYKKELTYPE st where st.type_id = s.type_id and st.klasse_id = ? and s.naa_avdeling_id = 1 and s.avdeling_id = 1 and s.sykkel_id NOT IN (SELECT i.sykkel_id from INNHOLDSYKKEL i, BESTILLING b where i.bestilling_id = b.bestilling_id and b.bestilling_id IN (SELECT bestilling_id from BESTILLING where ((leie_slutt between ? and ? )OR( leie_start BETWEEN ? and ?)))) group by st.type_id order by ant_sykler DESC',
      [klasse_id, avdeling_id, avdeling_id, startdato, sluttdato, startdato, sluttdato],
      (error, results) => {
        if (error) return console.error(error);
        console.log(results);
        console.log(results[0].type_id);
        success(results);
      }
    );
  }
}

export let pakkeService = new PakkeService();
