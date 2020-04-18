
/*-----------------Globale variabler-----------------------*/
let comboIdYat = ["1","2","3","4","5","6","par","toPar","treLike","fireLike","litenStraight","storStraight","hus","sjanse","yatzy"];
let playerIdYat = [];//finne ut hvem som spiller
let turnYat = 0; //holder styr på hvem sin turnYat det er
let storedValueYat = [];//boolsk array for å se om trekk er gjort
let numPlayersYat;
let shouldRollYat = [true, true, true, true, true];//boolsk verdi for hver terning
let diceCountYat = [0,0,0,0,0,0]; //oversikt over  antall like av hver sort 1-6
let diceResYat = [0,0,0,0,0];//oversikt over resultatet etter et kast
let numTriesYat = 3;
let totalSumYat = []; //holder oversikt over poengsummen til spillerene
let cpuOptionsYat = [];//mulige valg til cpu
let cpuYat = false;
let timerDoneYat = true; //holder styr på tidsstyrte hendelser

/* ---------------oversikt over setupYat------------------
  CPU - ha en cpuYat dersom det kun er en spiller
  id-setting  - lager playerIdYat basert på numPlayersYat, gjør det lettere ved evt utviding av spill
  Klikk 1     - Klikk-funksjon til alle td i yatzy-tabellen
  Klikk 2     - Klikk-funksjon til alle div-terningene for å kunne spare dem til neste kast
  storedValueYat - array med et nivå til hver spiller, alle er i utgangspunktet false, fordi ingen trekk er gjort
  totalSumYat    - array som lagrer poengsummen til hver spiller
  keyEvent    - for å kunne trille med bruk av en tast
*/
function setupYat(){
  numPlayersYat = 1;
  document.getElementById("btnRull").onclick = function(){if(timerDoneYat && shouldRollYat.indexOf(true) !== -1){rollDiceYat();}};
  let id;
  let t;

//CPU
  if(numPlayersYat == 1){
    cpuYat = true;
    numPlayersYat++;
    for(var i = 0; i < comboIdYat.length; i++){
      cpuOptionsYat[i] = 0;
    }
  }

  for(var i = 0; i < numPlayersYat; i++){//lag playerIdYat array basert på hvor mange spillere det er
    t = i+1;//plyerIdene er: "yS1_","yS2_", ... "yS" + t + "_"
    playerIdYat[i] = "yS" + t + "_";
  }

  //klikk1
  for(var i = 0; i < playerIdYat.length; i++){
    for(var k = 0; k < comboIdYat.length; k++){
      id = playerIdYat[i] + comboIdYat[k];
      document.getElementById(id).onclick = playerClickYat;
    }
  }

  //Klikk 2
  for(var k = 0; k < 5; k++){
    id = "yTerningDiv" + k;
    document.getElementById(id).onclick = saveDiceYat;
  }

  //storedValueYat-array
  for(var i = 0; i < numPlayersYat; i++){
    storedValueYat[playerIdYat[i]] = [];
    for(var k = 0; k < comboIdYat.length; k++){
      storedValueYat[playerIdYat[i]][k] = false;
    }
  }

  //totalSumYat-array
  for(var i = 0; i < numPlayersYat; i++){
    totalSumYat[playerIdYat[i]] = [];
    for(var k = 0; k < comboIdYat.length; k++){
      totalSumYat[playerIdYat[i]][k] = 0;
    }
  }
  //keyEvent- skal 'høre' etter SPACEBAR
    document.body.addEventListener("keyup",checkKeyEventYat);
}

//dersom du trykker SPACEBAR vil du trille terning
function checkKeyEventYat(event) {
  let key = event.keyCode || event.which;
  if(key == 32 && timerDoneYat && numTriesYat > 0 && shouldRollYat.indexOf(true) !== -1){
    rollDiceYat();
  }
}

//lagre terningene som ikke skal trilles på ny
function saveDiceYat(event){
  let id = event.currentTarget.id;  //terningen som skal spares eller forkastes
  let img = document.getElementById(id).firstElementChild.id;
  if(!(numTriesYat === 3)){//sjekker at du har trillet
    let element = document.getElementById(img).classList;
    let x = id.split("Div");
    let num = x[1];

    if(element.value.includes("sparT")){//Ikke spar på denne terningen
      element.remove("sparT");
      shouldRollYat[num] = true;
    }else{//Spar denne terningen
      element.add("sparT");
      shouldRollYat[num] = false;
    }
  }
}

//henter ut verdien til det aktuelle elementet og lagrer verdien
function playerClickYat(event){
  if(cpuYat && playerIdYat[turnYat] =="yS2_" || !timerDoneYat){
    return;
  }
  let id = event.target.id;//id-en til det aktuelle elementet
  let x = id.split("_");
  let tdPlayer = x[0] + "_";
  let comboIndex = parseInt(comboIdYat.indexOf(x[1]));
  let choosenBefore = storedValueYat[playerIdYat[turnYat]][comboIndex];

  if(tdPlayer === playerIdYat[turnYat] && !choosenBefore && numTriesYat < 3){
    let element = document.getElementById(id);
    let value = parseInt(element.innerHTML);

    if(isNaN(value)){//spiller ønsker å stryke feltet
      element.innerHTML = "X";
      value = 0; //stryk blir 0 poeng
    }
    makeChoiceYat(value, element, comboIndex);
  }
}

//forsegler brukerens choice -> lagrer verdien og starter nextTurnYat()
function makeChoiceYat(choice, element, comboIndex){
  storedValueYat[playerIdYat[turnYat]][comboIndex] = true;//gjør false verdien i storedValueYat til true
  totalSumYat[playerIdYat[turnYat]][comboIndex] = choice;//lagrer verdien til senere beregning av score

  let getBoolean = storedValueYat[playerIdYat[turnYat]].slice(0, 6);
  let id;

    if(getBoolean.indexOf(false) == -1){
      let getNumbers = totalSumYat[playerIdYat[turnYat]].slice(0, 6);
      let litenSum = getNumbers.reduce(sumArrayYat);
      let bonus = "X";
      if(litenSum >= 63){
        bonus = 50;
      }
      id = playerIdYat[turnYat] + "litenSum";
      document.getElementById(id).innerHTML = litenSum;
      id = playerIdYat[turnYat] + "bonus";
      document.getElementById(id).innerHTML = bonus;
  }

  //gjør valget synlig i tabellen(HTML) med CSS
  if(choice == 0){
    choice = "X";
  }
  element.classList.add("yBrukt");
  element.innerHTML = choice;
  nextTurnYat();
}

function nextTurnYat() {//starter neste tur
  if(isGameFinishedYat()){//sjekker om spillet er slutt
    endGameYat();
  }
//gjør terningene klare til neste runde/turnYat
  for(var i = 0; i < diceResYat.length; i++){
    id = "yTerning" + i;
    document.getElementById(id).classList.remove("sparT");
  }
  shouldRollYat.fill(true);

  emptyInvalidTdYat();//tøm td som ikke skal være med videre

  numTriesYat = 3;
//bytt på uthevingen av spillernavn
  document.getElementById(playerIdYat[turnYat]).classList.remove("yNavnUthev");
  if(turnYat >= numPlayersYat -1){
    turnYat = 0;
  }else{
    turnYat++;
  }
  document.getElementById(playerIdYat[turnYat]).classList.add("yNavnUthev");

  document.getElementById("btnRull").disabled = false;

  if(cpuYat && turnYat == 1){//cpuYat er alltid spiller 2
    setTimeout(cpuMakeMoveYat, 750);
  }
}
//gjør et valg ved å spare på de terningene som gir den høyeste poengsummen
//triller på ny og gjentar prosessen frem til enten alle terningene er spart eller forsøkene er brukt opp
function cpuMakeMoveYat(){
  rollDiceYat();//triller terningen og finner valgmuligheter
  let tempArr = cpuOptionsYat.slice();
  tempArr.sort(function(a, b){return b-a});//sorterer valgmulighetene
  let choice;
  let comboArr = [];//sparer komboer som gir høyest poengsum
  let comboIndex;
  let combo;
  let element;
  codeblock: {
    for(var i = 0; i < cpuOptionsYat.length; i++){
      choice = tempArr[i]; //den høyeste mulige verdien
      for(var k = 0; k < cpuOptionsYat.length; k++){//henter ut flere combo-indexer dersom de finnes
        if(cpuOptionsYat[k] == choice){
          comboArr.push(k);
        }
      }
      for(var j = 0; j < comboArr.length; j++){
        if(!storedValueYat[playerIdYat[turnYat]][comboArr[j]]){//fortsetter dersom komboen ikke allerde er valgt
          combo = comboIdYat[comboArr[j]];
          comboIndex = comboArr[j];
          id = playerIdYat[turnYat] + combo;
          element = document.getElementById(id);

          if(choice == 0){
            combo = undefined;
          }
          cpuChooseYat(combo);
          break codeblock;
        }
      }
    }
  }
  cpuOptionsYat.fill(0);//nullstiller valgmulighetene
  if(numTriesYat <= 0 || shouldRollYat.indexOf(true) == -1){
      makeChoiceYat(choice, element, comboIndex);
  }else{
    setTimeout(cpuMakeMoveYat, 600);
  }
}

function cpuChooseYat(combo){
  if(combo === undefined){
    let comboIndex = storedValueYat[playerIdYat[turnYat]].indexOf(false, 6);//første comboIndex som ikke er gjort, ekskluderer 1-6
    combo = comboIdYat[comboIndex];
  }
  let dice;
  let x;//brukt til diverse midlertidige variabler
  let arr; //midlertidig array
  let num = parseInt(combo);

  if(!isNaN(num)){
    for(var i = 0; i< diceResYat.length; i++){
      if(diceResYat[i] == num){
        shouldRollYat[i] = false;
      }
    }
  }
  switch (combo) {
    case "par":
      dice = findTheBestEqYat(2);
      saveThisYat(dice, 2);
      break;
    case "toPar":
      arr = findTheBestEqYat(2, true, 2);
      saveThisYat(arr[0], 2);
      saveThisYat(arr[1], 2);
      break;
    case "treLike":
      dice = findTheBestEqYat(3);
      saveThisYat(dice, 3);
      break;
    case "fireLike":
      dice = findTheBestEqYat(4);
      saveThisYat(dice, 4);
      break;
    case "litenStraight":
      for(var i = 1; i <= 5; i++){
        x = diceResYat.indexOf(i);
        if(x != -1){
          shouldRollYat[x] = false;
        }
      }
      break;
    case "storStraight":
      for(var i = 2; i <= 6; i++){
        x = diceResYat.indexOf(i);
        if(x != -1){
          shouldRollYat[x] = false;
        }
      }
      break;
    case "hus":
      arr = findTheBestEqYat(3, true, 2);
      saveThisYat(arr[0], 3);
      saveThisYat(arr[1], 2);
      break;
    case "sjanse":
      shouldRollYat.fill(false);
      for(var i = 0; i < diceResYat.length; i++){
        if(diceResYat[i] <= 2){
          shouldRollYat[i] = true;
        }
      }
      break;
    case "yatzy":
      dice = findTheBestEqYat(5);
      saveThisYat(dice, 5);
  }

    //num = antall ønsket like,
    //paired = true/false
    //num2 = antall ønsket like, num!=num2
    function findTheBestEqYat(num, paired, num2){
      if(paired === undefined){
        paired = false;
      }
      let arr = [];

      labelNum: {
        for(num; num > 0; num--){
          for(var i = diceCountYat.length - 1; i >=0; i--){
            if(diceCountYat[i] >= num){
              if(!paired){
                return (i+1);
              }
              arr.push(i+1);
              break labelNum;
            }
          }
        }
      }
      for(num2; num2 > 0; num2--){
        for(var i = diceCountYat.length - 1; i >=0; i--){
          if(diceCountYat[i] >= num2 && arr[0] != (i+1)){
            arr.push(i+1);
            return arr;
          }else if(num == 1 && i <= 1){
            arr.push(undefined);
            return arr;
          }
        }
      }
    }

    function saveThisYat(value, ant){//value - hviklen terning, ant - hvor mange
      if(value === undefined){
        return;
      }
      for(var i = 0; i < diceResYat.length; i++){
        if(diceResYat[i] == value && ant > 0){
          shouldRollYat[i] =  false;
          ant--;
        }
      }
    }


}

function isGameFinishedYat() {
  let finished;
  for(var i = 0; i < playerIdYat.length; i++){
    for(var k = 0; k < comboIdYat.length; k++){
      finished = storedValueYat[playerIdYat[i]][k];
      if(!finished){
        return false;
      }
    }
  }
  return true;
}

function endGameYat() {
  let id;
  let scoreBoardYat = [];
  for (var i = 0; i < playerIdYat.length; i++) {
    let a = totalSumYat[playerIdYat[i]].reduce(sumArrayYat);
    id = playerIdYat[i] + "bonus";
    if(document.getElementById(id).innerHTML == 50){
      a += 50;
    }
    id = playerIdYat[i] + "totalsum";
    document.getElementById(id).innerHTML = a;
    scoreBoardYat.push(a);
  }
    let winPoint = Math.max.apply(null, scoreBoardYat);
    let index = scoreBoardYat.indexOf(winPoint);
    let winner = document.getElementById(playerIdYat[index]).textContent;
    document.getElementById("txtUt").innerHTML = (winner === "Du" ? "Du vant!" : "Du tapte");
    let proceed = (winner === "Du" ? 2 : 1);
    document.getElementById("btnYatEnd").onclick = () => proceedToGame("mainstory", proceed);
    let cover = document.getElementById("yatCover");
    cover.classList.remove("yatHide");
    document.body.removeEventListener("keyup", checkKeyEventYat);

    //tilbakestiller globale variabler
    playerIdYat = [];
    turnYat = 0;
    storedValueYat = [];
    shouldRollYat = [true, true, true, true, true];
    diceCountYat = [0,0,0,0,0,0];
    diceResYat = [0,0,0,0,0];
    numTriesYat = 3;
    totalSumYat = [];
    cpuOptionsYat = [];
    cpuYat = false;
    timerDoneYat = true;
}

function rollDiceYat() {//trill terningene
  timerDoneYat = false;
  emptyInvalidTdYat();//tøm midlertidige felt
  numTriesYat--;
  diceCountYat.fill(0);
  for(var i = 0; i < diceResYat.length; i++){
    if(shouldRollYat[i]){//kast terningen om den ikke skal spares på
      let x = Math.floor(Math.random() *6 + 1);
      let k = x-1;
      diceCountYat[k]++;
      diceResYat[i] = x;
      let id = "yTerning" + i;
      if(cpuYat && playerIdYat[turnYat] == "yS2_"){
        document.getElementById(id).src = "img/dice" + x + ".png";
      }else{
        makeDiceShowYat(id, x);
      }
    }else{
      let k = diceResYat[i] - 1;
      diceCountYat[k]++;
    }
  }
  if(numTriesYat == 0){
    document.getElementById("btnRull").disabled = true;
  }
  if(cpuYat && playerIdYat[turnYat] == "yS2_"){
    chekkForOptionsYat();
  }else{
    setTimeout(chekkForOptionsYat, 1500);
  }
}

function makeDiceShowYat(diceId, diceResYat){//får ternignene til å 'trille'
  var count = 0;
  let int = setInterval(function(){
    count++;
      let rnd = Math.floor(Math.random()*6 +1);//tall 1-6
      let imgSrc = "img/dice" + rnd + ".png";
      document.getElementById(diceId).src = imgSrc;
    if(count > 10){
      clearInterval(int);
      document.getElementById(diceId).src = "img/dice" + diceResYat + ".png";
    }
  }, 100);
}
/*--------------\\Finner mulige yatzy-verdier og skriver dem ut i tabellen//------------------------ */
function chekkForOptionsYat() {
  timerDoneYat = true;

let arr = diceCountYat;
let arrRes = diceResYat;
let liten = arr.slice(0, 5);
let stor = arr.slice(1, 6);

let toLike;
let treLike;
let par = [];
let hus = 0;
let value;
let combo;
let dice;

/*Sjekker enkle 1-6*/
for(var i = 0; i < arr.length; i++){
  dice = i+1; //den aktuelle terningen
  let value = dice*arr[i];
  if(value > 0){
      writeToFieldYat(dice, value);
  }
}
//sjekker etter liten stright
for(var i = 0; i < liten.length; i++){
    if(liten[i] !== 1){
      break;
    }else if(liten[i] === 1 && i === liten.length -1){
      value = 15;
      combo = "litenStraight";
      writeToFieldYat(combo, value);
    }
  }
//sjekker etter stor stright
  for(var i = 0; i < stor.length; i++){
    if(stor[i] !== 1){
      break;
    }else if(stor[i] === 1 && i === stor.length -1){
      value = 20;
      combo = "storStraight";
      writeToFieldYat(combo, value);
    }
  }
/*Sjekker etter kombinasjoner*/
  for(var i = 0; i < arr.length; i++){
     dice = i+1;//den aktuelle terningen
    switch (arr[i]) {
      case 5://yatzy
        value = 50;
        combo = "yatzy";
        writeToFieldYat(combo, value);
      //fall through
      case 4://fire like
        value = 4*dice;
        combo = "fireLike";
        writeToFieldYat(combo, value);
      //fall through
      case 3://3 like og hus
        treLike = dice;
        value = 3*dice;
        combo = "treLike";
        writeToFieldYat(combo, value);

        if(hus > 0 && treLike != toLike && toLike != undefined){//sjekker hus
          value = 3*treLike + 2*toLike;
          combo = "hus";
          writeToFieldYat(combo, value);
        }
        hus++;
      //fall through
      case 2://sjekker etter par(2), to par (2+2) og hus
        toLike = dice;
        par.push(dice);
        value = 2*dice;
        combo = "par";
        writeToFieldYat(combo, value);

        if(hus > 0 && treLike != toLike && treLike != undefined){//sjekker hus
          value = 3*treLike + 2*toLike;
          combo = "hus";
          writeToFieldYat(combo, value);
        }
        if(par.length === 2 && par[0] != par[1]){//sjekker etter to unike par
          value = 2*par[0] + 2*par[1];
          combo = "toPar";
          writeToFieldYat(combo, value);
        }
        hus++;
    }
  }
  value = arrRes.reduce(sumArrayYat);
  combo = "sjanse";
  writeToFieldYat(combo, value);
}

function writeToFieldYat(combo, value){
  let str = combo.toString();
  let x = comboIdYat.indexOf(str);
  let id = playerIdYat[turnYat] + comboIdYat[x];
  if(!storedValueYat[playerIdYat[turnYat]][x]){
    document.getElementById(id).innerHTML = value;
  }
  if(cpuYat && playerIdYat[turnYat] == "yS2_"){
    cpuOptionsYat[x] = value;
  }
}
/*----------------------------------------------------------------------------*/

function sumArrayYat(total, num){//summerer en array
  return total + num;
}

function emptyInvalidTdYat(){//tømmer tabellen for midlertidig data
  let id;
  for(var i = 0; i < comboIdYat.length; i++){
    id = playerIdYat[turnYat] + comboIdYat[i];
    if(!storedValueYat[playerIdYat[turnYat]][i]){
      document.getElementById(id).textContent = "";
    }
  }
}
