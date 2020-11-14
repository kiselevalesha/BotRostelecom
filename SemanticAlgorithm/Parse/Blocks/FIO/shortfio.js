
const { ParseName, TypeNamePatronymic, TypeNameSurname, TypeSemanticsSign } = require("../../const");
const { IsSurname } = require("./parser");
const { GetNextIndex, GetPrevIndex, LOG } = require("../../../Utils/any");


function ParseShortFIOs(arrayBlocks) {
    //  По всем блокам поиск двух подряд идущих блоков.
    //  Однобуквенное слово и точка = два раза подряд
    //  рядом с ними должна находится Фамилия.
    //  Если проверка удачна, то помечаем эти блоки для слияния в один.

    for (let i = 0; i < arrayBlocks.length; i++) {

        let iSurname = -1, iName = -1, iPatronymic = -1;
        let flag;
        let iNext = i, iPrev = i;

        //  Ищем точку
        flag = false;
        if (arrayBlocks[i].typePOS === TypeSemanticsSign)
            if (arrayBlocks[i].tokens.length === 1)
                if (arrayBlocks[i].tokens[0].full === '.')
                    flag = true;
        if (! flag)
            continue;


        //  Ищем слово из одной буквы
        flag = false;
        
        iPrev = GetPrevIndex(arrayBlocks, i);
        if (iPrev > -1)
            if (arrayBlocks[iPrev].tokens.length === 1)
                if (arrayBlocks[iPrev].tokens[0].full.length === 1) {
                    iName = iPrev;
                    flag = true; 
                }                           
        if (! flag)
            continue;


        //  Повторяем для второй пары
        //  Ищем слово из одной буквы
        iNext = GetNextIndex(arrayBlocks, iNext);
        if (iNext < 0)
            continue;

        flag = false;
        if (arrayBlocks[iNext].tokens.length === 1)
            if (arrayBlocks[iNext].tokens[0].full.length === 1) {
                iPatronymic = iNext;
                flag = true; 
            }
        if (! flag)
            continue;


        //  Ищем точку
        iNext = GetNextIndex(arrayBlocks, iNext);
        if (iNext < 0)
            continue;

        flag = false;
        if (arrayBlocks[iNext].typePOS === TypeSemanticsSign)
            if (arrayBlocks[iNext].tokens.length === 1)
                if (arrayBlocks[iNext].tokens[0].full === '.')
                    flag = true;
        if (! flag)
            continue;


        //  Если дошли до сюда, значит найдено два блока
        //  Ищем фамилию
        flag = false;

        //  Сначала ищем в предыдущем блоке перед найденными
        iPrev = GetPrevIndex(arrayBlocks, iPrev);
        if (iPrev > -1)
            if (arrayBlocks[iPrev].tokens.length === 1)
                if (IsSurname(arrayBlocks[iPrev].tokens[0].full)) {
                    iSurname = iPrev;
                    flag = true;
                }
                    


        //  если не нашли, то ищем в следующем блоке после найденных
        if (! flag) {
            iNext = GetNextIndex(arrayBlocks, iNext);
            if (iNext > -1)
                if (arrayBlocks[iNext].tokens.length === 1)
                    if (IsSurname(arrayBlocks[iNext].tokens[0].full)) {
                        iSurname = iNext;
                        flag = true;
                    }
        }

        //  Отмечаем и сливаем найденные блоки
        if (flag) {

            /*arrayBlocks[iPrev].isUsed = true;
            arrayBlocks[iPrev].type = ParseName;
    
            arrayBlocks[iPrev].result = {};
            arrayBlocks[iPrev].result.name = arrayBlocks[iName].tokens[0];
            arrayBlocks[iPrev].result.surname = arrayBlocks[iSurname].tokens[0];
            arrayBlocks[iPrev].result.patronymic = arrayBlocks[iPatronymic].tokens[0];

            arrayBlocks = MergeRightBlocks(arrayBlocks, iPrev, iNext - iPrev);*/

            arrayBlocks[iName].type = ParseName;

            arrayBlocks[iSurname].type = ParseName;
            arrayBlocks[iSurname].tokens[0].subtype = TypeNameSurname;
            arrayBlocks[iSurname].mainBlock = iName;
            //arrayBlocks[iName].type = ParseName;
            //arrayBlocks[iName].tokens[0].subtype = TypeNameName;
            arrayBlocks[iPatronymic].type = ParseName;
            arrayBlocks[iPatronymic].tokens[0].subtype = TypeNamePatronymic;
            arrayBlocks[iPatronymic].mainBlock = iName;
        }
    }

    return arrayBlocks;
    //return RemoveNullBlocks(arrayBlocks);
}
module.exports.ParseShortFIOs = ParseShortFIOs;

