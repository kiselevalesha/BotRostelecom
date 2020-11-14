
const { ParseName, TypeNamePatronymic, TypeNameSurname } = require("../../const");
const { LOG } = require("../../../Utils/any");
const { MakeFirstUpperCase } = require("../../../Utils/strings");


const { ParseShortFIOs } = require("./shortfio");
const { ParseFullFIOs } = require("./fullfio");


function ParseFIOs(arrayBlocks) {

    //  Используются разные подходы для поиска полных и сокращённых ФИО

    //  Парсим полные ФИО: Иванов Александр Васильевич
    arrayBlocks = ParseFullFIOs(arrayBlocks);

    //  Парсим сокращённые ФИО: Иванов А.В.
    arrayBlocks = ParseShortFIOs(arrayBlocks);

    return arrayBlocks;
}
module.exports.ParseFIOs = ParseFIOs;


//  Переносим Отчество и Фамилию в главный блок, где Имя
function ConcatFIOs(arrayBlocks) {
    //  сначала переносим все данные в главный блок
    for (let i = 0; i < arrayBlocks.length; i++)
        if (arrayBlocks[i].type === ParseName)
            if (arrayBlocks[i].mainBlock !== undefined) {
                //LOG(arrayBlocks[i].tokens[0])
                let iMainBlock = arrayBlocks[i].mainBlock;

                arrayBlocks[iMainBlock].tokens.push(arrayBlocks[i].tokens[0]);
                if (! arrayBlocks[iMainBlock].result)
                    arrayBlocks[iMainBlock].result = {};

                switch(arrayBlocks[i].tokens[0].subtype) {
                    case TypeNamePatronymic:
                        arrayBlocks[iMainBlock].result.patronymic = MakeFirstUpperCase(arrayBlocks[i].tokens[0].full);
                        break;
                    case TypeNameSurname:
                        arrayBlocks[iMainBlock].result.surname = MakeFirstUpperCase(arrayBlocks[i].tokens[0].full);
                        break;    
                }                

                arrayBlocks[i] = null;
            }
            else {
                if (! arrayBlocks[i].result)
                    arrayBlocks[i].result = {};
                arrayBlocks[i].result.name = MakeFirstUpperCase(arrayBlocks[i].tokens[0].full);
            }

    //  Затем нужно удалить все блоки, помеченные как null;
    let arrayNewBlocks = [];
    for (let i = 0; i < arrayBlocks.length; i++)
        if (arrayBlocks[i] !== null)
            arrayNewBlocks.push(arrayBlocks[i]);

    return arrayNewBlocks;
}
module.exports.ConcatFIOs = ConcatFIOs;
