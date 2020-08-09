(function formCueillette() {
    let output;
    let debug;

    function update(formData) {
        let reference = formData.get('reference').trim();
        if (!formData.get('withSpaces')) {
            reference = reference.replace(/\s/g, '');
        }
        if (!formData.get('withPunctuation')) {
            reference = reference.replace(/[^A-Za-zÀ-ž ]/g, '');
        }

        let total = 0;
        let pick = formData.get('pick')
            .trim()
            .replace(/\s+/g, ' ')
            .match(/[\d]+|\D+/g);
        pick = pick.map(item => {
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
            const pattern = pick.slice(0);
            let last = pattern[pattern.length - 1];
            while (last < reference.length) {
                pick.push(' ');
                pattern.forEach((item, index) => {
                    if (typeof item === 'number') {
                        item = last + pattern[index];
                    }
                    pick.push(item);
                });
                last += pattern[pattern.length - 1];
            }
        }

        const result = pick.map(index => {
            if (typeof index !== 'number') {
                return index;
            }

            if (!reference[index - 1]) {
                console.error(`${index} not available in reference string`);
                return false;
            }

            return reference[index - 1];
        }).filter(item => item !== false).join('');

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
                ${Array.from(reference).map((char, index) => {
                    let style = `font-family: monospace, monospace;`;
                    let title = '';
                    const pickIndex = pick.findIndex(value => value === index + 1);
                    if (pickIndex > -1) {
                        style += `background: #D8AE5C;`;
                        title = `Numéro ${index + 1} -> Position ${pickIndex + 1}`;
                    }
        
                    return `<span style="${style}" title="${title}">${char}</span>`;
                }).join('')}
            </div>
        `);
    }

    function init(form) {
        const isLoopInput = form.isLoop.parentNode.parentNode;

        function toggleIsLoop() {
            if (form.isRelative.checked) {
                isLoopInput.style.display = '';
            } else {
                isLoopInput.style.display = 'none';
            }
        }

        form.isRelative.addEventListener('change', function () {
            toggleIsLoop();
        });
        toggleIsLoop();
    }

    initForm('cueillette', update, init);
})();