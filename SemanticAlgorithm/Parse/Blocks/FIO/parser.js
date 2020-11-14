
const { GetRootName } = require("./utils");
const { RemoveEnd } = require("./../../../Utils/strings");
const { TypeSexMan, TypeSexWoman, TypeSexNoKnow, TypeSexAny } = require("../../const");

//  Это пока нигде не используется. Осталась как раритет.
function IsName(word) {
    let str = GetRootName(word);

    if (HaveAnyWordOfArray([str], arrayHashMaleNames, arrayMaleNames, 2))
        return TypeSexMan;

    if (HaveAnyWordOfArray([str], arrayHashFemaleNames, arrayFemaleNames, 2))
        return TypeSexWoman;
        
    return 0;
}

function IsPatronymic(word) {
    let str = RemoveEnd(word);

    if (str.length > 3) {
        let letter3 = str.substring(str.length - 3);
        
        if (["вич","мич","ьич"].includes(letter3)) {
            return TypeSexMan;
        }
        
        if (["овн","евн","ичн"].includes(letter3)) {
            return TypeSexWoman;
        }
    }
    return 0;
}
module.exports.IsPatronymic = IsPatronymic;

function IsSurname(word) {
    let str = word;     //  не убираем окончания!

    if (str.length > 3) {
        let letter3 = str.substring(str.length - 3);
        
        if (["кая","ина","ова","ева"].includes(letter3)) {
            return TypeSexWoman;
        }
        
        if (["кин","к"].includes(letter3)) {
            return TypeSexMan;
        }
    }

    if (str.length > 2) {
        let letter2 = str.substring(str.length - 2);

        if (["ин","ов","ев","ёв","ый","ым","ву","ну","му"].includes(letter2)) {
            return TypeSexMan;
        }
        
        if (["ой","ве"].includes(letter2)) {
            return TypeSexWoman;
        }
        
        if (["ян","ко","ия"].includes(letter2)) {
            return TypeSexAny;
        }
    }

    return TypeSexNoKnow;
}
module.exports.IsSurname = IsSurname;
