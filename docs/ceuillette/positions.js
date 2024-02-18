(function formCueillette() {
    let output;
    let debug;

    function update(formData) {
        const isLetterPicking = formData.get('what') === 'letter';
        const isWordPicking = formData.get('what') === 'word';
        const isWithEachLine = formData.get('withEachLine');
        let reference = getInput(formData, 'reference', {
            withLetter: true,
            withNumber: true,
            withSpaces: isWordPicking || formData.get('withSpaces'),
            withPunctuation: isWordPicking || formData.get('withPunctuation'),
        });
        let pick = getInput(formData, 'pick', {
            withLetter: false,
            withNumber: true,
            withSpaces: true,
            withPunctuation: false,
        });
        if (!isWithEachLine) {
            reference = [reference.join('\n')];
            pick = [pick.join('\n')];
        }

        function referenceToList(string) {
            if (isLetterPicking) {
                return Array.from(string);
            }

            return cutInWords(string, {
                isPunctuationASeparator: true,
            });
        }
        pick = pick.map(function(pickLine, lineIndex) {
            let total = 0;

            pickLine = pickLine
                .replace(/\s+/g, ' ')
                .match(/[\d]+|\D+/g)
                .map(item => {
                    let index = parseInt(item, 10);
                    if (!index) {
                        return item;
                    }
                    if (formData.get('isRelative')) {
                        total += index;
                        index = total;
                    }

                    return index;
                });

            if (formData.get('isLoop')) {
                const pattern = pickLine.slice(0);
                const last = pattern.findLast(item => !isNaN(item));
                const singleReference = reference[lineIndex];
                let referenceArray = referenceToList(reference[lineIndex]);
                while (last > referenceArray.length) {
                    reference[lineIndex] += singleReference;
                    referenceArray = referenceToList(reference[lineIndex]);
                }
            }

            return pickLine;
        });

        const result = pick.map(function(pickLine, lineIndex) {
            return pickLine.map(function(index) {
                if (typeof index !== 'number') {
                    return index;
                }

                const referenceArray = referenceToList(reference[lineIndex]);
                if (!referenceArray[index - 1]) {
                    console.error(`${index} not available in ${lineIndex + 1}e reference string`);
                    return false;
                }

                return referenceArray[index - 1];
            }).filter(item => item !== false).join('');
        }).join(' ');

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
                ${reference.map(function(referenceLine, lineIndex) {
                    const referenceArray = referenceToList(referenceLine);
                    if (!pick[lineIndex]) {
                        return null;
                    }
                    
                    return `
                        <p>
                            ${referenceArray.map((char, index) => {
                                let style = `font-family: monospace, monospace;`;
                                let title = `${isWordPicking ? 'Mot' : 'Lettre'} n° ${index + 1}`;
                                const pickIndex = pick[lineIndex].findIndex(value => value === index + 1);
                                if (pickIndex > -1) {
                                    style += `background: #D8AE5C;`;
                                }
                    
                                return `<span style="${style}" title="${title}">${char}</span>`;
                            }).join(isWordPicking ? ' ' : '')}
                        </p>
                    `;
                }).join('')}
            </div>
        `);
    }

    function init(form) {
        const isLoopInput = form.isLoop.parentNode.parentNode;
        const withSpacesInput = form.withSpaces.parentNode.parentNode;
        const withPunctuationInput = form.withPunctuation.parentNode.parentNode;

        function toggleIsLoop() {
            if (form.isRelative.checked) {
                isLoopInput.style.display = '';
            } else {
                isLoopInput.style.display = 'none';
            }
        }

        form.isRelative.addEventListener('input', toggleIsLoop);
        toggleIsLoop();

        function toggleTypo() {
            if (form.what.value === 'letter') {
                withSpacesInput.style.display = '';
                withPunctuationInput.style.display = '';
            } else {
                withSpacesInput.style.display = 'none';
                withPunctuationInput.style.display = 'none';
            }
        }
        Array.from(form.what).forEach(function(input) {
            input.addEventListener('input', toggleTypo);
        })
        toggleTypo();
    }

    initForm('cueillette', update, init);
})();