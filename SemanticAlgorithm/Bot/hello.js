
const { CalcHashWord1, CalcHashWord2 } = require("../libs/hash");
const { RemoveEnd } = require("../Utils/strings");
const { LOG } = require("../Utils/any");


const arrayWordHellos = [
    ["привет"],
    ["приветик"],
    ["приветствую"],
    ["здравствуй"],
    ["здравствуйте"],
    ["хелло"],
    ["салют"],
    ["добрый","день"],
    ["доброе","утро"],
    ["добрый","вечер"],
    ["доброй","ночи"]
];

let arrayHash1Hellos = [];
let arrayHash2Hellos = [];


function CreateArrayHashWordHellos() {

    for (let i = 0; i < arrayWordHellos.length; i++) {
        arrayHash1Hellos.push([]);
        arrayHash2Hellos.push([]);
        for (let j = 0; j < arrayWordHellos[i].length; j++) {
            let word = RemoveEnd(arrayWordHellos[i][j]);
            let hash1 = CalcHashWord1(word);
            arrayHash1Hellos[i].push(hash1);
            let hash2 = CalcHashWord2(word);
            arrayHash2Hellos[i].push(hash2);
        }
    }
}


function CheckHaveHelloWords(arrayTokens, index) {

    for (let i = 0; i < arrayHash1Hellos.length; i++) {

        let flagIsHavePhrase = false;
        let ind;

        for (let j = 0; j < arrayHash1Hellos[i].length; j++) {

            ind = index + j;

            if (ind < arrayTokens.length) {

                let token = arrayTokens[ind];

                if ((token.hash1 === arrayHash1Hellos[i][j]) &&
                    (token.hash2 === arrayHash2Hellos[i][j])) {
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

            let ind = index + arrayHash1Hellos[i].length + 1;
            if (ind < arrayTokens.length)
                if (arrayTokens[ind].typePOS === 100)
                    arrayTokens[ind].isDelete = true;
            
            for (let j = 0; j < arrayHash1Hellos[i].length; j++)
                if ((index + j) < arrayTokens.length)
                    arrayTokens[index + j].isDelete = true;
        }

        flagIsHavePhrase = false;
    }
}


function MarkHelloTokens(arrayTokens) {

    for (let i = 0; i < arrayTokens.length; i++)
        CheckHaveHelloWords(arrayTokens, i);

    return arrayTokens;
}


function DeleteHelloTokens(arrayTokens) {

    let arrayNewTokens = [];

    for (let i = 0; i < arrayTokens.length; i++)
        if (! arrayTokens[i].isDelete)
            arrayNewTokens.push(arrayTokens[i]);

    return arrayNewTokens;
}


function SetNotDelete(arrayTokens) {
    for (let i = 0; i < arrayTokens.length; i++)
        arrayTokens[i].isDelete = false;
}

function DeleteAllHelloTokens(arrayTokens) {

    //LOG(arrayTokens)

    CreateArrayHashWordHellos();
    SetNotDelete(arrayTokens);

    //LOG(arrayTokens)

    arrayTokens = MarkHelloTokens(arrayTokens);
    let arrayNewTokens = DeleteHelloTokens(arrayTokens);
    return arrayNewTokens;
}
module.exports.DeleteAllHelloTokens = DeleteAllHelloTokens;

