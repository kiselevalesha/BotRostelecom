
//  Разбиение на блоки распарсенные токены.

const { LOG } = require("./../../Utils/any");
const { emitter, SendEvent } = require("./../../libs/events");
const { StartParseBlocks } = require("./start");


let eventOnParentError = '';
let eventReturnToParent = '';

const eventOnError = 'ErrorBlockSentence';
emitter.on(eventOnError, function(err) {
    SendEvent(err, null, eventOnParentError);
});

const eventEndBlockSentence = 'EndBlockSentence';
emitter.on(eventEndBlockSentence, function(data) {
    SendEvent(null, data, eventReturnToParent);
});

function StartBlockSentence(arrayJsonTokens, _eventReturnToParent, _eventOnError) {
    
    eventReturnToParent = _eventReturnToParent;
    eventOnParentError = _eventOnError;

    //  Запускаем поиск фраз и слитие однотипных токенов в один блок.
    //  на выходе получим новый массив блоков.
    StartParseBlocks(arrayJsonTokens, eventEndBlockSentence, eventOnError);
}
module.exports.StartBlockSentence = StartBlockSentence;
