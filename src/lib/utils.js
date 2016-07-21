export function translator(str) {
    return new RegExp(`(${[str].join('|')})`, 'i');
}

export function uniqueArray(array) {
    return array.filter((item, index, self) => self.indexOf(item) === index)
}