fetch('stock.json')
.then(function(response){
    return response.json();
})
.then(function(data){
    modeloSneaker = data
    
    renderizarStock()
});



let carrito

if(localStorage.getItem('carrito')){
    carrito = JSON.parse(localStorage.getItem('carrito'))
}
else{
    carrito=[]
}
console.log('carrito:', carrito);

const classcontainer = document.querySelector('#classConteiner')

const productoContainer = document.querySelector('#carrito-conteiner')
const añadirCarrito = (e) => {
    const idSneakerElegida = e.target.getAttribute('data-id');
    const sneakerElegida = productos.find((productos) => productos.id == idSneakerElegida)
    carrito.push(sneakerElegida)
    console.log(carrito)
    localStorage.setItem('carrito', JSON.stringify(carrito))
}


let desplegarCarrito = document.getElementById("carrito-desplegable")
let carritoDesplegado = document.querySelector(".carrito-desplegable")
let closeCarrito = document.getElementById("close-carrito")
desplegarCarrito.addEventListener("click",() => {
    carritoDesplegado.classList.remove('visible')

    mostrarCarrito();
})
closeCarrito.addEventListener("click",() => {
    carritoDesplegado.classList.add('visible')
})



let arraySelected = [];

let shopContent = document.getElementById ("classConteiner")
const renderizarStock = () => {
    modeloSneaker.forEach((modeloSneaker)=> {
        let content =document.createElement("div")
        let opciones = ""
        modeloSneaker.talles.forEach((talles) => {
            opciones += `<option value ${talles.talle}>  ${talles.talle} </option>`;
        });
        content.className = "card"
        content.innerHTML = `
        <div class = "imagenes"><img src = "${modeloSneaker.imagen}"></div>
        <h3> ${modeloSneaker.nombre}</h3>
        <div class = "talle" > <p>Talle:</p>
        <select class = "talles" id="seleccionado${modeloSneaker.id}">
        ${opciones}
        </select></div>
        <p> $${modeloSneaker.precio}</p>
        `;
        shopContent.append(content)

        let comprar = document.createElement("button")
        comprar.innerHTML = "Añadir al carrito"
        comprar.className = "comprar"

        content.append(comprar)
        
        let contador = document.querySelector(".indicator-value")

        let carritoCounter = () =>{
            contador.innerText = carrito.length
        }
 
        
        comprar.addEventListener("click", ()=>{

            let select = document.getElementById("seleccionado"+modeloSneaker.id);
            let selected = select.options[select.selectedIndex].text;
            
            let repeat2 = carrito.some((productoRepetido) => (productoRepetido.id === modeloSneaker.id && productoRepetido.talle == Number(selected)))

            let stock;
            let cantidad;

            if(repeat2){
                carrito.map((prod) => {
                    if(prod.id === modeloSneaker.id){
                        if(prod.talle == Number(selected)){
                            if(prod.cantidad < prod.stock)
                                prod.cantidad++;
                        }
                    }
                })
            } else{
                let seleccionado = selected
                modeloSneaker.talles.forEach((talles) => {
                    if(talles.talle == Number(seleccionado)){
                        stock = talles.stock;
                        cantidad = talles.cantidad;
                    }
                })
                carrito.push({
                    id:modeloSneaker.id,
                    modelo: modeloSneaker.nombre,
                    talle: selected,
                    stock: stock,
                    precio: modeloSneaker.precio,
                    cantidad: cantidad
                })
                console.log(carrito)
                carritoCounter()
                saveLocal();
            }
            mostrarCarrito();
            
        })
    })
}


const saveLocal = () => {
    localStorage.setItem('carrito',JSON.stringify(carrito));
}

const mostrarCarrito = () => {

    productoContainer.innerHTML = '';
    
    carrito.forEach((producto) => {
        let carritoContent = document.createElement('div')
        carritoContent.className = 'modal-content'
        carritoContent.innerHTML = `
        <div class=primer-orden>
        <h3 class ="nombreSneaker"> ${producto.modelo}</h3>
        <span id=eliminar>❌</span>
        </div>        
        <div class=segundo-orden>
        <span id="restar"> -  </span>
        <p>${producto.cantidad}</p>
        <span id="sumar">  + </span>
        </div>
        <p>Talle: ${producto.talle}</p>
        <p>Total: $${producto.precio * producto.cantidad}</p>
        `;
        

        productoContainer.append(carritoContent)
        
       

        let restar = carritoContent.querySelector('#restar');


        restar.addEventListener('click', () => {
            if (producto.cantidad !== 1) {
                producto.cantidad--;
            } else if (producto.cantidad == 1){
                borrarCarrito(producto.id,producto.talle);
                producto.cantidad--;
            }
            mostrarCarrito()
            carritoCounter()
        })

        let sumar = carritoContent.querySelector('#sumar')

        sumar.addEventListener('click', () => {
            if(producto.cantidad < producto.stock){
                producto.cantidad++;
                mostrarCarrito()
            }
        })

        let eliminarProducto = carritoContent.querySelector('#eliminar')

        eliminarProducto.addEventListener('click',() => {
            borrarCarrito(producto.id,producto.talle)
            carritoCounter()
        });
        
    })
    let total = carrito.reduce ((acc, el) => acc + el.precio*el.cantidad, 0)
    let totalCarrito = document.createElement("div");
    totalCarrito.className = "carritoTotal";
    totalCarrito.innerHTML = `total a pagar: $${total}`;
    
    productoContainer.append(totalCarrito);
}

const borrarCarrito = (id,talle) => {
    let repeat2 = carrito.some((productoRepetido) => (productoRepetido.id === id && productoRepetido.talle === talle))

    let indice = 0;
    let aux = 0;
    if(repeat2){
            
        carrito.forEach((carrito)=>{
            if(carrito.id === id){
                if(carrito.talle == talle){
                    indice = aux;
                }
            }
            aux++;
        })

        carrito.splice(indice,1)
        saveLocal();
        mostrarCarrito();
        
    }
    carritoCounter()
}


const borrarTodoCarrito = () => {
    carrito = [];
    saveLocal();
    mostrarCarrito();
    carritoCounter()
}

let vaciarCarrito = document.querySelector("#vaciar-carrito")
vaciarCarrito.addEventListener("click",borrarTodoCarrito)

let finalizaCompra = document.getElementById("finalizar-compra")
finalizaCompra.addEventListener('click', () => {
    if(carrito.length === 0){
        Swal.fire({
            title: "¡Tu carrito está vacio!",
            text: "Añade un producto para continuar con la compra",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
    }else{
    Swal.fire(
        'Gracias por su compra!',
        '',
        'success'
      )}

})









































// selectores

//let agregarSneaker = prompt("Seleccione su par de sneakers \n1-Nike Jordan Retro 4 Off White   $50000\n2-Patta x Nike Air Max Monarch   $42000\n3-Nike SB Dunk Low Parra            $48000");

/*
function comprarUsuario(sneakerElegida){
    carrito.push(modeloSneaker[sneakerElegida -1])
}

let talle=0
while (agregarSneaker != false && agregarSneaker>=1 && agregarSneaker<=3){

    comprarUsuario(agregarSneaker);

    switch (agregarSneaker) {
        case "1":
            alert("Usted eligió el modelo Nike Jordan Retro 4 Off White");
            console.log("Usted eligió el modelo: " + modelo1.modelo);
            talle = prompt("¿Cual es tu talle?");
            break;
        case "2":
            alert("Usted eligió el modelo Patta x Nike Air Max Monarch");
            console.log ("Usted eligió el modelo: " + modelo2.modelo);
            talle = prompt("¿Cual es tu talle?");
            break;
        case "3":
            alert("Usted eligió el modelo Nike SB Dunk Low Parra");
            console.log("Usted eligió el modelo: " + modelo3.modelo)
            talle = prompt("¿Cual es tu talle?");
            break;

        default:
            alert("Usted ha ingresado un valor incorrecto");
            break;
    }
    
    alert("Usted selecciono el modelo " + modeloSneaker[agregarSneaker-1].modelo + ". Talle " + talle + " por un total de " + modeloSneaker[agregarSneaker-1].precio + " Pesos");
    console.log("Usted selecciono el modelo " + modeloSneaker[agregarSneaker-1].modelo + ". Talle " + talle + " por un total de " + modeloSneaker[agregarSneaker-1].precio + " Pesos");
    agregarSneaker = prompt("Seleccione su par de sneakers \n1-Nike Jordan Retro 4 Off White   $50000\n2-Patta x Nike Air Max Monarch   $42000\n3-Nike SB Dunk Low Parra            $48000\n4-Realizar pago");
}

let precioCuota=0
let valorCuota=0
let cuotas=0

let total = 0
carrito.forEach((modelo) => {total += modelo.precio});
alert("Total de la compra: $" + total)

let pago= prompt("Seleccione medio de pago  \n1-efectivo \n2-tarjeta \n3-transferencia")
if (pago == "1"){
    alert("Sus sneakers han sido reservadas, recuerde que tiene un limite de 5 dias habiles para realizar el pago");
}else if(pago == "2"){
    cuotas = prompt("En cuantas cuotas desea realizar la compra? contamos con: 3, 6 o 12 sin interes");
    if(cuotas == 3) {
        precioCuota = total/cuotas;
        console.log("3 cuotas de: $"+ precioCuota);
        alert("3 cuotas de: $"+ precioCuota);

    }else if(cuotas == 6){
        precioCuota = total/cuotas;
        console.log("6 cuotas de: $"+ precioCuota);
        alert("6 cuotas de: $"+ precioCuota);

    }else if(cuotas == 12){
        precioCuota= total/cuotas;
        console.log("12 cuotas de: $"+ precioCuota);
        alert("12 cuotas de: $"+ precioCuota);

    }else{
        alert("opcion incorrecta");
    }

}else if(pago == "3"){
    alert("El numero de CBU para transferenmcias es: 508211587392315");
    console.log("El numero de CBU para transferenmcias es: 508211587392315");
    }else{
        alert("opcion incorrecta"); 
    }

alert("Gracias por elegirnos")
console.log("Gracias por elegirnos")

*/