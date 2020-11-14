
const { CalcHashWord1, CalcHashWord2 } = require("../libs/hash");
const { RemoveEnd } = require("../Utils/strings");
const { LOG } = require("../Utils/any");


const arrayWordQuestions = [
    ["как"],
    ["где"],
    ["почему"],
    ["когда"],
    ["зачем"],
    ["кто"],
    ["сколько"],
];

let arrayHash1Questions = [];
let arrayHash2Questions = [];


function CreateArrayHashWordQuestions() {

    for (let i = 0; i < arrayWordQuestions.length; i++) {
        arrayHash1Questions.push([]);
        arrayHash2Questions.push([]);
        for (let j = 0; j < arrayWordQuestions[i].length; j++) {
            //let word = RemoveEnd(arrayWordQuestions[i][j]);
            let word = arrayWordQuestions[i][j];
            let hash1 = CalcHashWord1(word);
            arrayHash1Questions[i].push(hash1);
            let hash2 = CalcHashWord2(word);
            arrayHash2Questions[i].push(hash2);
        }
    }
}


function CheckHaveQuestionWords(arrayTokens, index) {

    for (let i = 0; i < arrayHash1Questions.length; i++) {

        let flagIsHavePhrase = false;
        let ind;

        for (let j = 0; j < arrayHash1Questions[i].length; j++) {

            ind = index + j;

            if (ind < arrayTokens.length) {

                let token = arrayTokens[ind];

                if ((token.hash1 === arrayHash1Questions[i][j]) &&
                    (token.hash2 === arrayHash2Questions[i][j])) {
                    flagIsHavePhrase = true;
                }                    
                else 
                    if (token.typePOS === 100)
                        flagIsHavePhrase = true;
                    else {
                        flagIsHavePhrase = false;
                        break;
                    }
            }
        }

        if (flagIsHavePhrase) {

            let ind = index + arrayHash1Questions[i].length + 1;
            if (ind < arrayTokens.length)
                if (arrayTokens[ind].typePOS === 100)
                    arrayTokens[ind].isHave = true;
            
            for (let j = 0; j < arrayHash1Questions[i].length; j++)
                if ((index + j) < arrayTokens.length)
                    arrayTokens[index + j].isHave = true;
        }

        flagIsHavePhrase = false;
    }
}


function MarkQuestionTokens(arrayTokens) {

    for (let i = 0; i < arrayTokens.length; i++)
        CheckHaveQuestionWords(arrayTokens, i);

    return arrayTokens;
}


function GetQuestions(arrayTokens) {

    let arrayQuestions = [];

    for (let i = 0; i < arrayTokens.length; i++)
        if (arrayTokens[i].isHave)
            arrayQuestions.push(arrayTokens[i].full);

    return arrayQuestions;
}


function GetQuestionWords(arrayTokens) {

    CreateArrayHashWordQuestions();

    arrayTokens = MarkQuestionTokens(arrayTokens);
    let arrayQuestions = GetQuestions(arrayTokens);
    return arrayQuestions;
}
module.exports.GetQuestionWords = GetQuestionWords;


function ProbabilityTheme(wordQuestion) {
    let request = '';
    switch(wordQuestion) {
        case 'сколько':
            request = 'Финансовый запрос';
            break;
        case 'как':
        case 'где':
            request = 'Запрос инструкции';
            break;
        case 'когда':
            request = 'Информационный запрос';
            break;
        case 'почему':
        case 'зачем':
        case 'кто':
            request = 'Жалоба';
            break;
    }
    return { request: request };
}
module.exports.ProbabilityTheme = ProbabilityTheme;


