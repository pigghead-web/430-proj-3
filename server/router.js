// - REQUIRE -
// ./Controller and ./middleware
const controller = require('./controllers');
const mid = require('./middleware');

// - CONNECTIONS -
const router = (app) => {
  // /
  app.get('/', mid.requiresLogout, controller.Account.loginPage);

  // **TESTING REGISTER FUNCTION
  app.get('/register', controller.Account.loginPage);
  app.post('/register', controller.Account.register);
  
  // Login
  app.get('/login', mid.requiresLogout, controller.Account.loginPage);
  app.post('/login', mid.requiresLogout, controller.Account.login);

  // Signup
  app.get('/getToken', controller.Account.getToken);
  app.post('/signup', controller.Account.signup);

  // Game
  app.get('/game', mid.requiresLogin, (req, res) => {
    res.render('./game.handlebars');
  });

  // Logout
  app.get('/logout', controller.Account.logout);
  
  // Reset password
  app.post('/resetPassword', controller.Account.changePassword);

  // Construction
  // This will be a temporary path to reflect that this is still under construction
  app.get('/construction', controller.Account.constructionPage);

  app.get('/*', (req, res) => {
    res.render('./construction.handlebars', { csrfToken: req.csrfToken() });
  });

  // app.use((req, res))
};

module.exports = router;
