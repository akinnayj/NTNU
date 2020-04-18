// Funksjon for å lage konfirmasjonsboks
export default function confirmBox(tittel, melding, success) {
  const coverConfirmBox = document.createElement('div');
  coverConfirmBox.classList = 'coverConfirmBox';

  const confirmBox = document.createElement('div');
  confirmBox.classList = 'confirmBox';

  let title  = document.createElement('h2');
  title.innerText = tittel;

  let mld = document.createElement('p');
  mld.innerText = melding;

  let btnYes = document.createElement('button');
  btnYes.innerText = "Ja";
  btnYes.onclick = clickYes;
  btnYes.classList = 'btn btn-default';

  let btnNo = document.createElement('button');
  btnNo.innerText = "Nei";
  btnNo.onclick = clickNo;
  btnNo.classList = 'btn btn-default';

  confirmBox.appendChild(title);
  confirmBox.appendChild(mld);
  confirmBox.appendChild(btnYes);
  confirmBox.appendChild(btnNo);

  const body = document.getElementsByTagName('body')[0];
  body.appendChild(confirmBox);
  body.appendChild(coverConfirmBox);

  // funksjoner
  function clickYes(){
    removeBox();
    success(1);
  }
  function clickNo(){
    removeBox();
    success(0);
  }

  function removeBox(){
    body.removeChild(confirmBox);
    body.removeChild(coverConfirmBox);
  }
}
