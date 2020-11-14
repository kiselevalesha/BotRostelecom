
const { CalcHashWord1 } = require("../../libs/hash");
const { LOG } = require("./../../Utils/any");

function SearchPhraseInLeftWords(arrayBlocks, index, arrayFitPhrases) {
    let arrayTokens = MakeLeftSequenceTokens(arrayBlocks, index);
    let iFitToken = GetFitLeftSequenceTokens(arrayTokens, arrayFitPhrases);

    if (iFitToken > -1)
        return {
            iBlock:arrayTokens[iFitToken].iBlock,
            iToken:arrayTokens[iFitToken].iToken,
            side: "left"
        }
    
    return null;
}
module.exports.SearchPhraseInLeftWords = SearchPhraseInLeftWords;

function MakeLeftSequenceTokens(arrayBlocks, index) {
    let arrayTokens = [];
    for (let i = 0; i < index; i++)
        for (let j = 0; j < arrayBlocks[i].tokens.length; j++) {
            let token = arrayBlocks[i].tokens[j];
            let obj = {
                iBlock: i,
                iToken: j,
                full: token.full,
                short: token.short,
                hash1: token.hash1,
                hash2: token.hash2,
                isUsed: token.isUsed
            };
            arrayTokens.push(obj);
        }    
    return arrayTokens;
}

function GetFitLeftSequenceTokens(arrayTokens, arrayFitPhrases) {
    let iFitToken = -1;

    for (let i = arrayTokens.length - 1; i > -1; i--) {
        let word = arrayTokens[i].full;
        let hash = CalcHashWord1(word);

        arrayFitPhrases = GetFitPhrasesToLeftWord(arrayFitPhrases, hash, word);

        if (IsHaveFitPhrase(arrayFitPhrases))
            iFitToken = i;

        if (arrayFitPhrases.length === 0)
            break;
    }

    return iFitToken;
}

function GetFitPhrasesToLeftWord(arrayPhrases, hash, word) {
    let arrayRet = [];
    for (let i = 0; i < arrayPhrases.length; i++) {
        let iLength = arrayPhrases[i].content.length;
        if (iLength > 0) {

            //  Если последнее слово фразы в массиве слов фразы совпадает
            if (arrayPhrases[i].content[iLength - 1].hash1 === hash)
                if (arrayPhrases[i].content[iLength - 1].full === word) {
                    //  удаляем последнее слово
                    arrayPhrases[i].content = RemoveLastJsonObject(arrayPhrases[i].content);
                    //  засовываем фразу в выходной массив прошедших проверку фраз
                    arrayRet.push(arrayPhrases[i]);
                }
        }    
    }
    return arrayRet;
}





function SearchPhraseInRightWords(arrayBlocks, index, arrayFitPhrases) {
    let arrayTokens = MakeRightSequenceTokens(arrayBlocks, index);
    let iFitToken = GetFitRightSequenceTokens(arrayTokens, arrayFitPhrases);
    if (iFitToken > -1) {
        return {
            iBlock:arrayTokens[iFitToken].iBlock,
            iToken:arrayTokens[iFitToken].iToken,
            side: "right"
        }
    }
    return null;
}
module.exports.SearchPhraseInRightWords = SearchPhraseInRightWords;

function MakeRightSequenceTokens(arrayBlocks, index) {
    let arrayTokens = [];
    for (let i = index + 1; i < arrayBlocks.length; i++)
        for (let j = 0; j < arrayBlocks[i].tokens.length; j++) {
            let token = arrayBlocks[i].tokens[j];
            let obj = {
                iBlock: i,
                iToken: j,
                full: token.full,
                short: token.short,
                hash1: token.hash1,
                hash2: token.hash2,
                isUsed: token.isUsed
            };
            arrayTokens.push(obj);
        }    
    return arrayTokens;
}
module.exports.MakeRightSequenceTokens = MakeRightSequenceTokens;

function GetFitRightSequenceTokens(arrayTokens, arrayFitPhrases) {
    let iFitToken = -1;

    for (let i = arrayTokens.length - 1; i > -1; i--) {
        let word = arrayTokens[i].full;
        let hash = CalcHashWord1(word);

        arrayFitPhrases = GetFitPhrasesToRightWord(arrayFitPhrases, hash, word);

        if (IsHaveFitPhrase(arrayFitPhrases))
            iFitToken = i;

        if (arrayFitPhrases.length === 0)
            break;
    }

    return iFitToken;
}

function GetFitPhrasesToRightWord(arrayPhrases, hash, word) {
    let arrayRet = [];
    for (let i = 0; i < arrayPhrases.length; i++) {
        //  Если первое слово фразы в массиве слов фразы совпадает
        if (arrayPhrases[i].content[0].hash1 === hash)
            if (arrayPhrases[i].content[0].full === word) {
                //  удаляем первое слово
                arrayPhrases[i].content = RemoveFirstJsonObject(arrayPhrases[i].content);
                //  засовываем фразу в выходной массив прошедших проверку фраз
                arrayRet.push(arrayPhrases[i]);
            }
    }
    return arrayRet;
}




function IsHaveFitPhrase(arrayPhrases) {
    for (let i = 0; i < arrayPhrases.length; i++)
        if (arrayPhrases[i].content.length === 0)
            return true;
    return false;
}

function RemoveLastJsonObject(arrayItems) {
    let arrayRet = [];
    for (let i = 0; i < (arrayItems.length - 1); i++)
        arrayRet.push(arrayItems[i]);
    return arrayRet;
}

function RemoveFirstJsonObject(arrayItems) {
    let arrayRet = [];
    for (let i = 1; i < arrayItems.length; i++)
        arrayRet.push(arrayItems[i]);
    return arrayRet;
}


