// Global variables to hold the keys
let publicKey;
let privateKey;

document.addEventListener('DOMContentLoaded', function() {
    // Check if keys are generated
    chrome.storage.local.get(["publicKey", "privateKey"], function(result) {
        if (!result.publicKey || !result.privateKey) {
            // Prompt user to generate keys
            if (confirm("No keys detected. Would you like to generate them now?")) {
                chrome.runtime.sendMessage({ action: 'generate-keys' }, function(response) {
                    alert(response.status);
                    // After generation, load keys into variables
                    chrome.storage.local.get(["publicKey", "privateKey"], function(result) {
                        publicKey = result.publicKey;
                        privateKey = result.privateKey;
                    });
                });
            }
        } else {
            // Load keys into variables
            publicKey = result.publicKey;
            privateKey = result.privateKey;
        }
    });

    document.getElementById('showEncrypt').addEventListener('click', function() {
        showSection('encryptionSection');
    });
    document.getElementById('showDecrypt').addEventListener('click', function() {
        showSection('decryptionSection');
    });
    document.getElementById('encryptButton').addEventListener('click', encryptMessage);
    document.getElementById('decryptButton').addEventListener('click', decryptMessage);

    let backButtons = document.querySelectorAll('.backButton');
    backButtons.forEach(button => button.addEventListener('click', function() {
        showSection('mainMenu');
    }));

    document.getElementById('showMyKeys').addEventListener('click', function() {
        showSection('keyManagementSection');
        displayKeys();
    });
});

function encryptMessage() {
    let recipientPublicKeyInput = document.getElementById('recipientPublicKey').value;
    let message = document.getElementById('encryptionInput').value;

    if (!recipientPublicKeyInput || !message) {
        alert('Please enter both the recipient\'s public key and a message.');
        return;
    }

    chrome.runtime.sendMessage({
        action: 'encrypt',
        publicKey: recipientPublicKeyInput,
        message: message
    }, function(response) {
        if (response.error) {
            alert('Encryption error: ' + response.error);
        } else {
            document.getElementById('encryptedOutput').textContent = response.encryptedMessage;
        }
    });
}

function decryptMessage() {
    let encryptedMessage = document.getElementById('decryptionInput').value;

    if (!encryptedMessage) {
        alert('Please enter the encrypted message.');
        return;
    }

    chrome.runtime.sendMessage({
        action: 'decrypt',
        encryptedMessage: encryptedMessage
    }, function(response) {
        if (response.error) {
            alert('Decryption error: ' + response.error);
        } else {
            document.getElementById('decryptedOutput').textContent = response.decryptedMessage;
        }
    });
}

function showSection(sectionId) {
    // Hide all sections first
    ['mainMenu', 'encryptionSection', 'decryptionSection', 'keyManagementSection'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });

    // Then show the requested section
    document.getElementById(sectionId).style.display = 'block';

    // Apply large-ui class for encryption and decryption sections
    if (sectionId === 'encryptionSection' || sectionId === 'decryptionSection' || sectionId == 'keyManagementSection') {
        document.body.classList.add('large-ui');
    } else {
        document.body.classList.remove('large-ui');
    }
}

function displayKeys() {
    // Retrieve and display the keys from Chrome storage
    chrome.storage.local.get(["publicKey", "privateKey"], function(items) {
        document.getElementById('myPublicKey').textContent = items.publicKey ? JSON.stringify(items.publicKey, null, 2) : 'No Public Key';
    });
}

