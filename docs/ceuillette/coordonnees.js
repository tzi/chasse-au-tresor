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

        const pickedLetters = pick.split(/\s+/).filter(Boolean).map(function(pickItem) {
            if (!pickItem.match(/[-\.]/)) {
                output.addError('Mauvais format de coordonnées. Il manque un point dans : "' + pickItem + '"');
                return false;
            }
            const coords = pickItem.split(/[-\.]/);
            coords[0] = parseInt(coords[0], 10);
            if (!coords[0]) {
                output.addError('Mauvaises coordonnées. Ligne invalide dans : "' + pickItem + '"');
                return false;
            }
            const referenceLine = referenceLineList[coords[0] - 1];
            if (!referenceLine) {
                output.addError('Mauvaises coordonnées. Ligne "' + coords[0] + '" introuvable dans : "' + pickItem + '"');
                return false;
            }

            coords[1] = parseInt(coords[1], 10);
            if (!coords[1]) {
                output.addError('Mauvaises coordonnées. Lettre invalide dans : "' + pickItem + '"');
                return false;
            }
            let letter = referenceLine[coords[1] - 1];
            if (formData.get('isLoop')) {
                letter = referenceLine[(coords[1] - 1) % referenceLine.length]
            } else if (!letter) {
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