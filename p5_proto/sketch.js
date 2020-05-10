const url = 'res.png';
const players = [
  "Aquarhum",
  "JAZZY-G",
  "Pierre-Louis Attwell",
  "vita-rivé YCG",
  "Crab'vert",
  "vitalo",
  "Duduch'",
  "Ssam@SpiOF",
  "Eric Delamare",
  "Toma Tanquerel @snph"
];
let img;

function preload(){
  img = loadImage(url);
}

function setup() {
  createCanvas(img.width, img.height)
  background(img);
}

function draw() {
}

async function ocr(imageLike){
  const raw = await Tesseract.recognize(imageLike,'eng',{logger:console.log});
  const txt = raw.data.text;
  return txt;
}

function parseResultsText(txt) {

  //* Extract the results details
  //const matches = [...txt.matchAll(/(DNF|DSQ|course|[0-9sS]+)\s?-\s?(.*)/g)]; //old match, only work for french
  const matches = [...txt.matchAll(/(\w+)\s?-\s?(.+)/g)];

  //* Only get the player and it's rank for each result line
  const results = matches.map( match => ({
    rank: match[1] || '',
    player: match[2] || ''
  }) );

  //* treat the ranks to avoid false DNF
  for (let i = 0; i < results.length; i++) {
    if( results[i].rank == 'DSQ' ) continue;
    if( results[i].rank == 'DNF' ) continue;
    results[i].rank = results[i].rank
      .replace(/s|S/g,'5')
      .replace(/o|O/g,'0');
  }

  return results;
}

function matchResults( rawResults, players ) {
  let p = [...players];
  let results = [];
  for (const result of rawResults) {
    const rank = result.rank;
    const player = matchInList( result.player, p );
    results.push({ rank, player });
    //p.splice( p.indexOf( player ), 1 );
    console.log(player);
  }
  return results;
}


function matchInList(s,list){
  let min = {d:Infinity};
  for(let i=0;i<list.length;i++){
    let d = ldist(s,list[i]);
    console.log({d},list[i]);
    if( d==0 ) return list[i];
    if( d<min.d ){
      min.d = d;
      min.i = i;
    }
  }
  return list[min.i];
}


function ldist(s1, s2){
	if(!s1) return s2.length;
  if(!s2) return s1.length;
  if(s1[0]==s2[0]) return ldist(s1.slice(1),s2.slice(1));

	return 1+Math.min(
    ldist(s1.slice(1),s2),
    ldist(s1,s2.slice(1)),
    ldist(s1.slice(1),s2.slice(1))
  );
}


async function mousePressed(){
  
  console.log('Running OCR');

  const txt = await ocr(img.canvas);
  console.log( txt );
  
  const rawResults = parseResultsText( txt );
  console.log( rawResults );

  const results = matchResults( rawResults, players );
  console.log( results );
  // const siret = txt.match(/\d{14}/g)[0];
  // const livs = txt.match(/LIV\s?\d{4,6}/g);
  // console.log({siret,livs})
}