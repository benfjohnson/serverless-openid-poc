const { getToken } = require('./auth');
const { fetchAccount } = require('./account');

module.exports.render = async (event, context, callback) => {
  const accessToken = getToken(event);
  const isLoggedIn = Boolean(accessToken);
  const account = await fetchAccount(accessToken);

  // Send client
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: `
      <!DOCTYPE html>
      <body style='font-family: Helvetica; margin: 15px;'>
        <h3>My neat Avalara App.</h3>
        ${isLoggedIn ? `Hello, ${account.authenticatedUserName}!` : '<button style=\'padding: 5px; margin-top: 10px;\' id=\'login\' onclick=\'loginClick()\'>Login</button>'}
        <br/>
        ${isLoggedIn ? '<button style=\'padding: 5px; margin-top: 10px;\' onclick=\'logoutClick()\'>Logout</button>' : ''}
        <script>
          const loginClick = () => window.location.assign('/auth');
          const logoutClick = () => window.location.assign('/logout');
          const fetchAccount = () => {
            fetch('/account', { credentials: "include" })
              .then(res => res.json)
              .then(json => {
                document.getElementById('accountName').innerHTML = json.authenticatedUserName;
              });
          }
        </script>
      </body>
    `,
  };

  return callback(null, response);
};
