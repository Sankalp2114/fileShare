document.getElementById('login-form').addEventListener('submit', loginUser);

async function loginUser(event) {
  event.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const result = await fetch('http://localhost:3000/login', {
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
    const data = await result.json();


    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);

    window.location.replace('/frontend/home.html');
    console.log('Login successful!');
  } else {
    document.querySelector('.invalid').style.display = 'flex';
    document.querySelector('#login-username').value = '';
    document.querySelector('#login-password').value = '';
    console.log('Login failed');
  }
}
