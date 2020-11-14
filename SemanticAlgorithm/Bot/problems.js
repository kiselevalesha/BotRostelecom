
const { CalcHashWord1, CalcHashWord2 } = require("../libs/hash");
const { RemoveEnd } = require("../Utils/strings");
const { LOG } = require("../Utils/any");


const arrayWordProblems = [
    ["проблем"],
    ["не", "работает"],
    ["не", "включаетс"],
    ["не", "показывает"],
    ["не", "подключаетс"],
    ["не", "играет"],
    ["нет", "связ"],
    ["авар"],
    ["поломк"],
    ["засад"],
    ["катастроф"],
    ["глюк"],
];

let arrayHash1Problems = [];
let arrayHash2Problems = [];


function CreateArrayHashWordProblems() {

    for (let i = 0; i < arrayWordProblems.length; i++) {
        arrayHash1Problems.push([]);
        arrayHash2Problems.push([]);
        for (let j = 0; j < arrayWordProblems[i].length; j++) {
            //let word = RemoveEnd(arrayWordProblems[i][j]);
            let word = arrayWordProblems[i][j];
            let hash1 = CalcHashWord1(word);
            arrayHash1Problems[i].push(hash1);
            let hash2 = CalcHashWord2(word);
            arrayHash2Problems[i].push(hash2);
        }
    }
}


function CheckHaveProblemWords(arrayTokens, index) {

    for (let i = 0; i < arrayHash1Problems.length; i++) {

        let flagIsHavePhrase = false;
        let ind;

        for (let j = 0; j < arrayHash1Problems[i].length; j++) {

            ind = index + j;

            if (ind < arrayTokens.length) {

                let token = arrayTokens[ind];

                if ((token.hash1 === arrayHash1Problems[i][j]) &&
                    (token.hash2 === arrayHash2Problems[i][j])) {
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

            let ind = index + arrayHash1Problems[i].length + 1;
            if (ind < arrayTokens.length)
                if (arrayTokens[ind].typePOS === 100)
                    arrayTokens[ind].isHave = true;
            
            for (let j = 0; j < arrayHash1Problems[i].length; j++)
                if ((index + j) < arrayTokens.length)
                    arrayTokens[index + j].isHave = true;
        }

        flagIsHavePhrase = false;
    }
}


function MarkProblemTokens(arrayTokens) {

    for (let i = 0; i < arrayTokens.length; i++)
        CheckHaveProblemWords(arrayTokens, i);

    return arrayTokens;
}


function GetProblems(arrayTokens) {

    let arrayProblems = [];

    for (let i = 0; i < arrayTokens.length; i++)
        if (arrayTokens[i].isHave)
            arrayProblems.push(arrayTokens[i].full);

    return arrayProblems;
}


function GetProblemWords(arrayTokens) {

    CreateArrayHashWordProblems();

    arrayTokens = MarkProblemTokens(arrayTokens);
    let arrayProblems = GetProblems(arrayTokens);
    return (arrayProblems.length > 0);
}
//module.exports.GetProblemWords = GetProblemWords;


function ProbabilityProblem(arrayTokens) {
    let flag = GetProblemWords(arrayTokens);
    let problem = '';
    if (flag)
        problem = 'проблема';
    return { problem: problem };
}
module.exports.ProbabilityProblem = ProbabilityProblem;


