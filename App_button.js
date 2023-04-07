function uploadImg() {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => { 
        // Obtenemos el archivo seleccionado por el usuario
        const archivo = e.target.files[0]; 
        
        // Creamos un objeto URL para la imagen
        const urlImagen = URL.createObjectURL(archivo);
        
        // Asignamos la URL al atributo src del elemento img
        const imagen = document.getElementById("imagen");
        imagen.src = urlImagen;
    }

    input.click();
}

function getPixeles(img, length, arrIntensities) {
    // Crear un canvas temporal para manipular la imagen
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Obtener los datos de los píxeles
    var imageData = ctx.getImageData(0, 0, img.width, img.height);
    var data = imageData.data; // pixel = [red1, green1, blue1, transparencia1]
    // data = [pixe1-red, pixel1-green, pixel1-green, pixel1-trans ]

    // Calcular la intensidad media de los píxeles
    for (var i = 0; i < data.length; i += 4) {
        // Los datos de cada píxel están en los elementos [i], [i+1], [i+2] y [i+3]
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        // La intensidad de un píxel es la media de sus componentes RGB
        var intensity = Math.round((r + g + b) / 3); // 2 -> arrIntensities = [0,0,1,...]
        
        arrIntensities[intensity]++;
    }

    // [12, 24, 10, 0, ..., 89]

    for (let i=0; i<length; i++) {
        console.log("Intensidad: "+i+": "+arrIntensities[i]);
    }
}

function constructBarChart(arrIntensities, length) {
    // Creo elemento html para colocar para colocar mi chart
    document.getElementById("container-canvas").innerHTML="";
    var canvas = document.createElement("canvas");
    canvas.id="myChart";

    // Inserto contexto
    document.getElementById("container-canvas").appendChild(canvas);
    
    
    const context = document.getElementById('myChart');
    
    // Creo indices de X
    let indexes = [];
    // vector<int> indexes</int>
    
    for (let i = 0; i < length; i++) {
        indexes.push(i);
        // indexes.push_back(i);
    }
    //indexes=[0,1,2...255]

    // Creo el chart
    new Chart(context, {
        type: 'bar',
        data: {
            labels: indexes,
            datasets: [{
                label: 'Intensidades de negro',
                data: arrIntensities,
                backgroundColor: "#000",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}

function transformImage() {
    let img = new Image();
    img.src=document.getElementById("imagen").src;
    let length=256; // Rango de pixeles [0:255]
    let intensidades = new Array(length).fill(0); // [0,0,0, ... , 0, 0]

    getPixeles(img, length, intensidades);
    constructBarChart(intensidades, length)
}

