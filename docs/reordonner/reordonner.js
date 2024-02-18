(function formCueillette() {
    let output;
    let debug;

    function inverseArray(array) {
        const newArray = Array.from(Array(array.length).keys());
        array.forEach(function(value, index) {
            newArray[value] = index;
        });

        return newArray;
    }

    function reorder(text, key, reverse) {
        const mapping = Array.from(Array(key.length).keys());
        mapping.sort(function(a, b) {
            return key[a].localeCompare(key[b]);
        });
        const newMapping = reverse ? inverseArray(mapping) : mapping;

        const partLit = text.match(new RegExp('.{1,' + key.length + '}', 'g'));
        return partLit.map(function(part) {
            return newMapping.map(function(index) {
                return part[index];
            }).join('');
        }).join('');
    }

    function update(formData) {
        if (output) {
            output.clear();
        }
        output = initOutput();

        let reference = getInput(formData, 'reference', {
            withLetter: true,
            withNumber: true,
            withSpaces: false,
            withPunctuation: false,
            singleLine: true,
        });
        let key = getInput(formData, 'key', {
            withLetter: true,
            withNumber: false,
            withSpaces: false,
            withPunctuation: false,
            singleLine: true,
        });

        const result = reorder(reference, key, formData.get('reverse'))

        output.setTitle('Résultat');
        output.setDetails(result);
    }

    function init() {
    }

    initForm('reordonner', update, init);
})();