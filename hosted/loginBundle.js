"use strict";

var handleLogin = function handleLogin(e) {
  // prevent refresh
  e.preventDefault(); // If there are missing fields

  if ($('#user').val() == '' || $('#pass').val() == '') {
    console.log("Both fields are required");
    return false;
  } //console.log($('#input[name=_csrf]').val());


  sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault(); // If any fields are missing

  if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
    console.log("ERROR: \All three Fields required\\");
    return false;
  } // If pass and pass2 do NOT match


  if ($('#pass').val() != $('#pass2').val()) {
    console.log("ERROR: \Passwords do not match\\");
    return false;
  }

  sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);
  return false;
}; // Construct / Design the windows here
// Login


var LoginWindow = function LoginWindow(props) {
  return React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), React.createElement("input", {
    id: "loginFormSubmit",
    className: "formSubmit",
    type: "submit",
    value: "sign in"
  }));
}; // Signup


var SignupWindow = function SignupWindow(props) {
  return React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "re-type password"
  }), React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), React.createElement("input", {
    id: "signupFormSubmit",
    className: "formSubmit",
    type: "submit",
    value: "sign up"
  }));
}; // Create windows
// Login


var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
}; // Signup


var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector('#loginButton');
  var signupButton = document.querySelector('#signupButton');
  loginButton.addEventListener('click', function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  signupButton.addEventListener('click', function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  createLoginWindow(csrf); //createSignupWindow(csrf);
};

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
