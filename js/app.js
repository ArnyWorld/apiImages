const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const description = document.querySelector('.description');

const registroPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;


window.onload = ()=>{
    formulario.addEventListener("submit", validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();

    const terminoBusqueda = document.querySelector("#termino").value;

    if(terminoBusqueda === ""){
        mostrarAlerta("Campo obligatorio")
        return ;
    }

    buscarImagenes();
}

function buscarImagenes(){

    const termino = document.querySelector("#termino").value;
    const key = "27773654-369a243f3930fdc3840aab3f0";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registroPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(res => res.json())
        .then(resJson=> {
            totalPaginas = calcularPagina(resJson.totalHits)
            console.log(totalPaginas);
            mostrarImagenes(resJson.hits, termino);
            // imprimirPaginador()
        })
}

function mostrarImagenes(imagenes, termino){
    console.log(imagenes) ;
    limpiarHTML();

    description.textContent = `Resultado: ${termino}`;
    description.style.padding= "1em 0";
    //Iterar sobre el arreglo de imagenes
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;
        resultado.innerHTML+=`
            <div class="card">
                    <img class="imageCard" src="${previewURL}">
                    <div class="cardContent">
                        <p class="like"> <i class="fa-solid fa-thumbs-up"></i> ${likes}  </p>
                        <p class="views"> <i class="fa-solid fa-eye"></i> ${views}  </p>
                        <a class="btn" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver Imagen</a>
                    </div>    
            </div>
        `;
    });

    //Limpiar Paginador
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }

     imprimirPaginador();
}

//Generador de paginas
function *crearPaginador(total){
    console.log(total);
    for(let i=1; i<= total;i++){
        yield i;
        //console.log(i);
    }
}

function calcularPagina(total){
    return parseInt(Math.ceil(total / registroPorPagina))
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarAlerta(mensaje){

    const existeAlerta = document.querySelector(".alert");
    if(!existeAlerta){   
        const alerta = document.createElement("p");
        alerta.classList.add("alert");
        
        alerta.innerHTML = `
        <strong class="font-bold">Error! </strong>
        <span class="block sm:inline">${mensaje}</span>
        `;
        
        formulario.appendChild(alerta);
        
        setTimeout(()=>{
            alerta.remove()
        },3000)
    }
        
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);

    while(true){
        const {value, done} = iterador.next();
        if(done) return;

        //Caso contrario
        const boton = document.createElement("a");
        boton.href="#";
        boton.dataset.pagina=value;
        boton.textContent = value;
        boton.classList.add("pagina")

        boton.onclick =()=>{
            paginaActual = value;
            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
        
    }
}