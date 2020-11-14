
const { ExecuteSQLQuery } = require("../../libs/sql");
const { CalcHashWord1, CalcHashWord2 } = require("../../libs/hash");
const { emitter, SendEvent } = require("../../libs/events");
const { LOG } = require("../../Utils/any");

let eventOnParentError = '';
let eventReturnToParent = '';


const eventOnError = 'ErrorSrchBundle';
emitter.on(eventOnError, function(err) {
    //LOG(err)
    SendEvent(err, null, eventOnParentError); 
});

const eventOnEndSQLSrchBundle = 'EndSQLSrchBundle';
emitter.on(eventOnEndSQLSrchBundle, function(rows) {
    let idBundleConstant = 0;
    if (rows && rows.length)
        idBundleConstant = rows[0].idConstant;

    SendEvent(null, idBundleConstant, eventReturnToParent);
});


const eventOnEndSQLSrchCommon = 'EndSQLSrchCommon';
emitter.on(eventOnEndSQLSrchCommon, function(rows) {
    if (rows && rows.length) {
        let idBundle = rows[0].idBundle;
        let query = 'select * from Bundle where id=' + idBundle;
        //LOG(query)
        ExecuteSQLQuery(query, eventOnEndSQLSrchBundle);
    }
    else
        SendEvent(null, 0, eventReturnToParent);
});

function StartSearchBundle(strWord, _eventReturnToParent, _eventOnParentError) {

    eventReturnToParent = _eventReturnToParent;
    eventOnParentError = _eventOnParentError;
    //LOG("StartSearchBundle strWord="+strWord)

    let hash1 = CalcHashWord1(strWord);
    let hash2 = CalcHashWord2(strWord);
  
    let query = 'select * from hashCommons where intHash1=' + hash1 + 
        ' AND intHash2=' + hash2 +' AND strRoot LIKE "' + strWord + '"';
    //LOG(query)
    ExecuteSQLQuery(query, eventOnEndSQLSrchCommon);
}
module.exports.StartSearchBundle = StartSearchBundle;
