/**
  This is the model that will allow me to track player's scores (total clicks),
  their autoclick, and the remaining score (after buying an autoclick upgrade)
* */

// - REQUIRE -
const models = require('../models');

// - VARIABLES, CONSTANTS -
const click = models.ClickModel;

// - RENDER FUNCTIONS -
const leaderboardPage = (req, res) => {
  res.render('leaderboard', { csrfToken: req.csrfToken() });
};

const accountPage = (req, res) => {
  res.render('account', { csrfToken: req.csrfToken() });
};

const gamePage = (req, res) => {
//  const username = `${req.session.username}`;
//  res.render('game', {
//    csrfToken: req.csrfToken(),
//    user: username,
//  });
  click.ClickModel.findByOwner = (req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "An error occurred" });
    }
    
    return res.render('game', {
      csrfToken: req.csrfToken(),
      user: username,
    });
  });
}

// - FUNCTIONS -
// const purchaseAutoclick = (req, res) => {
//
// }

const getToken = (req, res) => {
  const request = req;
  const response = res;

  const csrfToken = {
    csrfToken: request.csrfToken(),
  };

  response.json(csrfToken);
};

// - EXPORTS -
module.exports.leaderboardPage = leaderboardPage;
module.exports.accountPage = accountPage;
module.exports.gamePage = gamePage;
module.exports.getToken = getToken;
