
function GetRestOfWord(word) {
    return word.substring(0, RemoveEnd(word).length);
}

function GetNameCase(word) {

    let rest = GetRestOfWord(word);

    if (['ея','а','ы','и'].includes(rest))
        return CaseRoditelniy;

    if (['ею','ау','е'].includes(rest))
        return CaseDatelniy;

    if (['ея','а','у'].includes(rest))
        return CaseVinitelniy;

    if (['ем','ом','ей','ой'].includes(rest))
        return CaseTvoritelniy;

    if (['ее','е'].includes(rest))
        return CasePredlozhniy;

    return 0;
}

