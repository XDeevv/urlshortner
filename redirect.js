const redtext = $('#redtext');

$(window).on('load', function () {
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
    $.ajax({
        url: 'https://xdev-urlshortner-backend.vercel.app/urlshortner/check_for_password',
        type: 'GET',
        data: { url_name: id },
        contentType: 'application/json',
        success: function(data) {
            if (data.requires_password) {
                showPrompt('Please enter the password.', 'password123', function(password) {
                    $.ajax({
                        url: 'https://xdev-urlshortner-backend.vercel.app/urlshortner/get_url',
                        type: 'GET',
                        data: {
                            url_name: id,
                            password: password
                        },
                        contentType: 'application/json',
                        success: function(data) {
                            redirectToUrl(data.original_url);
                        },
                        error: function() {
                            showMessageBox('Invalid password.', function() {
                                redirectToUrl("https://xdev.uno/");
                            });
                        }
                    });
                });
            } else {
                $.ajax({
                    url: 'https://xdev-urlshortner-backend.vercel.app/urlshortner/get_url',
                    type: 'GET',
                    data: { url_name: id },
                    contentType: 'application/json',
                    success: function(data) {
                        redirectToUrl(data.original_url);
                    },
                    error: function() {
                        showMessageBox('An unknown error occurred.', function() {
                            redirectToUrl("https://xdev.uno/");
                        });
                    }
                });
            }
        },
        error: function() {
            console.error('Failed to check for password');
            showMessageBox('An error occurred while checking for the password.', function() {
                redirectToUrl("https://xdev.uno/");
            });
        }
    });
});

function redirectToUrl(url) {
    redtext.text(`Redirecting to ${url}...`);
    window.location.href = url;
}