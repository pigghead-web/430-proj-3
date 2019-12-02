const redirect = (response) => {
  window.location = response.redirect;
}

const sendAjax = (type, action, data, success) => {
  //debugger;
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error) {
      console.log(xhr.responseText);
    },
  });
};