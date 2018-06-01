let self = {};

let _ = require('lodash');

self.getRandomWord = function () {
  var array = [
    "bullshit",
    "start"
  ];

  var index = Math.floor(Math.random() * Math.floor(array.length));

  return array[index];
}

//returns an array
self.tryLetter = function (letter, answer) {
  let characters = answer.split('');
  return _.filter(_.range(characters.length), (i) => characters[i].toLowerCase() === letter.toLowerCase()).map((i) => i + 1);
}

self.tryWord = function (word, answer) {
  return word.toLowerCase() === answer.toLowerCase();
}

module.exports = self;