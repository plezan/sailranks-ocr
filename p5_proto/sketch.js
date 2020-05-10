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


function matchInList(s,list,limit = 20){
  
  //* setup the possibiolities
  let possibilities = list.map(possibility=>({
    tested  : ''+s,
    against : ''+possibility,
    original: ''+possibility
  }));

  do {
    
    //* check every possiblities
    for (const possibility of possibilities) {
      if( possibility.tested == possibility.against ) return possibility.original;
    }
    
    //* get new possibilities
    const old_possibilities = [...possibilities];
    possibilities = [];
  
    for (const possibility of old_possibilities) {
      
      //* ignore the firsts characters if they are the same.
      while (possibility.tested[0] == possibility.against[0]) {
        possibility.tested = possibility.tested.slice(1);
        possibility.against = possibility.against.slice(1);
      }

      possibilities.push(
        {...possibility, tested:  possibility.tested.slice(1)  },
        {...possibility, against: possibility.against.slice(1) },
        {...possibility, tested:  possibility.tested.slice(1), against: possibility.against.slice(1)}
      );
      // todo : avoid doublons
    }
          
  } while (--limit > 0);
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