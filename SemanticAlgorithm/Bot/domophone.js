
const { CalcHashWord1, CalcHashWord2 } = require("../libs/hash");
const { RemoveEnd } = require("../Utils/strings");
const { LOG } = require("../Utils/any");


const arrayWordDomoPhones = [
    ["домофон"],
    ["камера"],
    ["видеокамера"],
    ["умный", "домофон"],
    ["умный", "дом"],
    ["умного", "дома"],
    ["видео", "наблюдение"],
    ["видеонаблюдения"],
    ["наблюдение"],
    ["контролер"],
    ["контроллер"],
];

let arrayHash1DomoPhones = [];
let arrayHash2DomoPhones = [];


function CreateArrayHashWordDomoPhones() {

    for (let i = 0; i < arrayWordDomoPhones.length; i++) {
        arrayHash1DomoPhones.push([]);
        arrayHash2DomoPhones.push([]);
        for (let j = 0; j < arrayWordDomoPhones[i].length; j++) {
            let word = RemoveEnd(arrayWordDomoPhones[i][j]);
            let hash1 = CalcHashWord1(word);
            arrayHash1DomoPhones[i].push(hash1);
            let hash2 = CalcHashWord2(word);
            arrayHash2DomoPhones[i].push(hash2);
        }
    }
}


function CheckHaveDomoPhoneWords(arrayTokens, index) {

    for (let i = 0; i < arrayHash1DomoPhones.length; i++) {

        let flagIsHavePhrase = false;
        let ind;

        for (let j = 0; j < arrayHash1DomoPhones[i].length; j++) {

            ind = index + j;

            if (ind < arrayTokens.length) {

                let token = arrayTokens[ind];

                if ((token.short.length > 2) &&
                    (token.hash1 === arrayHash1DomoPhones[i][j]) &&
                    (token.hash2 === arrayHash2DomoPhones[i][j])) {
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

            let ind = index + arrayHash1DomoPhones[i].length + 1;
            if (ind < arrayTokens.length)
                if (arrayTokens[ind].typePOS === 100)
                    arrayTokens[ind].isHave = true;
            
            for (let j = 0; j < arrayHash1DomoPhones[i].length; j++)
                if ((index + j) < arrayTokens.length)
                    arrayTokens[index + j].isHave = true;
        }

        flagIsHavePhrase = false;
    }
}


function MarkDomoPhoneTokens(arrayTokens) {

    for (let i = 0; i < arrayTokens.length; i++)
        CheckHaveDomoPhoneWords(arrayTokens, i);

    return arrayTokens;
}


function CalcCountDomoPhoneTokens(arrayTokens) {

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


function GetCountDomoPhoneTokens(arrayTokens) {

    CreateArrayHashWordDomoPhones();
    SetNotHave(arrayTokens);

    arrayTokens = MarkDomoPhoneTokens(arrayTokens);
    let count = CalcCountDomoPhoneTokens(arrayTokens);
    return count;
}
module.exports.GetCountDomoPhoneTokens = GetCountDomoPhoneTokens;

