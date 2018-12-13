const querystring = require('querystring');

module.exports.authCallback = async (event, context, callback) => {
  // Grab relevant userInfo (token, email, etc)
  const params = querystring.parse(event.body);
  const accessToken = params.access_token;

  // Stash in Dynamo with an expiration of 1 hour

  // Redirect to client
  const response = {
    statusCode: 301,
    headers: {
      Location: process.env.APP_URL,
      'Set-Cookie': `demo_access_token=${accessToken}; Path=/`,
    },
    body: null,
  };

  return callback(null, response);
};
