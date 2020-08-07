(function formCueillette() {
    let output;
    let debug;

    function update(formData) {
        let reference = formData.get('reference').trim();
        if (!formData.get('withSpaces')) {
            reference = reference.replace(/\s/g, '');
        }
        if (!formData.get('withPunctuation')) {
            reference = reference.replace(/[^A-Za-zÀ-ÿœ]/g, '');
        }

        const pick = formData.get('pick')
            .trim()
            .replace(/\s+/g, ' ')
            .match(/[\d]+|\D+/g);

        const result = pick.map(item => {
            const index = parseInt(item, 10);
            if (!index) {
                return item;
            }
            if (!reference[index - 1]) {
                console.error(`${index} not available in reference string`);
                return false;
            }

            return reference[index - 1];
        }).filter(item => item !== false).join('');

        // Output
        if (output) {
            output.clear();
        }
        output = initOutput();
        output.setTitle('Résultat');
        output.setDetails(result);

        // Debug
        if (debug) {
            debug.clear();
        }
        debug = initOutput();
        debug.setTitle('En détails');
        debug.setDetails(`
            <div style="word-wrap: break-word;">
                ${Array.from(reference).map((char, index) => {
                    let style = `font-family: monospace, monospace;`;
                    let title = '';
                    const pickIndex = pick.findIndex(value => value === (index + 1).toString());
                    if (pickIndex > -1) {
                        style += `background: #D8AE5C;`;
                        title = `Numéro ${index + 1} -> Position ${pickIndex + 1}`;
                    }
        
                    return `<span style="${style}" title="${title}">${char}</span>`;
                }).join('')}
            </div>
        `);
    }

    initForm('cueillette', update);
})();