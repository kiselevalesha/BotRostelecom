
//  Чтение всего датасета.

const fs = require('fs');
const { LOG } = require("./../Utils/any");
const { emitter, SendEvent } = require("./../libs/events");


let eventOnParentError = '';
let eventReturnToParent = '';


function StartReadDataSet(strFileName, _eventReturnToParent, _eventOnError) {
    
    eventReturnToParent = _eventReturnToParent;
    eventOnParentError = _eventOnError;

    //  Запускаем чтение из файла
    fs.readFile(strFileName, 'utf8', function(err, contents) {
        if (err)
            SendEvent(err, null, eventOnParentError);
        else
            SendEvent(null, contents, eventReturnToParent);
    });
    
}
module.exports.StartReadDataSet = StartReadDataSet;
