import { connection } from '../mysql_connection';
import { cartService } from './CartService';
import varsel from './notifications.js';
import { history } from '../index.js';

class BestillingService {
  addOrder(sum, rabatt) {
    //legg til en ny bestilling i databasen
    let d = new Date();
    let dateStamp = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();

    let besk = cartService.getBeskrivelse(); // FIXME: gjør det mulig å legge inn en kommentar
    let start = cartService.getStartdato();
    let slutt = cartService.getSluttdato();
    let gruppe = cartService.getGruppe().gruppe_id; // FIXME: gjør det mulig å legge inn en gruppe(?)
    let kunde = cartService.getKunde().person_id;
    let status = cartService.getStatus().status_id; // FIXME: gjør det mulig å legge inn en status
    let varer = cartService.getHandlekurv();

    connection.query(
      //legg inn bestilling
      'INSERT INTO BESTILLING (bestilling_id, bestillingsdato, person_id, gruppe_id, leie_start, leie_slutt, status_id, sum, beskrivelse, gittRabatt) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [null, dateStamp, kunde, gruppe, start, slutt, status, sum, besk, rabatt],
      (error, results) => {
        if (error) return console.error(error);

        let best_id = results.insertId;
        for (let i = 0; i < varer.length; i++) {
          let vare = varer[i];
          switch (vare.kategori) {
            case 'sykkel': //trenger bestillng_id og sykkel_id
              for (let k = 0; k < vare.antall; k++) {
                connection.query(
                  'insert into INNHOLDSYKKEL (innholdsykkel_id, bestilling_id, sykkel_id) values (?,?,?)',
                  [null, best_id, vare.id[k].sykkel_id],
                  (error, results) => {
                    if (error) return console.error(error);
                  }
                );
              }
              break;
            case 'utstyr':
              connection.query(
                'insert into INNHOLDUTSTYR (innholdutstyr_id, bestilling_id, utstyr_id, ant_utstyr) values (?,?,?,?)',
                [null, best_id, vare.id, vare.antall],
                (error, results) => {
                  if (error) return console.error(error);
                }
              );
              break;
            case 'pakke':
              connection.query(
                'insert into INNHOLDPAKKE (innholdpakke_id, bestilling_id, pakke_id) values (?,?, ?)',
                [null, best_id, vare.id],
                (error, results) => {
                  if (error) return console.error(error);
                }
              );
              break;
            default:
              varsel('Feil!', 'Feil under registrering', 'vrsl-danger');
          }
        }
        cartService.dropOrder();
        varsel('Suksess!', 'Bestillingen er registrert', 'vrsl-success');
        history.push('/');
      }
    );
  }

  updateOrder(bestill, utstyr, sykkel, pakke) {
    //Funksjon for å lagre endringer på en bestilling
    connection.query(
      'update BESTILLING set sum=?, status_id=?, beskrivelse=? where bestilling_id=?',
      [bestill.sum, bestill.status_id, bestill.beskrivelse, bestill.bestilling_id],
      (error, results) => {
        if (error) return console.error(error);
        connection.query(
          'update PERSON set fornavn=?, etternavn=? where person_id=?',
          [bestill.fornavn, bestill.etternavn, bestill.person_id],
          (error, results) => {
            if (error) return console.error(error);
          }
        );
      }
    );
  }

  deleteOrder(id) {
    //fjern en bestilling
    connection.query('delete from INNHOLDUTSTYR where bestilling_id = ?', [id], (error, results) => {
      if (error) return console.error(error);
      connection.query('delete from INNHOLDSYKKEL where bestilling_id = ?', [id], (error, results) => {
        if (error) return console.error(error);
        connection.query('delete from INNHOLDPAKKE where bestilling_id = ?', [id], (error, results) => {
          if (error) return console.error(error);
        });
        connection.query('delete from BESTILLING where bestilling_id = ?', [id], (error, results) => {
          if (error) return console.error(error);
        });
      });
    });
  }

  deleteSykkel(innholdsykkel_id) {
    //Fjern en sykkel fra en bestilling
    connection.query('delete from INNHOLDSYKKEL WHERE innholdsykkel_id = ?', [innholdsykkel_id], (error, results) => {
      if (error) return console.error(error);
    });
  }

  deleteUtstyr(innholdutstyr_id) {
    //Fjern utstyr fra en bestilling
    connection.query('delete from INNHOLDUTSTYR WHERE innholdutstyr_id = ?', [innholdutstyr_id], (error, results) => {
      if (error) return console.error(error);
    });
  }

  tilstander(success) {
    //endre statusen til en bestilling
    connection.query('SELECT status_id, tilstand FROM STATUS', (error, results) => {
      if (error) return console.error(error);
      success(results);
    });
  }

  getOrder(bestilling_id, success) {
    connection.query(
      'select * from BESTILLING, PERSON, STATUS where bestilling_id=? and BESTILLING.person_id=PERSON.person_id and STATUS.status_id = BESTILLING.status_id',
      [bestilling_id],
      (error, results) => {
        if (error) return console.error(error);

        success(results[0]);
      }
    );
  }

  getOrderContentsSykler(bestilling_id, success) {
    //Henter ut sykler som er lagt inn i en bestilling
    connection.query(
      'select * from INNHOLDSYKKEL, SYKKEL, SYKKELTYPE where INNHOLDSYKKEL.bestilling_id=? and INNHOLDSYKKEL.sykkel_id = SYKKEL.sykkel_id and SYKKEL.type_id = SYKKELTYPE.type_id',
      [bestilling_id],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getOrderContentsUtstyr(bestilling_id, success) {
    //Henter ut utstyr som er lagt inn i en bestilling
    connection.query(
      'select * from INNHOLDUTSTYR, UTSTYR where INNHOLDUTSTYR.bestilling_id=? and UTSTYR.utstyr_id = INNHOLDUTSTYR.utstyr_id',
      [bestilling_id],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
  getOrderContentsPakke(bestilling_id, success) {
    //Henter ut utstyr som er lagt inn i en bestilling
    connection.query(
      'select * from INNHOLDPAKKE, PAKKE where INNHOLDPAKKE.bestilling_id=? and PAKKE.pakke_id = INNHOLDPAKKE.pakke_id',
      [bestilling_id],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getAktiveBestillinger(success) {
    //Henter aktive bestillinger
    connection.query(
      'select * from BESTILLING, PERSON where BESTILLING.person_id = PERSON.person_id and BESTILLING.status_id NOT LIKE 9 order by leie_start',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getFullforteBestillinger(success) {
    //Henter aktive bestillinger
    connection.query(
      'select * from BESTILLING, PERSON where BESTILLING.person_id = PERSON.person_id and BESTILLING.status_id LIKE 9',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
}

export let bestillingService = new BestillingService();
