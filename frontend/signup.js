
document.getElementById('signup-form')
  .addEventListener('submit', registerUser);
   
async function registerUser(event) {

  event.preventDefault();

  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;

  const result = await fetch('http://localhost:3000/signup', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username, 
      password
    })
  });

  if (result.ok) {  
    // window.location.replace('/frontend/index.html'); 
    document.querySelector('.registered').style.display = 'flex';

  } else {
    // alert('Error!'); 
    document.querySelector('.usernameExsists').style.display = 'flex';
  }

}