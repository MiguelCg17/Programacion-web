// Configuración de autenticación
const publicKey = '05e1b180c2c1d4866b298f978c61484d';
const privateKey = '2a01b66615978735285319f294aaeda620cc77e8';

// Div para mostrar resultados
const outputDiv = document.getElementById('output');

// Función para generar el hash
function generateHash(ts) {
    return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

// Función usando Fetch para obtener personajes
function fetchCharacters() {
    const ts = Date.now(); // Marca de tiempo dinámica
    const hash = generateHash(ts); // Generar hash dinámico
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición de personajes');
            }
            return response.json();
        })
        .then(data => displayData('Personajes (Fetch)', data))
        .catch(error => console.error(error));
}

// Función usando Async/Await para obtener cómics
async function asyncAwaitComics() {
    const ts = Date.now(); // Marca de tiempo dinámica
    const hash = generateHash(ts); // Generar hash dinámico
    const url = `https://gateway.marvel.com:443/v1/public/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en la petición de cómics');
        }
        const data = await response.json();
        displayData('Cómics (Async/Await)', data);
    } catch (error) {
        console.error(error);
    }
}

// Función usando XMLHttpRequest para obtener series
function xmlHttpRequestSeries() {
    const ts = Date.now(); // Marca de tiempo dinámica
    const hash = generateHash(ts); // Generar hash dinámico
    const url = `https://gateway.marvel.com:443/v1/public/series?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) { // Petición completada
            if (xhr.status === 200) { // Respuesta exitosa
                const data = JSON.parse(xhr.responseText);
                displayData('Serie (XMLHttpRequest)', data);
            } else {
                console.error('Error en la petición de serie');
            }
        }
    };
    xhr.send();
}

// Función usando Axios para obtener personajes
function axiosFetchCharacters() {
    const ts = Date.now(); // Marca de tiempo dinámica
    const hash = generateHash(ts); // Generar hash dinámico
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    
    axios.get(url)
        .then(response => {
            displayData('Personajes (Axios)', response.data);
        })
        .catch(error => console.error('Error en la petición con Axios:', error));
}

// Función para mostrar datos en el contenedor de salida
function displayData(title, data) {
    outputDiv.innerHTML = `<h2>${title}</h2>`; // Título de los datos obtenidos
    if (data.data.results) {
        data.data.results.forEach(item => {
            // Crear un contenedor para cada elemento
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            // Agregar título
            const titleElement = document.createElement('h3');
            titleElement.textContent = item.name || item.title;
            itemDiv.appendChild(titleElement);

            // Agregar imagen
            const imgElement = document.createElement('img');
            const imagePath = item.thumbnail.path;
            const imageExtension = item.thumbnail.extension;
            imgElement.src = `${imagePath}.${imageExtension}`; // Construir URL de la imagen
            imgElement.alt = item.name || item.title;
            imgElement.style.width = '100px'; // Puedes ajustar el tamaño
            imgElement.style.height = 'auto'; // Mantiene la proporción
            itemDiv.appendChild(imgElement);

            // Agregar el itemDiv al outputDiv
            outputDiv.appendChild(itemDiv);
        });
    } else {
        outputDiv.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`; // Mostrar datos como texto si no hay resultados
    }
}

// Asignar funciones a los botones
document.getElementById('fetchButton').addEventListener('click', fetchCharacters);
document.getElementById('asyncAwaitButton').addEventListener('click', asyncAwaitComics);
document.getElementById('xmlHttpRequestButton').addEventListener('click', xmlHttpRequestSeries);
document.getElementById('axiosButton').addEventListener('click', axiosFetchCharacters); // Asignar el nuevo botón de Axios