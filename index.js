'use strict';

const game = require('game');

const Alexa = require('ask-sdk');
// use 'ask-sdk' if standard SDK module is installed

function isSlotValid(request, slotName){
    var slot = request.intent.slots[slotName];
    console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
    var slotValue;

    //if we have a slot, get the text and store it into speechOutput
    if (slot && slot.value) {
        //we have a value in the slot
        slotValue = slot.value;
        return slotValue;
    } else {
        //we didn't get a value in the slot.
        return false;
    }
}

// Code for the handlers here

const StartGameHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'startGuessTheWord'
  },
  handle(handlerInput) {
    //store in env variable
    let answer = game.getRandomWord();
    console.log("The guessed word is " + answer);

    let speechResponse = "Okay, the word has " + answer.length + " letters";

    handlerInput.attributesManager.setSessionAttributes({
      game_answer: answer
    })

    return handlerInput.responseBuilder
      .speak(speechResponse).getResponse();
  }
};

const GuessALetterHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'guessALetter'
    },
    handle(handlerInput) {
      let letterGuessed = isSlotValid(handlerInput.requestEnvelope.request, "letterGuessed");
      if (!letterGuessed) {
        var response = handlerInput.responseBuilder
            .addDelegateDirective().getResponse();
        console.log(response);
        return response;
      }

      let answer = handlerInput.attributesManager.getSessionAttributes().game_answer;

      console.log("The guessed word is " + answer);

      let speechResponse = "";
      let positions = game.tryLetter(letterGuessed, answer);

      if (positions.length === 0) {
        speechResponse = "Nope";
      } else {
        speechResponse = "You guessed it, the positions are: " + positions.join(",");
      }

      return handlerInput.responseBuilder
          .speak(speechResponse).getResponse();
    }
};

const GuessTheWordHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'guessTheWord'
  },
  handle(handlerInput) {
    let wordGuessed = isSlotValid(handlerInput.requestEnvelope.request, "wordGuess");
    if (!wordGuessed) {
      var response = handlerInput.responseBuilder
        .addDelegateDirective().getResponse();
      console.log(response);
      return response;
    }


    let answer = handlerInput.attributesManager.getSessionAttributes().game_answer;

    console.log("The guessed word is " + answer);

    let guessed = game.tryWord(wordGuessed, answer);

    if (guessed) {
      speechResponse = "You got it";
    } else {
      speechResponse = "Nope";
    }

    return handlerInput.responseBuilder
      .speak(speechResponse).getResponse();
  }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //any cleanup logic goes here
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        GuessALetterHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
