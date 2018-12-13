const fetch = require('isomorphic-fetch');

const { getToken } = require('./auth');

const fetchAccount = async (token) => {
  try {
    const res = await fetch(`${process.env.AVATAX_URL}/api/v2/utilities/ping`, { headers: { Authorization: `Bearer ${token}` } });
    const { authenticatedUserName, authenticatedAccountId } = await res.json();
    return { authenticatedUserName, authenticatedAccountId };
  } catch (ex) {
    return {};
  }
};

module.exports.fetchAccount = fetchAccount;

module.exports.account = async (event, context, callback) => {
  const at = getToken(event);

  try {
    const accountInfo = await fetchAccount(at);
    // Redirect to client
    const response = {
      statusCode: 200,
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
      body: JSON.stringify(accountInfo),
    };

    return callback(null, response);
  } catch (err) {
    return callback('Unauthorized');
  }
};
