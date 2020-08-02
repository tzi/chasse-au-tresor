(function formCueillette() {
    let output;

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

        if (output) {
            output.clear();
        }
        output = initOutput();
        output.setTitle('Résultat');
        output.setDetails(result);
    }

    initForm('cueillette', update);
})();