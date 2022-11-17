(function formAlphabet() {
    const ALL_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
    const ALL_NUMBERS = '0123456789';
    const OTHER_CHARS = '#@&é"\'(§è!çà)-°_^¨*$€%ù£`+=/:.;?,><';

    const unique = (value, index, self) => {
        return self.indexOf(value) === index
    }
    const debugAlphabet = (all, used) => {
        return all.split('').map(letter => {
            let style = `font-family: monospace, monospace;`;
            if (used.includes(letter)) {
                style += `background: #D8AE5C;`;
            }

            return `<span style="${style}">${letter}</span>`;
        }).join('') + '<br>';
    }

    let outputUsed;
    let debug;

    function update(formData) {
        const reference = formData.get('reference');
        let source = reference.trim().replace(/\s+/g, ' ');
        if (!formData.get('withNumbers')) {
            source = source.replace(/[0-9]/g, '');
        }
        if (!formData.get('withOtherChars')) {
            source = source.replace(/[^0-9a-zA-Z]/g, '');
        }
        if (!formData.get('isCaseSensitive')) {
            source = source.toLowerCase();
        }
        const alphabet = source
            .split('')
            .sort()
            .filter(unique);

        // Output
        if (outputUsed) {
            outputUsed.clear();
        }
        outputUsed = initOutput();
        outputUsed.setTitle('Alphabet');
        outputUsed.setDetails(`
            <div style="word-wrap: break-word;">
                ${alphabet.join(' ')}
            </div>
        `);

        if (debug) {
            debug.clear();
        }
        debug = initOutput();
        debug.setTitle('En détails');
        debug.setDetails(`
            <div style="word-wrap: break-word;">
                ${formData.get('isCaseSensitive') ? debugAlphabet(ALL_LETTERS.toUpperCase(), alphabet) : ''}
                ${debugAlphabet(ALL_LETTERS, alphabet)}
                ${formData.get('withNumbers') ? debugAlphabet(ALL_NUMBERS, alphabet) : ''}
                ${formData.get('withOtherChars') ? debugAlphabet(OTHER_CHARS, alphabet) : ''}
            </div>
        `);
    }

    initForm('alphabet', update);
})();