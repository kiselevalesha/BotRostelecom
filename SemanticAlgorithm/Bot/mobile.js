
const { CalcHashWord1, CalcHashWord2 } = require("../libs/hash");
const { RemoveEnd } = require("../Utils/strings");
const { LOG } = require("../Utils/any");


const arrayWordMobiles = [
    ["связь"],
    ["мобильная", "связь"],
    ["мобила"],
    ["мобильный"],
    ["мобильный", "телефон"],
    ["сим"],
    ["симкарта"],
    ["симка"],
    ["сим", "карта"],
    ["минут"],
    ["остаток", "минут"],
    ["смс"],
    ["гб"],
    ["мтс"],
    ["билайн"],
    ["мегафон"],
    ["теле2"],
];

let arrayHash1Mobiles = [];
let arrayHash2Mobiles = [];


function CreateArrayHashWordMobiles() {

    for (let i = 0; i < arrayWordMobiles.length; i++) {
        arrayHash1Mobiles.push([]);
        arrayHash2Mobiles.push([]);
        for (let j = 0; j < arrayWordMobiles[i].length; j++) {
            let word = RemoveEnd(arrayWordMobiles[i][j]);
            let hash1 = CalcHashWord1(word);
            arrayHash1Mobiles[i].push(hash1);
            let hash2 = CalcHashWord2(word);
            arrayHash2Mobiles[i].push(hash2);
        }
    }
}


function CheckHaveMobileWords(arrayTokens, index) {

    for (let i = 0; i < arrayHash1Mobiles.length; i++) {

        let flagIsHavePhrase = false;
        let ind;

        for (let j = 0; j < arrayHash1Mobiles[i].length; j++) {

            ind = index + j;

            if (ind < arrayTokens.length) {

                let token = arrayTokens[ind];

                if ((token.short.length > 2) &&
                    (token.hash1 === arrayHash1Mobiles[i][j]) &&
                    (token.hash2 === arrayHash2Mobiles[i][j])) {
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

            let ind = index + arrayHash1Mobiles[i].length + 1;
            if (ind < arrayTokens.length)
                if (arrayTokens[ind].typePOS === 100)
                    arrayTokens[ind].isHave = true;
            
            for (let j = 0; j < arrayHash1Mobiles[i].length; j++)
                if ((index + j) < arrayTokens.length) {
                    arrayTokens[index + j].isHave = true;
                }
                    
        }

        flagIsHavePhrase = false;
    }
}


function MarkMobileTokens(arrayTokens) {

    for (let i = 0; i < arrayTokens.length; i++)
        CheckHaveMobileWords(arrayTokens, i);

    return arrayTokens;
}


function CalcCountMobileTokens(arrayTokens) {

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


function GetCountMobileTokens(arrayTokens) {

    CreateArrayHashWordMobiles();
    SetNotHave(arrayTokens);

    arrayTokens = MarkMobileTokens(arrayTokens);
    let count = CalcCountMobileTokens(arrayTokens);
    return count;
}
module.exports.GetCountMobileTokens = GetCountMobileTokens;

