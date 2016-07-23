/**
 * Return array with unique elements
 * @param array
 */
export function uniqueArray(array) {
    return array.filter((item, index, self) => self.indexOf(item) === index)
}

const translitMap = {
    lat1: ['yo', 'zh', 'kh', 'ts', 'ch', 'sch', 'shch', 'sh', 'eh', 'yu', 'ya', 'YO', 'ZH', 'KH', 'TS', 'CH', 'SCH', 'SHCH', 'SH', 'EH', 'YU', 'YA', "'"],
    cyr1: ['ё', 'ж', 'х', 'ц', 'ч', 'щ', 'щ', 'ш', 'э', 'ю', 'я', 'Ё', 'Ж', 'Х', 'Ц', 'Ч', 'Щ', 'Щ', 'Ш', 'Э', 'Ю', 'Я', 'ь'],
    lat2: 'abvgdezijklmnoprstufhcyABVGDEZIJKLMNOPRSTUFHCYёЁ',
    cyr2: 'абвгдезийклмнопрстуфхцыАБВГДЕЗИЙКЛМНОПРСТУФХЦЫеЕ',

    cyrKeys: "йцукенгшщзхъфывапролджэячсмитьбю.ё",
    latKeys: "qwertyuiop[]asdfghjkl;'zxcvbnm,./`",
};

function translit(text, from, to) {
    for (let i = 0; i < from.length; i++) {
        text = text.split(from[i]).join(to[i]);
    }
    return text;
}

/**
 * Translit privet => привет
 */
export function translitToCyr(text) {
    text = translit(text, translitMap.lat1, translitMap.cyr1);
    text = translit(text, translitMap.lat2, translitMap.cyr2);
    return text;
}
/**
 * Translit привет => privet
 */
export function translitToLat(text) {
    text = translit(text, translitMap.cyr1, translitMap.lat1);
    text = translit(text, translitMap.cyr2, translitMap.lat2);
    return text;
}

/**
 * Translit ghbdtn => привет
 */
export function traslitKeyboardToCyr(text) {
    return translit(text, translitMap.latKeys, translitMap.cyrKeys);
}

/**
 * Translit зкшмуе => privet
 */
export function traslitKeyboardToLat(text) {
    return translit(text, translitMap.cyrKeys, translitMap.latKeys);
}

/**
 * Check that sub text contains in source with different types of enter
 * @param sourceVariations {string[]}
 * @param textVariations {string[]}
 * @return {boolean}
 */
export function hasText(sourceVariations, textVariations) {
    return sourceVariations.some(source => textVariations.some(sub => source.indexOf(sub) > -1));
}
