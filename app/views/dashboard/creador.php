<?php
session_start();
if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['rol'] !== 'creador') {
    header('Location: ../login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Creador de Contenido</title>
    <link rel="stylesheet" href="../../assets/css/styles.css">
    <link rel="stylesheet" href="../../assets/css/dashboard.css">
    <link rel="stylesheet" href="../../assets/css/theme-toggle.css">
</head>
<body>
    <div class="dashboard-container">
        <nav class="dashboard-nav">
            <div class="nav-header">
                <h2>Panel del Creador</h2>
                <p>Bienvenido, <?php echo htmlspecialchars($_SESSION['usuario']['nombre']); ?></p>
            </div>
            <ul class="nav-menu">
                <li><a href="#" class="active">Inicio</a></li>
                <li><a href="#videos">Mis Videos</a></li>
                <li><a href="#subir-video">Subir Video</a></li>
                <li><a href="#productos">Mis Productos</a></li>
                <li><a href="#agregar-producto">Agregar Producto</a></li>
                <li><a href="../../controllers/loginController.php?action=logout">Cerrar Sesión</a></li>
            </ul>
        </nav>

        <main class="dashboard-main">
            <div class="dashboard-header">
                <h1>Dashboard del Creador</h1>
                <div class="user-info">
                    <span><?php echo htmlspecialchars($_SESSION['usuario']['correo']); ?></span>
                </div>
            </div>

            <div class="dashboard-content">

                <!-- Resumen -->
                <div class="dashboard-card">
                    <h3>Resumen de Actividad</h3>
                    <div class="system-stats">
                        <div class="stat-item">
                            <span class="stat-value" id="totalVideos">0</span>
                            <span class="stat-label">Videos Subidos</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value" id="totalProductos">0</span>
                            <span class="stat-label">Productos en Venta</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">0</span>
                            <span class="stat-label">Visitas Totales</span>
                        </div>
                    </div>
                </div>

                <!-- Formulario para subir video -->
                <div id="subir-video" class="dashboard-card">
                    <h3>Subir Nuevo Video</h3>
                    <form id="form-subir-video" enctype="multipart/form-data">
                        <label for="titulo">Título del video:</label>
                        <input type="text" name="titulo" id="titulo" required>

                        <label for="descripcion">Descripción:</label>
                        <textarea name="descripcion" id="descripcion" rows="4" required></textarea>

                        <label for="url_video">URL del video (opcional):</label>
                        <input type="url" name="url_video" id="url_video" placeholder="Ej. https://youtube.com/watch?v=...">

                        <label for="video">O selecciona un archivo:</label>
                        <input type="file" name="video" id="video" accept="video/*">

                        <button type="submit" class="btn-action">Subir Video</button>
                    </form>
                </div>

                <!-- Listado de videos -->
                <div id="videos" class="dashboard-card">
                    <h3>Mis Videos</h3>
                    <div id="lista-videos" class="video-grid">
                        <!-- Aquí se cargarán los videos dinámicamente -->
                    </div>
                </div>

                <!-- Agregar Producto -->
                <div id="agregar-producto" class="dashboard-card">
                    <h3>Agregar Nuevo Producto</h3>
                    <form id="form-agregar-producto" enctype="multipart/form-data">
                        <label for="nombre">Nombre del producto:</label>
                        <input type="text" name="nombre" id="nombre" required>

                        <label for="descripcion">Descripción:</label>
                        <textarea name="descripcion" id="descripcion" rows="4" required></textarea>

                        <label for="precio">Precio:</label>
                        <input type="number" name="precio" id="precio" step="0.01" required>

                        <label for="stock">Stock:</label>
                        <input type="number" name="stock" id="stock" value="0" min="0" required>

                        <label for="imagen">Imagen del producto:</label>
                        <input type="file" name="imagen" id="imagen" accept="image/*" required>

                        <button type="submit" class="btn-action">Agregar Producto</button>
                    </form>
                </div>

                <!-- Listado de productos -->
                <div id="productos" class="dashboard-card">
                    <h3>Mis Productos</h3>
                    <div id="lista-productos" class="product-grid">
                        <!-- Aquí se cargarán los productos dinámicamente -->
                    </div>
                </div>

                <!-- Opciones adicionales -->
                <div class="dashboard-card">
                    <h3>Opciones adicionales</h3>
                    <a href="ver_videos.php" class="btn-action">🎥 Ver mis vídeos y comentarios</a>
                </div>

        </main>
    </div>

    <?php include('../components/theme-toggle.php'); ?>
    <script src="../../assets/js/dashboard.js"></script>
</body>
</html>