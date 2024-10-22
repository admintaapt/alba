const apiKey = 'PBQ3tOSKUj1qc6knIuno9aWBUz8G8kin0hDQP58JTAXtHnz0ngyIXJcu';  // Reemplaza con tu clave API de Pexels
const landingData = JSON.parse(localStorage.getItem('landingData') || '{}');
fetch('./landingData.json')  // Ajusta la ruta según la plantilla seleccionada
$(document).ready(function() {
    // Mostrar el menú
    $('.menu-icon').on('click', function() {
        $('.menu').toggleClass('show');
    });

    // Cerrar el menú al hacer clic en la "X"
    $('.close-menu').on('click', function() {
        $('.menu').removeClass('show');
    });

    // Smooth scroll for menu links
    $('nav ul li a').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){
                window.location.hash = hash;
            });
        }
    });

    const apiKey = 'PBQ3tOSKUj1qc6knIuno9aWBUz8G8kin0hDQP58JTAXtHnz0ngyIXJcu';  // Reemplaza con tu clave API de Pexels
    const businessModel = landingData.businessModel || 'cryptocurrency+fintech+investment';
    console.log("30"+businessModel)
    let totalImages = 0;  // Aquí definimos la variable totalImages
    
    // Obtener una imagen desde Pexels relacionada con "digital business"
    fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(businessModel)}&per_page=1`, {
        headers: {
            Authorization: apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const mediaImage = document.getElementById('pexels-media-image2');
        if (data.photos.length > 0) {
            mediaImage.src = data.photos[0].src.large;
            mediaImage.alt = data.photos[0].alt;
        }
    })
    .catch(error => console.error('Error fetching media image from Pexels:', error));

    fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(businessModel)}&per_page=5`, {
        headers: {
            Authorization: apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const thumbnails = ['pexels-thumb1', 'pexels-thumb2', 'pexels-thumb3', 'pexels-thumb4', 'pexels-thumb5'];
        totalImages = thumbnails.length;  // Aquí asignamos el número de imágenes
    
        data.photos.forEach((photo, index) => {
            const thumbElement = document.getElementById(thumbnails[index]);
            thumbElement.src = photo.src.small;  // Miniatura pequeña
            thumbElement.alt = photo.alt;
            thumbElement.dataset.largeSrc = photo.src.large;  // Imagen grande
    
            // Aquí actualizas el comportamiento al hacer clic en la miniatura
            thumbElement.addEventListener('click', function() {
                // Asegúrate de pasar el src correcto de la imagen grande
                updateMainImage(index, photo.src.large);
            });
        });
    
        // Inicializar la primera miniatura como activa y establecer la imagen principal
        setActiveThumbnail(0, data.photos[0].src.large); // Establecer la primera imagen en grande
    })
    .catch(error => console.error('Error fetching thumbnails:', error));

    // Función para actualizar la imagen principal
    function updateMainImage(index, src) {
        $('#main-image').attr('src', src);
    }

    let currentIndex2 = 0;

    // Función para manejar miniaturas activas y la imagen principal
    function setActiveThumbnail(index, largeSrc) {
        $('.thumbnail').removeClass('active');
        $('.thumbnail').eq(index).addClass('active');
        updateMainImage(index, largeSrc);  // Actualiza la imagen principal con la de alta calidad
        currentIndex2 = index;
    }

    // Control de navegación para avanzar en el carrusel
    function nextImage() {
        currentIndex2 = (currentIndex2 + 1) % totalImages;
        const nextThumb = $('.thumbnail').eq(currentIndex2);
        setActiveThumbnail(currentIndex2, nextThumb.data('large-src'));
    }

    // Control de navegación para retroceder en el carrusel
    function prevImage() {
        currentIndex2 = (currentIndex2 - 1 + totalImages) % totalImages;
        const prevThumb = $('.thumbnail').eq(currentIndex2);
        setActiveThumbnail(currentIndex2, prevThumb.data('large-src'));
    }

    // Controles manuales
    $('.next').on('click', nextImage);
    $('.prev').on('click', prevImage);

    // Carrusel automático cada 3 segundos
    setInterval(nextImage, 3000);

    // Obtener imágenes de personas desde Pexels
    fetch('https://api.pexels.com/v1/search?query=person&per_page=3', {
        headers: {
            Authorization: apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.photos.length > 0) {
            $('.testimonial-image').each(function(index) {
                if (data.photos[index]) {
                    $(this).css({
                        'background-image': `url(${data.photos[index].src.medium})`,
                        'background-size': 'cover',
                        'background-position': 'center',
                        'width': '100px',  // Ajusta el tamaño según sea necesario
                        'height': '100px', // Ajusta el tamaño según sea necesario
                        'border-radius': '50%'  // Para hacer la imagen circular
                    });
                }
            });
        }
    })
    .catch(error => console.error('Error fetching testimonial images from Pexels:', error));

    // Funcionalidad de carrusel de testimonios
    let currentIndex = 0;
    const totalCards = $('.testimonial-cards .card').length;

    function updateCarousel(index) {
        const cardWidth = $('.card').outerWidth(true);
        $('.testimonial-cards').animate({
            scrollLeft: cardWidth * index
        }, 400);
    }

    $('.next').on('click', function() {
        if (currentIndex < totalCards - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;  // Volver al primer testimonio si se llega al final
        }
        updateCarousel(currentIndex);
    });

    $('.prev').on('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalCards - 1;  // Ir al último testimonio si se está en el primero
        }
        updateCarousel(currentIndex);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const companyName = localStorage.getItem('companyName') || '[Nombre de tu Empresa]';
    document.querySelectorAll('#company-name, #company-name-service, #company-name-testimonial').forEach(el => {
        el.textContent = companyName;
    });
});

// Obtener datos del localStorage
if (landingData) {
    console.log("data landing"+landingData);
    // Reemplazar los placeholders con los datos reales
    document.querySelectorAll('#company-name-placeholder').forEach(el => el.textContent = landingData.companyName);
    document.querySelectorAll('#business-model-placeholder').forEach(el => el.textContent = landingData.businessModel);

    // Actualizar el logo en el header y el footer
    if (landingData.logo) {
        document.getElementById('logo-header').src = landingData.logo;
        document.getElementById('logo-footer').src = landingData.logo;
    }
    document.getElementById('main-title').textContent = landingData.mainTitle;
    document.getElementById('main-paragraph').textContent = landingData.mainParagraph;
    document.getElementById('main-subparagraph').textContent = landingData.mainSubparagraph;
   
    document.getElementById('testimonial-1').textContent = landingData.testimonials[0];
    document.getElementById('testimonial-2').textContent = landingData.testimonials[2];
    document.getElementById('testimonial-3').textContent = landingData.testimonials[4];

    // Ejemplo al aplicar contenido al HTML en el frontend
    document.getElementById('titulo-1').textContent = landingData.titulo1.replace(/[*"]/g, '').replace(/['"]/g, '');
    document.getElementById('subtitulo-1').textContent = landingData.subtitulo1.replace(/[*"]/g, '').replace(/['"]/g, '');

    document.getElementById('titulo-2').textContent = landingData.titulo2.replace(/[*"]/g, '').replace(/['"]/g, '');
    document.getElementById('subtitulo-2').textContent = landingData.subtitulo2.replace(/[*"]/g, '').replace(/['"]/g, '');

    document.getElementById('titulo-3').textContent = landingData.titulo3.replace(/[*"]/g, '').replace(/['"]/g, '');
    document.getElementById('subtitulo-3').textContent = landingData.subtitulo3.replace(/[*"]/g, '').replace(/['"]/g, '');

    document.getElementById('titulo-4').textContent = landingData.titulo4.replace(/[*"]/g, '').replace(/['"]/g, '');
    document.getElementById('subtitulo-4').textContent = landingData.subtitulo4.replace(/[*"]/g, '').replace(/['"]/g, '');

    // Aplicar los enlaces a los botones
    if (landingData['button-1-link']) {
        document.getElementById('button-1').onclick = () => { window.location.href = landingData['button-1-link']; };
    }
    if (landingData['button-2-link']) {
        document.getElementById('button-2').onclick = () => { window.location.href = landingData['button-2-link']; };
    }
    if (landingData['button-1-text']) {
        document.getElementById('button-1').textContent = landingData['button-1-text'];
      }
      if (landingData['button-2-text']) {
        document.getElementById('button-2').textContent = landingData['button-2-text'];
      }
      
}

document.addEventListener('DOMContentLoaded', function() {
    const selectedFont = localStorage.getItem('selectedFont') || 'Open Sans';
    document.body.style.fontFamily = selectedFont;

    // Asegúrate de que el enlace de la fuente esté cargado en el head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css?family=${selectedFont.replace(/ /g, '+')}&display=swap`;
    document.head.appendChild(link);
})
.catch(error => {
  console.error('Error al cargar landingData.json:', error);
});