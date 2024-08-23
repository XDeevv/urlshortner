const redtext = document.getElementById("redtext");

window.addEventListener('load', function () {
    console.log("Document loaded...");

    const url = window.location.pathname;
    const id = url.substring(1);

    if (id.length !== 9) {
        showMessageBox('Invalid URL.', function() {
            redirectToUrl("https://xdev.uno/");
        });
        return;
    }

    fetch('https://xdev-urlshortner-backend.vercel.app/urlshortner/check_for_password', {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url_name: id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.requires_password) {
            showPrompt('Please enter the password.', 'password123', function(password) {
                fetch('https://xdev-urlshortner-backend.vercel.app/urlshortner/get_url', {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url_name: id, password: password })
                })
                .then(response => response.json())
                .then(data => {
                    redirectToUrl(data.original_url);
                })
                .catch(error => {
                    showMessageBox('Invalid password.', function() {
                        redirectToUrl("https://xdev.uno/");
                    });
                });
            });
        } else {
            fetch('https://xdev-urlshortner-backend.vercel.app/urlshortner/get_url', {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url_name: id })
            })
            .then(response => response.json())
            .then(data => {
                redirectToUrl(data.original_url);
            })
            .catch(error => {
                showMessageBox('An unknown error occurred.', function() {
                    redirectToUrl("https://xdev.uno/");
                });
            });
        }
    })
    .catch(error => {
        showMessageBox('An error occurred while checking for the password.', function() {
            console.error(`Failed to check for password: ${error}`);
            redirectToUrl("https://xdev.uno/");
        });
    });
});

function redirectToUrl(url) {
    redtext.innerHTML = `Redirecting to ${url}...`;
    window.location.href = url;
}