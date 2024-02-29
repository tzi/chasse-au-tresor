(function formTableOrganiser() {
    let output;
    let debug;

    function update(formData) {
        if (output) {
            output.clear();
        }
        output = initOutput();

        let referenceList = getInput(formData, 'reference', {
            withLetter: true,
            withNumber: true,
            withSpaces: false,
            withPunctuation: formData.get('withPunctuation'),
        }).join('');
        const width = getInput(formData, 'width', { isNumber: true });
        const height = getInput(formData, 'height', { isNumber: true });

        let html = '<table style="border-collapse: collapse; width: 100%;">';
        for (let rowIndex = 0; rowIndex < height; rowIndex++) {
            html += '<tr>';
            for (let colIndex = 0; colIndex < width; colIndex++) {
                const index = rowIndex * width + colIndex;
                html += '<td style="border: 1px solid black; text-align: center;">' + (referenceList[index] || '') + '</td>';
            }
            html += '</tr>';
        }
        html += '</table>';

        output.setTitle('Résultat');
        output.setDetails(html);
    }

    function init() {
    }

    initForm('tableOrganiser', update, init);
})();