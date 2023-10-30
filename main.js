const authUsers = ["user", "test", "admin", "developer"];
const productList = [
  "celular",
  "televisor",
  "tablet",
  "laptop",
  "heladera",
  "salir",
];
const prices = [300000, 250000, 400000, 600000, 400000];

let loggedUser;
let authorized = false;
let maxAttempts = 3;
let currentAttempts = 0;
let finalPrice = 0;

do {
  loggedUser = prompt("Ingrese su nombre de usuario");
  serchUser(loggedUser);
  currentAttempts++;
} while (!authorized && currentAttempts < maxAttempts);

if (authorized) {
    offerProducts();
    alert("Compra realizada! El precio final es: $" + finalPrice)
} else {
  console.log("Usuario no autorizado");
}

function offerProducts() {
    let endBuy = false;
    

  do {
    let messsage =
    `Ingresa algunos de los productos o "Salir" para terminar tu compra \n Celular: $300.000 \n Televisor: $250.000 
    \n Tablet: $400.000 \n Laptop: $600.000 \n Heladera: $400.000 
    \n Precio final: ${finalPrice}`;
    let productName = prompt(messsage);

    if(productName.toLocaleLowerCase() != "salir") {
        let price = searchProduct(productName);
        if(price == 0) {
            alert("El producto ingresado no se encuentra en la lista")
        } else {
            finalPrice += price;
        }
    } else {
        endBuy = true;
    }

  } while (!endBuy);
}

function serchUser(userName) {
    let index = 0;
    while(!authorized && index<authUsers.length) {
        if(authUsers[index] == userName) {
            authorized = true;
        } else {
            index++;
        }
    }
}

function searchProduct(productName) {
    let prodFound = false;
    let index = 0;
    let price = 0;
    while(!prodFound && index<productList.length) {
        if(productList[index] == productName.toLowerCase()) {
            prodFound = true;
            price = prices[index];
        } else {
            index++;
        }
    }
    return price;
}
