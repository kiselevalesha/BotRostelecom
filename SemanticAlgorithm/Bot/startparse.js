
const { LOG } = require("../Utils/any");
const { DeleteAllHelloTokens } = require("./hello");
const { DeleteAllPleaseTokens } = require("./please");

const { GetCountInternetTokens } = require("./internet");
const { GetCountTVTokens } = require("./tv");
const { GetCountMobileTokens } = require("./mobile");
const { GetCountDomoPhoneTokens } = require("./domophone");
const { GetCountHomePhoneTokens } = require("./homephone");

const { GetQuestionWords, ProbabilityTheme } = require("./questions");
const { ProbabilityProblem } = require("./problems");


function StartParseReplic(arrayTokens) {
    //LOG(arrayTokens)

    arrayTokens = DeleteAllHelloTokens(arrayTokens);
    //LOG("ffff")
    //LOG(arrayTokens)
    arrayTokens = DeleteAllPleaseTokens(arrayTokens);



    let requestTheme = ProbabilityTheme(arrayTokens);
    LOG(requestTheme)

    let requestSection = GetProbabilitySection(arrayTokens);
    LOG(requestSection)

    let requestProblem = ProbabilityProblem(arrayTokens);
    LOG(requestProblem)

   

    return arrayTokens;  
}
module.exports.StartParseReplic = StartParseReplic;



function GetProbabilitySection(arrayTokens) {

    let countInternetWords = GetCountInternetTokens(arrayTokens);
    //LOG("countInternetWords="+countInternetWords)

    let countTVWords = GetCountTVTokens(arrayTokens);
    //LOG("countTVWords="+countTVWords)

    let countMobileWords = GetCountMobileTokens(arrayTokens);
    //LOG("countMobileWords="+countMobileWords)

    let countDomoPhoneWords = GetCountDomoPhoneTokens(arrayTokens);
    //LOG("countDomoPhoneWords="+countDomoPhoneWords)

    let countHomePhoneWords = GetCountHomePhoneTokens(arrayTokens);
    //LOG("countHomePhoneWords="+countHomePhoneWords)


    let arrayAll = [];
    arrayAll.push(countInternetWords);
    arrayAll.push(countTVWords);
    arrayAll.push(countMobileWords);
    arrayAll.push(countDomoPhoneWords);
    arrayAll.push(countHomePhoneWords);

    let index = -1;
    let max = -1;
    for (let i = 0; i < arrayAll.length; i++)
        if (max < arrayAll[i]) {
            index = i;
            max = arrayAll[i];
        }

    let section = '';
    switch(index) {
        case 0:
            section = 'Интернет';
            break;
        case 1:
            section = 'ТВ';
            break;
        case 2:
            section = 'Мобильная связь';
            break;
        case 3:
            section = 'Видеонаблюдение';
            break;
        case 4:
            section = 'Домашний телефон';
            break;
    }
    return { section: section };
}

