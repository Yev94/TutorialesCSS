//Cómo solo tenemos dos jugadores haremos uso de una variable que sea binaria (true o false)
let jugador = false;
//Creamos un objeto que contenga la función que queremos disparar según las preferencias de cada jugador 
let jugadores = {
    false: (casilla) => {
        casilla.style.background = '#ffe598';
        return 'x'
    },
    true: (casilla) => {
        casilla.style.background = '#c9daf8';
        return 'o'
    }
}

//Creamos una función para revisar que las dimensiones del cuadrado son las de un cuadrado y si es así pasamos esas dimensiones
let dimensionCuadrado = (tablero) => {
    let filas = tablero.length;
    return (tablero.every(element => { return element.length == filas })) ? filas : 0;
}

//Creamos una función para hacer la transpuesta de la matriz, para que luego se pueda checkear de manera más sencilla las celdas contiguas (las horizontales y verticales)
let transpuesta = (tablero) => {
    let matriz = new Array();
    q = dimensionCuadrado(tablero);
    if (q > 0) {
        for (let i = 0; i < q; i++) {
            matriz.push(new Array);
            for (let j = 0; j < q; j++) {
                matriz[i].push(tablero[j][i])
            }
        }
    }
    return matriz;
}

//Creamos una función para crear una matriz imagen en vertical de la primera para que se pueda checkear de manera más sencilla las celdas oblicuas (las que van en forma de cruz)
let imagenV = (tablero) => {
    let matriz = new Array();
    q = dimensionCuadrado(tablero);
    if (q > 0) {
        for (let i = 0; i < q; i++) {
            matriz.push(new Array);
            for (let j = 0; j < q; j++) {
                matriz[i].push(tablero[i][(q - 1) - j]);
            }
        }
    }
    return matriz;
}

//Creamos una función para chequear las celdas verticales y horizontales
let scanLineal = (tablero) => {
    q = dimensionCuadrado(tablero);
    let i = 0;
    let j = 1;
    let scan = false;
    //Si el tamaño del cuadrado es correcto
    if (q > 0) {
        //Compara las 2 primeras celdas si estas coinciden (teniendo en cuenta que no estén vacías) compara las 2 siguientes, sino para y pasa a la siguiente fila/columna 
        //Y así poder crear el juego con más filas y columnas y que siga revisando si hay un ganador del mismo modo
        while (i < q && scan == false) {
            scan = true;
            while (j < q && scan == true) {
                if (tablero[i][j] == '' || tablero[i][j - 1] == '' || tablero[i][j] !== tablero[i][j - 1]) scan = false;
                j++;
            }
            j = 1; i++;
        }
    }
    return scan
}

//Creamos una función para chequear las celdas oblicuas
let scanOblicuo = (tablero) => {
    q = dimensionCuadrado(tablero);
    let i = 1;
    let scan = true;
    //Hace lo mismo que la lineal pero entre las celdas oblicuas
    while (i < q && scan == true) {
        if (tablero[i][i] == '' || tablero[i - 1][i - 1] == '' || tablero[i][i] !== tablero[i - 1][i - 1]) scan = false;
        i++
    }
    return scan
}

//Creamos una función para chequear todas las celdas necesarias que harían ganar la partida
let checkWinner = (tablero) => {
    let tableroTrans = transpuesta(tablero);
    let tableroImgV = imagenV(tablero);
    let scan = [scanLineal(tablero), scanLineal(tableroTrans), scanOblicuo(tablero), scanOblicuo(tableroImgV)];
    return scan.some(element => element)
}

window.onload = () => {
    let casilla;
    let tablero = document.getElementsByTagName('tbody')[0];
    let columnas = tablero.children;
    let tableroVirtual = new Array;
    counter = 0;

    //Creamos una tabla virtual dentro del programa para que sea más sencillo asignar la posición de cada celda (puesto que no existen identificadores en el HTML)
    //Y la vamos ejecutando cada vez que un jugador presione dentro de una celda para mantenerla actualizada
    let connectTableroVirtual = (columnas, crear) => {
        if (!crear) {
            for (let i = 0; i < columnas.length; i++) {
                let filas = columnas[i].children;
                for (let j = 0; j < filas.length; j++) {
                    tableroVirtual[i][j] = filas[j].innerHTML;
                }
            };
        } else {
            for (let i = 0; i < columnas.length; i++) {
                let filas = columnas[i].children;
                tableroVirtual.push(new Array);
                for (let j = 0; j < filas.length; j++) {
                    tableroVirtual[i].push(filas[j].innerHTML);
                }
            }
        }
    }
    connectTableroVirtual(columnas, true);
    //Creamos una función que reinicia los valores para jugar otra partida
    let nuevaPartida = () => {
        for (let i = 0; i < columnas.length; i++) {
            let filas = columnas[i].children;
            for (let j = 0; j < filas.length; j++) {
                filas[j].innerHTML = '';
                filas[j].style.background = '#fff';
            }
        }
    }

    //Creamos una función para chequear que la celda que se presiona es la correcta
    let checkCelda = (casilla) => {
        if (casilla.nodeName == 'TD') {
            if (casilla.innerHTML !== '') {
                alert('Esta casilla ya está marcado 🤷🏻‍♂️, prueba con otra');
                return false;
            } else return true;
        } else return false;
    }

    //Creamos una función para chequear el tablero en busca de ganadores o si está el tablero está lleno, en esos caso lanza un mensaje y reinicia la partida
    let checkTablero = () => {
        if (checkWinner(tableroVirtual)) {
            alert(`${(jugadores[jugador])(casilla)} gana!! 🥳`);
            nuevaPartida();
        } else {
            if (tableroVirtual.every(element => element.every(deepElement => { return deepElement !== '' }))) {
                alert('El tablero ya está lleno 🤔, vamos a reiniciar la partida')
                nuevaPartida();
            }
        }
    }
    
    //Creamos una función que inicia el juego
    let juego = (e) => {
        casilla = e.target;
        if (checkCelda(casilla)) {
            casilla.innerHTML = (jugadores[jugador])(casilla);
            connectTableroVirtual(columnas, false);
            if (counter > 3) checkTablero();
            counter++;
            jugador = !jugador;
        }
    }

    tablero.addEventListener('click', (e) => juego(e), true);

}