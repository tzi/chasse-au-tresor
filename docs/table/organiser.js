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
        const startPoint = formData.get('start');
        const direction = formData.get('direction');
        const getIndex = function(rowIndex, colIndex) {
            const relativeColIndex = startPoint.includes('r') ? width - 1 - colIndex : colIndex;
            const relativeRowIndex = startPoint.includes('b') ? height - 1 - rowIndex : rowIndex;
            const [x, y] = direction === 'hv' ? [relativeColIndex, relativeRowIndex] : [relativeRowIndex, relativeColIndex];
            const stepSize = direction === 'hv' ? width : height;

            return y * stepSize + x;
        }

        let html = '<table style="border-collapse: collapse; width: 100%;">';
        for (let rowIndex = 0; rowIndex < height; rowIndex++) {
            html += '<tr>';
            for (let colIndex = 0; colIndex < width; colIndex++) {
                const index = getIndex(rowIndex, colIndex);
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