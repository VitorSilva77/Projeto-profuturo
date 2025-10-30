document.addEventListener('DOMContentLoaded', async () => {

    const logoutBtn = document.querySelector('.logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.auth.logout();
            window.location.href = 'index.html';
        });
    }

    const session = await window.auth.getUserSession();
    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    applyUIPermissions(session.permissions);
    loadDynamicContent(session.permissions);
});

function applyUIPermissions(permissions) {
    const elements = {
        'viewAllCourses': document.querySelector('section.courses'),
        'manageUsers': document.querySelector('section.registration'),
        'postOnMural': document.querySelector('section.mural'),
    };

    Object.entries(elements).forEach(([perm, el]) => {
        if (!el) return;
        el.style.display = permissions.includes(perm) ? '' : 'none';
    });
}

async function loadDynamicContent(permissions) {
   
}


const form = document.getElementById('formNotice');
if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const tipoAviso = document.getElementById('typeNotice').value;
        const tituloAviso = document.getElementById('tituloAviso').value;
        const descricaoAviso = document.getElementById('descricaoAviso').value;

        const avisoDiv = document.createElement('div');
        avisoDiv.classList.add('aviso', tipoAviso);

        const tipoAvisoElement = document.createElement('div');
        tipoAvisoElement.classList.add('tipo-aviso');
        tipoAvisoElement.textContent = tipoAviso.charAt(0).toUpperCase() + tipoAviso.slice(1);

        const tituloAvisoElement = document.createElement('h4');
        tituloAvisoElement.textContent = tituloAviso;

        const descricaoAvisoElement = document.createElement('p');
        descricaoAvisoElement.textContent = descricaoAviso;

        avisoDiv.appendChild(tipoAvisoElement);
        avisoDiv.appendChild(tituloAvisoElement);
        avisoDiv.appendChild(descricaoAvisoElement);

        document.getElementById('avisosList').appendChild(avisoDiv);
        form.reset();
    });
}