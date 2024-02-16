/*i

mport Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  url: process.env.REACT_APP_KEYCLOAK_URL,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID
});

// // must match to the configured value in keycloak
// redirectUri: 'http://localhost:4200/your_url',   

keycloak.init({ 
  onLoad: 'login-required',
  checkLoginIframe: false,
  pkceMethod: 'S256'
  }).then((auth) => {
  if (auth) {
    console.log('Authenticated');
  } else {
    console.log('Not Authenticated');
  }
});

export { keycloak };

*/