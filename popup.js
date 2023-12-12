// popup.js
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('encryptButton').addEventListener('click', encryptMessage);
    document.getElementById('decryptButton').addEventListener('click', decryptMessage);
});

function encryptMessage() {
    var message = document.getElementById("encryptionInput").value;
    // Encryption logic here
    document.getElementById("encryptedOutput").innerText = "Encrypted message: " + message; // Placeholder
}

function decryptMessage() {
    var message = document.getElementById("decryptionInput").value;
    // Decryption logic here
    document.getElementById("decryptedOutput").innerText = "Decrypted message: " + message; // Placeholder
}
