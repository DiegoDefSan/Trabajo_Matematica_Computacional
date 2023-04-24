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
        imagen.style.maxWidth="260px";
        imagen.style.maxHeight="260px";
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
}

function constructBarChart(arrIntensities, length, idContainer, idCanvas) {
    // Creo elemento html para colocar para colocar mi chart
    document.getElementById(idContainer).innerHTML="";
    var canvas = document.createElement("canvas");
    canvas.id=idCanvas;

    // Inserto contexto
    document.getElementById(idContainer).appendChild(canvas);
    
    
    const context = document.getElementById(idCanvas);
    
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
            title: {
                display: true,
                text: 'Histograma de intensidades',
                fontColor:'#000',
                fontSize: 18
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}


function editImageEcualizacion(img, intensidades, length) {
    // Creacion del canvas
    let newCanvas = document.createElement('canvas');
    newCanvas.width = img.width;
    newCanvas.height = img.height;

    // Asignar tamaño máximo a la imagen
    newCanvas.style.width="260px";

    // Obtener el contexto 2D del canvas
    const ctx = newCanvas.getContext('2d');

    // Dibujar la imagen en el canvas
    ctx.drawImage(img, 0, 0);

    // Obtener los valores de los píxeles de la imagen
    const imageData = ctx.getImageData(0, 0, newCanvas.width, newCanvas.height);
    const pixels = imageData.data;

    // Obtener la frecuencia acumulada por intensidades
        // intensidades = [2, 5, 10, 3, 6]
        // frecuenciaAcumulada = [2, 7, 17, 20, 26]
    let frecuenciaAcumulada = new Array(length).fill(0);
    frecuenciaAcumulada[0] = intensidades[0];
    for (let i = 1; i < 256; i++) {
        frecuenciaAcumulada[i] = frecuenciaAcumulada[i - 1] + intensidades[i];
    }

    // Declaramos arreglo para almacenar los nuevos valores de pixeles
    let newIntensidades=new Array(length).fill(0);

    for (let i = 0; i < pixels.length; i += 4) {
        // Se obtiene la intensidad del pixel
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        let intensity = Math.round((r + g + b) / 3);

        // Se obtiene la nueva intensidad a partir de la frecuencia acumulada y la ecuación ((L-1)/M*N)(Hi)
        let newIntensity=Math.round(((255)/(newCanvas.width*newCanvas.height))*(frecuenciaAcumulada[intensity])); 

        // Se le asigna las nuevas intensidades;
        pixels[i] = newIntensity;
        pixels[i + 1] = newIntensity;
        pixels[i + 2] = newIntensity;

        newIntensidades[newIntensity]++;
    }

    // Se construye el gráfico con las nuevas intensidades
    constructBarChart(newIntensidades, length, "new-container-canvas", "myNewChart");

    // Establecer los nuevos valores de los píxeles en la imagen
    ctx.putImageData(imageData, 0, 0);

    // Mostrar la imagen en la página
    document.getElementById('updated-img').innerHTML="";
    document.getElementById('updated-img').appendChild(newCanvas);
    
}

function extendHistogram(img,intensidades,length) {
    // Creacion del canvas
    let newCanvas = document.createElement('canvas');
    newCanvas.width = img.width;
    newCanvas.height = img.height;

    // Asignar tamaño máximo a la imagen
    newCanvas.style.width="260px";

    // Obtener el contexto 2D del canvas
    const ctx = newCanvas.getContext('2d');

    // Dibujar la imagen en el canvas
    ctx.drawImage(img, 0, 0);

    // Obtener los valores de los píxeles de la imagen
    let imageData = ctx.getImageData(0, 0, newCanvas.width, newCanvas.height);
    let pixels = imageData.data;

    let minIntensity=256;
    let maxIntensity=-1;

    for (let i=0; i<pixels.length; i+=4) {
        // Se obtiene la intensidad del pixel
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        let intensity = Math.round((r + g + b) / 3);

        if (intensity<minIntensity) minIntensity=intensity;
        if (intensity>maxIntensity) maxIntensity=intensity;
    }

    console.log(minIntensity);
    console.log(maxIntensity);
    
    // Quiero examndir mi histograma de [minIntensity, maxIntensity] -> [0, 255]
    // P1 = (minIntensity, 0) y P2 = (maxIntensity, 255)
    // y=pendiente*x+b_added
    let pendiente = (255-0)/(maxIntensity-minIntensity);
    let b_added = 255-maxIntensity*pendiente;
    console.log(pendiente);
    console.log(b_added);

    let newIntensidades=new Array(length).fill(0);


    for (let i=0; i<pixels.length; i+=4) {
        // Se obtiene la intensidad del pixel
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        let intensity = Math.round((r + g + b) / 3);

        let newIntensity=Math.round(pendiente*intensity+b_added);
        //console.log(newIntensity);
        pixels[i]=newIntensity;
        pixels[i+1]=newIntensity;
        pixels[i+2]=newIntensity;

        newIntensidades[newIntensity]=intensidades[intensity];
    }
    // Se construye el gráfico con las nuevas intensidades
    constructBarChart(newIntensidades, length, "new-container-canvas", "myNewChart");

    // Establecer los nuevos valores de los píxeles en la imagen
    ctx.putImageData(imageData, 0, 0);

    // Mostrar la imagen en la página
    document.getElementById('updated-img').innerHTML="";
    document.getElementById('updated-img').appendChild(newCanvas);

}


function transformImage() {
    let img = new Image();
    img.src=document.getElementById("imagen").src;
    let length=256; // Rango de pixeles [0:255]
    let intensidades = new Array(length).fill(0); // [0,0,0, ... , 0, 0]


    getPixeles(img, length, intensidades);
    constructBarChart(intensidades, length, "container-canvas", "myChart");

    document.getElementById('updated-img').style.backgroundColor='#132d46'
    
    // Ecualización
    if (options.value=='equalization')
        editImageEcualizacion(img, intensidades, length);

    // Extensiónd e histograma
    if (options.value=='expantion')
        extendHistogram(img, intensidades, length);

}

