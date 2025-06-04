/**
         * IMPLEMENTACIÓN DE FUNCIONALIDADES ACCESIBLES
         * Siguiendo principios WCAG y mejores prácticas
         */

// Variables globales
let currentTheme = localStorage.getItem('theme') || 'light';

/**
 * PRINCIPIO 2: OPERABLE
 * Manejo de tema oscuro/claro con persistencia
 */
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    // Aplicar tema guardado
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton();

    // Event listener para cambio de tema
    themeToggle.addEventListener('click', function () {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeButton();

        // Anunciar cambio a lectores de pantalla
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Tema cambiado a ${currentTheme === 'dark' ? 'oscuro' : 'claro'}`;
        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    });

    function updateThemeButton() {
        if (currentTheme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Tema Claro';
            themeToggle.setAttribute('aria-label', 'Cambiar a tema claro');
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Tema Oscuro';
            themeToggle.setAttribute('aria-label', 'Cambiar a tema oscuro');
        }
    }
}

/**
 * PRINCIPIO 3: COMPRENSIBLE
 * Validación de formulario accesible
 */
function initializeFormValidation() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.getElementById('searchQuery');
    const errorMessage = document.getElementById('searchError');

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const query = searchInput.value.trim();

        // Limpiar errores previos
        searchInput.setAttribute('aria-invalid', 'false');
        errorMessage.style.display = 'none';
        searchInput.style.borderColor = '';

        // Validación
        if (query.length < 2) {
            showError('Por favor ingresa al menos 2 caracteres para buscar');
            return;
        }

        if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s\-.,]+$/.test(query)) {
            showError('Por favor usa solo letras, espacios y signos de puntuación básicos');
            return;
        }

        // Simular búsqueda exitosa
        showSuccess(`Buscando "${query}"...`);
    });

    function showError(message) {
        searchInput.setAttribute('aria-invalid', 'true');
        searchInput.style.borderColor = 'var(--error-color)';
        errorMessage.textContent = message;
        errorMessage.style.display = 'flex';
        searchInput.focus();

        // Anunciar error a lectores de pantalla
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.className = 'sr-only';
        announcement.textContent = `Error en el formulario: ${message}`;
        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 3000);
    }

    function showSuccess(message) {
        // Crear mensaje de éxito temporal
        const successAlert = document.createElement('div');
        successAlert.className = 'alert alert-success';
        successAlert.setAttribute('role', 'status');
        successAlert.setAttribute('aria-live', 'polite');
        successAlert.innerHTML = `
                    <span aria-hidden="true">✅</span>
                    ${message}
                `;

        searchForm.insertBefore(successAlert, searchForm.firstChild);

        setTimeout(() => {
            if (successAlert.parentNode) {
                searchForm.removeChild(successAlert);
            }
        }, 3000);
    }
}

/**
 * PRINCIPIO 2: OPERABLE
 * Navegación por teclado mejorada
 */
function enhanceKeyboardNavigation() {
    // Trap focus en modales (si los hubiera)
    document.addEventListener('keydown', function (e) {
        // Escape para cerrar elementos
        if (e.key === 'Escape') {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.blur) {
                focusedElement.blur();
            }
        }

        // Enter en elementos clickeables que no son botones
        if (e.key === 'Enter') {
            const target = e.target;
            if (target.classList.contains('book-card')) {
                const link = target.querySelector('.btn');
                if (link) {
                    link.click();
                }
            }
        }
    });

    // Hacer las tarjetas de libros focusables
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label',
            `Tarjeta de libro: ${card.querySelector('.book-title').textContent} por ${card.querySelector('.book-author').textContent.replace('Por ', '')}`
        );
    });
}

/**
 * PRINCIPIO 1: PERCEPTIBLE
 * Detectar preferencias del usuario
 */
function respectUserPreferences() {
    // Respetar preferencia de movimiento reducido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition', 'none');
    }

    // Detectar preferencia de tema del sistema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (!localStorage.getItem('theme')) {
        currentTheme = prefersDarkScheme.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
    }

    // Escuchar cambios en preferencias del sistema
    prefersDarkScheme.addListener((e) => {
        if (!localStorage.getItem('theme')) {
            currentTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
        }
    });
}

/**
 * PRINCIPIO 4: ROBUSTO
 * Manejo de errores y compatibilidad
 */
function handleErrorsGracefully() {
    // Manejo global de errores
    window.addEventListener('error', function (e) {
        console.error('Error detectado:', e.error);

        // Mostrar mensaje amigable al usuario
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-error';
        errorAlert.setAttribute('role', 'alert');
        errorAlert.innerHTML = `
                    <span aria-hidden="true">⚠️</span>
                    Ha ocurrido un error. Por favor recarga la página o intenta nuevamente.
                `;

        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(errorAlert, container.firstChild);
        }
    });

    // Verificar compatibilidad de características
    if (!window.localStorage) {
        console.warn('LocalStorage no disponible, usando configuración por defecto');
    }

    if (!window.matchMedia) {
        console.warn('Media queries no soportadas completamente');
    }
}

/**
 * PRINCIPIO 2: OPERABLE
 * Gestión de tiempo y animaciones
 */
function manageTimingAndAnimations() {
    // Permitir pausar animaciones automáticas
    let animationsPaused = false;

    document.addEventListener('keydown', function (e) {
        // Ctrl + Alt + P para pausar/reanudar animaciones
        if (e.ctrlKey && e.altKey && e.key === 'p') {
            animationsPaused = !animationsPaused;

            if (animationsPaused) {
                document.documentElement.style.setProperty('--transition', 'none');
                announceToScreenReader('Animaciones pausadas');
            } else {
                document.documentElement.style.removeProperty('--transition');
                announceToScreenReader('Animaciones reanudadas');
            }
        }
    });
}

/**
 * Función auxiliar para anuncios a lectores de pantalla
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        if (announcement.parentNode) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}

/**
 * PRINCIPIO 3: COMPRENSIBLE
 * Mejoras de usabilidad y comprensión
 */
function enhanceUsability() {
    // Mostrar/ocultar ayuda contextual
    const helpButtons = document.querySelectorAll('[data-help]');
    helpButtons.forEach(button => {
        button.addEventListener('click', function () {
            const helpId = this.getAttribute('data-help');
            const helpElement = document.getElementById(helpId);
            if (helpElement) {
                const isVisible = helpElement.style.display !== 'none';
                helpElement.style.display = isVisible ? 'none' : 'block';
                this.setAttribute('aria-expanded', !isVisible);
            }
        });
    });

    // Contador de caracteres en campos de texto
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(input => {
        const maxLength = input.getAttribute('maxlength');
        if (maxLength) {
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.setAttribute('aria-live', 'polite');
            counter.style.fontSize = '0.875rem';
            counter.style.color = 'var(--text-secondary)';
            counter.style.marginTop = 'var(--spacing-xs)';

            input.parentNode.appendChild(counter);

            function updateCounter() {
                const remaining = maxLength - input.value.length;
                counter.textContent = `${remaining} caracteres restantes`;

                if (remaining < 10) {
                    counter.style.color = 'var(--warning-color)';
                } else {
                    counter.style.color = 'var(--text-secondary)';
                }
            }

            input.addEventListener('input', updateCounter);
            updateCounter();
        }
    });
}

/**
 * INICIALIZACIÓN PRINCIPAL
 * Se ejecuta cuando el DOM está listo
 */
function initialize() {
    try {
        // Verificar si el DOM está listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
            return;
        }

        // Ejecutar todas las inicializaciones
        respectUserPreferences();
        initializeTheme();
        initializeFormValidation();
        enhanceKeyboardNavigation();
        handleErrorsGracefully();
        manageTimingAndAnimations();
        enhanceUsability();

        // Anunciar que la página está lista
        setTimeout(() => {
            announceToScreenReader('Página cargada completamente. Biblioteca Digital lista para usar.');
        }, 1000);

        console.log('✅ Biblioteca Digital inicializada con soporte WCAG completo');

    } catch (error) {
        console.error('Error durante la inicialización:', error);
        handleErrorsGracefully();
    }
}

// Iniciar la aplicación
initialize();

/**
 * EXPORT PARA TESTING (si fuera necesario)
 * Exponer funciones para pruebas unitarias
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTheme,
        initializeFormValidation,
        enhanceKeyboardNavigation,
        respectUserPreferences,
        announceToScreenReader
    };
}