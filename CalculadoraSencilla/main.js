//Creamos un objeto que relaciona las variables con las clases buscadas el cual se rellenará de los elementos que recoja del HTML para que, si se cambia el nombre, no tener que cambiarlos uno a uno
let calc = {
    background: 'background',
    container: 'container',
    calc: 'calc',
    pantalla: 'value',
    num: 'num',
    botones: 'group-btn',
    '+': 'suma',
    '-': 'resta',
    '*': 'multiplicacion',
    '/': 'division',
    'c': 'cancelar',
    '=': 'resultado',
}
let EXP = {
    calc: /(\+|-|\*|\/|Enter|Shift|Control|=|c| |\d|\.)/i,
    num: /^^\d*(\d+[.|,])?\d*$/gi,
    signo: /(\+|-|\*|\/|=|c)/i
}
//Creamos una serie de signo que queremos que se formateen
let signosAFormatear = {
    'Enter': '=',
    ' ': '=',
    'C': 'c'
}

//Activa el efecto de error escrito en CSS
let efectoShake = (element) => {
    element.classList.add('error-shake');
    setTimeout(() => {
        element.classList.remove('error-shake');
    }, 400);
}

//Creamos una función a que se le pasarán el cálculo que si quiera realizar
//El caso por defecto es que devuelve el último valor
let calcula = {
    "+": (val1, val2) => { return parseFloat(val1) + parseFloat(val2) },
    "-": (val1, val2) => { return parseFloat(val1) - parseFloat(val2) },
    "*": (val1, val2) => { return parseFloat(val1) * parseFloat(val2) },
    "/": (val1, val2) => { return parseFloat(val1) / parseFloat(val2) },
    "default": (val1, val2) => { return parseFloat(val2) }
}
//Activa el efecto de pulsar en CSS
let efectoPulsar = (element) => {
    element.classList.add('active');
    setTimeout(() => {
        element.classList.remove('active');
    }, 120);
}

//Creamos un objeto que vaya guardando los valores que se van introduciendo
let guardado = {
    val: 0,
    signo: '='
}
//Creamos una función que muestre la solución en la pantalla de la calculadora con el formato que queremos
let muestraSol = (signo) => {
    calc.pantalla.value = guardado.val + " " + signo;
}

let guardaYMuestra = (signo, valInput, valActual) => {
    if (valInput !== '') {//Si en el input hay algo
        //Hacemos los cálculos pertinentes
        guardado.val = (calcula[guardado.signo] || calcula['default'])(guardado.val, valActual);
        //Si alguno de los cálculos diera un valor erróneo lo mostramos por consola y reseteamos el valor a 0
        if (guardado.val === Infinity || isNaN(guardado.val) || guardado.val === undefined) {
            calc.pantalla.value = `🤯`;
            guardado.val = 0;
        } else {
            muestraSol(signo);//Si todo está bien, mostramos la solución en consola
        }
        valInput = calc.num.value = ``;
    } else {//Si no hay input mostramos directamente la solución en consola
        muestraSol(signo);
    }
}

window.onload = () => {
    let valInput = '';
    let valActual = 0;
    let signo;
    let signoValido = 0;
    let yaErroneo = false;

    //Reasignamos el objeto literal calc con los elementos del DOM
    Object.entries(calc).forEach(([key, value]) => calc[key] = document.getElementsByClassName(value)[0]);
    calc.num.focus();

    // Creamos una función que ejecute lo necesario para hacer los cálculos y mostrarlos
    let ejecutaSalida = (signo) => {
        efectoPulsar(calc[signo]);
        guardaYMuestra(signo, valInput, valActual);
        valInput = '';
        guardado.signo = signo;
    }

    //Creamos una función que compruebe el que signo se está introduciendo
    let compruebaSigno = (signo) => {
        let validacionSigno;

        if (EXP.calc.test(signo)) {//Si es un signo correcto
            //Formateamos algunos signos a los valores deseados de entrada
            signo = signosAFormatear[signo] ?? signo;
            if (signo == 'c') {//Si el signo es una c, reseteamos
                calc.calc.reset();
                efectoPulsar(calc[signo]);
                return 1
            } else {
                validacionSigno = EXP.signo.exec(signo) ?? false;
                if (validacionSigno) { //Si alguno de los signo para calcular se aprieta
                    ejecutaSalida(signo);
                    return 1
                }
            }
        } else return 2
    }

    let calculadora = (e) => {
        //Recogemos del evento el valor que se ha introducido
        signo = e.key ?? e.target.innerHTML;
        signoValido = compruebaSigno(signo);
        if (signoValido < 1) return
        if (signoValido > 0) {//Si la comprobación es de nivel 1, prevenimos la introducción de valores
            e.preventDefault();
            if (signoValido > 1) {//Si es de nivel 2, lanzamos un efecto de error del valor
                efectoShake(calc.container);
            }
        }
    }

    //Creamos una función para ejecutar ciertas acciones cuando el input es erróneo o deja de serlo
    let inputErroneo = (esErroneo) => {
        if (esErroneo) {
            efectoShake(calc.container);
            calc.num.classList.add('error-color');
            return true;
        } else {
            calc.num.classList.remove('error-color');
            muestraSol(guardado.signo);
            valActual = valInput;
            return false;
        }
    }
    //Creamos una función para comprobar si es correcto
    let comprobarInput = (e) => {
        valInput = e.target.value;
        if (valInput === '') return;
        //Primero comprobamos si hay algún valor introducido
        if (!EXP.num.test(valInput)) { //Si el test es erróneo
            //Comprobamos si ya ha sido erróneo antes, si no lo es, enviamos info al usuario
            if (!yaErroneo) yaErroneo = inputErroneo(true);
            calc.calc.reset();
            calc.pantalla.value = `😑`;
            valInput = '';
            valActual = 0;
        } else { //Si el test no es erróneo
            //Comprobamos que ahora si, lo ha sido antes, y si es así enviamos info
            if (yaErroneo) yaErroneo = inputErroneo(false);
        }
        valActual = valInput;
        EXP.num.lastIndex = 0;
    }


    calc.num.addEventListener('keypress', e => calculadora(e), false);
    calc.num.addEventListener('input', e => comprobarInput(e), false);
    calc.botones.addEventListener('click', e => { calculadora(e); calc.num.focus() }, false);
}