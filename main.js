class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

let motos;

fetch("https://api.api-ninjas.com/v1/motorcycles?make=a", {
  headers: {
    "X-Api-Key": "IzwfWFD1SouJpi4lrXhAEw==OqY2Z6Ysd2p5F7Ip",
  },
})
  .then((response) => response.json())
  .then((data) => {
    motos = data
  })
  .catch(function (error) {
    console.log(error);
  });

const authUsers = ["user", "test", "admin", "developer"];
const authPasswords = ["user1234", "test90921", "admin22884", "developer0011"];
const usersList = generateAuthUserList(authUsers, authPasswords);

let loggedUsername;
let loggedPassword;
let maxAttempts = 3;
let currentAttempts = 0;
let cart = [];
let search = "";

function login(event) {
  event.preventDefault();

  loggedUsername = document.getElementById("username").value;
  loggedPassword = document.getElementById("password").value;

  let loggedUser = usersList.find((user) => user.username == loggedUsername);

  if (loggedUser != undefined && loggedUser.password === loggedPassword) {
    start();
  } else {
    currentAttempts++;
    if (currentAttempts < maxAttempts) {
      alert("Usuario o contraseña incorrectos");
    } else {
      notAllowed();
    }
  }
}

function start() {
  document.getElementById("login").style.display = "none";
  showPoducts();
}

function notAllowed() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "No tienes más intentos disponibles",
  }).then(() => {
    window.location.reload();
  });
}

async function  searchBike() {
  search = document.getElementById("search").value;
  let filter = document.getElementById("filtro").value;

  if(search === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Debes ingresar un modelo o marca",
    })
    return;
  }

  console.log(filter);
  let url = `https://api.api-ninjas.com/v1/motorcycles?${filter}=${search}`;
  console.log(url);
  await fetch(url, {
  headers: {
    "X-Api-Key": "IzwfWFD1SouJpi4lrXhAEw==OqY2Z6Ysd2p5F7Ip",
  },
})
  .then((response) => response.json())
  .then((data) => {
    motos = data
    console.log(motos);
  })
  .catch(function (error) {
    console.log(error);
  });

  if(motos.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No se encontraron resultados",
    })
    return;
  }
  showPoducts();
}

function showPoducts() {
  let motoContainer = document.getElementById("products-list");
  motoContainer.innerHTML = "";

  if (localStorage.getItem("cart") !== null) {
    cart = JSON.parse(localStorage.getItem("cart"));
    updateFavView(cart);
  }

  motos.map((moto) => {
    let motoNueva = document.createElement("article");
    motoNueva.className = "bike";
    motoNueva.innerHTML = `
            <h3 style="text-transform: capitalize">${moto.make}</h3>
            <p>Modelo: ${moto.model}</p>
            <p>Cilindrada: ${moto.displacement.split('.')[0]}cc</p>
            <div class='card-buttons'>
              <button type="button" onclick="showBike('${moto.model}')">Ver</button>
              <button type="button" onclick="addToFavourites('${moto.model}')">Agregar a favoritos</button>
            <div>
        `;
        motoContainer.appendChild(motoNueva);
  });
  document.getElementById("bikes-container").style.display = "block";
  motoContainer.style.display = "block";
  document.getElementById("cart").style.display = "block";
}

function addToFavourites(model) {

  Swal.fire({
    position: "top-center",
    icon: "success",
    title: "Se agregó a favoritos",
    showConfirmButton: false,
    timer: 1500
  });

  if (localStorage.getItem("cart") === null) {
    localStorage.setItem("cart", JSON.stringify([]));
  }
  cart = JSON.parse(localStorage.getItem("cart"));

  cart.push(motos.find((moto) => moto.model === model));
  localStorage.setItem("cart", JSON.stringify(cart));
  updateFavView(cart);
}

function updateFavView(cart) {
  finalPrice = 0;
  cartListView = document.getElementById("cart-list");
  cartListView.innerHTML = "";
  cart.forEach((moto) => {
    let listItem = document.createElement("article");
    listItem.className = "bike";
    listItem.innerHTML = `
            <h4 style="text-transform: capitalize">${moto.make}</h4>
            <p>${moto.model}</p>
        `;
    cartListView.appendChild(listItem);
  });
}

function clearFavourites() {

  Swal.fire({
    position: "top-center",
    icon: "success",
    title: "Se han eliminado todos los favoritos",
    showConfirmButton: false,
    timer: 1500
  })
  localStorage.removeItem("cart");
  updateFavView([]);
}

function generateAuthUserList(usernameList, passwordList) {
  let users = [];
  if (usernameList.length === passwordList.length) {
    for (let i = 0; i < usernameList.length; i++) {
      let user = new User(usernameList[i], passwordList[i]);
      users.push(user);
    }
  } else {
    console.log("La cantidad de usuarios y contraseñas no coincide");
  }
  return users;
}

function showBike(model) {
  let moto = motos.find((moto) => moto.model === model);

  Swal.fire({
    title: `<h3 style="text-transform: capitalize">${moto.make}</h3>
            <h6>${moto.model}</h6> `,
    icon: "info",
    html: `
    <div class="modal-content">
      <p><span>Año: </span>${moto.year? moto.year : 'Sin información'}</p>
      <p><span>Tipo: </span>${moto.type? moto.type : 'Sin información'}</p>
      <p><span>Motor: </span>${moto.engine? moto.engine : 'Sin información'}</p>
      <p><span>Capacidad de tanque: </span>${moto.fuel_capacit? moto.fuel_capacit : 'Sin información'}</p>
      <p><span>Compresión: </span>${moto.compression? moto.compression : 'Sin información'}</p>
      <p><span>Systema de admisión: </span>${moto.fuel_system? moto.fuel_system: 'Sin información'}</p>
      <p><span>Caja de cambios: </span>${moto.gearbox? moto.gearbox: 'Sin información'}</p>
    </div>
    `,
    showCloseButton: true,
    focusConfirm: false,
    confirmButtonText: `
      <i class="fa fa-thumbs-up"></i> Cerrar
    `
  });
}