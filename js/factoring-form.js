// Formulario de contacto de la página "Factoring" (versión desktop y móvil): validación y envío.
(function () {
  // RUT: cuerpo numérico + dígito verificador (módulo 11).
  function limpiarRut(valor) {
    return valor.replace(/[^0-9kK]/g, '').toUpperCase().slice(0, 9);
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
    rut: function (v) { return rutValido(v) || 'Ingresa un RUT válido (ej: 76.197.101-8).'; },
    name: function (v) { return v.trim().length >= 2 || 'Ingresa tu nombre.'; },
    email: function (v) { return correoRe.test(v.trim()) || 'Ingresa un correo válido (ej: nombre@empresa.cl).'; },
    phone: function (v) { return telefonoValido(v) || 'Ingresa un teléfono de 9 dígitos (ej: +56 9 1234 5678).'; },
    consentimiento: function (v, el) { return el.checked || 'Debes aceptar el uso de tus datos para continuar.'; }
  };

  // main.js (formato de campos y envío al API) no viene en la maqueta: si está cargado,
  // este script solo valida y le deja el formato y el envío.
  function hayMainJs() {
    return typeof window.inputRut === 'function';
  }

  function iniciar(form) {
    if (!form) return;
    form.noValidate = true;
    var feedback = form.querySelector('.alert');

    // Los campos se recorren en el orden en que aparecen en cada formulario,
    // para que al enviar el foco vaya al primer campo con error.
    var campos = Array.prototype.filter.call(form.elements, function (el) {
      return Object.prototype.hasOwnProperty.call(VALIDADORES, el.name);
    });

    function validarCampo(el) {
      var resultado = VALIDADORES[el.name](el.value, el);
      var error = document.getElementById(el.getAttribute('aria-describedby'));
      var ok = resultado === true;
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (error) error.textContent = ok ? '' : resultado;
      return ok;
    }

    function limpiarEstado() {
      delete form.dataset.intentado;
      campos.forEach(function (el) {
        el.removeAttribute('aria-invalid');
        var error = document.getElementById(el.getAttribute('aria-describedby'));
        if (error) error.textContent = '';
      });
    }

    // Formato automático mientras se escribe (76.197.101-8), manteniendo el cursor
    // detrás del mismo carácter aunque se agreguen o quiten puntos y guion.
    var rut = form.elements.rut;
    rut.addEventListener('input', function () {
      if (hayMainJs()) return;
      var cursor = rut.selectionStart;
      var significativos = limpiarRut(rut.value.slice(0, cursor)).length;
      var formateado = formatearRut(rut.value);
      rut.value = formateado;
      var pos = 0;
      var contados = 0;
      while (pos < formateado.length && contados < significativos) {
        if (/[0-9K]/.test(formateado[pos])) contados++;
        pos++;
      }
      rut.setSelectionRange(pos, pos);
    });

    // Tras el primer intento de envío, revalida cada campo mientras se corrige.
    campos.forEach(function (el) {
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', function () {
        if (form.dataset.intentado) validarCampo(el);
      });
    });

    // En fase de captura: si hay errores, el envío de main.js no alcanza a ejecutarse.
    form.addEventListener('submit', function (e) {
      form.dataset.intentado = '1';

      var primeroInvalido = null;
      campos.forEach(function (el) {
        if (!validarCampo(el) && !primeroInvalido) primeroInvalido = el;
      });
      if (primeroInvalido) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (feedback) {
          feedback.classList.add('d-none');
          feedback.classList.remove('alert-success', 'alert-danger');
        }
        primeroInvalido.focus();
        return;
      }

      if (hayMainJs()) return;

      e.preventDefault();
      // TODO: conectar con el endpoint real de envío (igual que el formulario Hazte Cliente).
      if (feedback) {
        feedback.textContent = 'Listo, recibimos tus datos. Un ejecutivo te contactará a la brevedad.';
        feedback.classList.remove('d-none', 'alert-danger');
        feedback.classList.add('alert-success');
      }
      form.reset();
      limpiarEstado();
    }, true);
  }

  iniciar(document.getElementById('lead-form'));
  iniciar(document.getElementById('lead-form-mobile'));
})();
