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
var clicks = 0;  // Total number of clicks; what will function as 'score'
var autoClicks = 0;  // Automatically click this amount of times/second
var clickRate = 1000;  // Time between auto clicks

// update clicks to the
const updateTotalClicks = () => {
  document.getElementById("totalClicks").innerHTML = clicks;
}

// - HANDLE FUNCTIONS -
/**
  All of these functions handle screen switching.
**/

// When our player actually clicks on the reset button, do this
const handleReset = (e) => {
  // prevent refresh
  e.preventDefault();
  
  // if values are missing
  if($('#oldPass').val() == "" || $('#newPass').val() == "" || $('#newPass2') == "") {
    console.log("handleReset::ERROR::FIELDS_MISSING");
    return false;
  }
  
  // if values don't match
  if($('#newPass').val() != $('#newPass2').val()) {
    console.log("handleReset::ERROR::PASSWORDS_DO_NOT_MATCH");
    return false;
  }
  
  sendAjax('POST', $('#resetForm').attr('action'), $('#resetForm').serialize(), redirect);
  
  return false;
}

// Make the game page and retrieve the ClickModel associated with each player
const gamePage = (res, req) => {
  ClickModel.ClickModel.findByOwner(req.session._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "ERROR" })
    }
    
    return res.render('game', { score: docs });
  });
}

// - VIEWABLE WINDOWS -
/**
  These are all of the different screens users will be able to navigate between when they are
  logged in.
**/

// Main Game Screen
const GameWindow = (props) => {
  return (  // JSX return
    <div id="gameAreaWrapper">
      <h2 id="totalClicks" className="totalClicks">0</h2>
      <button id="clickForScore" className="btn btn-default">click</button>
      <input type="hidden" name="_csrf" value={props.csrf}/>
    </div>
  );
}

// Reset Password Screen
const AccountWindow = (props) => {
  return (
    // We need a form for the reset. Include: Old password (to preven account stealing),
    // New password (entered twice)
    <form id="resetForm" name="resetForm"
          onSubmit={handleReset}
          action="/resetPassword"
          method="POST"
          className="mainForm">
          
      <input id="oldPass" type="password" name="oldPass" placeholder="current password" />
          
      <input id="newPass" type="text" name="newPass" placeholder="new password" />
      
      <input id="newPass2" type="password" name="newPass2" placeholder="re-type new password" />
      
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input id="resetFormSubmit" className="formSubmit" type="submit" value="reset password" />
    </form>
  );
}

const LeaderboardWindow = (props) => {
  return (
    // CREDIT TO https://www.tablesgenerator.com/html_tables#
    <table class="tg">
      <tr>
        <th class="tg-lx26">name</th>
        <th class="tg-lx26">total clicks</th>
      </tr>
      <tr>
        <td class="tg-a79m">example name</td>
        <td class="tg-a79m">example score</td>
      </tr>
    </table>
  );
}

// - SETUP -
const createGameWindow = (csrf) => {
  ReactDOM.render(
    <GameWindow csrf={csrf} />,
    document.querySelector('#content')
  );
}

const createAccountWindow = (csrf) => {
  ReactDOM.render(
    <AccountWindow csrf={csrf} />,
    document.querySelector('#content')
  );
}

const createLeaderboardWindow = (csrf) => {
  ReactDOM.render(
    <LeaderboardWindow csrf={csrf} />,
    document.querySelector('#content')
  );
}

const setup = (csrf) => {
  const gameButton = document.querySelector('#gameButton');
  const leaderboardButton = document.querySelector('#leaderboardButton');
  const accountButton = document.querySelector('#accountButton');
  
  gameButton.addEventListener('click', (e) => {
    e.preventDefault();
    createGameWindow(csrf);
    return false;
  })
  
  leaderboardButton.addEventListener('click', (e) => {
    e.preventDefault();
    createLeaderboardWindow(csrf);
    return false;
  });
  
  accountButton.addEventListener('click', (e) => {
    e.preventDefault();
    createAccountWindow(csrf);
    return false;
  })
  
  createGameWindow(csrf);
}

// - RDY -
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
