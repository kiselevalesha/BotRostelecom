
const { LOG } = require("../../../Utils/any");
const { SearchRanges } = require("./searchranges");


//  Пока это только заглушка

function SearchGoodBadCurrencies(arrayBlocks, idTypeBundle, 
    arrayStartPhrases = [], arrayEndPhrases = [], arrayAndPhrases = []) {

    arrayBlocks = SearchRanges(arrayBlocks, idTypeBundle, 
            arrayStartPhrases, arrayEndPhrases, arrayAndPhrases);
    
    //  Пока просто подставляем всё в вариант Приемлемо-Good
    for (let i = 0; i < arrayBlocks.length; i++)
        if (arrayBlocks[i].type === idTypeBundle)
            if (arrayBlocks[i].result)
                arrayBlocks[i].result = { good: arrayBlocks[i].result };

    return arrayBlocks;
}
module.exports.SearchGoodBadCurrencies = SearchGoodBadCurrencies;

