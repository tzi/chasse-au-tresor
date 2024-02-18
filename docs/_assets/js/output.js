function initOutput() {
    let hasError = false;

    function createDOM(html) {
        const fragment = document.createElement('div');
        fragment.innerHTML = html;

        return fragment.children[0];
    }

    const section = createDOM(`
        <div class="o-section">
            <div class="o-container">
                <h3 data-output="title"></h3>
                <div data-output="details"></div>
                <div data-output="media"></div>
            </div>
        </div>
    `);
    document.getElementById('output').appendChild(section);

    function setTitle(title) {
        section.querySelector('[data-output="title"]').innerHTML = title;
    }

    function setDetails(html) {
        section.querySelector('[data-output="details"]').innerHTML = html;
    }

    function addDetails(html) {
        section.querySelector('[data-output="details"]').innerHTML += html;
    }

    function setMedia(html) {
        section.querySelector('[data-output="media"]').innerHTML = html;
    }

    function clear() {
        hasError = false;
        section.remove();
    }

    function addError(details) {
        hasError = true;
        setTitle('Erreur');
        addDetails('<p>' + details + '</p>');
    }

    function getHasError() {
        return hasError;
    }

    return {
        addError,
        getHasError,
        setTitle,
        setDetails,
        setMedia,
        clear,
    };
}