function initForm(formName, compute) {
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
        const url = window.location.hostname + window.location.pathname + '?' + serialized;
        share.setTitle('Partager / Sauvegarder');
        share.setDetails(`<a href="${url}">${url}</a>`);
    }

    if (!form) {
        return null;
    }
    url2form.init(formName);
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        update();
    });

    if (form.checkValidity()) {
        update();
    }
}