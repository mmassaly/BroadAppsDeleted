const { Readable } = require('stream');

// Votre tableau de données
const dataArray = ['donnée1', 'donnée2', 'donnée3',{a:1}];

// Créer un Readable Stream à partir du tableau

// Écouter l'événement 'data' pour consommer le flux
func(dataArray);

let count = 4;
setInterval(()=>{
	dataArray.push("donnée"+count);
	++count;
	console.log(count);
	func(dataArray);
},2000);

function func(otherdataArray)
{
	let arrayStream = Readable.from(otherdataArray);

	// Écouter l'événement 'data' pour consommer le flux
	arrayStream.on('data', (chunk) => {
	  console.log(chunk);
	});

	// Écouter l'événement 'end' pour savoir quand le flux est terminé
	arrayStream.on('end', () => {
	  console.log('Aucune donnée supplémentaire à lire.');
	});
}