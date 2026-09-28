// Formulario del modal "Hazte cliente": regiones/comunas, validación y envío.
(function () {
  var form = document.getElementById('hazte-cliente-form');
  if (!form) return;

  // 16 regiones y 346 comunas de Chile, de norte a sur.
  var REGIONES = [
    { nombre: 'Arica y Parinacota', comunas: ['Arica', 'Camarones', 'General Lagos', 'Putre'] },
    { nombre: 'Tarapacá', comunas: ['Alto Hospicio', 'Camiña', 'Colchane', 'Huara', 'Iquique', 'Pica', 'Pozo Almonte'] },
    { nombre: 'Antofagasta', comunas: ['Antofagasta', 'Calama', 'María Elena', 'Mejillones', 'Ollagüe', 'San Pedro de Atacama', 'Sierra Gorda', 'Taltal', 'Tocopilla'] },
    { nombre: 'Atacama', comunas: ['Alto del Carmen', 'Caldera', 'Chañaral', 'Copiapó', 'Diego de Almagro', 'Freirina', 'Huasco', 'Tierra Amarilla', 'Vallenar'] },
    { nombre: 'Coquimbo', comunas: ['Andacollo', 'Canela', 'Combarbalá', 'Coquimbo', 'Illapel', 'La Higuera', 'La Serena', 'Los Vilos', 'Monte Patria', 'Ovalle', 'Paiguano', 'Punitaqui', 'Río Hurtado', 'Salamanca', 'Vicuña'] },
    { nombre: 'Valparaíso', comunas: ['Algarrobo', 'Cabildo', 'Calle Larga', 'Cartagena', 'Casablanca', 'Catemu', 'Concón', 'El Quisco', 'El Tabo', 'Hijuelas', 'Isla de Pascua', 'Juan Fernández', 'La Calera', 'La Cruz', 'La Ligua', 'Limache', 'Llaillay', 'Los Andes', 'Nogales', 'Olmué', 'Panquehue', 'Papudo', 'Petorca', 'Puchuncaví', 'Putaendo', 'Quillota', 'Quilpué', 'Quintero', 'Rinconada', 'San Antonio', 'San Esteban', 'San Felipe', 'Santa María', 'Santo Domingo', 'Valparaíso', 'Villa Alemana', 'Viña del Mar', 'Zapallar'] },
    { nombre: 'Metropolitana de Santiago', comunas: ['Alhué', 'Buin', 'Calera de Tango', 'Cerrillos', 'Cerro Navia', 'Colina', 'Conchalí', 'Curacaví', 'El Bosque', 'El Monte', 'Estación Central', 'Huechuraba', 'Independencia', 'Isla de Maipo', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Lampa', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'María Pinto', 'Melipilla', 'Ñuñoa', 'Padre Hurtado', 'Paine', 'Pedro Aguirre Cerda', 'Peñaflor', 'Peñalolén', 'Pirque', 'Providencia', 'Pudahuel', 'Puente Alto', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Bernardo', 'San Joaquín', 'San José de Maipo', 'San Miguel', 'San Pedro', 'San Ramón', 'Santiago', 'Talagante', 'Tiltil', 'Vitacura'] },
    { nombre: "Libertador General Bernardo O'Higgins", comunas: ['Chépica', 'Chimbarongo', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'La Estrella', 'Las Cabras', 'Litueche', 'Lolol', 'Machalí', 'Malloa', 'Marchihue', 'Mostazal', 'Nancagua', 'Navidad', 'Olivar', 'Palmilla', 'Paredones', 'Peralillo', 'Peumo', 'Pichidegua', 'Pichilemu', 'Placilla', 'Pumanque', 'Quinta de Tilcoco', 'Rancagua', 'Rengo', 'Requínoa', 'San Fernando', 'San Vicente', 'Santa Cruz'] },
    { nombre: 'Maule', comunas: ['Cauquenes', 'Chanco', 'Colbún', 'Constitución', 'Curepto', 'Curicó', 'Empedrado', 'Hualañé', 'Licantén', 'Linares', 'Longaví', 'Maule', 'Molina', 'Parral', 'Pelarco', 'Pelluhue', 'Pencahue', 'Rauco', 'Retiro', 'Río Claro', 'Romeral', 'Sagrada Familia', 'San Clemente', 'San Javier', 'San Rafael', 'Talca', 'Teno', 'Vichuquén', 'Villa Alegre', 'Yerbas Buenas'] },
    { nombre: 'Ñuble', comunas: ['Bulnes', 'Chillán', 'Chillán Viejo', 'Cobquecura', 'Coelemu', 'Coihueco', 'El Carmen', 'Ninhue', 'Ñiquén', 'Pemuco', 'Pinto', 'Portezuelo', 'Quillón', 'Quirihue', 'Ránquil', 'San Carlos', 'San Fabián', 'San Ignacio', 'San Nicolás', 'Treguaco', 'Yungay'] },
    { nombre: 'Biobío', comunas: ['Alto Biobío', 'Antuco', 'Arauco', 'Cabrero', 'Cañete', 'Chiguayante', 'Concepción', 'Contulmo', 'Coronel', 'Curanilahue', 'Florida', 'Hualpén', 'Hualqui', 'Laja', 'Lebu', 'Los Álamos', 'Los Ángeles', 'Lota', 'Mulchén', 'Nacimiento', 'Negrete', 'Penco', 'Quilaco', 'Quilleco', 'San Pedro de la Paz', 'San Rosendo', 'Santa Bárbara', 'Santa Juana', 'Talcahuano', 'Tirúa', 'Tomé', 'Tucapel', 'Yumbel'] },
    { nombre: 'La Araucanía', comunas: ['Angol', 'Carahue', 'Cholchol', 'Collipulli', 'Cunco', 'Curacautín', 'Curarrehue', 'Ercilla', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Purén', 'Renaico', 'Saavedra', 'Temuco', 'Teodoro Schmidt', 'Toltén', 'Traiguén', 'Victoria', 'Vilcún', 'Villarrica'] },
    { nombre: 'Los Ríos', comunas: ['Corral', 'Futrono', 'La Unión', 'Lago Ranco', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'Río Bueno', 'Valdivia'] },
    { nombre: 'Los Lagos', comunas: ['Ancud', 'Calbuco', 'Castro', 'Chaitén', 'Chonchi', 'Cochamó', 'Curaco de Vélez', 'Dalcahue', 'Fresia', 'Frutillar', 'Futaleufú', 'Hualaihué', 'Llanquihue', 'Los Muermos', 'Maullín', 'Osorno', 'Palena', 'Puerto Montt', 'Puerto Octay', 'Puerto Varas', 'Puqueldón', 'Purranque', 'Puyehue', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Río Negro', 'San Juan de la Costa', 'San Pablo'] },
    { nombre: 'Aysén del General Carlos Ibáñez del Campo', comunas: ['Aysén', 'Chile Chico', 'Cisnes', 'Cochrane', 'Coyhaique', 'Guaitecas', 'Lago Verde', "O'Higgins", 'Río Ibáñez', 'Tortel'] },
    { nombre: 'Magallanes y de la Antártica Chilena', comunas: ['Antártica', 'Cabo de Hornos', 'Laguna Blanca', 'Natales', 'Porvenir', 'Primavera', 'Punta Arenas', 'Río Verde', 'San Gregorio', 'Timaukel', 'Torres del Paine'] }
  ];

  var region = form.elements.region;
  var comuna = form.elements.comuna;
  var rut = form.elements.rut;
  var telefono = form.elements.telefono;
  var feedback = form.querySelector('.modal-hazte-cliente__feedback');

  REGIONES.forEach(function (r, i) {
    region.add(new Option(r.nombre, r.nombre));
    region.options[region.options.length - 1].dataset.index = i;
  });

  region.addEventListener('change', function () {
    var opt = region.options[region.selectedIndex];
    comuna.length = 1; // deja solo el placeholder
    if (!opt || opt.dataset.index === undefined) {
      comuna.disabled = true;
      return;
    }
    REGIONES[opt.dataset.index].comunas.forEach(function (c) {
      comuna.add(new Option(c, c));
    });
    comuna.disabled = false;
  });

  // RUT: cuerpo numérico + dígito verificador (módulo 11).
  function limpiarRut(valor) {
    return valor.replace(/[^0-9kK]/g, '').toUpperCase();
  }
  function rutValido(valor) {
    var limpio = limpiarRut(valor);
    if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;
    var cuerpo = limpio.slice(0, -1);
    var dv = limpio.slice(-1);
    var suma = 0;
    var factor = 2;
    for (var i = cuerpo.length - 1; i >= 0; i--) {
      suma += Number(cuerpo[i]) * factor;
      factor = factor === 7 ? 2 : factor + 1;
    }
    var resto = 11 - (suma % 11);
    var esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
    return dv === esperado;
  }
  function formatearRut(valor) {
    var limpio = limpiarRut(valor);
    if (limpio.length < 2) return limpio;
    var cuerpo = limpio.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return cuerpo + '-' + limpio.slice(-1);
  }

  // Teléfono chileno: 9 dígitos nacionales, con o sin +56.
  function telefonoValido(valor) {
    var digitos = valor.replace(/\D/g, '');
    if (digitos.length === 11 && digitos.indexOf('56') === 0) digitos = digitos.slice(2);
    return /^[2-9]\d{8}$/.test(digitos);
  }

  var correoRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var VALIDADORES = {
    nombre: function (v) { return v.trim().length >= 2 || 'Ingresa tu nombre.'; },
    rut: function (v) { return rutValido(v) || 'Ingresa un RUT válido (ej: 76.123.456-7).'; },
    correo: function (v) { return correoRe.test(v.trim()) || 'Ingresa un correo válido.'; },
    telefono: function (v) { return telefonoValido(v) || 'Ingresa un teléfono de 9 dígitos (ej: +56 9 1234 5678).'; },
    region: function (v) { return !!v || 'Selecciona una región.'; },
    comuna: function (v) { return !!v || 'Selecciona una comuna.'; },
    consentimiento: function (v, el) { return el.checked || 'Debes aceptar el uso de tus datos para continuar.'; }
  };

  function validarCampo(nombre) {
    var el = form.elements[nombre];
    var resultado = VALIDADORES[nombre](el.value, el);
    var error = document.getElementById('hc-error-' + nombre);
    var ok = resultado === true;
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (error) error.textContent = ok ? '' : resultado;
    return ok;
  }

  rut.addEventListener('blur', function () {
    if (rut.value.trim()) rut.value = formatearRut(rut.value);
  });

  // Tras el primer intento de envío, revalida cada campo mientras se corrige.
  // En los textos se usa 'input' y no 'blur': si el error desapareciera al perder el foco,
  // el salto de layout desviaría el clic que el usuario está haciendo en el siguiente campo.
  Object.keys(VALIDADORES).forEach(function (nombre) {
    var el = form.elements[nombre];
    var evento = el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(evento, function () {
      if (form.dataset.intentado) validarCampo(nombre);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.dataset.intentado = '1';
    feedback.classList.add('d-none');
    feedback.classList.remove('alert-success', 'alert-danger');

    var primeroInvalido = null;
    Object.keys(VALIDADORES).forEach(function (nombre) {
      if (!validarCampo(nombre) && !primeroInvalido) primeroInvalido = form.elements[nombre];
    });
    if (primeroInvalido) {
      primeroInvalido.focus();
      return;
    }

    // TODO: conectar con el endpoint real de envío.
    feedback.textContent = 'Listo, recibimos tu solicitud. Un ejecutivo te contactará a la brevedad.';
    feedback.classList.remove('d-none');
    feedback.classList.add('alert-success');
    form.reset();
    comuna.length = 1;
    comuna.disabled = true;
    delete form.dataset.intentado;
    Array.prototype.forEach.call(form.querySelectorAll('[aria-invalid]'), function (el) {
      el.removeAttribute('aria-invalid');
    });
  });
})();
