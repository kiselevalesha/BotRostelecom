
function GetRootName(word) {
    let str = RemoveEnd(word);
    let flag = false;
    
    if (str.length > 7) {
        let letter6 = str.charAt(str.length - 7);
        if (["ашеньк"].includes(letter6)) {
            str = str.substring(0, str.length - 7);
            flag = true;
        }
    }
    
    if (! flag)
        if (str.length > 6) {
            let letter5 = str.charAt(str.length - 6);
            if (["улечк",'ашечк'].includes(letter5)) {
                str = str.substring(0, str.length - 6);
                flag = true;
            }
        }
    
    if (! flag)
        if (str.length > 3) {
            let letter3 = str.charAt(str.length - 3);
            if (['чик','ушк','юшк','очк','аич'].includes(letter3)) {
                str = str.substring(0, str.length - 3);
                flag = true;
            }
        }
    
    if (! flag)
        if (str.length > 2) {
            let letter2 = str.charAt(str.length - 2);
            if (['ик','юш','юх','ул','ун','ух','ыч','ич','аш'].includes(letter2)) {
                str = str.substring(0, str.length - 2);
                flag = true;
            }
        }
    
    /*if (! flag)
        if (str.length > 1) {
            let letter1 = str.charAt(str.length - 1);
            if (["к","","","","","","","","","",""].includes(letter1)) {
                letter1 = str.charAt(str.length - 2);
                if (IsSoglasnaya(letter1))
                    str = str.substring(0, str.length - 1);
            }
        }*/
    return str;
}
module.exports.GetRootName = GetRootName;
