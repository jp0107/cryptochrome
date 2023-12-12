// Global variables to hold the keys
let publicKey;
let privateKey;

// Adding event listeners after the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('showEncrypt').addEventListener('click', function() {
        showSection('encryptionSection');
        document.body.classList.add('large-ui'); // Make UI larger
    });
    document.getElementById('showDecrypt').addEventListener('click', function() {
        showSection('decryptionSection');
        document.body.classList.add('large-ui'); // Make UI larger
    });
    document.getElementById('encryptButton').addEventListener('click', encryptMessage);
    document.getElementById('decryptButton').addEventListener('click', decryptMessage);
    

    let backButtons = document.querySelectorAll('.backButton');
    backButtons.forEach(button => button.addEventListener('click', function() {
        showSection('mainMenu');
        document.body.classList.remove('large-ui'); // Make UI smaller again
    }));
});

function showSection(sectionId) {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('encryptionSection').style.display = 'none';
    document.getElementById('decryptionSection').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
}


// Function to generate a public-private key pair
function generateKeyPair() {
    window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",  // RSA-OAEP is the algorithm used for the key generation
            modulusLength: 2048,  // The length of the modulus in bits; 2048 is a common choice
            publicExponent: new Uint8Array([1, 0, 1]),  // Public exponent; 65537 is a common choice (encoded as [1, 0, 1])
            hash: {name: "SHA-256"},  // The hash function used; SHA-256 is a common choice
        },
        true,  // The keys are set to be extractable
        ["encrypt", "decrypt"]  // The key pair can be used for encryption and decryption
    )
    .then((keyPair) => {
        publicKey = keyPair.publicKey;
        privateKey = keyPair.privateKey;
        // Additional code to handle the public key (e.g., display or store it) goes here
        // Remember to securely store the private key
    })
    .catch((err) => {
        console.error(err);
    });
}

// Function to encrypt a message using the public key
function encryptMessage() {
    let message = document.getElementById("encryptionInput").value;
    window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"  // Using RSA-OAEP algorithm for encryption
        },
        publicKey,  // Using the generated public key
        new TextEncoder().encode(message)  // Encoding the message as a byte array
    )
    .then((encrypted) => {
        // The encrypted data is in the form of an ArrayBuffer; converting it to a string
        let encoded = btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
        document.getElementById("encryptedOutput").innerText = encoded;
    })
    .catch((err) => {
        console.error(err);
    });
}

// Function to decrypt a message using the private key
function decryptMessage() {
    let encodedMessage = document.getElementById("decryptionInput").value;
    // Converting the base64-encoded string back to an ArrayBuffer
    let encrypted = new Uint8Array(atob(encodedMessage).split("").map(char => char.charCodeAt(0)));

    window.crypto.subtle.decrypt(
        {
            name: "RSA-OAEP"  // Using RSA-OAEP algorithm for decryption
        },
        privateKey,  // Using the generated private key
        encrypted  // The encrypted data as a byte array
    )
    .then((decrypted) => {
        // Decoding the decrypted data back to a string
        let dec = new TextDecoder().decode(decrypted);
        document.getElementById("decryptedOutput").innerText = dec;
    })
    .catch((err) => {
        console.error(err);
    });
}
