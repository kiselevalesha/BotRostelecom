
const { AddHashToFullTokens } = require("../../../Utils/hash");
const { MoveTokensToLeftBlock, MoveTokensToRightBlock, RemoveNullBlocks, LOG } = require("../../../Utils/any");
const tokenization = require("../../Semantics/Parse/tokenization");
const MakeTokensRegular = require("../../Semantics/Parse/regular");
const { SearchPhraseInLeftWords, SearchPhraseInRightWords } = require("../searchphrase");

const arrayStartLeftPhrases = [
    "с","от",
    "начиная","начиная с",
    "не меньше","не менее",
    "самое малое","самое меньшее","самое маленькое","самое наименьшее",
    "минимально","минимум","как минимум"
];
const arrayStartRightPhrases = [
    "не меньше","не менее","но не меньше","но не менее",
    "самое малое","самое меньшее","самое маленькое","самое наименьшее",
    "минимально","минимум","как минимум","это минимум","самый минимум","самый самый минимум"
];

const arrayEndLeftPhrases = [
    "по","до",
    "заканчивая","заканчивая по",
    "не больше","не более",
    "самое большое","самое большее","самое наибольшее",
    "максимально","максимум","как максимум"
];
const arrayEndRightPhrases = [
    "не больше","не более","но не больше","но не более",
    "самое большое","самое большее","самое наибольшее",
    "максимально","максимум","как максимум","это максимум","самый максимум","самый самый максимум"
];

const arrayAndPhrases = ["либо","или","и","ещё"];

function MakeArray(arrayPhrases, idType) {
    let arrayRet = [];
    if (arrayPhrases)
        for (let i = 0; i < arrayPhrases.length; i++) {


            //  Разделим текст на токены
            let arrayTokens = tokenization(arrayPhrases[i]);
            //LOG(arrayTokens);


            //  Приведём все слова к нижнему регистру
            //  заменим ё на е
            //  заменим большое тире на короткое  — на -
            arrayTokens = MakeTokensRegular(arrayTokens);

            arrayTokens = AddHashToFullTokens(arrayTokens);

            arrayRet.push({
                type:idType,
                phrase: arrayPhrases[i],
                content: arrayTokens
            });
        }
    return arrayRet;
}


function SearchBorders(arrayBlocks, idTypeBundle, 
                            arrayStartPhrases = [], arrayEndPhrases = [], arrayAndPhrases = []) {
    
    let arrayLeftStartPhrases = [].concat(
        MakeArray(arrayStartLeftPhrases, 1),
        MakeArray(arrayStartPhrases, 1),
    );
    let arrayLeftEndPhrases = [].concat(
        MakeArray(arrayStartRightPhrases, 1),
        MakeArray(arrayStartPhrases, 1),
    );

    let arrayRightStartPhrases = [].concat(
        MakeArray(arrayEndLeftPhrases, 1),
        MakeArray(arrayEndPhrases, 1),
    );
    let arrayRightEndPhrases = [].concat(
        MakeArray(arrayEndRightPhrases, 1),
        MakeArray(arrayEndPhrases, 1),
    );

    let flagIsFinded;
    do {
        flagIsFinded = false;
        for (let i = 0; i < arrayBlocks.length; i++)
            if (arrayBlocks[i])
                if (arrayBlocks[i].type === idTypeBundle) {
                    if (! arrayBlocks[i].used) {
                        arrayBlocks[i].used = true;
                        flagIsFinded = true;
                        arrayBlocks = SearchPhrases(arrayBlocks, i, 
                            arrayLeftStartPhrases, arrayLeftEndPhrases,
                            arrayRightStartPhrases, arrayRightEndPhrases);
                    }
                }
    } while (flagIsFinded);

    return RemoveNullBlocks(arrayBlocks);
}
module.exports.SearchBorders = SearchBorders;


function SearchPhrases(arrayBlocks, i, 
                        arrayLeftStartPhrases, arrayLeftEndPhrases,
                        arrayRightStartPhrases, arrayRightEndPhrases) {

    let arrayJsonRanges = [];
    let objRet = null;

    // проверяем есть ли слева от текущего блока искомые фразы
    objRet = SearchPhraseInLeftWords(arrayBlocks, i, arrayLeftStartPhrases);
    if (! objRet)
        objRet = SearchPhraseInRightWords(arrayBlocks, i, arrayLeftEndPhrases);
    if (objRet)
        objRet.border = 'left';

    // если слева не нашлось, то проверяем
    // есть ли справа от текущего блока искомые фразы
    if (! objRet) {
        objRet = SearchPhraseInLeftWords(arrayBlocks, i, arrayRightStartPhrases);
        if (! objRet)
            objRet = SearchPhraseInRightWords(arrayBlocks, i, arrayRightEndPhrases);
        if (objRet)
            objRet.border = 'right';
    }

    //  Если найдены искомые слова в блоках слева или справа, то сливаем блоки
    //  (start, end) (and) - взаимоисключающие объекты
    //  (start, end) - могут присутствовать вдвоём или поодиночке, 
    //  указывая, что была указана лишь одна граница диапазона
    let jsonStart = null;
    let jsonEnd = null;
    let jsonAnd = null;

    let strName = '';
    if (arrayBlocks[i].result)
        if (arrayBlocks[i].result.name)
            strName = arrayBlocks[i].result.name;

    let iValue = 0;
    if (arrayBlocks[i].result)
        if (arrayBlocks[i].result.value)
            iValue = arrayBlocks[i].result.value;


    if (objRet) {

        if (objRet.border === 'left') {
            jsonStart = {            
                name: strName,
                value: iValue            
            };
        }

        else if (objRet.border === 'right') {
            jsonEnd = {            
                name: strName,
                value: iValue            
            };
        }
    }
    else {
        //  ничего не нашлось. Переносить токены никуда не нужно.

        jsonAnd = {            
            name: strName,
            value: iValue            
        };
    }

    //  собираем только указанные границы диапазона или вообще без диапазона
    let objJsons = {};
    if (jsonStart)
        objJsons.start = jsonStart;
    if (jsonEnd)
        objJsons.end = jsonEnd;
    if (jsonAnd)
        objJsons.and = jsonAnd;
    arrayJsonRanges.push(objJsons);

    arrayBlocks[i].result = arrayJsonRanges;


    //  И только теперь переносим
    if (objRet) {

        if (objRet.side === 'left') {
            //  перенести токены в главный блок и поставить их слева
            arrayBlocks = MoveTokensToLeftBlock(arrayBlocks, i, objRet.iBlock, objRet.iToken);
        }

        if (objRet.side === 'right') {
            //  перенести токены в главный блок и поставить их справа
            arrayBlocks = MoveTokensToRightBlock(arrayBlocks, i, objRet.iBlock, objRet.iToken);
        }
    }

    return arrayBlocks;
}
