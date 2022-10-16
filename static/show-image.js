function setImageVisible(id, visible) {
    var img = document.getElementById(id);
    if (visible == "true"){
        img.style.visibility = "visible"; 
    }
    else {
        img.style.visibility = "hidden"; 
    }
}


