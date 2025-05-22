function base64UrlDecode(input) { input = input.replace(/-/g, '+').replace(/_/g, '/'); const pad = input.length % 4; if (pad) input += '='.repeat(4 - pad); return atob(input); }

function base64UrlEncode(input) { return btoa(input).replace(/+/g, '-').replace(///g, '_').replace(/=+$/, ''); }

function autoDecodeJWT() { const jwtInput = document.getElementById('jwtInput').value.trim(); const parts = jwtInput.split('.'); if (parts.length !== 3) return;

try { const header = JSON.parse(base64UrlDecode(parts[0])); const payload = JSON.parse(base64UrlDecode(parts[1]));

document.getElementById('decodedHeader').value = JSON.stringify(header, null, 2);
document.getElementById('decodedPayload').value = JSON.stringify(payload, null, 2);

} catch (e) { console.warn('Failed to decode:', e.message); } }

function readWordlist(file, callback) { const reader = new FileReader(); reader.onload = () => { const words = reader.result.split(/\r?\n/).filter(w => w.trim() !== ''); callback(words); }; reader.readAsText(file); }

function crackJWT() { const jwt = document.getElementById('jwtInput').value.trim(); const wordlistFile = document.getElementById('wordlistInput').files[0]; const resultDisplay = document.getElementById('result');

resultDisplay.className = ''; resultDisplay.textContent = '';

if (!jwt || !wordlistFile) { resultDisplay.textContent = 'Please input JWT and upload a wordlist.'; resultDisplay.className = 'error'; return; }

const parts = jwt.split('.'); if (parts.length !== 3) { resultDisplay.textContent = 'Invalid JWT format.'; resultDisplay.className = 'error'; return; }

try { const headerJson = JSON.parse(base64UrlDecode(parts[0])); if (headerJson.alg !== 'HS256') { resultDisplay.textContent = Unsupported algorithm (${headerJson.alg}). Only HS256 is supported.; resultDisplay.className = 'error'; return; } } catch (e) { resultDisplay.textContent = 'Invalid JWT header.'; resultDisplay.className = 'error'; return; }

const data = ${parts[0]}.${parts[1]}; const signature = parts[2];

readWordlist(wordlistFile, wordlist => { for (let secret of wordlist) { const hmac = CryptoJS.HmacSHA256(data, secret); const hash = CryptoJS.enc.Base64url.stringify(hmac); if (hash === signature) { resultDisplay.textContent = Secret found: ${secret}; resultDisplay.className = 'success'; return; } } resultDisplay.textContent = 'Secret not found in wordlist.'; resultDisplay.className = 'error'; }); }

function updateJWTFromEdits() { const headerJSON = document.getElementById('decodedHeader').value.trim(); const payloadJSON = document.getElementById('decodedPayload').value.trim(); const secret = document.getElementById('editSecret').value.trim(); const jwtInput = document.getElementById('jwtInput'); const output = document.getElementById('encodedResult');

try { const header = JSON.parse(headerJSON); const payload = JSON.parse(payloadJSON);

const encodedHeader = base64UrlEncode(JSON.stringify(header));
const encodedPayload = base64UrlEncode(JSON.stringify(payload));
const data = `${encodedHeader}.${encodedPayload}`;
let fullJWT = data;

if (secret) {
  const hmac = CryptoJS.HmacSHA256(data, secret);
  const signature = CryptoJS.enc.Base64url.stringify(hmac);
  fullJWT += `.${signature}`;
}

jwtInput.value = fullJWT;
output.textContent = fullJWT;

} catch (e) { output.textContent = 'Invalid JSON format'; } }

document.addEventListener('DOMContentLoaded', () => { document.getElementById('jwtInput').addEventListener('input', autoDecodeJWT); document.getElementById('decodedHeader').addEventListener('input', updateJWTFromEdits); document.getElementById('decodedPayload').addEventListener('input', updateJWTFromEdits); document.getElementById('editSecret').addEventListener('input', updateJWTFromEdits); });

