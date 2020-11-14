
const { CalcHashWord1, CalcHashWord2 } = require("../libs/hash");
const { RemoveEnd } = require("../Utils/strings");
const { LOG } = require("../Utils/any");


const arrayWordInternets = [
    ["интернет"],
    ["инет"],
    ["онлайн"],
    ["браузер"],
    ["сайт"],
    ["модема"],
];

let arrayHash1Internets = [];
let arrayHash2Internets = [];


function CreateArrayHashWordInternets() {

    for (let i = 0; i < arrayWordInternets.length; i++) {
        arrayHash1Internets.push([]);
        arrayHash2Internets.push([]);
        for (let j = 0; j < arrayWordInternets[i].length; j++) {
            let word = RemoveEnd(arrayWordInternets[i][j]);
            //LOG(word)
            let hash1 = CalcHashWord1(word);
            arrayHash1Internets[i].push(hash1);
            let hash2 = CalcHashWord2(word);
            arrayHash2Internets[i].push(hash2);
        }
    }
}


function CheckHaveInternetWords(arrayTokens, index) {

    for (let i = 0; i < arrayHash1Internets.length; i++) {

        let flagIsHavePhrase = false;
        let ind;

        for (let j = 0; j < arrayHash1Internets[i].length; j++) {

            ind = index + j;

            if (ind < arrayTokens.length) {

                let token = arrayTokens[ind];

                if ((token.short.length > 2) &&
                    (token.hash1 === arrayHash1Internets[i][j]) &&
                    (token.hash2 === arrayHash2Internets[i][j])) {
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

            let ind = index + arrayHash1Internets[i].length + 1;
            if (ind < arrayTokens.length)
                if (arrayTokens[ind].typePOS === 100)
                    arrayTokens[ind].isHave = true;
            
            for (let j = 0; j < arrayHash1Internets[i].length; j++)
                if ((index + j) < arrayTokens.length)
                    arrayTokens[index + j].isHave = true;
        }

        flagIsHavePhrase = false;
    }
}


function MarkInternetTokens(arrayTokens) {

    for (let i = 0; i < arrayTokens.length; i++)
        CheckHaveInternetWords(arrayTokens, i);

    return arrayTokens;
}


function CalcCountInternetTokens(arrayTokens) {

    let count = 0;

    for (let i = 0; i < arrayTokens.length; i++)
        if (arrayTokens[i].isHave)
            count++;

    return count;
}

function SetNotHave(arrayTokens) {
    for (let i = 0; i < arrayTokens.length; i++)
        arrayTokens[i].isHave = false;
}


function GetCountInternetTokens(arrayTokens) {

    CreateArrayHashWordInternets();
    SetNotHave(arrayTokens);

    arrayTokens = MarkInternetTokens(arrayTokens);
    let count = CalcCountInternetTokens(arrayTokens);
    return count;
}
module.exports.GetCountInternetTokens = GetCountInternetTokens;

