// Import file utils
var fs = require('fs');

// Define list of invitees
var fam = [
  'Beth',
  'Tony',
  'Lauren',
  'Helen',
  'Neil',
  'Peter',
  'Kathy',
  'Jack',
  'Rosie',
  'Rob',
  'Brian',
  'Barbara',
  'Jane',
  'Phil',
  'Sean',
  'Megan'
];

// Write list of Christmas Dinner invitees to JSON file
fs.writeFile('../site/js/invitees.json', JSON.stringify(fam), function (err) {
  if (err) throw err;
});

// Generate and write mapping of givers to receivers
fs.writeFile('../site/js/snowmap.json', JSON.stringify(map()), function (err) {
  if (err) throw err;
});

// Recursively generates and validates the mapping of givers to receivers
function map() {
  var mapping = createMapping();
  for (var mapIndex in mapping) {
    if (mapIndex === mapping[mapIndex]) {
      return map();
    }
  }
  return mapping;
}

// Generates an attempt at a mapping between givers and receivers with no validation
function createMapping() {
  var famClone = JSON.parse(JSON.stringify(fam))
  var shuffledFam = shuffle(famClone);
  var mapping = {};
  for (var famIndex in fam) {
    mapping[fam[famIndex]] = shuffledFam[famIndex];
  }
  return mapping;
}

// Shuffles an array of items into a random order
function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
