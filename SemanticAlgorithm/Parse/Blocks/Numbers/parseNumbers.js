
const { CreateArrayHashWords, IsWordInArray } = require("../../../Utils/hash");
const { CalcHashWord1 } = require("../../../libs/hash");
const { LOG } = require("../../../Utils/any");

const arrayNumOrders1 = ["нулев","перв","втор","трет","четверт","пят","шест","седьм","восьм","девят"];
const arrayNumValues1 = [0,1,2,3,4,5,6,7,8,9];
const arrayNumOrders3 = ["десят","двадцат","тридцат","сороков","пятидесят","шестидесят","семидесят","восьмидесят","девяност"];
const arrayNumValues3 = [10,20,30,40,50,60,70,80,90];
const arrayNumOrders4 = ["сот","сотен","сотн","двухсот","двухст","трёхсот","трёхст","четырехсот","четырехст","пятисот","пятист","шестисот","шестист","семисот","семист","восьмисот","восьмист","девятьсот","девятист","девятисот"];
const arrayNumValues4 = [100,100,100,200,200,300,300,400,400,500,500,600,600,700,700,800,800,900,900,900];
const arrayNumOrders5 = ["тысячн","миллионн","миллиардн","триллионн"];
const arrayNumValues5 = [1000,1000000,1000000000,1000000000000];

const arrayNumOrders = [].concat(arrayNumOrders1,arrayNumOrders3,arrayNumOrders4,arrayNumOrders5);
const arrayHashNumOrders = CreateArrayHashWords(arrayNumOrders);
const arrayNumOrderValues = [].concat(arrayNumValues1,arrayNumValues3,arrayNumValues4,arrayNumValues5 );

const arrayNumLevel10 = ["нол","один","одн","дв","тр","четыр","пят","шест","сем","восем","девят"];
const arrayNumValues10 = [0,1,1,2,3,4,5,6,7,8,9];
const arrayNumLevel20 = ["одиннадцат","двенадцат","тринадцат","четырнадцат","пятнадцат","шестьнадцат","семнадцат","восемнадцат","девятнадцат"];
const arrayNumValues20 = [11,12,13,14,15,16,17,18,19];
const arrayNumLevel21 = ["десят","двадцат","тридцат","сорок","пятьдесят","шестьдесят","семьдесят","восемьдесят","девяносто"];
const arrayNumValues21 = [10,20,30,40,50,60,70,80,90];
const arrayNumLevel22 = ["пар","нескольк","десятк","десяток","дюжин"];
const arrayNumValues22 = [2,2,10,10,20];
const arrayNumLevel30 = ["ст","сотн","сотен","двест","трист","четырест","пятьсот","шестьсот","семьсот","восемьсот","девятьсот"];
const arrayNumValues30 = [100,100,100,200,300,400,500,600,700,800,900,900];
const arrayNumLevel40 = ["тыщ","тысяч","миллион","миллиард","триллион"];
const arrayNumValues40 = [1000, 1000, 1000000, 1000000000, 1000000000000];

const arrayNumLevels = [].concat(arrayNumLevel10, arrayNumLevel20, arrayNumLevel21, arrayNumLevel30, arrayNumLevel40);
const arrayNumLevelValues = [].concat(arrayNumValues10, arrayNumValues20, arrayNumValues21, arrayNumValues30, arrayNumValues40);
const arrayHashNumLevels = CreateArrayHashWords(arrayNumLevels);



function ParseNumberWord(word) {
    if (! word)
        return NaN;

    let num = parseInt(word);
    if (! isNaN(num))    return num;

    //  удаляем две последние буквы, если они 'ог' (пятнадцат-ог-о)
    let twoLetter = word.substring(word.length - 2);
    if (twoLetter === 'ог') word = word.substring(0, word.length - 2);

    let hash = CalcHashWord1(word);
    let index;
    
    index = arrayHashNumOrders.indexOf(hash);
    if (index > -1)
        if (word === arrayNumOrders[index])
            return arrayNumOrderValues[index];
    
    index = arrayHashNumLevels.indexOf(hash);
    if (index > -1)
        if (word === arrayNumLevels[index])
            return arrayNumLevelValues[index];

    return NaN;
}

function IsNumericalWithRemoveEnd(word) {
    return IsNumerical(RemoveEnd(word));
}
function IsNumerical(word) {
    let num = parseInt(word);
    if (num === NaN)    return true;
    return IsNumberWord(word);
}
function IsNumberWord(word) {
    return IsWordInArray(word, arrayHashNumLevels, arrayNumLevels) || IsWordInArray(word, arrayHashNumOrders, arrayNumOrders);
}
module.exports.IsNumberWord = IsNumberWord;


function ParseNumbersSequence(arrayWords) {
    let i = 0;
    let arrayRet = [];
    if (arrayWords)
        while (i < arrayWords.length) {
            let obj = ParseFirstNumValue(arrayWords, i);
            if (obj.count > 0) {
                arrayRet.push(obj.value);
                i = i + obj.count;
            }
            else {
                arrayRet.push(arrayWords[i]);
                i = i + 1;
            }
        }
    return arrayRet;
}
module.exports.ParseNumbersSequence = ParseNumbersSequence;


function ParseFirstNumValue(arrayWords, indexStart) {
    let curValue = 0, predValue = NaN, value = 0, num = 0, i = 0;
    for (i = indexStart; i < arrayWords.length; i++) {
        let word = arrayWords[i];

        if (['триллион'].includes(word)) {
            if (num === 0)
                num = 1000000000000;
            else
                num = num * 1000000000000;
            
            value = value + num;
            predValue = num;
            num = 0;
        }
        else if (['миллиард'].includes(word)) {
            if (num === 0)
                num = 1000000000;
            else
                num = num * 1000000000;
            
            value = value + num;
            predValue = num;
            num = 0;
        }
        else if (['миллион'].includes(word)) {
            if (num === 0)
                num = 1000000;
            else
                num = num * 1000000;
            
            value = value + num;
            predValue = num;
            num = 0;
        }
        else if (['тысяч','тыщ'].includes(word)) {
            if (num === 0)
                num = 1000;
            else
                num = num * 1000;
            
            value = value + num;
            predValue = num;
            num = 0;
        }
        else {
            curValue = ParseNumberWord(word);

            //  Если оказался ноль. Это особый случай. 
            //  Его никуда не прибавляем, а оставляем отдельно. Он делит собой сиквенсию цифр.
            if (curValue === 0) {
                if (num === 0)
                    return { count: (i - indexStart + 1), value: 0 };
                else
                    return { count: (i - indexStart), value: num };
            }


            let flag = false;
            
            if (isNaN(curValue))
                flag = true;
            else {
                if (isNaN(predValue) || (CheckDegree(predValue) > CheckDegree(curValue))                      
                    && (Math.floor(predValue/10)*10 === predValue)) {                            
                        num = num + curValue;
                        predValue = curValue;
                }
                else
                    flag = true;                
            }
            if (flag) break;
        }
    }
    return { count: (i-indexStart), value: num };
}

//  проверяем, что число является с нулями на конце. иначе его не следует прибавлять к правстоящему
function CheckDegree(num) {
    let value = num;
    
    while (value > 9)
        value = Math.floor(value/10);

    let degree = GetDegree(num) - 1;
    for (let i = 0; i < degree; i++)
        value = value * 10;
    
    let value1 = value;
    let value2 = value * 10 - 1;
    if ((value1 <= num) && (num <= value2))
        return degree;

    return 0;
}

//  находим порядок числа
function GetDegree(num) {
    if (num < 10)   return 1;
    if (num < 100)   return 2;
    if (num < 1000)   return 3;
    if (num < 10000)   return 4;
    if (num < 100000)   return 5;
    if (num < 1000000)   return 6;
    if (num < 10000000)   return 7;
    if (num < 100000000)   return 8;
    if (num < 10000000000)   return 9;
    if (num < 100000000000)   return 10;
    if (num < 1000000000000)   return 11;
    if (num < 10000000000000)   return 12;
    if (num < 100000000000000)   return 13;
    if (num < 1000000000000000)   return 14;
    if (num < 10000000000000000)   return 15;
    return 0;
}


