const { CalcHashWord1 } = require("../../../libs/hash");
const { CreateArrayHashWords } = require("../../../Utils/hash");
const { RemoveNullBlocks, MoveToRightTokens, LOG } = require("../../../Utils/any");
const { SearchBorders } = require("./searchborders");
const { TypeSemanticsPretext, TypeSemanticsSign, TypeSemanticsMat,
    TypeSemanticsEmpty, TypeSemanticsConjunction } = require("../../const");

const arrayConjunctionJoins = ["и","но","однако"];
const arrayHashConjunctionJoins = CreateArrayHashWords(arrayConjunctionJoins);

const arrayConjunctionSeparates = ["еще","либо","или"];
const arrayHashConjunctionSeparates = CreateArrayHashWords(arrayConjunctionSeparates);


let arrayRanges = [];
let objRange = {};


function SearchRanges(arrayBlocks, idTypeBundle, 
    arrayStartPhrases = [], arrayEndPhrases = [], arrayAndPhrases = []) {

    //  Ищем границы диапазонов - start и end
    //  если найдены, они находятся в свойстве result
    arrayBlocks = SearchBorders(arrayBlocks, idTypeBundle, 
                                    arrayStartPhrases, arrayEndPhrases, arrayAndPhrases);

    //  По всем блокам
    for (let i = 0; i < arrayBlocks.length; i++) {

        //  Если тип блока Знак, Мат или Пустые слова, то игнорируем его
        if ((arrayBlocks[i].typePOS === TypeSemanticsSign) ||
            (arrayBlocks[i].typePOS === TypeSemanticsMat) ||
            (arrayBlocks[i].typePOS === TypeSemanticsEmpty))
                continue;

                
        //  Если тип блока Союз или предлог, то проверяем что это за слово
        if ((arrayBlocks[i].typePOS === TypeSemanticsConjunction) ||
            (arrayBlocks[i].typePOS === TypeSemanticsPretext)) {

            //  Для упрощения смотрим только первый токен блока.
            //  По идее в таком блоке должен быть только один токен
            let word = arrayBlocks[i].tokens[0].full;
            let hash1 = CalcHashWord1(word);

            //  ["и","но","однако"] - соединительные слова
            let index = arrayHashConjunctionJoins.indexOf(hash1);
            if (index > -1)
                if (arrayConjunctionJoins[index] === word) {
                    //  не разделять на новый диапазон

                    continue;
                }
            

            //  ["еще","либо","или"] - разделительные слова
            index = arrayHashConjunctionSeparates.indexOf(hash1);
            if (index > -1)
                if (arrayConjunctionSeparates[index] === word) {
                    //  создать из текущих данных новый диапазон
                    MakeNewRange(i);
                    continue;
                }            
        }

        //  Добавить границы, если это блок искомого типа
        if (arrayBlocks[i].type === idTypeBundle)
            if (arrayBlocks[i].result) {
                AddNewBorder(arrayBlocks[i].result, i);
                continue;
            }
                

        //  и потом разделить на новый диапазон, если какое-либо другое слово разделяет диапазоны
        MakeNewRange(i);
    }

    if ((objRange.start) || (objRange.end))
        MakeNewRange(arrayBlocks.length - 1);

    //  Теперь сливаем все найденные диапазоны в единые блоки
    arrayBlocks = JoinBlocks(arrayBlocks, arrayRanges, idTypeBundle);

    return RemoveNullBlocks(arrayBlocks);
}
module.exports.SearchRanges = SearchRanges;


function JoinBlocks(arrayBlocks, arrayRanges, idTypeBundle) {

    if (arrayRanges.length === 0)
        return arrayBlocks;

    let arrayNewBlocks = [];
    let iStartBlock = 0;
    for (let i = 0; i < arrayRanges.length; i++) {

        for (let j = iStartBlock; j < arrayRanges[i].iStartBlock; j++)
            arrayNewBlocks.push(arrayBlocks[j]);

        //
        let arrayTokens = [];
        for (let j = arrayRanges[i].iStartBlock; j < arrayRanges[i].iEndBlock; j++)
            if (j < arrayBlocks.length) {
                arrayTokens = MoveToRightTokens(arrayTokens, arrayBlocks[j].tokens);
                arrayBlocks[j].tokens = [];
            }

        arrayBlocks[arrayRanges[i].iStartBlock].tokens = arrayTokens;
        arrayBlocks[arrayRanges[i].iStartBlock].type = idTypeBundle;
        arrayBlocks[arrayRanges[i].iStartBlock].typePOS = 0;    //  Теперь это не имеет смысла.
        let jsonResult = {};
        if (arrayRanges[i].start)
            jsonResult.start = arrayRanges[i].start;
        if (arrayRanges[i].end)
            jsonResult.end = arrayRanges[i].end;
        arrayBlocks[arrayRanges[i].iStartBlock].result = jsonResult;

        arrayNewBlocks.push(arrayBlocks[arrayRanges[i].iStartBlock]);
        iStartBlock = arrayRanges[i].iEndBlock + 1;
    }
    if (arrayRanges.length > 0) {
        let iStart = arrayRanges[arrayRanges.length - 1];
        let iEnd = arrayBlocks.length;

        for (let i = iStart; i < iEnd; i++)
            arrayNewBlocks.push(arrayBlocks[i]);        
    }

    return arrayNewBlocks;
}

//  Создать новый диапазон, если есть из чего его создавать.
function MakeNewRange(iEndBlock) {
    if (objRange)
        if ((objRange.start) || (objRange.end)) {

            let jsonRange = {
                iStartBlock: objRange.iBlock,
                iEndBlock: iEndBlock
            };

            if (objRange.start)
                jsonRange.start = objRange.start;
            if (objRange.end)
                jsonRange.end = objRange.end;

            arrayRanges.push(jsonRange);
        }
    objRange = {};
}


//  Добавить границу в текущий диапазон, проверяя что в нём уже есть.
function AddNewBorder(result, iBlock) {
    if (result) {
        for (let i = 0; i < result.length; i++) {
            if (result[i].start) {
                if (objRange.start)
                    MakeNewRange(iBlock);
                
                objRange.start = result[i].start;
                if (objRange.iBlock === undefined)
                    objRange.iBlock = iBlock;
                return;
            }
                
            if (result[i].end) {
                if (objRange.end)
                    MakeNewRange(iBlock);
                
                objRange.end = result[i].end;
                if (objRange.iBlock === undefined)
                    objRange.iBlock = iBlock;
                return;
            }
        }
    }    
}
