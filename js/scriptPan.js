const cards = document.getElementById(`cards`);
const items = document.getElementById(`items`);
const footer = document.getElementById(`footer`);
const templateCard = document.getElementById(`template-card`).content;
const templateFooter = document.getElementById(`template-footer`).content;
const templateCarrito = document.getElementById(`template-carrito`).content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener(`DOMContentLoaded`, () => {
    fetchData();
    //para almacenar en la variable carrito, si es que hay algo
    if (localStorage.getItem (`carrito`)) {
        carrito = JSON.parse(localStorage.getItem (`carrito`))
        aniadirCarrito()
    }
})
cards.addEventListener(`click`, (e) => {
    addCarrito(e);
})

items.addEventListener(`click`, e => {
    btnAccion(e)
})

const fetchData = async () => {
    try {
        const res = await fetch(`apiPan.json`);
        const data = await res.json();
        aniadirCards(data);
    } catch (error) {
        console.log(error);
    }
}

const aniadirCards = (data) => {
    data.forEach( (producto) => {
        templateCard.querySelector(`h5`).textContent = producto.title;
        templateCard.querySelector(`p`).textContent = producto.precio;
        templateCard.querySelector(`img`).setAttribute(`src`, producto.thumbnailUrl);
        templateCard.querySelector(`.btn-dark`).dataset.id = producto.id;

        const conar = templateCard.conarNode(true);
        fragment.appendChild(conar);
    })
    cards.appendChild(fragment) 
}

const addCarrito = e => {
    if (e.target.classList.contains(`btn-dark`)) {
        
        setCarrito(e.target.parentElement)

    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector(`.btn-dark`).dataset.id,
        title: objeto.querySelector(`h5`).textContent,
        precio: objeto.querySelector(`p`).textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto} //adquiero info, p/hacer copia del producto
    aniadirCarrito();
}

const aniadirCarrito = () => {
    items.innerHTML = "";
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector(`th`).textContent = producto.id
        templateCarrito.querySelectorAll(`td`)[0].textContent = producto.title
        templateCarrito.querySelectorAll(`td`)[1].textContent = producto.cantidad
        templateCarrito.querySelector(`.btn-info`).dataset.id = producto.id
        templateCarrito.querySelector(`.btn-danger`).dataset.id = producto.id
        templateCarrito.querySelector(`span`).textContent = producto.cantidad * producto.precio

        const conar = templateCarrito.conarNode(true)
        fragment.appendChild(conar)
    })
    items.appendChild(fragment)

    pintarFooter()

    //para guardar la info,, strigify es para que vuelva como una coleccion de obejeto, antes haberlo hecho con parse.
    localStorage.setItem(`carrito`, JSON.stringify(carrito))

}

const pintarFooter = () => {
    footer.innerHTML = "";
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
//creo const para ir sumando la cantidad de cada producto y lo vaya acumulando= acc
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)//paso el 0 para devolverlo como un nro
    
    templateFooter.querySelectorAll(`td`)[0].textContent = nCantidad
    templateFooter.querySelector(`span`).textContent = nPrecio

    const conar = templateFooter.conarNode(true)
    fragment.appendChild(conar)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById(`vaciar-carrito`)
    btnVaciar.addEventListener(`click`, () => {
        carrito = {} //Lo utilizo para volver a vaciar el carrito
        aniadirCarrito() //Para volver a 
    })
}
 
//Ya sea para aumentar de cantidad el prod y luego para disminuir
const btnAccion = e  => {
    if(e.target.classList.contains(`btn-info`)) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        aniadirCarrito()
    }
//para disminuir
    if(e.target.classList.contains(`btn-danger`)) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        aniadirCarrito()
    }

    e.stopPropagation()
}