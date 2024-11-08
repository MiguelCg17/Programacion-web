
const publicKey = '05e1b180c2c1d4866b298f978c61484d'; // Clave pública
const privateKey = '2a01b66615978735285319f294aaeda620cc77e8'; // Clave privada

// Div para mostrar resultados
const outputDiv = document.getElementById('output'); // Selecciona el contenedor donde se mostrarán los datos obtenidos de la API

// Función para generar el hash
function generateHash(ts) {
    return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

// Función usando Fetch para obtener personajes
function fetchCharacters() {
    const ts = Date.now(); // Obtiene la marca de tiempo actual para la autenticación
    const hash = generateHash(ts); 
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`; // Construye la URL de la API
    
    fetch(url)
        .then(response => {
            if (!response.ok) { // Verifica si la respuesta es válida
                throw new Error('Error en la petición de personajes');
            }
            return response.json(); // Convierte la respuesta en JSON si es válida
        })
        .then(data => displayData('Personajes (Fetch)', data)) // Llama a displayData para mostrar los datos obtenidos
        .catch(error => console.error(error)); // Muestra un error en la consola si la petición falla
}

// Función usando Async/Await para obtener cómics
async function asyncAwaitComics() {
    const ts = Date.now(); 
    const hash = generateHash(ts); 
    const url = `https://gateway.marvel.com:443/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}`; // Construye la URL de la API
    
    try {
        const response = await fetch(url); // Espera a que se complete la petición
        if (!response.ok) { // Verifica si la respuesta es válida
            throw new Error('Error en la petición de cómics');
        }
        const data = await response.json(); // Convierte la respuesta en JSON
        displayData('Cómics (Async/Await)', data); // Llama a displayData para mostrar los datos obtenidos
    } catch (error) {
        console.error(error); 
    }
}

// Función usando XMLHttpRequest para obtener series
function xmlHttpRequestSeries() {
    const ts = Date.now(); 
    const hash = generateHash(ts);
    const url = `https://gateway.marvel.com:443/v1/public/series?ts=${ts}&apikey=${publicKey}&hash=${hash}`; // URL de la API con los parámetros necesarios
    
    const xhr = new XMLHttpRequest(); //instancia
    xhr.open("GET", url, true); // Configura la petición como GET y asincrónica
    xhr.onreadystatechange = function() { // Define la función que se ejecuta cuando cambia el estado de la petición
        if (xhr.readyState === 4) { // Verifica si la petición está completada
            if (xhr.status === 200) { // Si la respuesta es exitosa (200 OK)
                const data = JSON.parse(xhr.responseText); // Convierte la respuesta en un objeto JavaScript
                displayData('Serie (XMLHttpRequest)', data); // Llama a displayData para mostrar los datos obtenidos
            } else {
                console.error('Error en la petición de serie'); // Muestra un error en la consola si la petición falla
            }
        }
    };
    xhr.send(); // Envía la petición
}

// Función usando Axios para obtener personajes
function axiosFetchCharacters() {
    const ts = Date.now(); 
    const hash = generateHash(ts); 
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`; // URL de la API con los parámetros necesarios
    
    axios.get(url) // Realiza la petición GET usando Axios
        .then(response => {
            displayData('Personajes (Axios)', response.data); 
        })
        .catch(error => console.error('Error en la petición con Axios:', error)); 
}

// Función para mostrar datos en el contenedor de salida
function displayData(title, data) {
    outputDiv.innerHTML = `<h2>${title}</h2>`; 
    if (data.data.results) { // Verifica si existen resultados
        data.data.results.forEach(item => {
            const itemDiv = document.createElement('div'); // Crea un div para cada elemento obtenido
            itemDiv.classList.add('item'); // Asigna una clase CSS al div para estilos

            const titleElement = document.createElement('h3'); 
            titleElement.textContent = item.name || item.title; 
            itemDiv.appendChild(titleElement); // Agrega el título al div del elemento

            const imgElement = document.createElement('img'); // Crea un elemento de imagen
            const imagePath = item.thumbnail.path; // Obtiene la ruta de la imagen
            const imageExtension = item.thumbnail.extension; // Obtiene la extensión de la imagen
            imgElement.src = `${imagePath}.${imageExtension}`; // Construye la URL de la imagen
            imgElement.alt = item.name || item.title; // Asigna el texto alternativo de la imagen
            imgElement.style.width = '100px'; // Ajusta el ancho de la imagen
            imgElement.style.height = 'auto'; // Mantiene la proporción de la imagen
            itemDiv.appendChild(imgElement); // Agrega la imagen al div del elemento

            outputDiv.appendChild(itemDiv); // Agrega el div del elemento al contenedor de salida
        });
    } else {
        outputDiv.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`; // Si no hay resultados, muestra los datos en formato de texto
    }
}

// Asignar funciones a los botones
document.getElementById('fetchButton').addEventListener('click', fetchCharacters); 
document.getElementById('asyncAwaitButton').addEventListener('click', asyncAwaitComics); 
document.getElementById('xmlHttpRequestButton').addEventListener('click', xmlHttpRequestSeries); 
document.getElementById('axiosButton').addEventListener('click', axiosFetchCharacters);
