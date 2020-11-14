
const { LOG } = require("../Utils/any");


function SplitToReplics(strSource) {
    //let strSpecial = GetReplacedDivideSymbolsOnSpecial(strSource);
    let arrayRet = [];
    let index1 = 0;
    let index2 = -1;
    let symbol = '\n';
    do {
        index2 = strSource.indexOf(symbol, index2 + 1);
        
        if (index2 >= 0) {

            let strToken = strSource.substring(index1, index2);
            strToken = strToken.trim();
            if (strToken.length > 0)
                arrayRet = PushNewItemToArray(arrayRet, strToken);

            index1 = index2 + 1;
        }
        else {
            let strToken = strSource.substring(index1, strSource.length);
            strToken = strToken.trim();
            if (strToken.length > 0)
                arrayRet = PushNewItemToArray(arrayRet, strToken);
        }
        
    } while (index2 > -1);

    return arrayRet;
}
module.exports.SplitToReplics = SplitToReplics;



function PushNewItemToArray(arrayItems, strToken) {
    /*if (arrayItems) {
        let nomer = arrayItems.length + 1;
        arrayItems.push({
            id:nomer,
            source:strToken
        });
    }*/
    arrayItems.push(strToken);
    return arrayItems;
}