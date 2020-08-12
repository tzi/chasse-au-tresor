(function formMorse() {
    const CHARACTER_TYPE = {
        NUMBER: 'number',
        LETTER: 'letter',
        PUNCTUATION: 'punctuation',
    };
    const CHARACTER_GROUP = {
        CONSONNE: 'consonne',
        VOYELLE: 'voyelle',
    };
    const MORSE_CODE = {
        "-----": { value: "0", type: CHARACTER_TYPE.NUMBER },
        ".----": { value: "1", type: CHARACTER_TYPE.NUMBER },
        "..---": { value: "2", type: CHARACTER_TYPE.NUMBER },
        "...--": { value: "3", type: CHARACTER_TYPE.NUMBER },
        "....-": { value: "4", type: CHARACTER_TYPE.NUMBER },
        ".....": { value: "5", type: CHARACTER_TYPE.NUMBER },
        "-....": { value: "6", type: CHARACTER_TYPE.NUMBER },
        "--...": { value: "7", type: CHARACTER_TYPE.NUMBER },
        "---..": { value: "8", type: CHARACTER_TYPE.NUMBER },
        "----.": { value: "9", type: CHARACTER_TYPE.NUMBER },
        ".-": { value: "A", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.VOYELLE },
        "-...": { value: "B", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "-.-.": { value: "C", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "-..": { value: "D", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        ".": { value: "E", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.VOYELLE },
        "..-.": { value: "F", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "--.": { value: "G", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "....": { value: "H", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "..": { value: "I", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.VOYELLE },
        ".---": { value: "J", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "-.-": { value: "K", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        ".-..": { value: "L", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "--": { value: "M", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "-.": { value: "N", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "---": { value: "O", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.VOYELLE },
        ".--.": { value: "P", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "--.-": { value: "Q", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        ".-.": { value: "R", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "...": { value: "S", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "-": { value: "T", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "..-": { value: "U", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.VOYELLE },
        "...-": { value: "V", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        ".--": { value: "W", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "-..-": { value: "X", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "-.--": { value: "Y", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.VOYELLE },
        "--..": { value: "Z", type: CHARACTER_TYPE.LETTER, group: CHARACTER_GROUP.CONSONNE },
        "-.-.--": { value: "!", type: CHARACTER_TYPE.PUNCTUATION },
        ".-.-.-": { value: ".", type: CHARACTER_TYPE.PUNCTUATION },
        "--..--": { value: ",", type: CHARACTER_TYPE.PUNCTUATION },
    };

    const result = initOutput();

    function decode(morse, options, start) {
        return Object.keys(MORSE_CODE).map(code => {
            const character = MORSE_CODE[code];
            if (!morse.startsWith(code)) {
               return false;
            }
            if (character.type === CHARACTER_TYPE.PUNCTUATION) {
                if (!options.withPunctuation) {
                    return false;
                }
            } else if (character.type === CHARACTER_TYPE.NUMBER) {
               if (!options.withNumber) {
                   return false;
               }
            }

            const newStart = start + character.value;
            const rest = morse.slice(code.length);
            if (!rest) {
               return newStart;
            }
            if (newStart.length >= options.maxLength) {
                return false;
            }

            return decode(rest, options, newStart);
        }).filter(Boolean).flat();
    }

    function multiply(array, start) {
        if (array.length === 0) {
            return start;
        }

        if (typeof array[0] === 'string') {
            return multiply(array.slice(1), start + array[0]);
        }

        return array[0].map(item => {
            return multiply(array.slice(1), start + item);
        }).flat();
    }

    function update(formData) {
        const message = formData.get('morse').match(/([^\.-]+|[\.-]+)/g);
        const maxLength = formData.get('maxLength') && parseInt(formData.get('maxLength'), 10);
        const minLength = formData.get('minLength') && parseInt(formData.get('minLength'), 10);
        const maxVoyelles = formData.get('maxVoyelles') && parseInt(formData.get('maxVoyelles'), 10);
        const maxConsonnes = formData.get('maxConsonnes') && parseInt(formData.get('maxConsonnes'), 10);
        const options = {
            maxLength: maxLength + 1 - message.length,
            withNumber: Boolean(formData.get('withNumber')),
            withPunctuation: Boolean(formData.get('withPunctuation')),
        };
        const decoded = message.map(messagePart => {
            if (messagePart[0] !== '.' && messagePart[0] !== '-') {
                return messagePart;
            }
            return decode(messagePart, options, '');
        });
        const possibilities = multiply(decoded, '')
            .filter(possibility => !maxLength || possibility.length <= maxLength)
            .filter(possibility => !minLength || possibility.length >= minLength)
            .filter(possibility => !maxVoyelles || possibility.match(/[aeiouy]/gi).length <= maxVoyelles)
            .filter(possibility => !maxConsonnes || possibility.match(/[bcdfghjklmnpqrstvwxz]/gi).length <= maxConsonnes);

        // Output
        result.setTitle(`${possibilities.length} résultats`);
        result.setDetails(`
            <ul>
                ${possibilities.sort().map(item => `<li>${item}</li>`).join('')}
            </ul>
        `);
    }

    initForm('morse', update);
})();