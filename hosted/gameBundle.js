"use strict";

// - VARIABLES & CONSTANTS -
//var speed = 1000;  // how fast the game will go
//
//// An object to store the elapsed time
//var gameTimeData = {
//  hour: 1,
//  day: 1,
//  month: 1,
//  year: 1
//}
//
//var gameTimer = setInterval(function() {
//  addHour();
//}, speed);
//
//const addHour = () => {
//  if (hour !== 24) {
//    gameTimeData.hour++;
//  } else {
//    gameTimeData.hour = 1;
//    addDay();
//  }
//  console.log("Hour is now: " + gameTimeData.hour);
//}
//
//const addDay = () => {
//  if(!monthEnd()) {
//    gameTimeData.day++;
//  } else {
//    gameTimeData.day = 1;
//    addMonth();
//  }
//  console.log("Day is now: " + gameTimeData.day);
//}
//
//const monthEnd = () => {
//  var endofMonth = false;
//  
//  switch (true) {
//      case(gameTimeData.month === 1)
//  }
//}
//
//const addMonth = () => {
//  
//}
var clicks = 0; // Total number of clicks; what will function as 'score'

var autoClicks = 0; // Automatically click this amount of times/second

var clickRate = 1000; // Time between auto clicks
// update clicks to the

var updateTotalClicks = function updateTotalClicks() {
  document.getElementById("totalClicks").innerHTML = clicks;
}; // - HANDLE FUNCTIONS -

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

  sendAjax('POST', $('#resetForm').attr('action'), $('#resetForm').serialize(), redirect);
  return false;
}; // Make the game page and retrieve the ClickModel associated with each player


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
  return (// JSX return
    React.createElement("div", {
      id: "gameAreaWrapper"
    }, React.createElement("h2", {
      id: "totalClicks",
      className: "totalClicks"
    }, "0"), React.createElement("button", {
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
  return (// We need a form for the reset. Include: Old password (to preven account stealing),
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

var setup = function setup(csrf) {
  var gameButton = document.querySelector('#gameButton');
  var leaderboardButton = document.querySelector('#leaderboardButton');
  var accountButton = document.querySelector('#accountButton');
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
