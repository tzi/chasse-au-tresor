(function formCueillette() {
    let output;
    let debug;

    function update(formData) {
        if (output) {
            output.clear();
        }
        output = initOutput();

        let reference = getInput(formData, 'reference', {
            withLetter: true,
            withNumber: true,
            withSpaces: true,
            withPunctuation: formData.get('withPunctuation'),
        });
        let pick = getInput(formData, 'pick', {
            withLetter: false,
            withNumber: true,
            withSpaces: true,
            withPunctuation: true,
            singleLine: true,
        });

        const referenceMap = reference.reduce(function(acc, seed) {
            const split = seed.split(' ');
            const key = split[0];
            let value = split.slice(1).join(' ');
            if (!formData.get('withSpaces')) {
                value = value.replace(/\s+/, '');
            }
            acc[key] = value;

            return acc;
        }, {});

        const pickedLetters = pick.split(' ').filter(Boolean).map(function(pickItem) {
            if (!pickItem.includes('.')) {
                output.addError('Mauvais format de coordonnées. Il manque un point dans : "' + pickItem + '"');
                return false;
            }
            const coords = pickItem.split('.');
            const referenceText = referenceMap[coords[0]];
            if (!referenceText) {
                output.addError('Mauvaises coordonnées. Texte "' + coords[0] + '" introuvable dans : "' + pickItem + '"');
                return false;
            }

            coords[1] = parseInt(coords[1], 10);
            if (!coords[1]) {
                output.addError('Mauvaises coordonnées. Index "' + coords[1] + '" invalide dans : "' + pickItem + '"');
                return false;
            }
            const letter = referenceText[coords[1] - 1];
            if (!letter) {
                output.addError('Mauvaises coordonnées. Index "' + coords[1] + '" trop grand (maximum ' + referenceText.length + ') dans : "' + pickItem + '"');
                return false;
            }

            return '<span title="' + pickItem + '">' + letter + '</span>';
        });

        if (output.getHasError()) {
            return false;
        }

        output.setTitle('Résultat');
        output.setDetails(pickedLetters.join(' '));
    }

    function init() {
    }

    initForm('cueilletteMultiple', update, init);
})();