const redtext = document.getElementById('redtext');

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

    // Check if a password is required
    const xhrCheckPassword = new XMLHttpRequest();
    xhrCheckPassword.open('GET', 'https://xdev-urlshortner-backend.vercel.app/url_shortner/check_for_password', true);
    xhrCheckPassword.setRequestHeader('Content-Type', 'application/json');

    xhrCheckPassword.onreadystatechange = function () {
        if (xhrCheckPassword.readyState === 4) {
            const passwordJson = JSON.parse(xhrCheckPassword.responseText);
            if (passwordJson.requires_password) {
                const data = JSON.parse(xhrCheckPassword.responseText);
                if (data.requires_password) {
                    showPrompt('Please enter the password.', 'password123', function(password) {
                        const xhrGetUrl = new XMLHttpRequest();
                        xhrGetUrl.open('GET', 'https://xdev-urlshortner-backend.vercel.app/url_shortner/get_url', true);
                        xhrGetUrl.setRequestHeader('Content-Type', 'application/json');

                        xhrGetUrl.onreadystatechange = function () {
                            if (xhrGetUrl.readyState === 4) {
                                if (xhrGetUrl.status === 200) {
                                    const data = JSON.parse(xhrGetUrl.responseText);
                                    redirectToUrl(data.original_url);
                                } else {
                                    showMessageBox('Invalid password.', function() {
                                        redirectToUrl("https://xdev.uno/");
                                    });
                                }
                            }
                        };

                        xhrGetUrl.send(JSON.stringify({ url_name: id, password: password }));
                    });
                } else {
                    const xhrGetUrl = new XMLHttpRequest();
                    xhrGetUrl.open('GET', 'https://xdev-urlshortner-backend.vercel.app/url_shortner/get_url', true);
                    xhrGetUrl.setRequestHeader('Content-Type', 'application/json');

                    xhrGetUrl.onreadystatechange = function () {
                        if (xhrGetUrl.readyState === 4) {
                            if (xhrGetUrl.status === 200) {
                                const data = JSON.parse(xhrGetUrl.responseText);
                                redirectToUrl(data.original_url);
                            } else {
                                showMessageBox('An unknown error occurred.', function() {
                                    redirectToUrl("https://xdev.uno/");
                                });
                            }
                        }
                    };

                    xhrGetUrl.send(JSON.stringify({ url_name: id }));
                }
            } else {
                console.error(`Failed to check for password, url id given: ${id}, readystate: ${xhrCheckPassword.readyState}, message: ${xhrCheckPassword.responseText}`);
                showMessageBox('An error occurred while checking for the password.', function() {
                    redirectToUrl("https://xdev.uno/");
                });
            }
        }
    };

    xhrCheckPassword.send(JSON.stringify({ url_name: id }));
});

function redirectToUrl(url) {
    redtext.textContent = `Redirecting to ${url}...`;
    window.location.href = url;
}
