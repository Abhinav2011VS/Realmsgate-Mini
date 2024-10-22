window.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html')) {
        window.electronAPI.verifyMinecraft()
            .then((result) => {
                document.getElementById('status').textContent = result;
                // Redirect if verification is successful
                if (result === 'Minecraft installation verified!') {
                    setTimeout(() => {
                        window.location.href = 'options.html';
                    }, 1000);
                }
            })
            .catch((error) => {
                document.getElementById('status').textContent = error;
                document.getElementById('status').style.color = 'red';
            });
    } else if (window.location.pathname.includes('options.html')) {
        const form = document.getElementById('optionsForm');

        // Load saved settings if any
        window.electronAPI.loadSettings().then(settings => {
            if (settings) {
                document.getElementById('username').value = settings.username;
                document.getElementById('version').value = settings.version;
                document.getElementById('modLoader').value = settings.modLoader;
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const version = document.getElementById('version').value;
            const modLoader = document.getElementById('modLoader').value;
            const skin = document.getElementById('skin').files[0];

            const settings = {
                username,
                version,
                modLoader,
                skin: skin ? skin.name : null
            };

            window.electronAPI.saveSettings(settings);
            window.electronAPI.launchMinecraft(settings);
        });
    }
});
