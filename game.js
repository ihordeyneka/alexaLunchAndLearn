let self = {
  answer: null
};

let _ = require('lodash');

//sets an answer
self.setAnswer = function (answer) {
  self.answer = answer;
}

//returns an array
self.tryLetter = function (letter) {
  let characters = self.answer.split('');
  return _.filter(_.range(characters.length), (i) => characters[i].toLowercase() === letter.toLowercase());
}

self.tryWord = function (word) {
  return word.toLowercase() === self.answer.toLowercase();
}

module.exports = self;