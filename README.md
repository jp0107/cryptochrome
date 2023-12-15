# CryptoChrome

Cryptochrome is a Chrome extension that enables secure message encryption and decryption using public key cryptography. This extension allows users to encrypt messages with a recipient's public key and decrypt messages with their own private key.

## Features
Generate Key Pair: Users can generate their own public-private key pair.
Import Public Key: Users can import others' public keys to encrypt messages intended for them.
Encrypt Messages: Securely encrypt messages using a recipient's public key.
Decrypt Messages: Decrypt received messages using the user's private key.
Secure Key Storage: Public and private keys are stored securely within the browser.


## Installation
Download the extension files from the github repository (https://github.com/jp0107/cryptochrome)
Open Google Chrome and navigate to chrome://extensions/.
Enable "Developer Mode" at the top right.
Click on "Load unpacked" and select the extension's directory.

## Usage
### Generating a Key Pair
Key pairs are generated upon opening the extension 
### Encrypting a Message
Obtain the recipient's public key and paste it into the designated field.
Type your message in the message input area.
Click 'Encrypt'. The encrypted message will be displayed and can be copied and sent.
### Decrypting a Message
Copy the encrypted message received.
Open the extension and paste the encrypted message into the decryption field.
Click 'Decrypt'. If the correct private key is stored, the decrypted message will be displayed.
### Security
The extension uses RSA-OAEP for encryption and decryption. Private keys are stored securely and should never be shared. Ensure secure transmission of public keys.
