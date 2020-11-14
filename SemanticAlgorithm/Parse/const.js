
const CaseImenitelniy = 1;
module.exports.CaseImenitelniy = CaseImenitelniy;
const CaseRoditelniy = 2;
module.exports.CaseRoditelniy = CaseRoditelniy;
const CaseDatelniy = 3;
module.exports.CaseDatelniy = CaseDatelniy;
const CaseVinitelniy = 4;
module.exports.CaseVinitelniy = CaseVinitelniy;
const CaseTvoritelniy = 5;
module.exports.CaseTvoritelniy = CaseTvoritelniy;
const CasePredlozhniy = 6;
module.exports.CasePredlozhniy = CasePredlozhniy;


const TypeSexNoKnow = 0;
module.exports.TypeSexNoKnow = TypeSexNoKnow;
const TypeSexMan = 1;
module.exports.TypeSexMan = TypeSexMan;
const TypeSexWoman = 2;
module.exports.TypeSexWoman = TypeSexWoman;
const TypeSexOno = 3;
module.exports.TypeSexOno = TypeSexOno;
const TypeSexAny = 4;
module.exports.TypeSexAny = TypeSexAny;


const TypeNumeralSingular = 1;
module.exports.TypeNumeralSingular = TypeNumeralSingular;
const TypeNumeralPlural = 2;
module.exports.TypeNumeralPlural = TypeNumeralPlural;


const TypeTimePast = 1;
module.exports.TypeTimePast = TypeTimePast;
const TypeTimePresent = 2;
module.exports.TypeTimePresent = TypeTimePresent;
const TypeTimeFuture = 3;
module.exports.TypeTimeFuture = TypeTimeFuture;


const TypeNameName = 1;
module.exports.TypeNameName = TypeNameName;
const TypeNamePatronymic = 2;
module.exports.TypeNamePatronymic = TypeNamePatronymic;
const TypeNameSurname = 3;
module.exports.TypeNameSurname = TypeNameSurname;


const RussianAlfabet = 'абвгдеёжзиклмнопрстуфхцчшщъыьэюя';
module.exports.RussianAlfabet = RussianAlfabet;



const TypeSemanticsNoknow = 0;
module.exports.TypeSemanticsNoknow = TypeSemanticsNoknow;
const TypeSemanticsSign = 100;
module.exports.TypeSemanticsSign = TypeSemanticsSign;
const TypeSemanticsVerb = 1;
module.exports.TypeSemanticsVerb = TypeSemanticsVerb;
const TypeSemanticsNoun = 2;
module.exports.TypeSemanticsNoun = TypeSemanticsNoun;
const TypeSemanticsAdjective = 3;
module.exports.TypeSemanticsAdjective = TypeSemanticsAdjective;
const TypeSemanticsAdVerb = 4;
module.exports.TypeSemanticsAdVerb = TypeSemanticsAdVerb;
const TypeSemanticsNumeral = 5;
module.exports.TypeSemanticsNumeral = TypeSemanticsNumeral;
const TypeSemanticsConjunction = 6;
module.exports.TypeSemanticsConjunction = TypeSemanticsConjunction;
const TypeSemanticsPronoun = 7;
module.exports.TypeSemanticsPronoun = TypeSemanticsPronoun;
const TypeSemanticsPretext = 8;
module.exports.TypeSemanticsPretext = TypeSemanticsPretext;
const TypeSemanticsQuestion = 9;
module.exports.TypeSemanticsQuestion = TypeSemanticsQuestion;
const TypeSemanticsEmpty = 10;
module.exports.TypeSemanticsEmpty = TypeSemanticsEmpty;
const TypeSemanticsMat = 11;
module.exports.TypeSemanticsMat = TypeSemanticsMat;



const ParseAbuse = 1;
module.exports.ParseAbuse = ParseAbuse;
const ParseAdress = ParseAbuse + 1;
module.exports.ParseAdress = ParseAdress;
const ParseAdverb = ParseAdress + 1;
module.exports.ParseAdverb = ParseAdverb;
const ParseBody = ParseAdverb + 1;
module.exports.ParseBody = ParseBody;
const ParseCloth = ParseBody + 1;
module.exports.ParseCloth = ParseCloth;
const ParseColor = ParseCloth + 1;
module.exports.ParseColor = ParseColor;
const ParseCompound = ParseColor + 1;
module.exports.ParseCompound = ParseCompound;
const ParseCurrency = ParseCompound + 1;
module.exports.ParseCurrency = ParseCurrency;
const ParseEmpty = ParseCurrency + 1;
module.exports.ParseEmpty = ParseEmpty;
const ParseFlower = ParseEmpty + 1;
module.exports.ParseFlower = ParseFlower;
const ParseFruit = ParseFlower + 1;
module.exports.ParseFruit = ParseFruit;
const ParseGreenery = ParseFruit + 1;
module.exports.ParseGreenery = ParseGreenery;
const ParseGroat = ParseGreenery + 1;
module.exports.ParseGroat = ParseGroat;
const ParseItem = ParseGroat + 1;
module.exports.ParseItem = ParseItem;
const ParseLength = ParseItem + 1;
module.exports.ParseLength = ParseLength;
const ParseMonth = ParseLength + 1;
module.exports.ParseMonth = ParseMonth;
const ParseNumber = ParseMonth + 1;
module.exports.ParseNumber = ParseNumber;
const ParseName = ParseNumber + 1;
module.exports.ParseName = ParseName;
const ParsePseudoName = ParseName + 1;
module.exports.ParsePseudoName = ParsePseudoName;
const ParseShoes = ParsePseudoName + 1;
module.exports.ParseShoes = ParseShoes;
const ParseTimes = ParseShoes + 1;
module.exports.ParseTimes = ParseTimes;
const ParseDates = ParseTimes + 1;
module.exports.ParseDates = ParseDates;
const ParseVegetable = ParseDates + 1;
module.exports.ParseVegetable = ParseVegetable;
const ParseWeekday = ParseVegetable + 1;
module.exports.ParseWeekday = ParseWeekday;
const ParseWeight = ParseWeekday + 1;
module.exports.ParseWeight = ParseWeight;
const ParseFamily = ParseWeight + 1;
module.exports.ParseFamily = ParseFamily;
const ParseProfessions = ParseFamily + 1;
module.exports.ParseProfessions = ParseProfessions;
