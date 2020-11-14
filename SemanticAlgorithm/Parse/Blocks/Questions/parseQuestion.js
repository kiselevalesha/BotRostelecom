
const { CreateArrayHashWords } = require("../../../Utils/hash");
//const { CalcHashWord1 } = require("../../../libs/hash");
const { LOG } = require("../../../Utils/any");
const { MakeRightSequenceTokens } = require("./../searchphrase");

const { questions } = require("./../../../LoadDB/bundles/miniwords");
const arrayEmptyPretexts = ["ну","а","да","вот","э","ты","-","ка","блин"];
const arrayEmptyVerbs = ["скаж;","подскаж","ответ","намекн","расскаж"];

const arrayHashQuestions = CreateArrayHashWords(questions);
const arrayHashEmptyPretexts = CreateArrayHashWords(arrayEmptyPretexts);
const arrayHashEmptyVerbs = CreateArrayHashWords(arrayEmptyVerbs);


function ParseQuestion(arrayBlocks) {

    let iMainBlock = -1;
    let iStart = -1;
    let iEnd = -1;

    let arrayTokens = MakeRightSequenceTokens(arrayBlocks, -1);
    for (let i = 0; i < arrayTokens.length; i++)
        if (! arrayTokens[i].isUsed)
            //if (arrayTokens[i].hash1 === hash)
                //if (arrayTokens[i].full === hash)
                    if (arrayHashQuestions.indexOf(arrayTokens[i].hash1) > -1) {

                    iMainBlock = i;
                    arrayBlocks[arrayTokens[iStart].iBlock].question = arrayTokens[i].hafull;

                    for (let j = i; j > -1; j--) {
                        if ((arrayHashEmptyPretexts.indexOf(arrayTokens[j].hash1) > -1) ||
                            (arrayHashEmptyVerbs.indexOf(arrayTokens[j].hash1)) > -1) {
                            if (iEnd === -1)
                                iEnd = j;                            
                            iStart = j;
                            continue;
                        }
                        break;
                    }

                    break;
                }

    //  Если нашли какие-то слова, помимо вопроса, то сливаем их в один блок.
    if (iMainBlock > -1) {
        if (iStart === -1)
            iStart = iMainBlock;

        let iStartBlock = arrayBlocks[iStart].iBlock;
        let iStartToken = arrayBlocks[iStart].iToken;
        
        arrayBlocks = MoveTokensToLeftBlock(arrayBlocks, iMainBlock, iStartBlock, iStartToken);
    }
    

    return { arrayBlocks, isQuestion: (iMainBlock > -1) };
}
module.exports.ParseQuestion = ParseQuestion;
