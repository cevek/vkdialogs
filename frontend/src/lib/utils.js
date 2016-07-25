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
    lat2: 'eEabvgdezijklmnoprstufhcyABVGDEZIJKLMNOPRSTUFHCY'.split(''),
    cyr2: 'ёЁабвгдезийклмнопрстуфхцыАБВГДЕЗИЙКЛМНОПРСТУФХЦЫ'.split(''),

    cyrKeys: "йцукенгшщзхъфывапролджэячсмитьбю.ёЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЯЧСМИТЬБЮ.ЁЭ".split(''),
    latKeys: "qwertyuiop[]asdfghjkl;'zxcvbnm,./`QWERTYUIOP{}ASDFGHJKL:ZXCVBNM<>&|\"".split(''),
};

export const translit = {
    latCyr: translitFunctionFactory([...translitMap.lat1, ...translitMap.lat2], [...translitMap.cyr1, ...translitMap.cyr2]),
    cyrLat: translitFunctionFactory([...translitMap.cyr1, ...translitMap.cyr2], [...translitMap.lat1, ...translitMap.lat2]),
    cyrLatKeys: translitFunctionFactory(translitMap.cyrKeys, translitMap.latKeys),
    latCyrKeys: translitFunctionFactory(translitMap.latKeys, translitMap.cyrKeys),
};

function translitFunctionFactory(a, b) {
    const regExp = new RegExp(`(${a.map(t => t.replace(/([^\wа-яё])/ig, '\\$1')).join('|')})`, 'g');

    const map = {};
    let hasComplexReplace = false;
    for (let i = 0; i < a.length; i++) {
        if (a[i].length > 1) {
            hasComplexReplace = true;
        }
        map[a[i]] = b[i];
    }

    if (hasComplexReplace) {
        return (text) => text.replace(regExp, replace);
    }

    function replace(m, m1) {
        return map[m1] || m1;
    }

    return (text) => {
        let s = '';
        for (let i = 0; i < text.length; i++) {
            const sym = text[i];
            s += map[sym] || sym;
        }
        return s;
    }
}
