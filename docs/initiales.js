(function formCueillette() {
    let output;
    let debug;

    function stripPunctuation(string) {
        return string.replace(/[^A-Za-zÀ-ÿœ]/g, '');
    }

    function update(formData) {
        const reference = formData.get('reference').trim().replace(/\s+/g, ' ');
        console.log({reference});
        let words;
        if (formData.get('isPunctuationASeparator')) {
            words = reference.match(/[A-Za-zÀ-ÿœ]+/g);
            console.log({words});
        } else {
            words = reference
                .split(' ')
                .map(word => stripPunctuation(word));
            console.log({words});
        }

        const result = words.map(word => word[0]).join('');

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
                ${words.map(word => {
                    return Array.from(word).map((letter, index) => {
                        let style = `font-family: monospace, monospace;`;
                        if (index === 0) {
                            style += `background: #D8AE5C;`;
                        }

                        return `<span style="${style}">${letter}</span>`;
                    }).join('');
                }).join('')}
            </div>
        `);
    }

    initForm('initiales', update);
})();