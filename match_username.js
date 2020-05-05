const results = [
	"Vvita-rive",
  	"MaxouS0",
  	"t0mmmma5",
  	"Zazale0uf",
  	"crabver"
]

const list = [
  	"Maxou50",
  	"Maxou50",
  	"thommmma",
  	"ZazaLeOuf",
  	"vita-rive"
]


const result =results.map(r=>matchInList(r,list))
console.log(result);

function matchInList(s,list){
  let min = {d:Infinity}
  for(let i=0;i<list.length;i++){
    let d = ldist(s,list[i]);
    if( d<min.d ){
      min.d = d
      min.i = i
    }
  }
  return list[min.i];
}


function ldist(s1, s2){
	if(!s1) return s2.length
  	if(!s2) return s1.length
  	if(s1[0]==s2[0]) return ldist(s1.slice(1),s2.slice(1))

	return 1+Math.min(
      	ldist(s1.slice(1),s2),
      	ldist(s1,s2.slice(1)),
      	ldist(s1.slice(1),s2.slice(1))
    )
}
