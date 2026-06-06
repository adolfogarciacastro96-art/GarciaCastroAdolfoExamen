function ipANumero(ip) {
    return ip.split('.')
        .reduce((acum, octeto) =>
            (acum << 8) + parseInt(octeto), 0) >>> 0;
}

function numeroAIP(numero) {
    return [
        (numero >>> 24) & 255,
        (numero >>> 16) & 255,
        (numero >>> 8) & 255,
        numero & 255
    ].join('.');
}

// Validar formato de IP
function validarIP(ip) {

    const partes = ip.split('.');

    if (partes.length !== 4) {
        return false;
    }

    for (let parte of partes) {

        if (parte === '' || isNaN(parte)) {
            return false;
        }

        const numero = parseInt(parte);

        if (numero < 0 || numero > 255) {
            return false;
        }
    }

    return true;
}

// Validar máscara de subred
function validarMascara(mascara) {

    if (!validarIP(mascara)) {
        return false;
    }

    const mascaraNum = ipANumero(mascara);

    const binario = mascaraNum.toString(2).padStart(32, '0');

    let encontroCero = false;

    for (let bit of binario) {

        if (bit === '0') {
            encontroCero = true;
        }

        if (encontroCero && bit === '1') {
            return false;
        }
    }

    return true;
}

function obtenerClase(ip) {

    const primerOcteto = parseInt(ip.split('.')[0]);

    if (primerOcteto >= 1 && primerOcteto <= 126) {
        return "Clase A";
    }

    if (primerOcteto >= 128 && primerOcteto <= 191) {
        return "Clase B";
    }

    if (primerOcteto >= 192 && primerOcteto <= 223) {
        return "Clase C";
    }

    if (primerOcteto >= 224 && primerOcteto <= 239) {
        return "Clase D (Multicast)";
    }

    return "Clase E (Experimental)";
}

function obtenerBitsMascara(mascara) {

    return mascara
        .split('.')
        .map(octeto =>
            parseInt(octeto)
                .toString(2)
                .split('1')
                .length - 1
        )
        .reduce((a, b) => a + b, 0);
}

function calcularSubred() {

    const ip = document.getElementById("ip").value.trim();
    const mascara = document.getElementById("mascara").value.trim();

    // Validación IP
    if (!validarIP(ip)) {

        alert("La dirección IP no es válida.");

        return;
    }

    // Validación máscara
    if (!validarMascara(mascara)) {

        alert("La máscara de subred no es válida.");

        return;
    }

    const ipNum = ipANumero(ip);
    const mascaraNum = ipANumero(mascara);

    const red = ipNum & mascaraNum;

    const broadcast = red | (~mascaraNum >>> 0);

    const primerHost = red + 1;

    const hosts = broadcast - red - 1;

    const wildcard = (~mascaraNum) >>> 0;

    const wildcardIP = numeroAIP(wildcard);

    const clase = obtenerClase(ip);

    const bitsMascara = obtenerBitsMascara(mascara);

    let bitsClase = 24;

    if (clase === "Clase A") {
        bitsClase = 8;
    }

    if (clase === "Clase B") {
        bitsClase = 16;
    }

    if (clase === "Clase C") {
        bitsClase = 24;
    }

    const bitsSubred = bitsMascara - bitsClase;

    let subredes = 1;

    if (bitsSubred > 0) {
        subredes = Math.pow(2, bitsSubred);
    }

    document.getElementById("resultado").innerHTML = `
        <strong>Clase de Red:</strong> ${clase}<br>

        <strong>Dirección de Red:</strong> ${numeroAIP(red)}<br>

        <strong>Broadcast:</strong> ${numeroAIP(broadcast)}<br>

        <strong>Primer Host:</strong> ${numeroAIP(primerHost)}<br>

        <strong>Hosts disponibles:</strong> ${hosts}<br>

        <strong>Máscara Wildcard:</strong> ${wildcardIP}<br>

        <strong>Cantidad de subredes:</strong> ${subredes}<br>

        <strong>Prefijo CIDR:</strong> /${bitsMascara}
    `;
}