// - FUNCTIONS -
// If we aren't logged in, navigate to the default/ main page
const requiresLogin = (req, res, next) => {
  console.log('requires login triggered');
  if (!req.session.account) {
    return res.redirect('/');
  }

  return next();
};

// If we are logged out, keep us where we need to be
const requiresLogout = (req, res, next) => {
  console.log(req.session);
  if (req.session.account) {
    return res.redirect('/game');
  }

  return next();
};

const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }

  return next();
};

const bypassSecure = (req, res, next) => next();

// - EXPORTS -
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// Environment Variable
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
