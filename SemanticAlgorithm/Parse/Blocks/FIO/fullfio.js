
const { TypeSemanticsNoun, TypeSemanticsAdjective,
 ParseName, TypeNamePatronymic, TypeNameSurname } = require("../../const");
const { IsPatronymic, IsSurname } = require("./parser");
const { GetNextIndex, GetPrevIndex, LOG } = require("../../../Utils/any");
//const { MakeFirstUpperCase } = require("../../../Utils/strings");


function ParseFullFIOs(arrayBlocks) {
    //  По всем блокам поиск блока, помеченного как Имя.
    //  Предполагаем, что рядом с ним лежащие слова это ИО или ИФ.
    //  Или, что перед ним находится Фамилия.
    //  Если проверка удачна, то помечаем эти блоки для слияния в один.

    for (let i = 0; i < arrayBlocks.length; i++)
        if (arrayBlocks[i].type === ParseName) {

            let iMainBlock = i;

            // проверяем следующие токены на ИО и ИФ
            let iNext = GetNextIndex(arrayBlocks, i);
            if (iNext > -1) {
                
                if ((arrayBlocks[iNext].typePOS === TypeSemanticsNoun) ||
                    (arrayBlocks[iNext].typePOS === TypeSemanticsAdjective)) {
                    let strWord = arrayBlocks[iNext].tokens[0].full;

                    if (IsPatronymic(strWord)) {
                        arrayBlocks[iNext].type = ParseName;
                        arrayBlocks[iNext].tokens[0].subtype = TypeNamePatronymic;
                        arrayBlocks[iNext].mainBlock = iMainBlock;
                        i++;

                        // проверяем следующие на ИОФ
                        let iNext2 = GetNextIndex(arrayBlocks, iNext);
                        if (iNext2 > -1) {
                            if ((arrayBlocks[iNext2].typePOS === TypeSemanticsNoun) ||
                                (arrayBlocks[iNext2].typePOS === TypeSemanticsAdjective)) {
                                let strWord = arrayBlocks[iNext2].tokens[0].full;

                                if (IsSurname(strWord)) {
                                    arrayBlocks[iNext2].type = ParseName;
                                    arrayBlocks[iNext2].tokens[0].subtype = TypeNameSurname;
                                    arrayBlocks[iNext2].mainBlock = iMainBlock;
                                    i++;
                                }
                            }
                        }
                    }

                    //  ИФ
                    else if (IsSurname(strWord)) {
                        arrayBlocks[iNext].type = TypeName;
                        arrayBlocks[iNext].tokens[0].subtype = TypeNameSurname;
                        arrayBlocks[iNext].mainBlock = iMainBlock;
                        i++;
                    }
                }                
            }

            // проверяем предыдущий токен на то, что это Фамилия
            let iPrev = GetPrevIndex(arrayBlocks, iMainBlock);
            if (iPrev > -1) {
                
                if ((arrayBlocks[iPrev].typePOS === TypeSemanticsNoun) ||
                    (arrayBlocks[iPrev].typePOS === TypeSemanticsAdjective)) {

                    let strWord = arrayBlocks[iPrev].tokens[0].full;
                    if (IsSurname(strWord)) {
                        arrayBlocks[iPrev].type = ParseName;
                        arrayBlocks[iPrev].tokens[0].subtype = TypeNameSurname;
                        arrayBlocks[iPrev].mainBlock = iMainBlock;
                    }
                }
            }
        }

    return arrayBlocks;
}
module.exports.ParseFullFIOs = ParseFullFIOs;

