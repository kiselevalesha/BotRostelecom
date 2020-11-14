
const { ParseCurrency, TypeSemanticsNumeral, TypeSemanticsSign,
     TypeSemanticsEmpty, TypeSemanticsMat, TypeSemanticsAdjective 
    } = require("../../const");
const { CreateArrayHashWords } = require("../../../Utils/hash");
const { CalcHashWord1 } = require("../../../libs/hash");
const { GetNextIndex, GetPrevIndex, MoveToLeftTokens, MoveToRightTokens, RemoveNullBlocks, LOG } = require("./../../../Utils/any");

const strRuble = 'руб';
const arrayRubleNames = ["руб","рубл","рублик"];
const arrayRubleValues = [100,100,100];

const strKopeek = 'коп';
const arrayKopeekNames = ["коп","копеек","копейк","копеечек"];
const arrayKopeekValues = [1,1,1,1];

const arrayCurrencyNames = [].concat(arrayRubleNames, arrayKopeekNames);
const arrayCurrencyValues = [].concat(arrayRubleValues, arrayKopeekValues);
const arrayCurrencyHashs = CreateArrayHashWords(arrayCurrencyNames);


//  Находим числа, стоящие рядом с денежными словами и объединяем их в один блок
function DoParseCurrency(arrayBlocks) {
    
    for (let i = 0; i < arrayBlocks.length; i++)
        if (arrayBlocks[i])
            if (arrayBlocks[i].type === ParseCurrency) {
                let word = arrayBlocks[i].tokens[0].short;
                let value = GetCurrencyValue(word);

                if (value) {

                    let iMainBlock = i;

                    // проверяем есть ли слева Numbers
                    let iPrev = GetPrevIndex(arrayBlocks, i);
                    if (iPrev > -1) {
                        let type = arrayBlocks[iPrev].typePOS;

                        if ((type === TypeSemanticsNumeral) ||
                            (type === TypeSemanticsSign) ||
                            (type === TypeSemanticsEmpty) ||
                            (type === TypeSemanticsMat) ||
                            (type === TypeSemanticsAdjective)) {

                            if (type === TypeSemanticsNumeral) {
                                arrayBlocks[iMainBlock].result = {};

                                arrayBlocks[iMainBlock].result.name = GetCurrencyName(value);
                                arrayBlocks[iMainBlock].result.value = arrayBlocks[iPrev].result[0];            
                                arrayBlocks[iMainBlock].tokens = MoveToLeftTokens(arrayBlocks[iMainBlock].tokens, arrayBlocks[iPrev].tokens);
                                arrayBlocks[iPrev] = null;

                                continue;
                            }
                        }
                    }

                    // проверяем есть ли справа Numbers
                    let iNext = GetNextIndex(arrayBlocks, i);
                    if (iNext > -1) {
                        let type = arrayBlocks[iNext].typePOS;

                        if ((type === TypeSemanticsNumeral) ||
                            (type === TypeSemanticsEmpty) ||
                            (type === TypeSemanticsMat)) {

                            if (type === TypeSemanticsNumeral) {
                                arrayBlocks[iMainBlock].result = {};
                                arrayBlocks[iMainBlock].result.value = arrayBlocks[iNext].result[0];
                                arrayBlocks[iMainBlock].result.name = GetCurrencyName(value);
                                arrayBlocks[iMainBlock].tokens = MoveToRightTokens(arrayBlocks[iMainBlock].tokens, arrayBlocks[iNext].tokens);
                                arrayBlocks[iNext] = null;
                            }
                        }
                    }
                }
            }

    return RemoveNullBlocks(arrayBlocks);
}
module.exports.DoParseCurrency = DoParseCurrency;

function GetCurrencyValue(word) {
    let hash = CalcHashWord1(word);

    let index = arrayCurrencyHashs.indexOf(hash);
    if (index > -1)
        if (word === arrayCurrencyNames[index])
            return arrayCurrencyValues[index];
    return 0;
}

function GetCurrencyName(value) {
    let strCurrency = '';

    if (value === 1)
        strCurrency = 'коп';
    else
        strCurrency = 'руб';

    return strCurrency;
}

//  Соединяем рубли и копейки в один блок - общую сумму
function DoJoinCurrencies(arrayBlocks) {
    let iPrev = -1;
    let flagIsHave;
    do {
        flagIsHave = false;

        for (let i = 0; i < arrayBlocks.length; i++)
            if (arrayBlocks[i])
                if (arrayBlocks[i].type === ParseCurrency) {
                    if (iPrev === -1) {
                        iPrev = i;
                    }
                    else {
                        if ((iPrev + 1) === i) {
                            let name1 = arrayBlocks[iPrev].result.name;
                            let value1 = arrayBlocks[iPrev].result.value;
                            let name2 = arrayBlocks[i].result.name;
                            let value2 = arrayBlocks[i].result.value;
    
                            if (name1 !== name2) {
                                flagIsHave = true;
    
                                if (name1 === strRuble)
                                    value1 = value1 * 100;
    
                                if (name2 === strRuble)
                                    value2 = value2 * 100;
                                     
                                arrayBlocks[iPrev].result.name = strKopeek;
                                arrayBlocks[iPrev].result.value = value1 + value2;
    
                                arrayBlocks[iPrev].tokens = MoveToRightTokens(arrayBlocks[iPrev].tokens, arrayBlocks[i].tokens);
                                arrayBlocks[i] = null;

                                iPrev = -1;
    
                                break;
                            }
                        }
                        else {
                            iPrev = i;
                        }
                    }
                }

    } while(flagIsHave);

    return RemoveNullBlocks(arrayBlocks);
}
module.exports.DoJoinCurrencies = DoJoinCurrencies;
