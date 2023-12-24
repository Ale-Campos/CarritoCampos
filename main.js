class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

class Product {
  constructor(name, price, id) {
    this.id = id;
    this.name = name;
    this.price = price;
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
    console.log(motos);
  })
  .catch(function (error) {
    console.log(error);
  });

const authUsers = ["user", "test", "admin", "developer"];
const authPasswords = ["user1234", "test90921", "admin22884", "developer0011"];
const usersList = generateAuthUserList(authUsers, authPasswords);
const productList = ["celular", "televisor", "tablet", "laptop", "heladera"];
const prices = [300000, 250000, 400000, 600000, 400000];
const productsList = generateProductList(productList, prices);

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
  alert("No se pudo iniciar sesión, intente nuevamente más tarde");
}

async function  searchProduct() {
  search = document.getElementById("search").value;
  let filter = document.getElementById("filtro").value;
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

  showPoducts(search);
}

function showPoducts(search) {
  let motoContainer = document.getElementById("products-list");
  motoContainer.innerHTML = "";

  if (search) {
    filterProducts = productsList.filter((product) =>
      product.name.includes(search.toLowerCase())
    );
  } else {
    filterProducts = productsList;
  }
  if (localStorage.getItem("cart") !== null) {
    cart = JSON.parse(localStorage.getItem("cart"));
    updateCartView(cart);
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
              <button type="button" onclick="addToCart('${moto.model}')">Agregar a favoritos</button>
            <div>
        `;
        motoContainer.appendChild(motoNueva);
  });
  document.getElementById("products").style.display = "block";
  motoContainer.style.display = "block";
  document.getElementById("cart").style.display = "block";
}

function addToCart(model) {

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
  updateCartView(cart);
}

function updateCartView(cart) {
  finalPrice = 0;
  cartListView = document.getElementById("cart-list");
  cartListView.innerHTML = "";
  cart.forEach((moto) => {
    let listItem = document.createElement("li");
    listItem.innerHTML = `
            <h4 style="text-transform: capitalize">${moto.make}</h4>
            <p>${moto.model}</p>
        `;
    cartListView.appendChild(listItem);
  });
}

function checkout() {
  alert("Gracias por su compra");
  localStorage.removeItem("cart");
  updateCartView([]);
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

function generateProductList(productList, prices) {
  let products = [];
  for (let i = 0; i < productList.length; i++) {
    let product = new Product(productList[i], prices[i], i);
    products.push(product);
  }
  return products;
}

function showBike(model) {
  let moto = motos.find((moto) => moto.model === model);
  let modal = document.getElementById("details-modal");
  modal.style.display = "block";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="closeModal()">&times;</span>
      <h3 style="text-transform: capitalize">${moto.make}</h3>
      <p>${moto.model}</p>
      <p>${moto.year}</p>
      <p>${moto.engine}</p>
      <p>${moto.fuel_capacity}</p>
      <p>${moto.fuel_system}</p>
      <p>${moto.gearbox}</p>
      <p>${moto.type}</p>
      <p>${moto.compression}</p>

      
    </div>
  `;
}
