
const { LOG } = require("./Utils/any");
const { SQLEnd } = require("./libs/sql");
const { emitter } = require("./libs/events");
const { StartParseBlockSentences } = require("./Parse/Blocks/sentences");
const { StartReadDataSet } = require("./Bot/readdataset");
const { StartParseLingvistic } = require("./Parse/Semantics/Parse/start");
const { SplitToReplics } = require("./Bot/replics");
const { StartParseReplic } = require("./Bot/startparse");


let arrayReplics = [];

const eventOnError = 'ErrorAppParse';
emitter.on(eventOnError, function(err) {
    LOG(err);
});

const eventEndAppParseLingvistic = 'EndAppParseLingvistic';
emitter.on(eventEndAppParseLingvistic, function(data) {
    //  Запускаем перевод токенов в блоки и анализ блоков.

    //LOG(data[0][0])
    //LOG(data[1])

    let arrayTokens = [];
    for (let i = 0; i < data.length; i++)
        for (let j = 0; j < data[i].length; j++)
            arrayTokens.push(data[i][j]);

    arrayTokens = StartParseReplic(arrayTokens );   //data[1]

    //LOG(arrayTokens)
    SQLEnd();
    LOG("END");

    //StartParseBlockSentences(data, eventEndAppParse, eventOnError);
});

const eventEndAppParse = 'EndAppParse';
emitter.on(eventEndAppParse, function(data) {

    let arrayBlocks = data[0].blocks;


    SQLEnd();
    LOG("END");
});

//  Запускаем перевод предложений в массивы токенов и парсинг их.
///const { StartParseLingvistic } = require("./Parse/Semantics/Parse/start");
///StartParseLingvistic(strText, eventEndAppParseLingvistic, eventOnError);




const eventEndReadDataset = 'EndReadDataset';
emitter.on(eventEndReadDataset, function(data) {

    arrayReplics = SplitToReplics(data);
    //LOG(arrayReplics.length)

    let index = getRandomInt(arrayReplics.length - 1);
    //index = 85;
    LOG("index=" + index)
    let replic = arrayReplics[index];
    LOG("\n" + replic);

    
    //  Запускаем перевод токенов в блоки и анализ блоков.    
    StartParseLingvistic(replic, eventEndAppParseLingvistic, eventOnError);

});

StartReadDataSet("./Temp/dataset.txt", eventEndReadDataset, eventOnError);





function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
