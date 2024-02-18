function cutInWords(string, options = {}) {
    return string.match(/\p{L}+/gu);
}

function getInput(formData, name, options) {
    return formData.get(name)
        .split("\n")
        .map(function(line) {
            line = line.trim();
            if (!options.withLetter) {
                line = line.replace(/[A-Za-zÀ-ÿœ]/g, '');
            }
            if (!options.withNumber) {
                line = line.replace(/[0-9]/g, '');
            }
            if (!options.withSpaces) {
                line = line.replace(/\s/g, '');
            }
            if (!options.withPunctuation) {
                line = line.replace(/[^A-Za-zÀ-ÿœ0-9\s]/g, '');
            }
            if (options.mapper) {
                line = options.mapper(line);
            }

            return line;
        })
        .filter(Boolean);
}