var clicks = 0;  // Total number of clicks; what will function as 'score'
var autoClicks = 0;  // Automatically click this amount of times/second
var clickRate = 1000;  // Time between auto clicks

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
  
  console.log($('#resetForm').serialize());
  
  sendAjax('POST', $('#resetForm').attr('action'), $('#resetForm').serialize(), redirect);
  
  return false;
}

const handlePurchase = (e) => {
  e.preventDefault();
  
  const tier = e.target.id;
  
  //console.log(e.target.value);
  
  const data = {
    clicks: 0,
    price: 0,
    _csrf: e.target.value
  }
  
  if (tier == 't1') {  // tier 1
    data.clicks = 100;
    data.price = 4.99;
  } else if (tier == 't2') {  // tier 2
    data.clicks = 200;
    data.price = 8.99;
  } else {
    console.log("tier not recognized");
    return false;
  }
  
  console.log(JSON.stringify(data));
  
  sendAjax('POST', '/purchaseClicks', data, redirect);
  
  return false;
}

const handleFunds = (e) => {
  e.preventDefault();
  
  sendAjax('POST', '/addFunds', null, redirect);
  
  return false;
}

//const t1Purchase = (e) => {
//  sendAjax('POST', '/t1purchase', { clicks: 100, price: 4.99 }, redirect);
//}
//
//const t2Purchase = (e) => {
//  sendAjax('POST', '/t2purchase', { clicks: 200, price: 8.99 }, redirect);
//}

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
  const updateTotalClicks = (e) => {
    clicks++;
  }
  
  return (  // JSX return
    <div id="gameAreaWrapper">
      <h2 id="totalClicks" className="totalClicks">Total Clicks:{props.clicks}</h2>
      <button onClick={updateTotalClicks} id="clickForScore" className="btn btn-default">click</button>
      <input type="hidden" name="_csrf" value={props.csrf}/>
    </div>
  );
}

// Reset Password Screen
const AccountWindow = (props) => {
  return (
    // We need a form for the reset. Include: Old password (to prevent account stealing),
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

const StoreWindow = (props) => {
  return (
    <table>
      <tr>
        <button id="t1" className="store-button" onClick={handlePurchase} value={props.csrf}>100 clicks / $4.99</button>
      </tr>
      <tr>
        <button id="t2" className="store-button" onClick={handlePurchase} value={props.csrf}>200 clicks / $4.99</button>
      </tr>
      <tr>
        <input type="disabled" value="credit card # here" disabled="true"/>
        <button id="addFunds" className="store-button" onClick={handleFunds} value={props.csrf}>Add $5.00</button>
      </tr>
      <tr>
        <input type="hidden" name="_csrf" value={props.csrf}/>
      </tr>
    </table>
  )
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

const createStoreWindow = (csrf) => {
  ReactDOM.render(
    <StoreWindow csrf={csrf} />,
    document.querySelector('#content')
  );
}

const setup = (csrf) => {
  const gameButton = document.querySelector('#gameButton');
  const leaderboardButton = document.querySelector('#leaderboardButton');
  const accountButton = document.querySelector('#accountButton');
  const storeButton = document.querySelector('#storeButton');
  
  gameButton.addEventListener('click', (e) => {
    e.preventDefault();
    createGameWindow(csrf);
    return false;
  });
  
  leaderboardButton.addEventListener('click', (e) => {
    e.preventDefault();
    createLeaderboardWindow(csrf);
    return false;
  });
  
  accountButton.addEventListener('click', (e) => {
    e.preventDefault();
    createAccountWindow(csrf);
    return false;
  });
  
  storeButton.addEventListener('click', (e) => {
    e.preventDefault();
    createStoreWindow(csrf);
    return false;
  });
  
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
