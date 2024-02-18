(function formCueillette() {
    let output;
    let debug;

    function update(formData) {
        if (output) {
            output.clear();
        }
        output = initOutput();

        let referenceLineList = getInput(formData, 'reference', {
            withLetter: true,
            withNumber: true,
            withSpaces: formData.get('withSpaces'),
            withPunctuation: formData.get('withPunctuation'),
        });
        let pick = getInput(formData, 'pick', {
            withLetter: false,
            withNumber: true,
            withSpaces: true,
            withPunctuation: true,
            singleLine: true,
        });

        const pickedLetters = pick.split(' ').filter(Boolean).map(function(pickItem) {
            if (!pickItem.includes('.')) {
                output.addError('Mauvais format de coordonnées. Il manque un point dans : "' + pickItem + '"');
                return false;
            }
            const coords = pickItem.split('.');
            const referenceLine = referenceLineList[coords[0]];
            if (!referenceLine) {
                output.addError('Mauvaises coordonnées. Ligne "' + coords[0] + '" introuvable dans : "' + pickItem + '"');
                return false;
            }

            coords[1] = parseInt(coords[1], 10);
            if (!coords[1]) {
                output.addError('Mauvaises coordonnées. Lettre "' + coords[1] + '" introuvable dans : "' + pickItem + '"');
                return false;
            }
            const letter = referenceLine[coords[1] - 1];
            if (!letter) {
                output.addError('Mauvaises coordonnées. Lettre "' + coords[1] + '" introuvable (maximum ' + referenceLine.length + ') dans : "' + pickItem + '"');
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

    initForm('cueilletteCoordonnees', update, init);
})();