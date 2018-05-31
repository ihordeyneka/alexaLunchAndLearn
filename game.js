let self = {};

let _ = require('lodash');

//returns an array
self.tryLetter = function (letter, answer) {
  let characters = answer.split('');
  return _.filter(_.range(characters.length), (i) => characters[i].toLowercase() === letter.toLowercase());
}

self.tryWord = function (word, answer) {
  return word.toLowercase() === answer.toLowercase();
}

module.exports = self;