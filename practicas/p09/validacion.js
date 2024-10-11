function requerido(x, y) {
	const element = document.getElementById(x);
    const elError = document.getElementById(y);
	if (element.value.length < 1) {
		elError.removeAttribute("hidden");
		elError.innerHTML = "El campo es obligatorio.";
		return false;
	}
	elError.setAttribute("hidden", true);
	return true;
}
function largo(x, y, largo) {
	const element = document.getElementById(x);
    const elError = document.getElementById(y);
	if (element.value.length > largo) {
		elError.removeAttribute("hidden");
		elError.innerHTML =
			"No debe superar los " + largo + " caracteres.";
		return false;
	}
	elError.setAttribute("hidden", true);
	return true;
}
function validarNombre(x, y, maximo) {
    if (requerido(x, y) && largo(x, y, maximo)) {
        return true;
    }
    return false;
}
function alpha(x, y) {
    const element = document.getElementById(x);
    const pattern = /^[a-zA-Z0-9\s]+$/;
    if (!pattern.test(element.value)&& element.value.length > 0) {
        document.getElementById(y).removeAttribute("hidden");
        document.getElementById(y).innerHTML = "Solo se permiten caracteres alfanuméricos.";
        return false;
    }
    document.getElementById(y).setAttribute("hidden", true);
    return true;
}
function validarModelo(x, y, maximo) {
    if (requerido(x, y) && largo(x, y, maximo) && alpha(x, y)) {
        return true;
    }
    return false;

}
function valor(x, y, min) {
    const element = document.getElementById(x);
    if (parseFloat(element.value) < min) {
        document.getElementById(y).removeAttribute("hidden");
        document.getElementById(y).innerHTML = "El valor debe ser mayor a " + min + ".";
        return false;
    }
    document.getElementById(y).setAttribute("hidden", true);
}
function validarPrecio(x, y, min) {
    if (requerido(x, y) && valor(x, y, min)) {
        return true;
    }
    return false;
}
function validarUnidades(x, y, min){
    if(requerido(x, y) && valor(x, y, min)){
        return true;
    }
    return false;
}
function defImg(imgPath) {
    const defaultPath = "img/default.jpeg";
    return imgPath && imgPath.trim() !== "" ? imgPath : defaultPath;
}
