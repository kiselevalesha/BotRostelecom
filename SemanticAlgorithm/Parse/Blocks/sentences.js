
//  Блокинг (объединение токенов в блоки) набора предложений.
//  По одному предложению.

const { StartBlockSentence } = require("./sentence");
const { emitter, SendEvent } = require("./../../libs/events");
const { LOG } = require("./../../Utils/any");
const { ParseQuestion } = require("./Questions/parseQuestion");


let arrayInSentences = [];
let arrayOutSentences = [];
let indexArray = 0;

let eventOnParentError = '';
let eventReturnToParent = '';

const eventOnError = 'BlockSentencesError';
emitter.on(eventOnError, function(err) {
    SendEvent(err, null, eventOnParentError);
});


const eventEndBlockSentences = 'EndBlockSentences';
emitter.on(eventEndBlockSentences, function(data) {
    //LOG(data)

    let objSentence = {};

    //  Определим не вопросительное ли это предложение
    let objRet = ParseQuestion(data);
    if (objRet.isQuestion)
        objSentence.isQuestion = true;

    objSentence.blocks = objRet.arrayBlocks;

    arrayOutSentences.push(objSentence);

    indexArray++;
    DoBlockSentence();
});

function DoBlockSentence() {
    if (indexArray < arrayInSentences.length)
        StartBlockSentence(arrayInSentences[indexArray], eventEndBlockSentences, eventOnError);
    else
        SendEvent(null, arrayOutSentences, eventReturnToParent);
}


//  Запустим каждое предложение на POS-тагировку
function StartParseBlockSentences(_arraySentences, _eventReturnToParent, _eventOnError) {
    arrayInSentences = _arraySentences;
    arrayOutSentences = [];
    indexArray = 0;

    eventReturnToParent = _eventReturnToParent;
    eventOnParentError = _eventOnError;

    DoBlockSentence();
}
module.exports.StartParseBlockSentences = StartParseBlockSentences;
