const token = localStorage.getItem('token');
const nom = localStorage.getItem('nom');

if (!token) window.location.href = 'index.html';

document.getElementById('nom-utilisateur').textContent = '👤 ' + nom;

let tousLesDocuments = [];


async function chargerCategories() {
    const res = await fetch('http://localhost:3000/api/documents/categories');
    const categories = await res.json();
    
    const select = document.getElementById('doc-categorie');
    const filtreSelect = document.getElementById('filtre-categorie');
    
    categories.forEach(cat => {
        const opt1 = document.createElement('option');
        opt1.value = cat.id;
        opt1.textContent = cat.nom;
        select.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = cat.nom;
        opt2.textContent = cat.nom;
        filtreSelect.appendChild(opt2);
    });
}


async function chargerDocuments() {
    const res = await fetch('http://localhost:3000/api/documents', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    tousLesDocuments = await res.json();
    filtrer();
}


function filtrer() {
    const recherche = document.getElementById('recherche').value.toLowerCase();
    const categorie = document.getElementById('filtre-categorie').value;
    const tri = document.getElementById('tri').value;

    let docs = [...tousLesDocuments];

    if (recherche) docs = docs.filter(d => d.nom.toLowerCase().includes(recherche));
    if (categorie) docs = docs.filter(d => d.categorie === categorie);

    if (tri === 'recent') docs.sort((a, b) => new Date(b.date_upload) - new Date(a.date_upload));
    if (tri === 'ancien') docs.sort((a, b) => new Date(a.date_upload) - new Date(b.date_upload));
    if (tri === 'nom') docs.sort((a, b) => a.nom.localeCompare(b.nom));

    afficherDocuments(docs);
}


function getIcone(path) {
    if (!path) return '📄';
    const ext = path.split('.').pop().toLowerCase();
    if (['jpg','jpeg','png','gif','webp'].includes(ext)) return '🖼️';
    if (ext === 'pdf') return '📕';
    if (['doc','docx'].includes(ext)) return '📝';
    if (['xls','xlsx'].includes(ext)) return '📊';
    return '📄';
}


function afficherDocuments(documents) {
    const liste = document.getElementById('liste-documents');
    if (documents.length === 0) {
        liste.innerHTML = '<p class="vide">📭 Aucun document trouvé</p>';
        return;
    }
    liste.innerHTML = documents.map(doc => `
        <div class="document-item">
            <div class="doc-gauche">
                <div class="doc-icone">${getIcone(doc.fichier_path)}</div>
                <div class="doc-info">
                    <h3>${doc.nom}</h3>
                    <p>${doc.description || 'Aucune description'} • ${new Date(doc.date_upload).toLocaleDateString('fr-FR')}</p>
                </div>
            </div>
            <div class="doc-droite">
                <span class="categorie-badge">${doc.categorie || 'Sans catégorie'}</span>
                <button class="btn-voir" onclick="previsualiser(${doc.id})">👁️ Voir</button>
                <button class="btn-supprimer" onclick="supprimerDocument(${doc.id})">🗑️</button>
            </div>
        </div>
    `).join('');
}


function previsualiser(id) {
    const doc = tousLesDocuments.find(d => d.id === id);
    if (!doc) return;

    document.getElementById('modal-titre').textContent = '📄 ' + doc.nom;
    const body = document.getElementById('modal-body');
    const ext = doc.fichier_path.split('.').pop().toLowerCase();
    const url = 'http://localhost:3000/' + doc.fichier_path;

    if (['jpg','jpeg','png','gif','webp'].includes(ext)) {
        body.innerHTML = `<img src="${url}" alt="${doc.nom}" />`;
    } else if (ext === 'pdf') {
        body.innerHTML = `<iframe src="${url}"></iframe>`;
    } else {
        body.innerHTML = `
            <div class="modal-info">
                <p><strong>📄 Nom :</strong> ${doc.nom}</p>
                <p><strong>📁 Catégorie :</strong> ${doc.categorie || 'Sans catégorie'}</p>
                <p><strong>📅 Date :</strong> ${new Date(doc.date_upload).toLocaleDateString('fr-FR')}</p>
                <p><strong>📝 Description :</strong> ${doc.description || 'Aucune'}</p>
                <br>
                <a href="${url}" download><button>⬇️ Télécharger</button></a>
            </div>`;
    }

    document.getElementById('modal').classList.add('active');
}

function fermerModal() {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('modal-body').innerHTML = '';
}


async function ajouterDocument() {
    const nom = document.getElementById('doc-nom').value;
    const description = document.getElementById('doc-description').value;
    const categorie_id = document.getElementById('doc-categorie').value;
    const fichier = document.getElementById('doc-fichier').files[0];

    if (!nom || !fichier) {
        document.getElementById('message-doc').textContent = '⚠️ Nom et fichier obligatoires !';
        return;
    }

    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('categorie_id', categorie_id);
    formData.append('fichier', fichier);

    const res = await fetch('http://localhost:3000/api/documents', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: formData
    });

    const data = await res.json();
    const msg = document.getElementById('message-doc');
    msg.textContent = data.message ? '✅ ' + data.message : '❌ ' + data.erreur;
    
    if (data.message) {
        document.getElementById('doc-nom').value = '';
        document.getElementById('doc-description').value = '';
        document.getElementById('doc-fichier').value = '';
        chargerDocuments();
    }
}


async function supprimerDocument(id) {
    if (!confirm('Supprimer ce document ?')) return;
    await fetch('http://localhost:3000/api/documents/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    chargerDocuments();
}

function seDeconnecter() {
    localStorage.removeItem('token');
    localStorage.removeItem('nom');
    window.location.href = 'index.html';
}


chargerCategories();
chargerDocuments();