
const { CalcHashWord1, CalcHashWord2 } = require("../libs/hash");
const { RemoveEnd } = require("../Utils/strings");
const { LOG } = require("../Utils/any");


const arrayWordHomePhones = [
    ["телефон"],
    ["гудки"],
    ["нету", "гудков"],
    ["домашний", "телефон"],
    ["стационарный"],
    ["стационарный", "телефон"],
    ["звонки"],
    ["звонок"],
    ["занято"],
];

let arrayHash1HomePhones = [];
let arrayHash2HomePhones = [];


function CreateArrayHashWordHomePhones() {

    for (let i = 0; i < arrayWordHomePhones.length; i++) {
        arrayHash1HomePhones.push([]);
        arrayHash2HomePhones.push([]);
        for (let j = 0; j < arrayWordHomePhones[i].length; j++) {
            let word = RemoveEnd(arrayWordHomePhones[i][j]);
            let hash1 = CalcHashWord1(word);
            arrayHash1HomePhones[i].push(hash1);
            let hash2 = CalcHashWord2(word);
            arrayHash2HomePhones[i].push(hash2);
        }
    }
}


function CheckHaveHomePhoneWords(arrayTokens, index) {

    for (let i = 0; i < arrayHash1HomePhones.length; i++) {

        let flagIsHavePhrase = false;
        let ind;

        for (let j = 0; j < arrayHash1HomePhones[i].length; j++) {

            ind = index + j;

            if (ind < arrayTokens.length) {

                let token = arrayTokens[ind];

                if ((token.short.length > 2) &&
                    (token.hash1 === arrayHash1HomePhones[i][j]) &&
                    (token.hash2 === arrayHash2HomePhones[i][j])) {
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

            let ind = index + arrayHash1HomePhones[i].length + 1;
            if (ind < arrayTokens.length)
                if (arrayTokens[ind].typePOS === 100)
                    arrayTokens[ind].isHave = true;
            
            for (let j = 0; j < arrayHash1HomePhones[i].length; j++)
                if ((index + j) < arrayTokens.length)
                    arrayTokens[index + j].isHave = true;
        }

        flagIsHavePhrase = false;
    }
}


function MarkHomePhoneTokens(arrayTokens) {

    for (let i = 0; i < arrayTokens.length; i++)
        CheckHaveHomePhoneWords(arrayTokens, i);

    return arrayTokens;
}


function CalcCountHomePhoneTokens(arrayTokens) {

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


function GetCountHomePhoneTokens(arrayTokens) {

    CreateArrayHashWordHomePhones();
    SetNotHave(arrayTokens);

    arrayTokens = MarkHomePhoneTokens(arrayTokens);
    let count = CalcCountHomePhoneTokens(arrayTokens);
    return count;
}
module.exports.GetCountHomePhoneTokens = GetCountHomePhoneTokens;

