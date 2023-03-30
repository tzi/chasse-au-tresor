(function formAleatoireLettres () {
    const ALL_LETTERS = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

    let outputUsed;

    function random(alphabet, withMinuscules) {
        let letter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!withMinuscules || Math.random() < 0.5) {
            return letter;
        }

        return letter.toLowerCase();
    }

    function update(formData) {
        const quantity = parseInt(formData.get('quantity'), 10);
        const banned = formData.get('banned').toUpperCase();
        const withMinuscules = formData.get('withMinuscules');

        const alphabet = ALL_LETTERS.filter(letter => !banned.includes(letter));
        const letters = new Array(quantity)
            .fill(null)
            .map(() => random(alphabet, withMinuscules))

        // Output
        if (outputUsed) {
            outputUsed.clear();
        }
        outputUsed = initOutput();
        outputUsed.setTitle('Lettres aléatoires');
        outputUsed.setDetails(letters.join(''));
    }

    initForm('lettres', update);
})();