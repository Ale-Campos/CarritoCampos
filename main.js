class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

class Product {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}


const authUsers = ["user", "test", "admin", "developer"];
const authPasswords = ["user1234", "test90921", "admin22884", "developer0011"];
const usersList = generateAuthUserList(authUsers, authPasswords);
const productList = [
  "celular",
  "televisor",
  "tablet",
  "laptop",
  "heladera",
];
const prices = [300000, 250000, 400000, 600000, 400000];
const productsList = generateProductList(productList, prices);


let loggedUsername;
let loggedPassword;
let authorized = false;
let maxAttempts = 3;
let currentAttempts = 0;
let finalPrice = 0;

do {
  loggedUsername = prompt("Ingrese su nombre de usuario");
  loggedPassword = prompt("Ingrese su contraseña");
  let loggedUser = usersList.find(user => user.username == loggedUsername);
  if(loggedUser != undefined & loggedUser.password === loggedPassword) {
        authorized = true;
  } else {
        alert("Usuario o contraseña incorrectos");
  }
  currentAttempts++;
} while (!authorized && currentAttempts < maxAttempts);

if (authorized) {
    offerProducts();
    alert("Compra realizada! El precio final es: $" + finalPrice);
} else {
  alert("No se pudo iniciar sesión, intente nuevamente más tarde");
}

function offerProducts() {
    let endBuy = false;
    

  do {
    let messsage = generateOfferMessage(productsList, finalPrice)
    let productName = prompt(messsage);

    if(productName.toLocaleLowerCase() != "salir") {
        let selectedProduct = productsList.find(product => product.name == productName.toLowerCase());
        if(selectedProduct != undefined) {
            finalPrice += selectedProduct.price;
        } else {
            alert("El producto ingresado no se encuentra en la lista")
        }
    } else {
        endBuy = true;
    }

  } while (!endBuy);
}

function generateAuthUserList(usernameList, passwordList) {
    let users = [];
    if(usernameList.length === passwordList.length) {
        for(let i=0; i<usernameList.length; i++) {
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
    for(let i=0; i<productList.length; i++) {
        let product = new Product(productList[i], prices[i]);
        products.push(product);
    }
    return products;
}

function generateOfferMessage(productList, finalPrice) {
    let initialMessage = 'Ingresa algunos de los productos o "Salir" para terminar tu compra';

    productList.forEach(product => {
        initialMessage += `\n ${product.name}: ${product.price}`;
    });
    initialMessage += `\n salir \n Precio final: ${finalPrice}`;
   return initialMessage;
}

