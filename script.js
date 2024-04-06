document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner les éléments HTML
    const imageUpload = document.getElementById('imageUpload');
    const textToAdd = document.getElementById('textToAdd');
    const textColor = document.getElementById('textColor');
    const textPosition = document.getElementById('textPosition');
    const previewButton = document.getElementById('previewButton');
    const downloadButton = document.getElementById('downloadButton');
    const facebookShareButton = document.getElementById('facebookShareButton');
    const twitterShareButton = document.getElementById('twitterShareButton');
    const galleryButton = document.getElementById('galleryButton');
    const previewArea = document.getElementById('previewArea');
    const galleryContainer = document.getElementById('gallery');

    // Fonction pour sauvegarder le mème dans la galerie
    function saveMemeToGallery(imageDataURL) {
        let memes = JSON.parse(localStorage.getItem('memes')) || [];
        memes.push(imageDataURL);
        localStorage.setItem('memes', JSON.stringify(memes));
    }

    // Fonction pour afficher la galerie
    function displayGallery() {
        galleryContainer.innerHTML = '';

        const memes = JSON.parse(localStorage.getItem('memes')) || [];
        memes.forEach((meme, index) => {
            const img = document.createElement('img');
            img.src = meme;
            img.alt = 'Meme ' + index;
            galleryContainer.appendChild(img);
        });
    }

    // Fonction pour partager le mème sur Facebook
    function shareOnFacebook(imageDataURL) {
        const shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(imageDataURL);
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }


    // Fonction pour partager le mème sur Twitter
    function shareOnTwitter(imageDataURL) {
        const twitterShareUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(imageDataURL);
        window.open(twitterShareUrl, '_blank');
    }

    // Écouter l'événement de click sur le bouton d'aperçu
    previewButton.addEventListener('click', () => {
        // Vérifier si une image est sélectionnée
        if (imageUpload.files.length === 0) {
            alert('Veuillez sélectionner une image.');
            return;
        }

        // Créer un objet FileReader pour lire l'image sélectionnée
        const reader = new FileReader();
        reader.onload = function(event) {
            // Créer un élément <img> pour afficher l'image
            const img = new Image();
            img.onload = function() {
                // Créer un élément <canvas> pour superposer le texte sur l'image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                // Dessiner l'image sur le canvas
                ctx.drawImage(img, 0, 0);

                // Ajouter le texte sur l'image
                const text = textToAdd.value;
                ctx.fillStyle = textColor.value;
                ctx.font = '30px Arial';
                ctx.textAlign = 'center';
                // Position du texte en fonction de la sélection de l'utilisateur
                if (textPosition.value === 'bottom') {
                    ctx.fillText(text, canvas.width / 2, canvas.height - 20);
                } else if (textPosition.value === 'middle') {
                    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
                } else if (textPosition.value === 'top') {
                    ctx.fillText(text, canvas.width / 2, 40);
                }

                // Afficher l'aperçu dans la zone de prévisualisation
                previewArea.innerHTML = '';
                previewArea.appendChild(canvas);

                // Afficher les boutons de téléchargement et de partage
                downloadButton.style.display = 'block';
                facebookShareButton.style.display = 'block';
                twitterShareButton.style.display = 'block';
            };
            img.src = event.target.result;
        };

        // Lire l'image sélectionnée en tant que Data URL
        reader.readAsDataURL(imageUpload.files[0]);
    });

    // Écouter l'événement de click sur le bouton de téléchargement
    downloadButton.addEventListener('click', () => {
        const canvas = previewArea.querySelector('canvas');
        const imageDataURL = canvas.toDataURL();

        // Télécharger le mème
        const downloadLink = document.createElement('a');
        downloadLink.href = imageDataURL;
        downloadLink.download = 'meme.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Sauvegarder le mème dans la galerie
        saveMemeToGallery(imageDataURL);
    });

    // Écouter l'événement de click sur le bouton de partage sur Facebook
    facebookShareButton.addEventListener('click', () => {
        const canvas = previewArea.querySelector('canvas');
        const imageDataURL = canvas.toDataURL();

        // Appeler la fonction de partage sur Facebook
        shareOnFacebook(imageDataURL);
    });

    // Écouter l'événement de click sur le bouton de partage sur Twitter
    twitterShareButton.addEventListener('click', () => {
        const canvas = previewArea.querySelector('canvas');
        const imageDataURL = canvas.toDataURL();

        // Appeler la fonction de partage sur Twitter
        shareOnTwitter(imageDataURL);
    });

    // Afficher la galerie lors du chargement de la page
    displayGallery();

    // Écouter l'événement de click sur le bouton de galerie
    galleryButton.addEventListener('click', () => {
        // Afficher la galerie
        galleryContainer.style.display = 'flex';
    });
});