// Función para extraer ID de YouTube
function getYoutubeID(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

// Cargar videos al iniciar
function cargarVideos() {
    fetch('../../controllers/videoController.php?action=listar')
        .then(res => res.json())
        .then(data => {
            const lista = document.getElementById('lista-videos');
            let total = 0;

            if (data.success && data.videos.length > 0) {
                data.videos.forEach(video => {
                    const div = document.createElement('div');
                    div.className = 'video-item';

                    let playerHTML = '';
                    if (video.url_video.startsWith('https://'))  {
                        const videoId = getYoutubeID(video.url_video);
                        if (videoId) {
                            playerHTML = `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}"  frameborder="0" allowfullscreen></iframe>`;
                        } else {
                            playerHTML = `<p>Vídeo no compatible</p>`;
                        }
                    } else {
                        playerHTML = `<video controls width="100%" height="200"><source src="../..${video.url_video}" type="video/mp4">Tu navegador no soporta el elemento de video.</video>`;
                    }

                    div.innerHTML = `
                        <h4>${video.titulo}</h4>
                        <p>${video.descripcion}</p>
                        ${playerHTML}
                        <br>
                        <button onclick="obtenerVideo(${video.id_video})">Editar</button>
                        <button onclick="eliminarVideo(${video.id_video})">Eliminar</button>
                        <div id="edit-form-${video.id_video}" class="edit-form"></div>
                    `;
                    lista.appendChild(div);
                    total++;
                });
            }

            document.getElementById('totalVideos').textContent = total;
        });
}

// Cargar productos al iniciar
function cargarProductos() {
    fetch('../../controllers/productoController.php?action=listar')
        .then(res => res.json())
        .then(data => {
            const listaProductos = document.getElementById('lista-productos');
            let totalProductos = 0;

            if (data.success && data.productos.length > 0) {
                data.productos.forEach(producto => {
                    const div = document.createElement('div');
                    div.className = 'product-item';

                   
                     const imagenUrl = producto.imagen_url ? `../../${producto.imagen_url}` : '../uploads/imagenes/placeholder.png';


                    div.innerHTML = `
                        <img src="${imagenUrl}" alt="${producto.nombre}" style="max-width: 100px;">
                        <h4>${producto.nombre}</h4>
                        <p>$${parseFloat(producto.precio).toFixed(2)}</p>
                        <p>Stock: ${producto.stock}</p>
                        <button onclick="eliminarProducto(${producto.id_producto})">Eliminar</button>
                    `;

                    listaProductos.appendChild(div);
                    totalProductos++;
                });
            }

            document.getElementById('totalProductos').textContent = totalProductos;
        });
}

// Manejar envío del formulario de subida de video
function initFormSubirVideo() {
    const form = document.getElementById('form-subir-video');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);

        fetch('../../controllers/videoController.php?action=subir', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('✅ Vídeo subido correctamente.');
                location.reload();
            } else {
                alert('❌ Error: ' + data.message);
            }
        })
        .catch(err => {
            alert('⚠️ Hubo un error al procesar tu solicitud.');
            console.error(err);
        });
    });
}

// Manejar envío del formulario de agregar producto
function initFormAgregarProducto() {
    const form = document.getElementById('form-agregar-producto');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);

        fetch('../../controllers/productoController.php?action=agregar', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('✅ Producto creado correctamente.');
                location.reload();
            } else {
                alert('❌ Error: ' + data.message);
            }
        })
        .catch(err => {
            alert('⚠️ Hubo un error al procesar tu solicitud.');
            console.error(err);
        });
    });
}

// Eliminar video
function eliminarVideo(id) {
    if (confirm("¿Estás seguro de eliminar este video?")) {
        fetch(`../../controllers/videoController.php?action=eliminar&id=${id}`)
            .then(() => location.reload())
            .catch(err => {
                alert("Error al eliminar el video.");
                console.error(err);
            });
    }
}

// Eliminar producto
function eliminarProducto(id) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        fetch(`../../controllers/productoController.php?action=eliminar&id=${id}`)
            .then(() => location.reload())
            .catch(err => {
                alert("Error al eliminar el producto.");
                console.error(err);
            });
    }
}

// Inicializar funcionalidad cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    cargarVideos();
    cargarProductos();
    initFormSubirVideo();
    initFormAgregarProducto();
});

// Función para resolver reporte
async function resolverReporte(idReporte, estado) {
    try {
        const res = await fetch('../../controllers/moderadorController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id_reporte=${idReporte}&estado=${estado}`
        });

        const data = await res.json();

        if (data.success) {
            alert("Reporte actualizado correctamente");
            location.reload();
        } else {
            alert("Error al actualizar el reporte");
        }
    } catch (err) {
        console.error("Error al procesar el reporte:", err);
    }
}

async function sancionarUsuario(idUsuario) {
    if (!confirm("¿Estás seguro de sancionar a este usuario?")) return;

    try {
        const res = await fetch('../../controllers/moderadorController.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id_usuario=${idUsuario}&accion=sancionar`
        });

        const data = await res.json();

        if (data.success) {
            alert("Usuario sancionado correctamente");
            location.reload();
        } else {
            alert("Error al sancionar usuario");
        }
    } catch (err) {
        console.error("Error al sancionar usuario:", err);
    }
}

// Función para obtener detalles de un video y mostrar formulario de edición
function obtenerVideo(id_video) {
    fetch(`../../controllers/videoController.php?action=obtener&id=${id_video}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const video = data.video;
                const container = document.getElementById('edit-form-' + id_video);

                // Limpiar contenido previo y generar formulario
                container.innerHTML = `
                    <form onsubmit="guardarEdicion(event, ${id_video})">
                        <label>Título:</label>
                        <input type="text" id="edit-titulo-${id_video}" value="${video.titulo}" required>

                        <label>Descripción:</label>
                        <textarea id="edit-descripcion-${id_video}">${video.descripcion}</textarea>

                        <button type="submit" class="btn-action">Guardar Cambios</button>
                    </form>
                `;
            } else {
                alert("⚠️ No se pudo cargar el video.");
            }
        })
        .catch(err => {
            console.error("Error al obtener el video:", err);
            alert("⚠️ Error al cargar los datos del video.");
        });
}

// Función para guardar los cambios del video
function guardarEdicion(event, id_video) {
    event.preventDefault(); // Evita recargar página

    const titulo = document.getElementById(`edit-titulo-${id_video}`).value.trim();
    const descripcion = document.getElementById(`edit-descripcion-${id_video}`).value.trim();

    const formData = new URLSearchParams();
    formData.append("action", "actualizar_video");
    formData.append("id_video", id_video);
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);

    fetch("../../controllers/videoController.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("✅ Video actualizado correctamente.");
            location.reload(); // Recargar para ver cambios
        } else {
            alert("❌ Error al actualizar el video.");
        }
    })
    .catch(err => {
        console.error("Error al guardar:", err);
        alert("⚠️ Hubo un error al guardar los cambios.");
    });
}
