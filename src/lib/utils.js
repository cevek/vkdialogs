export function translator(str) {
    return new RegExp(`(${[str].join('|')})`, 'i');
}