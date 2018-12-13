const { Issuer } = require('openid-client');
const cookie = require('cookie');

const getIdentityClient = async () => {
  const aiIssuer = await Issuer.discover(process.env.AUTH_ROOT_URL);
  const client = new aiIssuer.Client({
    client_id: process.env.AUTH_CLIENT_ID,
    client_secret: process.env.AUTH_CLIENT_SECRET,
  });
  return client;
};

module.exports.getToken = (event) => {
  const { demo_access_token: accessToken } = cookie.parse(event.headers.Cookie);
  return accessToken;
};

module.exports.auth = async (event, context, callback) => {
  try {
    const client = await getIdentityClient();

    // Redirect to client
    const response = {
      statusCode: 301,
      headers: {
        Location: client.authorizationUrl({
          redirect_uri: `${process.env.LOCAL_URL}/auth/callback`,
          scope: 'openid profile avatax avatax_api',
          // Nonce should NOT be static in real apps..
          nonce: 'abkldjsfkn-0S6_WzA2Mj213434',
          client_id: process.env.AUTH_CLIENT_ID,
          response_type: 'id_token token',
          response_mode: 'form_post',
        }),
      },
      body: null,
    };

    return callback(null, response);
  } catch (err) {
    return callback('Unauthorized');
  }
};

module.exports.logout = async (event, context, callback) => {
  const client = await getIdentityClient();

  const response = {
    statusCode: 301,
    headers: {
      Location: client.endSessionUrl({}),
      'Set-Cookie': 'demo_access_token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
    },
  };

  return callback(null, response);
};
