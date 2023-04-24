const btnTransform=document.getElementById('btn-convert-img');
const options = document.getElementById('options');

options.addEventListener("change", function() {
    let selectedOption = this.value;
    
    if (selectedOption!="") {
        btnTransform.disabled=false;
    }
});



