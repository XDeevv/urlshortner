// I commented everything because i'm a good person
// and the frontend is open source (and the most interesting part tbh)

const redtext = document.getElementById('redtext');

// Website urls
const defaultWebsite = "https://xdev.uno";
const backendUrl = "https://xdev-urlshortner-backend.vercel.app"; // do NOT include the '/'

// Website behaviour
window.addEventListener('load', function () {
    console.log("Document loaded...");

    // Get the id of the url (everything after the /)
    // There is a vercel.json that redirects traffic to index.html anyways
    const url = window.location.pathname;
    const id = url.substring(1);

    // Check if there is a link, if not directly redirect the user to the default website
    if (id.length < 1) {
        console.error("Url characters less expected");
        showMessageBox('Invalid URL.', function() {
            redirectToUrl(defaultWebsite);
        });
        return;
    }

    // Check if a password is required
    const xhrCheckPassword = new XMLHttpRequest();
    xhrCheckPassword.open('POST', `${backendUrl}/url_shortner/check_for_password`, true);
    xhrCheckPassword.setRequestHeader('Content-Type', 'application/json');

    xhrCheckPassword.onreadystatechange = function () {
        if (xhrCheckPassword.readyState === 4) {
            const passwordJson = JSON.parse(xhrCheckPassword.responseText);
            console.log(passwordJson.requires_password);
            if (passwordJson.requires_password) {
                const data = JSON.parse(xhrCheckPassword.responseText);
                if (data.requires_password === true) {
                    // If yes then prompt the user to enter it
                    showPrompt('Please enter the password.', 'password123', function(password) {
                        // Send a request to the server to get the url                        
                        const xhrGetUrl = new XMLHttpRequest();
                        xhrGetUrl.open('POST', `${backendUrl}/url_shortner/get_url`, true);
                        xhrGetUrl.setRequestHeader('Content-Type', 'application/json');

                        xhrGetUrl.onreadystatechange = function () {
                            if (xhrGetUrl.readyState === 4) {
                                if (xhrGetUrl.status === 200) {
                                    // Get the url and redirect the user to it
                                    const data = JSON.parse(xhrGetUrl.responseText);
                                    redirectToUrl(data.original_url);
                                } else {
                                    // If the password is wrong tell the user
                                    showMessageBox('Invalid password.', function() {
                                        redirectToUrl(defaultWebsite);
                                    });
                                }
                            }
                        };

                        xhrGetUrl.send(JSON.stringify({ url_name: id, password: password }));
                    });
                } else {
                    // If password is not required then directly get it
                    const xhrGetUrl = new XMLHttpRequest();
                    xhrGetUrl.open('POST', `${backendUrl}/url_shortner/get_url`, true);
                    xhrGetUrl.setRequestHeader('Content-Type', 'application/json');

                    xhrGetUrl.onreadystatechange = function () {
                        if (xhrGetUrl.readyState === 4) {
                            if (xhrGetUrl.status === 200) {
                                const data = JSON.parse(xhrGetUrl.responseText);
                                redirectToUrl(data.original_url);
                            } else {
                                showMessageBox('An unknown error occurred.', function() {
                                    redirectToUrl(defaultWebsite);
                                });
                            }
                        }
                    };

                    xhrGetUrl.send(JSON.stringify({ url_name: id }));
                }
            } else {
                console.error(`Failed to check for password, url id given: ${id}, readystate: ${xhrCheckPassword.readyState}, message: ${xhrCheckPassword.responseText}`);
                showMessageBox('An error occurred while checking for the password.', function() {
                    redirectToUrl(defaultWebsite);
                });
            }
        }
    };

    xhrCheckPassword.send(JSON.stringify({ url_name: id }));
});

// Function to redirect to the url
function redirectToUrl(url) {
    // Only keep the host name in order to look cooler
    const parsedUrl = new URL(url);
    let hostname = parsedUrl.hostname;
    redtext.textContent = `Redirecting to ${hostname}...`;

    window.location.href = url;
}
