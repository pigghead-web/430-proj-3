const handleLogin = (e) => {
  // prevent refresh
  e.preventDefault();
  
  // If there are missing fields
  if($('#user').val() == '' || $('#pass').val() == '') {
    console.log("Both fields are required");
    return false;
  }
  
  //console.log($('#input[name=_csrf]').val());

  sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);
  
  return false;
}

const handleSignup = (e) => {
  e.preventDefault();
  
  // If any fields are missing
  if($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
    console.log("ERROR: \All three Fields required\\");
    return false;
  }
  
  // If pass and pass2 do NOT match
  if($('#pass').val() != $('#pass2').val()) {
    console.log("ERROR: \Passwords do not match\\");
    return false;
  }
  
  sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);
  
  return false;
}

// Construct / Design the windows here
// Login
const LoginWindow = (props) => {
  return (
    <form id="loginForm" name="loginForm"
          onSubmit={handleLogin}
          action="/login"
          method="POST"
          className="mainForm">
          
      <input id="user" type="text" name="username" placeholder="username" />
      
      <input id="pass" type="password" name="pass" placeholder="password" />
      
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input id="loginFormSubmit" className="formSubmit" type="submit" value="sign in" />
    </form>
  );
}

// Signup
const SignupWindow = (props) => {
  return (
    <form id="signupForm" name="signupForm"
          onSubmit={handleSignup}
          action="/register"
          method="POST"
          className="mainForm">
      <input id="user" type="text" name="username" placeholder="username" />
      <input id="pass" type="password" name="pass" placeholder="password" />
      <input id="pass2" type="password" name="pass2" placeholder="re-type password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input id="signupFormSubmit" className="formSubmit" type="submit" value="sign up" />
    </form>
  );
}

// Create windows
// Login
const createLoginWindow = (csrf) => {
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector('#content')
  );
}; 

// Signup
const createSignupWindow = (csrf) => {
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector('#content')
  );
};

const setup = (csrf) => {
  const loginButton = document.querySelector('#loginButton');
  const signupButton = document.querySelector('#signupButton');
  
  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  
  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  
  createLoginWindow(csrf);
  //createSignupWindow(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});