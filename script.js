$(document).ready(function() {

    // ==========================================
    // 1. FILTRO DE BÚSQUEDA Y CATEGORÍAS
    // ==========================================
    function filterProducts() {
        let searchText = $('#searchProduct').val().toLowerCase();
        let category = $('#categoryFilter').val();

        $('.product-card').each(function() {
            let name = $(this).data('name').toLowerCase();
            let cat = $(this).data('category');

            let matchesSearch = name.includes(searchText);
            let matchesCategory = (category === 'all' || cat === category);

            if (matchesSearch && matchesCategory) {
                $(this).fadeIn('fast');
            } else {
                $(this).fadeOut('fast');
            }
        });
    }

    $('#searchProduct').off('keyup').on('keyup', filterProducts);
    $('#categoryFilter').off('change').on('change', filterProducts);

    // ==========================================
    // 2. VALIDACIÓN EN VIVO DEL FORMULARIO DE CONTACTO
    //    - Se dispara desde el PRIMER carácter
    //    - Nombre: blacklist de números y símbolos
    //    - Correo: debe tener "@" y un "." después
    // ==========================================

    function validarNombre(valor) {
        let regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;
        let tieneNumeroOSimbolo = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(valor);
        return regexLetras.test(valor) && !tieneNumeroOSimbolo;
    }

    function validarCorreo(valor) {
        let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let tieneArroba = valor.includes('@');
        let parteDespues = valor.split('@')[1] || '';
        let tienePunto = parteDespues.includes('.');
        return regex.test(valor) && tieneArroba && tienePunto;
    }

    function validarMensaje(valor) {
        return valor.trim() !== '';
    }

    function marcarCampo($campo, esValido) {
        if (esValido) {
            $campo.removeClass('is-invalid');
        } else {
            $campo.addClass('is-invalid');
        }
    }

    // --- Validación EN VIVO (desde el primer carácter) ---

    $('#nombre').off('input').on('input', function() {
        let valor = $(this).val().trim();
        if (valor === '') {
            $(this).removeClass('is-invalid');
            return;
        }
        marcarCampo($(this), validarNombre(valor));
    });

    $('#correo').off('input').on('input', function() {
        let valor = $(this).val().trim();
        if (valor === '') {
            $(this).removeClass('is-invalid');
            return;
        }
        marcarCampo($(this), validarCorreo(valor));
    });

    $('#mensaje').off('input').on('input', function() {
        let valor = $(this).val().trim();
        if (valor === '') {
            $(this).removeClass('is-invalid');
            return;
        }
        marcarCampo($(this), validarMensaje(valor));
    });

    // --- Validación al enviar ---

    $('#contactForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        let $nombre = $('#nombre');
        if (!validarNombre($nombre.val().trim())) {
            $nombre.addClass('is-invalid');
            isValid = false;
        } else {
            $nombre.removeClass('is-invalid');
        }

        let $correo = $('#correo');
        if (!validarCorreo($correo.val().trim())) {
            $correo.addClass('is-invalid');
            isValid = false;
        } else {
            $correo.removeClass('is-invalid');
        }

        let $mensaje = $('#mensaje');
        if (!validarMensaje($mensaje.val())) {
            $mensaje.addClass('is-invalid');
            isValid = false;
        } else {
            $mensaje.removeClass('is-invalid');
        }

        if (isValid) {
            $('#formSuccess').slideDown('fast').delay(3000).slideUp('fast');
            this.reset();
            $('#nombre, #correo, #mensaje').removeClass('is-invalid');
        }
    });

    // ==========================================
    // 3. CARRITO DE COMPRAS Y TOAST
    // ==========================================
    let cart = [];
    let total = 0;

    $('#productGrid').off('click', '.btn-add-cart').on('click', '.btn-add-cart', function() {
        let productName = $(this).data('product');
        let price = parseFloat($(this).data('price'));

        cart.push({ name: productName, price: price });
        total += price;

        updateCartUI();

        $('#toastMsg').text('Añadido: ' + productName);
        $('#toastAlert').slideDown('fast').delay(2000).fadeOut('fast');
    });

    function updateCartUI() {
        $('#cartCount').text(cart.length);
        $('#cartTotal').text(total);

        let $list = $('#cartList');
        $list.empty();

        if (cart.length === 0) {
            $list.append('<li class="list-group-item bg-dark text-muted border-secondary text-center">El carrito está vacío.</li>');
        } else {
            cart.forEach((item) => {
                let $li = $('<li>').addClass('list-group-item d-flex justify-content-between align-items-center border-secondary bg-dark text-white');
                let $name = $('<span>').text(item.name);
                let $price = $('<span>').addClass('text-warning fw-bold').text(item.price + ' Bs');
                $li.append($name, $price);
                $list.append($li);
            });
        }
    }

    $('#btnCart').off('click').on('click', function(e) {
        e.preventDefault();
        let cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
    });

    $('#btnCheckout').off('click').on('click', function() {
        if (cart.length === 0) {
            $('#toastMsg').text('El carrito está vacío.');
            $('#toastAlert').find('.bi')
                .removeClass('bi-check-circle-fill bi-check-double')
                .addClass('bi-exclamation-triangle-fill');
            $('#toastAlert').slideDown('fast').delay(2000).fadeOut('fast');
            return;
        }

        $('#toastAlert').find('.bi')
            .removeClass('bi-check-circle-fill bi-exclamation-triangle-fill')
            .addClass('bi-check-double');
        $('#toastMsg').text('¡Compra realizada con éxito!');
        $('#toastAlert').slideDown('fast').delay(3000).fadeOut('fast');

        cart = [];
        total = 0;
        updateCartUI();

        bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
    });

});
