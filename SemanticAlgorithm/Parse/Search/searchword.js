
const { ExecuteSQLQuery } = require("../../libs/sql");
const { CalcHashWord1, CalcHashWord2 } = require("../../libs/hash");
const { emitter, SendEvent } = require("../../libs/events");
const { LOG } = require("../../Utils/any");

let eventOnParentError = '';
let eventReturnToParent = '';



const eventOnError = 'eventOnSrchWordError';
emitter.on(eventOnError, function(err) {
    //LOG(err)
    SendEvent(err, null, eventOnParentError); 
});

const eventOnEndSQLSrchWord = 'eventOnEndSQLSrchWord';
emitter.on(eventOnEndSQLSrchWord, function(rows) {
    let flag = false;
    if (rows && rows.length)
        flag = true;

    SendEvent(null, flag, eventReturnToParent);
});

function StartSearchWord(strWord, strTableName, strFieldName, 
                        _eventReturnToParent, _eventOnParentError, 
                        strHash1 = 'intHash1', strHash2 = 'intHash2') {

    eventReturnToParent = _eventReturnToParent;
    eventOnParentError = _eventOnParentError;

    let hash1 = CalcHashWord1(strWord);
    let hash2 = CalcHashWord2(strWord);
  
    let query = 'select * from ' + strTableName + ' where ' + strHash1 + '=' + hash1 + 
        ' AND ' + strHash2 + '=' + hash2 +' AND ' + strFieldName + ' LIKE "' + strWord + '"';
    ExecuteSQLQuery(query, eventOnEndSQLSrchWord);
}
module.exports.StartSearchWord = StartSearchWord;
