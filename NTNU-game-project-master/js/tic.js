//---------Globale variabler----------//
let cpuTic = false;
let bStatusTic = []; // false(ikke brukt),0(brukt av spilller1),1(brukt av spiller2)
let markTic = ["X","O"];
let turnTic = 0;
let winComboesTic = [];//mulige vinn-kombinasjoner
let bGridTic;//størrelsen på brettet
let timerDoneTic = true;//holder styr på tidsstyrte hendelser
//-------------------------------------------//

function setupTic() {
  let players = 1;
  bGridTic = 3*3;//størrelsen på brettet

  createTicTacToe();
  fillStatusTic();
  fillWinComboesTic();

  if(players ==1){
    cpuTic = true;
  }
}

function createTicTacToe() {//genererer spillebrettet og 'sluttskjermen'
  let bSize = 6.5*(Math.sqrt(bGridTic)) + "em";
  let elSize = (100/(Math.sqrt(bGridTic))) + "%";

  //'sluttskjermen' som kommer når spillet er ferdig
  let cover = document.createElement("DIV");
  cover.id = "ticCover";
  cover.classList.add("ticCover","ticHide");
  cover.style.height = bSize;
  cover.style.width = bSize;
  document.getElementById("gamecontainerTic").appendChild(cover);

  let p = document.createElement("P");
  cover.appendChild(p);

  let endBtn = document.createElement("BUTTON");
  endBtn.id = "btnEndTic";
  endBtn.classList.add("ticReBtn");
  document.getElementById("ticCover").appendChild(endBtn);

  //Lager spillbrettet
  let board = document.createElement("DIV");
  board.id = "ticParent";
  board.style.height = bSize;
  board.style.width = bSize;
  document.getElementById("gamecontainerTic").appendChild(board);

  //lager feltene og gjør dem klikkbare
  for(var i = 0; i < bGridTic; i++){
    let field = document.createElement("DIV");
    field.id = "tic_" + i;
    field.value = i;
    field.innerHTML = "<br>";
    field.classList.add("ticField");
    field.style.height = elSize;
    field.style.width = elSize;
    field.onclick = playerMoveTic;
    document.getElementById("ticParent").appendChild(field);
  }
}
//fyller statusen til feltene med false, dvs ikke brukt
function fillStatusTic() {
  for(var i = 0; i < bGridTic; i++){
    bStatusTic.push(false);
  }
}
//finner alle mulige vinn-kombinasjoner
function fillWinComboesTic() {
  let b = bGridTic;
  let bSqrt = Math.sqrt(b);
  let combo, c;

//loddrette kombinasjoner
  for (var i = 0; i < bSqrt; i++) {
    combo = [];
    for(var k = 0; k < b; k+= bSqrt){
        c = i+k;
        combo.push(c);
    }
    winComboesTic.push(combo);
  }
  //vannrette kombinasjoner
  for (var i = 0; i < b; i+= bSqrt) {
    combo = [];
    for(var k = 0; k < bSqrt; k++){
      c = i+k;
      combo.push(c);
    }
    winComboesTic.push(combo);
  }
  //skrå kombinasjoner, kun 2 mulige
  let step = (b-1)/(bSqrt-1);
  c = 0;
  for(var i = 0; i < 2; i++){
    combo = [];
    combo.push(c);
    for(var k = 0; k < bSqrt-1; k++){
      c += step;
      combo.push(c);
    }
    step-=2;
    c = bSqrt-1;
    winComboesTic.push(combo);
  }
}

//-------------SETUP COMPLETE-------------------//

function playerMoveTic(event) {//finner feltet som ble klikket og sjekker om det er gyldig
  let index = event.target.value;
  let id = event.target.id;
  let element = document.getElementById(id);

  if(bStatusTic[index] === false && timerDoneTic){
    makeMoveTic(element, index);
    nextTurnTic();
  }
}

function makeMoveTic(element, index) {//markerer trekk
  element.innerHTML =  markTic[turnTic];
  bStatusTic[index] = turnTic;
}

function nextTurnTic() {//sjekker om noen har vunnet før neste tur begynner
  switch (true) {
    case checkForWinTic():
      endGameTic("win");
      break;
    case isGameOverTic():
      endGameTic("tie");
      break;
    default://neste tur
      if(turnTic == 1){
        turnTic = 0;
      }else {
        turnTic++;
      }
      if(cpuTic == true && turnTic == 1){
        timerDoneTic = false;
        window.setTimeout(cpuMakeMoveTic, 600);
      }
  }
}

//cpuen gjør valg i prioritert rekkefølge: midten, vinne, forsvare, tilfeldig
function cpuMakeMoveTic() {

  if(bStatusTic[4] === false){//sjekker midten
    index = 4;
    let element = document.getElementById("tic_4");
    makeMoveTic(element, index);
    nextTurnTic();
    timerDoneTic = true;
    return;
  }

  switch (true) {
    case cpuAorDTic(0,1)://vinnertrekk, brukerTrekk = 0 cputrekk = 1
      break;
    case cpuAorDTic(1,0)://forsvarstrek brukerTrekk = 0 cputrekk = 1
      break;
    default:
      while (true) {//tilfeldig trekk
        let i = Math.floor(Math.random()*bGridTic);
          if(bStatusTic[i] === false){
            let id = "tic_" + i;
            let element = document.getElementById(id);
            makeMoveTic(element, i);
            nextTurnTic();
            break;
          }
        }
  }
  timerDoneTic = true;
}

function cpuAorDTic(brCrit, search) {//brCrit uønket spiller, search ønsket spiller
  let bSqrt = Math.sqrt(bGridTic);
  for(var i = 0; i < winComboesTic.length; i++){
    let count = 0;
    let index = -1;
    let arr = winComboesTic[i].slice();
    for(var k = 0; k < bSqrt; k++){
      let x = arr[k];
      if(bStatusTic[x] === brCrit){
        break;
      }else if(bStatusTic[x] === search){
        count++;
      }else if(bStatusTic[x] === false){
        index = x;
      }
    }
    if(count == (bSqrt-1)  && index != -1){
      let id = "tic_" + index;
      let element = document.getElementById(id);
      makeMoveTic(element, index);
      nextTurnTic();
      return true;
    }
  }
  return false;
}

function isGameOverTic() {//sjekke om alle feltene er tatt
  if(bStatusTic.indexOf(false) == -1){
    return true;
  }
  return false;
}

function checkForWinTic(){//sjekker om noen har vunnet
  let lim = Math.sqrt(bGridTic);
  for(var i = 0; i < winComboesTic.length; i++){
    let count = 0;
    for(var k = 0; k < lim; k++){
      let x = winComboesTic[i][k];
      let p = bStatusTic[x];
      if(p !== turnTic){
        break;
      }else{
        count++;
        if(count == lim){
          return true;
        }
      }
    }
  }
  return false;
}

function endGameTic(expression) {
  let text = "";
  let btn = document.getElementById("btnEndTic");
  switch (expression) {
    case "win":
      text = (turnTic === 0 ? "Du":"Motstanderen") + " vant";
      btn.textContent = "Fortsett";
      let winner = (turnTic === 0 ? 2:1);
      btn.onclick = () => proceedToGame("mainstory", winner);

      //tilbakestilling av globale variabler
      cpuTic = false;
      bStatusTic = [];
      turnTic = 0;
      winComboesTic = [];
      bGridTic;
      timerDoneTic = true;
      break;
    case "tie":
      text = "Det ble uavgjort";
      btn.textContent = "Spill igjen";
      btn.onclick = resetGameTic;
  }
  let cover = document.getElementById("ticCover");
  cover.classList.remove("ticHide");
  cover.firstChild.textContent = text;
}

function resetGameTic() {//start spillet på ny
  bStatusTic.fill(false);
  for(var i=0; i < bGridTic; i++){
    let id = "tic_" + i;
    document.getElementById(id).innerHTML = "<br>";
  }
  document.getElementById("ticCover").classList.add("ticHide");
  turnTic = 0;
}
