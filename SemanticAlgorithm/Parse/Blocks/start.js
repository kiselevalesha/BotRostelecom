
const { ParseNumbersSequence } = require("./Numbers/parseNumbers");
const { emitter, SendEvent } = require("./../../libs/events");
const { LOG, MoveToLeftTokens, MoveToRightTokens, RemoveNullBlocks } = require("./../../Utils/any");
const { TypeSemanticsNumeral, ParseTimes, ParseDates, ParseName, ParseCurrency, ParseNumber, TypeSemanticsNoun } = require("./../const");
const { StartSearchWords } = require("../Search/searchwords");
const { StartSearchBundles } = require("../Search/searchbundles");
const { ParseFIOs, ConcatFIOs } = require("./FIO/fio");
const { DoParseCurrency, DoJoinCurrencies } = require("./Currency/parser");
const { DoParseTimes } = require("./Times/parser");
const { DoParseDates } = require("./Dates/parser");
const { SearchGoodBadCurrencies } = require("./Currency/searchgoodbad");
const { CalcHashWord1, CalcHashWord2 } = require("../../libs/hash");
const { IsHour } = require("./Times/searchtimes");
const { ParseDateFormat } = require("./Dates/format");
const { ParseTimeFormat } = require("./Times/format");


let arrayTokens = [];
let arrayTypeParsers = [];

let eventOnParentError = '';
let eventReturnToParent = '';

const eventOnError = 'ErrorParseBlocks';
emitter.on(eventOnError, function(err) {
    //LOG(err);
    SendEvent(err, null, eventOnParentError);
});

const eventEndSearchBundle = 'EndSearchBundle';
emitter.on(eventEndSearchBundle, function(data) {
    let arrayBlocks = data;

    //  Проходимся по полученным блокам выявителем Bundles
    //  Если указан какой-то Bundle-элемент, то сразу запускаем его функцию-определитель
    arrayBlocks = ParseAllBundles(arrayBlocks);
    
    SendEvent(null, arrayBlocks, eventReturnToParent);
});

function ParseAllBundles(arrayBlocks) {

    //  Сначала определяем все найденные Bundles
    for (let i = 0; i < arrayBlocks.length; i++)
        if (arrayBlocks[i].type)
            AddTypeParser(arrayBlocks[i].type);

    //  Затем все их обрабатываем
    if (arrayTypeParsers.length > 0)
        for (let i = 0; i < arrayTypeParsers.length; i++)
            switch (arrayTypeParsers[i]) {            
                case ParseCurrency:
                    arrayBlocks = DoParseCurrency(arrayBlocks);
                    arrayBlocks = DoJoinCurrencies(arrayBlocks);
                    arrayBlocks = SearchGoodBadCurrencies(arrayBlocks, ParseCurrency);
                    break;
                case ParseTimes:
                    //arrayBlocks = DoParseTimes(arrayBlocks);
                    //break;
                case ParseDates:
                    arrayBlocks = DoParseDates(arrayBlocks);
                    break;
            }
    else {
        //arrayBlocks = DoParseTimes(arrayBlocks);
        arrayBlocks = DoParseDates(arrayBlocks);
    }
    return arrayBlocks;
}

function AddTypeParser(type) {
    for (let i = 0; i< arrayTypeParsers; i++)
        if (arrayTypeParsers[i] === type)
            return;

    arrayTypeParsers.push(type);
}


const eventEndSearchNames = 'EndSearchNames';
emitter.on(eventEndSearchNames, function(data) {

    //LOG(data)
    let arrayBlocks = data;

    //  Сразу проходимся выявителем ФИО, который помечает найденные ФИО
    arrayBlocks = ParseFIOs(arrayBlocks);

    //  Сливаем найденные блоки ФИО в один блок. По всем найденным ФИО.
    arrayBlocks = ConcatFIOs(arrayBlocks);


    //  находим даты, написанные числами 28.03.1977 или 2020.02.23
    arrayBlocks = ParseDateFormat(arrayBlocks);
    //  находим время, написанное числами 14:30 или 11:35:24
    arrayBlocks = ParseTimeFormat(arrayBlocks);


    //  Запускаем поиск в блоках Bundle-элементов
    StartSearchBundles(arrayBlocks, eventEndSearchBundle, eventOnError);
});

function DoParseBlocks() {

    //  Делаем из объектов Токенов объекты Блоки (включая в них токены)
    let arrayBlocks = MakeBlocksFromTokens(arrayTokens);
    //LOG(arrayBlocks)

    //  Соединяем одинаковые блоки в один
    arrayBlocks = JoinBlocks(arrayBlocks);

    //  Присоединяем к правостоящему блоку частицу НЕ, отмечая, что он отрицание
    arrayBlocks = JoinNe(arrayBlocks);

    //  Присоединяем левостоящее прилагательное к существительному справа
    ///arrayBlocks = JoinByType(arrayBlocks, TypeSemanticsAdjective, TypeSemanticsNoun);;

    //  Присоединяем левостоящее наречие к глаголу справа
    ///arrayBlocks = JoinByType(arrayBlocks, TypeSemanticsAdVerb, TypeSemanticsVerb);

    //  Присоединяем левостоящий глагол к существительному справа
    //arrayBlocks = JoinByType(arrayBlocks, TypeSemanticsVerb, TypeSemanticsNoun);

    //  Ищем числовые блоки
    SearchNumberBlocks(arrayBlocks);

    //  Запускаем поиск Имён в db
    StartSearchWords(arrayBlocks, 'hashNames', 'strRoot', ParseName,
                        eventEndSearchNames, eventOnError);
}

function SearchNumberBlocks(arrayBlocks) {
    for (let i = 0; i < arrayBlocks.length; i++)
        if (arrayBlocks[i].typePOS === TypeSemanticsNumeral) {
            let arrayWords = [];
            for (let j = 0; j < arrayBlocks[i].tokens.length; j++)
                if (arrayBlocks[i].tokens[j].isDigit)
                    arrayWords.push(arrayBlocks[i].tokens[j].short);
                else
                    arrayWords.push(arrayBlocks[i].tokens[j].value);

            arrayBlocks[i].result = ParseNumbersSequence(arrayWords);
        }    
}

//  Переводим токены в блоки. Каждый токен в свой блок.
function MakeBlocksFromTokens(arrayTokens) {
    let arrayBlocks = [];
    for (let i = 0; i < arrayTokens.length; i++) {
        let objBlock = {};
        objBlock.tokens = [];
        objBlock.tokens.push(arrayTokens[i]);
        objBlock.typePOS = arrayTokens[i].typePOS;
        objBlock.type = 0;
        objBlock.isUsed = false;
        arrayBlocks.push(objBlock);
    }
    return arrayBlocks;
}

//  Однотипные блоки сольём в один.
function JoinBlocks(arrayBlocks) {
    let idTypePrevious = 0;
    let iCurrentBlock = 0;

    //  Переносим однотипные токены в один блок
    for (let i = 0; i < arrayBlocks.length; i++) {
        for (let j = 0; j < arrayBlocks[i].tokens.length; j++) {
            if (idTypePrevious === arrayBlocks[i].tokens[j].typePOS) {
                if (iCurrentBlock !== i) {
                    //  С найденными числами особая проверка
                    if (arrayBlocks[i].tokens[j].typePOS === TypeSemanticsNumeral) {
                        
                        //  Проверка, что число это слово, оканчивающееся на -ого,-его,-ему
                        //  или если это словесное выражение - пара, несколько, дюжина
                        let word = arrayBlocks[i].tokens[j].full;
                        if ((IsHour(word)) || (! arrayBlocks[i].tokens[j].isDigit)) {
                            iCurrentBlock = i;
                            idTypePrevious = 0;
                        }
                    }
                    //  Найденные существительные не сливаем
                    else if (arrayBlocks[i].tokens[j].typePOS === TypeSemanticsNoun) {
                        iCurrentBlock = i;
                        idTypePrevious = 0;
                    }
                    else {
                        arrayBlocks[iCurrentBlock].tokens = MoveToRightTokens(arrayBlocks[iCurrentBlock].tokens, arrayBlocks[i].tokens);
                        arrayBlocks[i].tokens = [];    //  помечаем как пустое, чтобы потом удалить
                    }
                }
            }
            else {
                idTypePrevious = arrayBlocks[i].tokens[j].typePOS;
                iCurrentBlock = i;
            }
        }
    }
    return RemoveNullBlocks(arrayBlocks);
}

//  Ищем частицу НЕ и сливаем её со следующим токеном справа
function JoinNe(arrayBlocks) {
    let wordNe = 'не';
    let hashNe1 = CalcHashWord1(wordNe);
    let hashNe2 = CalcHashWord2(wordNe);

    for (let i = 0; i < arrayBlocks.length; i++)
        if (arrayBlocks[i].tokens.length === 1)
            for (let j = 0; j < 1; j++)
                if (arrayBlocks[i].tokens[j].hash1 === hashNe1)
                    if (arrayBlocks[i].tokens[j].hash2 === hashNe2)
                        if (arrayBlocks[i].tokens[j].short === wordNe) {
                            let iNext = i + 1;
                            if (iNext < arrayBlocks.length) {                            
                                arrayBlocks[iNext].tokens = MoveToLeftTokens(arrayBlocks[iNext].tokens, arrayBlocks[i].tokens);
                                arrayBlocks[iNext].not = 1;
                                arrayBlocks[i].tokens = [];
                                continue;
                            }
                        }
    return RemoveNullBlocks(arrayBlocks);
}

function JoinByType(arrayBlocks, typeSlave, typeMaster) {
    for (let i = 0; i < arrayBlocks.length; i++)
        if (arrayBlocks[i].type === typeSlave) {
            let iNext = i + 1;
            if (iNext < arrayBlocks.length)
                if (arrayBlocks[iNext].type === typeMaster) {
                    if (! arrayBlocks[iNext].features)
                        arrayBlocks[iNext].features = {};
                    if (! arrayBlocks[iNext].features.enum)
                        arrayBlocks[iNext].features.enum = [];

                    arrayBlocks[iNext].features.enum = MoveToLeftTokens(arrayBlocks[iNext].features.enum, arrayBlocks[i].tokens);
                    arrayBlocks[i].tokens = [];
                    continue;
                }
        }
    return RemoveNullBlocks(arrayBlocks);
}


function StartParseBlocks(_arrayTokens, _eventReturnToParent, _eventOnParentError) {

    arrayTokens = _arrayTokens;
    arrayTypeParsers = [];

    eventReturnToParent = _eventReturnToParent;
    eventOnParentError = _eventOnParentError;

    DoParseBlocks();
}
module.exports.StartParseBlocks = StartParseBlocks;
