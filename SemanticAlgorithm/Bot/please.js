
const { CalcHashWord1, CalcHashWord2 } = require("../libs/hash");
const { RemoveEnd } = require("../Utils/strings");
const { LOG } = require("../Utils/any");


const arrayWordPleases = [
    ["пожалуйста"],
    ["пожалуста"],
    ["пжлста"],
    ["плиз"],
    ["ну","пожалуйста"]
];

let arrayHash1Pleases = [];
let arrayHash2Pleases = [];


function CreateArrayHashWordPleases() {

    for (let i = 0; i < arrayWordPleases.length; i++) {
        arrayHash1Pleases.push([]);
        arrayHash2Pleases.push([]);
        for (let j = 0; j < arrayWordPleases[i].length; j++) {
            let word = RemoveEnd(arrayWordPleases[i][j]);
            let hash1 = CalcHashWord1(word);
            arrayHash1Pleases[i].push(hash1);
            let hash2 = CalcHashWord2(word);
            arrayHash2Pleases[i].push(hash2);
        }
    }
}


function CheckHavePleaseWords(arrayTokens, index) {

    for (let i = 0; i < arrayHash1Pleases.length; i++) {

        let flagIsHavePhrase = false;
        let ind;

        for (let j = 0; j < arrayHash1Pleases[i].length; j++) {

            ind = index + j;

            if (ind < arrayTokens.length) {

                let token = arrayTokens[ind];

                if ((token.hash1 === arrayHash1Pleases[i][j]) &&
                    (token.hash2 === arrayHash2Pleases[i][j])) {
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

            let ind = index + arrayHash1Pleases[i].length + 1;
            if (ind < arrayTokens.length)
                if (arrayTokens[ind].typePOS === 100)
                    arrayTokens[ind].isDelete = true;
            
            for (let j = 0; j < arrayHash1Pleases[i].length; j++)
                if ((index + j) < arrayTokens.length)
                    arrayTokens[index + j].isDelete = true;
        }

        flagIsHavePhrase = false;
    }
}


function MarkPleaseTokens(arrayTokens) {

    for (let i = 0; i < arrayTokens.length; i++)
        CheckHavePleaseWords(arrayTokens, i);

    return arrayTokens;
}


function DeletePleaseTokens(arrayTokens) {

    let arrayNewTokens = [];

    for (let i = 0; i < arrayTokens.length; i++)
        if (! arrayTokens[i].isDelete)
            arrayNewTokens.push(arrayTokens[i]);

    return arrayNewTokens;
}


function DeleteAllPleaseTokens(arrayTokens) {

    CreateArrayHashWordPleases();

    arrayTokens = MarkPleaseTokens(arrayTokens);
    let arrayNewTokens = DeletePleaseTokens(arrayTokens);
    return arrayNewTokens;
}
module.exports.DeleteAllPleaseTokens = DeleteAllPleaseTokens;

