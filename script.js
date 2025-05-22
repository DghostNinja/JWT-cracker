function decodeJWT(jwt) {
  const [header, payload] = jwt.split('.');
  document.getElementById('decodedHeader').value = JSON.stringify(JSON.parse(atob(header.replace(/-/g, '+').replace(/_/g, '/'))), null, 2);
  document.getElementById('decodedPayload').value = JSON.stringify(JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))), null, 2);
}

function encodeEditedJWT() {
  const header = JSON.parse(document.getElementById('decodedHeader').value);
  const payload = JSON.parse(document.getElementById('decodedPayload').value);
  const secret = document.getElementById('editSecret').value;

  const encodedHeader = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const data = `${encodedHeader}.${encodedPayload}`;

  const hmac = CryptoJS.HmacSHA256(data, secret);
  const signature = CryptoJS.enc.Base64url.stringify(hmac);

  document.getElementById('encodedResult').textContent = `${data}.${signature}`;
}
