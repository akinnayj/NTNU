import { connection } from '../mysql_connection';
import varsel from '../services/notifications.js';

class KundeService {
  addNewKunde(fornavn, etternavn, mail, tlf, adresse, postnr, sted, fodt, kommentar, success) {
    //legg til en ny kunde
    connection.query(
      'insert into PERSON values (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [fornavn, etternavn, mail, tlf, adresse, postnr, sted, fodt, kommentar],
      (error, results) => {
        if (error) {
          varsel('FEIL!', 'Du mangler input.', 'vrsl-danger');
          return console.error(error);
        }

        success('Registrering vellykket');
        varsel('Suksess!', 'Kunden ble registrert.', 'vrsl-success');
      }
    );
  }

  erKundeAnsatt(person_id, success) {
    //sjeker om en kunde er ansatt
    connection.query('select * from ANSATT where person_id = ?', [person_id], (error, results) => {
      if (error) return console.log(error);

      if (results.length != 0) {
        success(true); //kunden er også ansatt
      } else {
        success(false); //kunden er ikke ansatt
      }
    });
  }

  harKundeAktiveBestillinger(person_id, success) {
    //sjekker om en kunde har bestillinger som ikke er fullført
    connection.query(
      'select * from BESTILLING where status_id != 9 and person_id = ?',
      [person_id],
      (error, results) => {
        if (error) return console.log(error);
        console.log(results);
        console.log(results.length != 0);
        if (results.length != 0) {
          success(true); //kunden har bestillinger
        } else {
          success(false); //kunden har ikke bestillinger
        }
      }
    );
  }

  removeKunde(person_id) {
    // Slette person

    connection.query('UPDATE BESTILLING SET person_id = NULL WHERE person_id = ?', [person_id], (error, results) => {
      if (error) return console.error(error);

      connection.query('DELETE FROM ANSATT WHERE person_id = ?', [person_id], (error, results) => {
        if (error) return console.error(error);

        connection.query('DELETE FROM PERSON WHERE person_id = ?', [person_id], (error, results) => {
          if (error) return console.error(error);
          varsel('Suksess!', 'Kunden ble slettet', 'vrsl-success');
        });
      });
    });
  }

  getKunder(success) {
    connection.query('select * from PERSON', (error, results) => {
      if (error) {
        varsel('Oops!', 'Det oppsto problemer med å hente data.', 'vrsl-danger');
        return console.error(error);
      }

      success(results);
    });
  }
}

export let kundeService = new KundeService();
