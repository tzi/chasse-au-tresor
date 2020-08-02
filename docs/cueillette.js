(function formCueillette() {
    let output;
    let debug;

    function update(formData) {
        let reference = formData.get('reference').trim();
        if (!formData.get('withSpaces')) {
            reference = reference.replace(/\s/g, '');
        }

        let result = '';
        const pick = formData.get('pick').trim().replace(/\s+/g, ' ').split(' ');
        pick.forEach(position => {
            const index = parseInt(position, 10);
            if (!index) {
                return false;
            }
            if (!reference[index - 1]) {
                return false;
            }
            result += reference[index - 1];
        });

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
        debug.setDetails(Array.from(reference).map((char, index) => {
            let style = `font-family: monospace, monospace;`;
            let title = '';
            const pickIndex = pick.findIndex(value => value === (index + 1).toString());
            if (pickIndex > -1) {
                style += `background: #D8AE5C;`;
                title = `Numéro ${index + 1} -> Position ${pickIndex + 1}`;
            }

            return `<span style="${style}" title="${title}">${char}</span>`;
        }).join(''));
    }

    initForm('cueillette', update);
})();