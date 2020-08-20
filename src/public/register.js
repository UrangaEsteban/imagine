var logInForm = document.querySelector('form.log-in');
var userName = document.querySelector('input#username');
var userMail = document.querySelector('input#usermail');
var userPwd = document.querySelector('input#password');
logInForm.addEventListener('submit', handleLogInSubmit);


function handleLogInSubmit(event) {
  event.preventDefault();

  var data = {
    username: userName.value,
    email: userMail.value,
    password: userPwd.value
  }

  console.log(data);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var miInit = {  method: 'POST',
                  headers: myHeaders,
                  mode: 'cors',
                  cache: 'default',
                  body: JSON.stringify(data)
                };
  fetch('http://localhost:3000/register', miInit)
  .then(handleFetchLogin)
  .then(saveToken);
}


function handleFetchLogin(response) {
  return response.json()
}

function saveToken(data) {
  var old = localStorage.getItem('myToken');
  if (old && old == data.token) return;
  localStorage.setItem('myToken', data.token);
  console.log(data)
}