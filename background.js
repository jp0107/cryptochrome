let publicKey, privateKey;

// Listener for extension installation or startup
chrome.runtime.onInstalled.addListener(() => {
    generateKeyPairIfNeeded();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generate-keys') {
        generateKeyPair().then(() => {
            sendResponse({ status: 'Key pair generated' });
        });
    } else if (request.action === 'encrypt') {
        // Parse the recipient's public key
        let jwkPublicKey = JSON.parse(request.publicKey);
        encryptMessage(request.message, jwkPublicKey).then(encryptedMessage => {
            sendResponse({ encryptedMessage });
        }).catch(error => {
            sendResponse({ error: error.message });
        });
    } else if (request.action === 'decrypt') {
        decryptMessage(request.encryptedMessage).then(decryptedMessage => {
            sendResponse({ decryptedMessage });
        }).catch(error => {
            sendResponse({ error: error.message });
        });
    }
    return true; // Indicates asynchronous response
});

function generateKeyPairIfNeeded() {
    chrome.storage.local.get(["publicKey", "privateKey"], function(items) {
        if (!items.publicKey || !items.privateKey) {
            // Keys do not exist, generate new key pair
            console.log("Generating new key pair...");
            generateKeyPair();
        } else {
            // Keys already exist
            console.log("Key pair already exists.");
        }
    });
}

function generateKeyPair() {
    return crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: { name: "SHA-256" }
        },
        true,
        ["encrypt", "decrypt"]
    )
    .then(keyPair => {
        publicKey = keyPair.publicKey;
        privateKey = keyPair.privateKey;

        // Export and store the public key
        crypto.subtle.exportKey("jwk", publicKey).then(exportedPublicKey => {
            chrome.storage.local.set({ publicKey: exportedPublicKey });
        });

        // Export and store the private key
        crypto.subtle.exportKey("jwk", privateKey).then(exportedPrivateKey => {
            chrome.storage.local.set({ privateKey: exportedPrivateKey });
        });
    })
    .catch(error => {
        console.error("Error generating key pair:", error);
    });
}

function encryptMessage(message, jwkPublicKey) {
    return crypto.subtle.importKey(
        "jwk", 
        jwkPublicKey,
        { name: "RSA-OAEP", hash: { name: "SHA-256" } },
        true,
        ["encrypt"]
    )
    .then(importedPublicKey => {
        let encodedMessage = new TextEncoder().encode(message);
        return crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            importedPublicKey,
            encodedMessage
        );
    })
    .then(encrypted => {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
    })
    .catch(error => {
        console.error("Encryption error:", error);
        throw error;
    });
}

function decryptMessage(encryptedMessage) {
    // Retrieve the private key from storage
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["privateKey"], function(items) {
            if (items.privateKey) {
                const jwkPrivateKey = items.privateKey;
                // Import the private key
                crypto.subtle.importKey(
                    "jwk", 
                    jwkPrivateKey,
                    { name: "RSA-OAEP", hash: { name: "SHA-256" } },
                    false, // private keys should be non-extractable
                    ["decrypt"]
                )
                .then(importedPrivateKey => {
                    // Decode the encrypted message and decrypt
                    let decodedMessage = new Uint8Array(atob(encryptedMessage).split("").map(char => char.charCodeAt(0)));
                    return crypto.subtle.decrypt(
                        { name: "RSA-OAEP" },
                        importedPrivateKey,
                        decodedMessage
                    );
                })
                .then(decrypted => {
                    resolve(new TextDecoder().decode(decrypted));
                })
                .catch(error => {
                    console.error("Decryption error:", error);
                    reject(error);
                });
            } else {
                reject(new Error("Private key not found"));
            }
        });
    });
}
