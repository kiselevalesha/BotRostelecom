
const { GetRootName } = require("./utils");
const { MakeFirstUpperCase } = require("./../../../Utils/strings");


function GetNameInitialCase(word, sex) {
    if (!word || !word.length)  return word;
    
    let str = GetRootName(word);

    if (sex === TypeSexMan) {
        let index = GetIndexOfArrayWords(str, arrayHashMaleNames, arrayMaleNames, 2);
        if (index > -1)
            return MakeFirstUpperCase(arrayMaleNames[index * 2] + arrayMaleNames[index * 2 + 1]);
    }
    else {
        let index = GetIndexOfArrayWords(str, arrayHashFemaleNames, arrayFemaleNames, 2);
        if (index > -1)
            return MakeFirstUpperCase(arrayFemaleNames[index * 2] + arrayFemaleNames[index * 2 + 1]);
    }
    return MakeFirstUpperCase(word);
}

function GetSurnameInitialCase(surname, sex) {
    if (!surname || !surname.length)  return surname;
    
    let lastChar = surname.charAt(surname.length - 1);
    if (['а','у','е'].includes(lastChar)) {
        if (sex === TypeSexMan)
            return MakeFirstUpperCase(surname.substring(0, surname.length - 1));
        else
            return MakeFirstUpperCase(surname.substring(0, surname.length - 1) + 'а');
    }
    
    let last2Char = surname.substring(surname.length - 2);
    if (['ым','ой'].includes(last2Char)) {
        if (sex === TypeSexMan)
            return MakeFirstUpperCase(surname.substring(0, surname.length - 2));
        else
            return MakeFirstUpperCase(surname.substring(0, surname.length - 2) + 'а');
    }
    
    let last3Char = surname.substring(surname.length - 3);
    if (['ыми','ами'].includes(last3Char)) {
        if (sex === TypeSexMan)
            return MakeFirstUpperCase(surname.substring(0, surname.length - 3));
        else
            return MakeFirstUpperCase(surname.substring(0, surname.length - 3) + 'а');
    }
    
    return MakeFirstUpperCase(surname);
}

function GetPatronymicInitialCase(patronymic, sex) {
    if (!patronymic || !patronymic.length)  return patronymic;
    
    if (sex === TypeSexMan) {
        let lastChar = patronymic.charAt(patronymic.length - 1);
        if (['а','у','е'].includes(lastChar))
            return MakeFirstUpperCase(patronymic.substring(0, patronymic.length - 1));
    }
    else {
        let lastChar = patronymic.charAt(patronymic.length - 1);
        if (['а','у','е','ы'].includes(lastChar))
            return MakeFirstUpperCase(patronymic.substring(0, patronymic.length - 1) + 'а');
    }
    
    return MakeFirstUpperCase(patronymic);
}


/*
-ея -а -ы -и
-ею -у -е 
-ея -а -у -ю
-ем -ом -ей -ой
-ее -е
*/
function GetCaseName(strName, sex, predlog) {
    
    // Проверим, что слово в именительном падеже
    if (strName === GetNameInitialCase(strName, sex))   return CaseImenitelniy;
    
    let str = GetRootName(strName);
    
    //  возьмём окончание слова. по нему будем определять падеж.
    let rest = strName.substring(str.length);

    if (sex === TypeSexMan) {
        if (['ея','а'].includes(rest)) {
            if (predlog.length > 0)
                if (['без','у','от','до','с','около','из','возле','после','для','вокруг'].includes(predlog))    return CaseRoditelniy;
        }
        if (['ею','у'].includes(rest)) {
            //if (['к','по'].includes(predlog))    return CaseDatelniy;
            return CaseDatelniy;
        }
        if (['ея','а'].includes(rest)) {
            if (predlog.length > 0)
                if (['за','на','про','через'].includes(predlog))    return CaseVinitelniy;

            // по умолчанию в иных случаях будет Родительный
            return CaseRoditelniy;
        }
        if (['ем','ом','ей'].includes(rest)) {
            //if (['за','над','под','с','перед'].includes(predlog))    return CaseTvoritelniy;
            return CaseTvoritelniy;
        }
        if (['ее','е'].includes(rest)) {
            //if (['в','на','об','о','при'].includes(predlog))    return CasePredlozhniy;
            return CasePredlozhniy;
        }
    }
    else {
        if (['ы','и'].includes(rest)) {
            //if (['без','у','от','до','с','около','из','возле','после','для','вокруг'].includes(predlog))    return CaseRoditelniy;
            return CaseRoditelniy;
        }
        if (['е'].includes(rest)) {
            //if (['к','по'].includes(predlog))    return CaseDatelniy;
            return CaseDatelniy;
        }
        if (['у'].includes(rest)) {
            //if (['за','на','про','через'].includes(predlog))    return CaseVinitelniy;
            return CaseRoditelniy;    // по умолчанию в иных случаях будет Родительный
        }
        if (['ой','ей'].includes(rest)) {
            //if (['за','над','под','с','перед'].includes(predlog))    return CaseTvoritelniy;
            return CaseTvoritelniy;
        }
        if (['е'].includes(rest)) {
            //if (['в','на','об','о','при'].includes(predlog))    return CasePredlozhniy;
            return CasePredlozhniy;
        }
    }
    return CaseImenitelniy;
}
