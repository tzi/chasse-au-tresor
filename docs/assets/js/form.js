function initForm(formName, compute, init) {
    let share;
    const form = document.forms[formName];

    function update() {
        if (share) {
            share.clear();
        }

        const formData = new FormData(form);
        const serialized = new URLSearchParams(formData).toString();
        compute(formData);

        share = initOutput();
        const url = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + serialized;
        share.setTitle('Partager / Sauvegarder');
        share.setDetails(`
            <a href="${url}" style="display: block; font-size: 12px">
                Lien direct
            </a>
        `);
    }

    if (!form) {
        return null;
    }
    url2form.init(formName);
    if (init) {
        init(form);
    }
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        update();
    });

    if (form.checkValidity()) {
        update();
    }
}