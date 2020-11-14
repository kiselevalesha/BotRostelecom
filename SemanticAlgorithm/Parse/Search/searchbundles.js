
const { StartSearchBundle } = require("./searchbundle");
const { emitter, SendEvent } = require("../../libs/events");
const { LOG } = require("../../Utils/any");

let arrayBlocks = [];
let indexArray = 0;


const eventOnError = 'SearchBundlesError';
emitter.on(eventOnError, function(err) {
    SendEvent(err, null, eventOnParentError); 
});

const eventOnEndSearchBundles = 'endSearchBundles';
emitter.on(eventOnEndSearchBundles, function(idBundleConstant){
    //LOG("arrayBlocks[indexArray].tokens[0].short="+arrayBlocks[indexArray].tokens[0].short+" idBundleConstant="+idBundleConstant)
    if (idBundleConstant > 0)
        arrayBlocks[indexArray].type = idBundleConstant;

    indexArray++;
    DoSearchBundle();
});

function DoSearchBundle() {
    if (indexArray < arrayBlocks.length)
        StartSearchBundle(arrayBlocks[indexArray].tokens[0].short,
                            eventOnEndSearchBundles, eventOnError);
    else
        SendEvent(null, arrayBlocks, eventReturnToParent);
}

function StartSearchBundles(_arrayBlocks, _eventReturnToParent, _eventOnError) {

    arrayBlocks = _arrayBlocks;

    eventReturnToParent = _eventReturnToParent;
    eventOnParentError = _eventOnError;

    DoSearchBundle();
}
module.exports.StartSearchBundles = StartSearchBundles;
