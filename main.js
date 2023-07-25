// TRABAJO FINAL - FRASCA GIANINA
// Sitio web de Compra de Entradas a Recitales


///URL JSON///
const URL = "entradas.json"


/// LOCAL STORAGE CARRITO///
const guardarCarrito = () => {
  if (carrito.length > 0) {
    localStorage.setItem("carrito", JSON.stringify(carrito))
  }
}

const recuperarCarrito = () => {
  return JSON.parse(localStorage.getItem("carrito")) || []
}


/// ARRAY PRODUCTOS ///
const entradas = []


/// ARRAY CARRITO ///
const carrito = recuperarCarrito()



/// BOTON VACIAR CARRITO + SWEETALERT + EVENTO ///
function vaciarCarrito() {
  Swal.fire({
    title: '¿Estás seguro de vaciar el carrito?',
    text: 'Una vez vaciado el carrito, no podrás recuperar los productos.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, vaciar carrito',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.splice(0, carrito.length);
      mostrarCarrito();
      guardarCarrito();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'El carrito ha sido vaciado.',
        showConfirmButton: false,
        timer: 1500
      })
    }
  })
}

const vaciarCarritoBtn = document.getElementById('vaciar-carrito-btn')
vaciarCarritoBtn.addEventListener('click', vaciarCarrito)



/// BOTON FINALIZAR COMPRA + SWEET ALERT + EVENTO ///
async function finalizarCompra() {
  const result = await Swal.fire({
    title: '¿Estás seguro de finalizar la compra?',
    text: 'Una vez finalizada la compra, se vaciará el carrito.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, finalizar compra',
    cancelButtonText: 'Cancelar',
  });

  if (result.isConfirmed) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: '¡Compra finalizada!',
      showConfirmButton: false,
      timer: 1500
    });
    vaciarCarrito()
    mostrarCarrito()
    guardarCarrito()
  }
}

const finalizarCompraBtn = document.getElementById('finalizar-compra-btn')
finalizarCompraBtn.addEventListener('click', finalizarCompra)



/// TARJETAS DE PRODUCTO GENERADAS DINAMICAMENTE CON JS///
function generarTarjetaProducto(entrada) {
  return `
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="images/${entrada.imagen}" alt="${entrada.nombre}" width="300" height="200">
      <div class="card-body">
        <h5 class="card-title text-center">${entrada.nombre}</h5>
        <p class="card-subtitle text-center my-1">$${entrada.precio}.-</p>
        <p class="card-subtitle text-center my-1">${entrada.fecha}</p>
        <p class="card-subtitle text-center my-1">${entrada.lugar}</p>
        <div class="d-flex justify-content-center text-center">
          <button id="btn-comprar-${entrada.codigo}" class="btn btn-primary">Comprar</button>
        </div>
      </div>
    </div>
  `
}



/// MOSTRAR PRODUCTOS EN CARRITO Y TOTAL A PAGAR ///
const tbody = document.querySelector("tbody")

const actualizarCarrito = (entrada) => {
  return `<tr>
            <td>${entrada.codigo}</td>
            <td>${entrada.nombre}</td>
            <td>$${entrada.precio}</td>
          </tr>`
}

const mostrarCarrito = () => {
  tbody.innerHTML = ""
  if (carrito.length > 0) {
    carrito.forEach((entrada) => {
      tbody.innerHTML += actualizarCarrito(entrada)
    })
  }
  const totalColumna = document.getElementById('carrito-total')
  const total = carrito.reduce((acumulador, entrada) => acumulador + entrada.precio, 0)
  totalColumna.textContent = '$' + total.toFixed(2)
}



/// EVENTO: CLICK EN BOTÓN COMPRAR ///
function agregarClickEnBotones() {
  const botonesComprar = document.querySelectorAll('button.btn.btn-primary')

  botonesComprar.forEach((boton) => {
    boton.addEventListener("click", () => {
      let entrada = entradas.find((entrada) => "btn-comprar-" + entrada.codigo === boton.id)
      carrito.push(entrada)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Entrada ' + entrada.nombre + ' se agregó al carrito.',
        showConfirmButton: false,
        timer: 1500
      })
      mostrarCarrito()
      guardarCarrito()
    })
  })
}



/// FUNCIÓN CARGAR ENTRADA + FETCH///
function cargarEntrada() {
  entradas.forEach(function (entrada) {
    let tarjetaHTML = generarTarjetaProducto(entrada);
    document.querySelector(".tarjetaproducto").innerHTML += tarjetaHTML
    agregarClickEnBotones()
  })
}

function solicitarEntradas() {
  fetch(URL)
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      }
    })
    .then((data) => entradas.push(...data))
    .then(()=> cargarEntrada())
}
solicitarEntradas()