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

export function translitToCyr(text) {
    text = translit(text, translitMap.lat1, translitMap.cyr1);
    text = translit(text, translitMap.lat2, translitMap.cyr2);
    return text;
}
export function translitToLat(text) {
    text = translit(text, translitMap.cyr1, translitMap.lat1);
    text = translit(text, translitMap.cyr2, translitMap.lat2);
    return text;
}

export function traslitKeyboardToCyr(text) {
    return translit(text, translitMap.latKeys, translitMap.cyrKeys);
}
export function traslitKeyboardToLat(text) {
    return translit(text, translitMap.cyrKeys, translitMap.latKeys);
}

// todo: too heavy load, need to cache translits
export function hasText(source, sub) {
    source = source.toLocaleLowerCase();
    const sourceVersions = [
        source,
        translitToCyr(source),
        translitToLat(source),
    ];
    const subVersions = [
        sub,
        translitToLat(sub),
        translitToCyr(sub),
        traslitKeyboardToCyr(sub),
        traslitKeyboardToLat(sub)
    ];
    return sourceVersions.some(source => subVersions.some(sub => source.indexOf(sub) > -1));
}
