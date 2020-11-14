
const { StartSearchWord } = require("./searchword");
const { emitter, SendEvent } = require("../../libs/events");
const { LOG } = require("../../Utils/any");

let arrayBlocks = [];
let indexArray = 0;

let strTableName = '';
let idType = 0;
let strFieldName = '';


const eventOnError = 'SearchWordsError';
emitter.on(eventOnError, function(err) {
    SendEvent(err, null, eventOnParentError); 
});

const eventOnEndSearchWords = 'endSearchWords';
emitter.on(eventOnEndSearchWords, function(flagHaveWord){
    //LOG('eventOnEndSearchWords!');
    //LOG('flagHaveWord='+flagHaveWord);

    if (flagHaveWord)
        arrayBlocks[indexArray].type = idType;

    indexArray++;
    DoSearchWord();
});

function DoSearchWord() {
    if (indexArray < arrayBlocks.length)
        StartSearchWord(arrayBlocks[indexArray].tokens[0].short, strTableName, strFieldName,
            eventOnEndSearchWords, eventOnError);
    else
        SendEvent(null, arrayBlocks, eventReturnToParent);
}

function StartSearchWords(_arrayBlocks, _strTableName, _strFieldName, _idType,
                            _eventReturnToParent, _eventOnError) {

    arrayBlocks = _arrayBlocks;
    strTableName = _strTableName;
    strFieldName = _strFieldName;
    idType = _idType;
    
    eventReturnToParent = _eventReturnToParent;
    eventOnParentError = _eventOnError;

    DoSearchWord();
}
module.exports.StartSearchWords = StartSearchWords;
