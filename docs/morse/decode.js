(function formMorse() {
    const CHARACTER_TYPE = {
        NUMBER: 'number',
        LETTER: 'letter',
        PUNCTUATION: 'punctuation',
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
        ".-": { value: "A", type: CHARACTER_TYPE.LETTER },
        "-...": { value: "B", type: CHARACTER_TYPE.LETTER },
        "-.-.": { value: "C", type: CHARACTER_TYPE.LETTER },
        "-..": { value: "D", type: CHARACTER_TYPE.LETTER },
        ".": { value: "E", type: CHARACTER_TYPE.LETTER },
        "..-.": { value: "F", type: CHARACTER_TYPE.LETTER },
        "--.": { value: "G", type: CHARACTER_TYPE.LETTER },
        "....": { value: "H", type: CHARACTER_TYPE.LETTER },
        "..": { value: "I", type: CHARACTER_TYPE.LETTER },
        ".---": { value: "J", type: CHARACTER_TYPE.LETTER },
        "-.-": { value: "K", type: CHARACTER_TYPE.LETTER },
        ".-..": { value: "L", type: CHARACTER_TYPE.LETTER },
        "--": { value: "M", type: CHARACTER_TYPE.LETTER },
        "-.": { value: "N", type: CHARACTER_TYPE.LETTER },
        "---": { value: "O", type: CHARACTER_TYPE.LETTER },
        ".--.": { value: "P", type: CHARACTER_TYPE.LETTER },
        "--.-": { value: "Q", type: CHARACTER_TYPE.LETTER },
        ".-.": { value: "R", type: CHARACTER_TYPE.LETTER },
        "...": { value: "S", type: CHARACTER_TYPE.LETTER },
        "-": { value: "T", type: CHARACTER_TYPE.LETTER },
        "..-": { value: "U", type: CHARACTER_TYPE.LETTER },
        "...-": { value: "V", type: CHARACTER_TYPE.LETTER },
        ".--": { value: "W", type: CHARACTER_TYPE.LETTER },
        "-..-": { value: "X", type: CHARACTER_TYPE.LETTER },
        "-.--": { value: "Y", type: CHARACTER_TYPE.LETTER },
        "--..": { value: "Z", type: CHARACTER_TYPE.LETTER },
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

    function update(formData) {
        const message = formData.get('morse').replace(/[^\.-]*/g, '');
        const options = {
            maxLength: parseInt(formData.get('maxLength'), 10),
            withNumber: Boolean(formData.get('withNumber')),
            withPunctuation: Boolean(formData.get('withPunctuation')),
        };
        console.log({ options });
        const possibilities = decode(message, options, '');

        // Output
        result.setTitle(`${possibilities.length} résultats`);
        result.setDetails(`
            <ul>
                ${possibilities.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `);
    }

    initForm('morse', update);
})();