// Basculer entre Connexion et Inscription
function afficherTab(tab, event) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    event.target.classList.add('active');
}

// Connexion
async function seConnecter() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert("Remplis tous les champs !");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, mot_de_passe: password })
        });

        const data = await res.json();

        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('nom', data.nom || '');
            window.location.href = "dashboard.html";
        } else {
            alert(data.erreur || "Email ou mot de passe incorrect");
        }
    } catch (error) {
        alert("Erreur serveur");
    }
}

// Inscription
async function sInscrire() {
    const nom = document.getElementById('reg-nom').value;
    const email = document.getElementById('reg-email').value;
    const ddn = document.getElementById('reg-ddn').value;
    const tel = document.getElementById('reg-tel').value;
    const password = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-password2').value;

    if (!nom || !email || !password || !ddn) {
        alert("⚠️ Remplis tous les champs obligatoires !");
        return;
    }

    if (password !== password2) {
        alert("❌ Les mots de passe ne correspondent pas !");
        return;
    }

    if (password.length < 6) {
        alert("⚠️ Le mot de passe doit faire au moins 6 caractères !");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom, email, mot_de_passe: password, ddn, tel })
        });

        const data = await res.json();

        if (data.message) {
            alert("✅ Compte créé avec succès ! Tu peux te connecter.");
            afficherTab('login', { target: document.querySelectorAll('.tab')[0] });
        } else {
            alert(data.erreur || "Erreur lors de l'inscription");
        }
    } catch (error) {
        alert("Erreur serveur");
    }
}
