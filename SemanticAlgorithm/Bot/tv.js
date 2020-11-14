
const { CalcHashWord1, CalcHashWord2 } = require("../libs/hash");
const { RemoveEnd } = require("../Utils/strings");
const { LOG } = require("../Utils/any");


const arrayWordTVs = [
    ["wink"],
    ["винк"],
    ["экран"],
    ["смарт"],
    ["тв"],
    ["теле"],
    ["телевизор"],
    ["тиви"],
    ["мультискрин"],
    ["tv"],
    ["iptv"],
];

let arrayHash1TVs = [];
let arrayHash2TVs = [];


function CreateArrayHashWordTVs() {

    for (let i = 0; i < arrayWordTVs.length; i++) {
        arrayHash1TVs.push([]);
        arrayHash2TVs.push([]);
        for (let j = 0; j < arrayWordTVs[i].length; j++) {
            //let word = RemoveEnd(arrayWordTVs[i][j]);
            let word = arrayWordTVs[i][j];
            let hash1 = CalcHashWord1(word);
            arrayHash1TVs[i].push(hash1);
            let hash2 = CalcHashWord2(word);
            arrayHash2TVs[i].push(hash2);
        }
    }
}


function CheckHaveTVWords(arrayTokens, index) {

    for (let i = 0; i < arrayHash1TVs.length; i++) {

        let flagIsHavePhrase = false;
        let ind;

        for (let j = 0; j < arrayHash1TVs[i].length; j++) {

            ind = index + j;

            if (ind < arrayTokens.length) {

                let token = arrayTokens[ind];

                if ((token.short.length > 1) &&
                    (token.hash1 === arrayHash1TVs[i][j]) &&
                    (token.hash2 === arrayHash2TVs[i][j])) {
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

            let ind = index + arrayHash1TVs[i].length + 1;
            if (ind < arrayTokens.length)
                if (arrayTokens[ind].typePOS === 100)
                    arrayTokens[ind].isHave = true;
            
            for (let j = 0; j < arrayHash1TVs[i].length; j++)
                if ((index + j) < arrayTokens.length)
                    arrayTokens[index + j].isHave = true;
        }

        flagIsHavePhrase = false;
    }
}


function MarkTVTokens(arrayTokens) {

    for (let i = 0; i < arrayTokens.length; i++)
        CheckHaveTVWords(arrayTokens, i);

    return arrayTokens;
}


function CalcCountTVTokens(arrayTokens) {

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


function GetCountTVTokens(arrayTokens) {

    CreateArrayHashWordTVs();
    SetNotHave(arrayTokens);

    arrayTokens = MarkTVTokens(arrayTokens);
    let count = CalcCountTVTokens(arrayTokens);
    return count;
}
module.exports.GetCountTVTokens = GetCountTVTokens;

