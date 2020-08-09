(function formMorse() {
    const MORSE_CODE = {
        "-----":"0",
        ".----":"1",
        "..---":"2",
        "...--":"3",
        "....-":"4",
        ".....":"5",
        "-....":"6",
        "--...":"7",
        "---..":"8",
        "----.":"9",
        ".-":"A",
        "-...":"B",
        "-.-.":"C",
        "-..":"D",
        ".":"E",
        "..-.":"F",
        "--.":"G",
        "....":"H",
        "..":"I",
        ".---":"J",
        "-.-":"K",
        ".-..":"L",
        "--":"M",
        "-.":"N",
        "---":"O",
        ".--.":"P",
        "--.-":"Q",
        ".-.":"R",
        "...":"S",
        "-":"T",
        "..-":"U",
        "...-":"V",
        ".--":"W",
        "-..-":"X",
        "-.--":"Y",
        "--..":"Z",
        "-.-.--":"!",
        ".-.-.-":".",
        "--..--":","
    };

    const result = initOutput();

    function decode(morse, start) {
        return Object.keys(MORSE_CODE).map(code => {
           if (morse.startsWith(code)) {
               const rest = morse.slice(code.length);
               if (!rest) {
                   return start + MORSE_CODE[code];
               }
               const result = decode(rest, start + MORSE_CODE[code]);
               return result;
           }

           return false;
        }).filter(Boolean).flat();
    }

    function update(formData) {
        const message = formData.get('morse').replace(/[^\.-]*/g, '');
        const possibilities = decode(message, '');

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