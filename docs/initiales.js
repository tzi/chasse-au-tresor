(function formInitiales() {
    let output;
    let debug;

    function isPunctuation(letter) {
        return /[^A-Za-zÀ-ÿœ]/.test(letter);
    }

    function update(formData) {
        const reference = formData.get('reference').trim().replace(/\s+/g, ' ');
        const positions = [];
        let previousLetterWasASeparator = true;
        Array.from(reference).forEach((letter, index) => {
            if (previousLetterWasASeparator) {
                if (!isPunctuation(letter)) {
                    positions.push(index);
                    previousLetterWasASeparator = false;
                }
                return true;
            }

            if (formData.get('isPunctuationASeparator')) {
                if (isPunctuation(letter)) {
                    previousLetterWasASeparator = true;
                }
                return true;
            }

            if (letter === ' ') {
                previousLetterWasASeparator = true;
            }
        });
        const result = positions.map(index => reference[index]).join('');

        // Output
        if (output) {
            output.clear();
        }
        output = initOutput();
        output.setTitle('Résultat');
        output.setDetails(`
            <div style="word-wrap: break-word;">
                ${result}
            </div>
        `);

        // Debug
        if (debug) {
            debug.clear();
        }
        debug = initOutput();
        debug.setTitle('En détails');
        debug.setDetails(`
            <div style="word-wrap: break-word;">
                ${Array.from(reference).map((letter, index) => {
                    let style = `font-family: monospace, monospace;`;
                    if (positions.includes(index)) {
                        style += `background: #D8AE5C;`;
                    }

                    return `<span style="${style}">${letter}</span>`;
                }).join('')}
            </div>
        `);
    }

    initForm('initiales', update);
})();