const btnTransform=document.getElementById('btn-convert-img');
const options = document.getElementById('options');

options.addEventListener("change", function() {
    let selectedOption = this.value;
    
    if (selectedOption!="") {
        btnTransform.disabled=false;
    }
});

function createButton() {
    let imgDiv = document.getElementById('updated-img');
    
    var btn = document.createElement("button");
    btn.innerHTML = "Descargar imagen";
    btn.className = 'btn-dwnld-result';

    btn.style.margin = '36px';
    btn.style.fontSize = '0.8em';
    btn.style.borderRadius = '20px';
    btn.style.border = 'None';
    btn.style.padding = '8px 20px';
    btn.style.cursor = 'pointer';

    

    btn.addEventListener('click', descargarResultado);

    imgDiv.appendChild(btn);

    
}

function descargarResultado() {
    var canvas = document.getElementById("new-canvas");
    
    // Obtener la representación base64 de la imagen
    var dataURL = canvas.toDataURL("image/png");

    // Crear un enlace y establecer el atributo href con la representación base64
    var enlace = document.createElement('a');
    enlace.href = dataURL;
    enlace.download = "imagen.png";

    // Simular el clic en el enlace para descargar la imagen
    enlace.click();
}

var iconToProfiles = document.getElementById('to-profiles')
iconToProfiles.addEventListener('click', function() {
    window.location.href = 'index_creditos.html'
})






