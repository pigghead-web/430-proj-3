"use strict";

var clicks = 0; // Total number of clicks; what will function as 'score'

var autoClicks = 0; // Automatically click this amount of times/second

var clickRate = 1000; // Time between auto clicks
// - HANDLE FUNCTIONS -

/**
  All of these functions handle screen switching.
**/
// When our player actually clicks on the reset button, do this

var handleReset = function handleReset(e) {
  // prevent refresh
  e.preventDefault(); // if values are missing

  if ($('#oldPass').val() == "" || $('#newPass').val() == "" || $('#newPass2') == "") {
    console.log("handleReset::ERROR::FIELDS_MISSING");
    return false;
  } // if values don't match


  if ($('#newPass').val() != $('#newPass2').val()) {
    console.log("handleReset::ERROR::PASSWORDS_DO_NOT_MATCH");
    return false;
  }

  console.log($('#resetForm').serialize());
  sendAjax('POST', $('#resetForm').attr('action'), $('#resetForm').serialize(), redirect);
  return false;
};

var handlePurchase = function handlePurchase(e) {
  e.preventDefault();
  var tier = e.target.id; //console.log(e.target.value);

  var data = {
    clicks: 0,
    price: 0,
    _csrf: e.target.value
  };

  if (tier == 't1') {
    // tier 1
    data.clicks = 100;
    data.price = 4.99;
  } else if (tier == 't2') {
    // tier 2
    data.clicks = 200;
    data.price = 8.99;
  } else {
    console.log("tier not recognized");
    return false;
  }

  console.log(JSON.stringify(data));
  sendAjax('POST', '/purchaseClicks', data, redirect);
  return false;
};

var handleFunds = function handleFunds(e) {
  e.preventDefault();
  sendAjax('POST', '/addFunds', null, redirect);
  return false;
}; //const t1Purchase = (e) => {
//  sendAjax('POST', '/t1purchase', { clicks: 100, price: 4.99 }, redirect);
//}
//
//const t2Purchase = (e) => {
//  sendAjax('POST', '/t2purchase', { clicks: 200, price: 8.99 }, redirect);
//}
// Make the game page and retrieve the ClickModel associated with each player


var gamePage = function gamePage(res, req) {
  ClickModel.ClickModel.findByOwner(req.session._id, function (err, docs) {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "ERROR"
      });
    }

    return res.render('game', {
      score: docs
    });
  });
}; // - VIEWABLE WINDOWS -

/**
  These are all of the different screens users will be able to navigate between when they are
  logged in.
**/
// Main Game Screen


var GameWindow = function GameWindow(props) {
  var updateTotalClicks = function updateTotalClicks(e) {
    clicks++;
  };

  return (// JSX return
    React.createElement("div", {
      id: "gameAreaWrapper"
    }, React.createElement("h2", {
      id: "totalClicks",
      className: "totalClicks"
    }, "Total Clicks:", props.clicks), React.createElement("button", {
      onClick: updateTotalClicks,
      id: "clickForScore",
      className: "btn btn-default"
    }, "click"), React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }))
  );
}; // Reset Password Screen


var AccountWindow = function AccountWindow(props) {
  return (// We need a form for the reset. Include: Old password (to prevent account stealing),
    // New password (entered twice)
    React.createElement("form", {
      id: "resetForm",
      name: "resetForm",
      onSubmit: handleReset,
      action: "/resetPassword",
      method: "POST",
      className: "mainForm"
    }, React.createElement("input", {
      id: "oldPass",
      type: "password",
      name: "oldPass",
      placeholder: "current password"
    }), React.createElement("input", {
      id: "newPass",
      type: "text",
      name: "newPass",
      placeholder: "new password"
    }), React.createElement("input", {
      id: "newPass2",
      type: "password",
      name: "newPass2",
      placeholder: "re-type new password"
    }), React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), React.createElement("input", {
      id: "resetFormSubmit",
      className: "formSubmit",
      type: "submit",
      value: "reset password"
    }))
  );
};

var LeaderboardWindow = function LeaderboardWindow(props) {
  return (// CREDIT TO https://www.tablesgenerator.com/html_tables#
    React.createElement("table", {
      "class": "tg"
    }, React.createElement("tr", null, React.createElement("th", {
      "class": "tg-lx26"
    }, "name"), React.createElement("th", {
      "class": "tg-lx26"
    }, "total clicks")), React.createElement("tr", null, React.createElement("td", {
      "class": "tg-a79m"
    }, "example name"), React.createElement("td", {
      "class": "tg-a79m"
    }, "example score")))
  );
};

var StoreWindow = function StoreWindow(props) {
  return React.createElement("table", null, React.createElement("tr", null, React.createElement("button", {
    id: "t1",
    className: "store-button",
    onClick: handlePurchase,
    value: props.csrf
  }, "100 clicks / $4.99")), React.createElement("tr", null, React.createElement("button", {
    id: "t2",
    className: "store-button",
    onClick: handlePurchase,
    value: props.csrf
  }, "200 clicks / $4.99")), React.createElement("tr", null, React.createElement("input", {
    type: "disabled",
    value: "credit card # here",
    disabled: "true"
  }), React.createElement("button", {
    id: "addFunds",
    className: "store-button",
    onClick: handleFunds,
    value: props.csrf
  }, "Add $5.00")), React.createElement("tr", null, React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  })));
}; // - SETUP -


var createGameWindow = function createGameWindow(csrf) {
  ReactDOM.render(React.createElement(GameWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
};

var createAccountWindow = function createAccountWindow(csrf) {
  ReactDOM.render(React.createElement(AccountWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
};

var createLeaderboardWindow = function createLeaderboardWindow(csrf) {
  ReactDOM.render(React.createElement(LeaderboardWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
};

var createStoreWindow = function createStoreWindow(csrf) {
  ReactDOM.render(React.createElement(StoreWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
};

var setup = function setup(csrf) {
  var gameButton = document.querySelector('#gameButton');
  var leaderboardButton = document.querySelector('#leaderboardButton');
  var accountButton = document.querySelector('#accountButton');
  var storeButton = document.querySelector('#storeButton');
  gameButton.addEventListener('click', function (e) {
    e.preventDefault();
    createGameWindow(csrf);
    return false;
  });
  leaderboardButton.addEventListener('click', function (e) {
    e.preventDefault();
    createLeaderboardWindow(csrf);
    return false;
  });
  accountButton.addEventListener('click', function (e) {
    e.preventDefault();
    createAccountWindow(csrf);
    return false;
  });
  storeButton.addEventListener('click', function (e) {
    e.preventDefault();
    createStoreWindow(csrf);
    return false;
  });
  createGameWindow(csrf);
}; // - RDY -


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  //debugger;
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      console.log(xhr.responseText);
    }
  });
};
