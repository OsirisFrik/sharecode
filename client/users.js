function addUser(user) {
  let container = document.getElementById('users');
  let div = document.createElement('div');
  let img = document.createElement('img');
  
  img.src = user.img;
  img.classList.add('avatar');
  container.appendChild(img);
}

export {
  addUser
}
