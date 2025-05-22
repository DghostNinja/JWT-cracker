function readWordlist(file, callback) { const reader = new FileReader(); reader.onload = () => { const words = reader.result.split(/\r?\n/).filter(w => w.trim() !== ''); callback(words); }; reader.readAsText(file); }

function crackJWT() { const jwt = document.getElementById('jwtInput').value.trim(); const wordlistFile = document.getElementById('wordlistInput').files[0]; const resultDisplay = document.getElementById('result');

resultDisplay.className = ''; resultDisplay.textContent = '';

if (!jwt || !wordlistFile) { resultDisplay.textContent = 'Please input JWT and upload a wordlist.'; resultDisplay.className = 'error'; return; }

const parts = jwt.split('.'); if (parts.length !== 3) { resultDisplay.textContent = 'Invalid JWT format.'; resultDisplay.className = 'error'; return; }

const data = ${parts[0]}.${parts[1]}; const signature = parts[2];

readWordlist(wordlistFile, wordlist => { for (let secret of wordlist) { const hmac = CryptoJS.HmacSHA256(data, secret); const hash = CryptoJS.enc.Base64url.stringify(hmac); if (hash === signature) { resultDisplay.textContent = Secret found: ${secret}; resultDisplay.className = 'success'; return; } } resultDisplay.textContent = 'Secret not found in wordlist.'; resultDisplay.className = 'error'; }); }

function decodeJWT() { const jwt = document.getElementById('jwtInput').value.trim(); const parts = jwt.split('.'); if (parts.length !== 3) return alert('Invalid JWT');

try { const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(//g, '/'))); const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(//g, '/')));

document.getElementById('decodedHeader').value = JSON.stringify(header, null, 2);
document.getElementById('decodedPayload').value = JSON.stringify(payload, null, 2);

} catch (e) { alert('Failed to decode JWT'); } }

function encodeEditedJWT() { const headerJSON = document.getElementById('decodedHeader').value.trim(); const payloadJSON = document.getElementById('decodedPayload').value.trim(); const secret = document.getElementById('editSecret').value.trim();

if (!headerJSON || !payloadJSON || !secret) return alert('All fields required.');

try { const header = JSON.parse(headerJSON); const payload = JSON.parse(payloadJSON);

const encodedHeader = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const encodedPayload = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const data = `${encodedHeader}.${encodedPayload}`;

const hmac = CryptoJS.HmacSHA256(data, secret);
const signature = CryptoJS.enc.Base64url.stringify(hmac);

const fullJWT = `${data}.${signature}`;
document.getElementById('encodedResult').textContent = fullJWT;

} catch (e) { alert('Error encoding JWT'); } }

