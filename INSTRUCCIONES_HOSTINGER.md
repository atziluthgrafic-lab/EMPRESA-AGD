# Guía de Despliegue en Hostinger — Atziluth Grafic Digital

¡Hola! He creado y configurado los archivos necesarios para que puedas subir tu sitio web de **Atziluth Grafic Digital** a tu hosting de Hostinger de manera exitosa y sin errores de enrutamiento o de carga de recursos.

Aquí tienes los detalles de lo que se ha configurado y el paso a paso exacto para publicarlo:

---

## 🛠️ ¿Qué hemos solucionado y configurado?

1. **Nuevo Backend de API en PHP (`/public/api/index.php`)**:
   - **El Problema**: Los hostings compartidos de Hostinger no ejecutan servidores de Node.js de forma predeterminada, sino que sirven archivos estáticos y scripts de **PHP**. Al no tener un servidor de Node.js corriendo para procesar las rutas de la API (`/api/admin/login`, etc.), el servidor Apache de Hostinger redirigía estas llamadas al archivo `index.html`, causando el error *"Respuesta inesperada del servidor (Estado: 200)"*.
   - **La Solución**: He creado un backend en PHP 100% compatible y ultraligero que simula exactamente las mismas funciones del servidor de desarrollo. Este archivo se encuentra en `public/api/index.php`. Al compilar tu proyecto, Vite lo moverá a la carpeta `dist/api/index.php` automáticamente.
   - **Características**:
     - **Inicio de Sesión**: Valida de manera segura las credenciales del Administrador (`Estiven` / `Lmrv.1979` o `Lmrv1979`).
     - **Guardado de Configuración**: Escribe los cambios en un archivo `custom_images_config.json` en tu carpeta raíz de Hostinger.
     - **Subida de Imágenes**: Procesa y guarda de forma segura los archivos subidos de banners, logos y anuncios en la carpeta pública `uploads/` de tu hosting.

2. **Actualización del Archivo `.htaccess` en `/public`**:
   - He modificado el archivo de configuración `.htaccess` para que dirija de forma limpia todas las llamadas de la API (`/api/...`) hacia nuestro nuevo backend de PHP (`api/index.php`), y el resto de peticiones de páginas hacia `index.html` de manera invisible para el usuario.
   - Adicionalmente, incluye compresión **GZIP** para máxima velocidad de carga y define los **MIME-Types** correctos para que no haya bloqueos de CSS/JS en Hostinger.

3. **Copiado automático al construir**:
   - Todos los archivos necesarios (`.htaccess` y la carpeta `api/`) están en `/public`, por lo que Vite los incluirá automáticamente en la carpeta `/dist` cada vez que construyas el proyecto (`npm run build`).

---

## 🚀 Paso a Paso para subir tu Web a Hostinger

Sigue estos sencillos pasos para compilar tu proyecto e instalarlo en Hostinger:

### Paso 1: Generar la Carpeta de Producción (`dist`)
Antes de subir los archivos, debes compilar el sitio web para generar los archivos optimizados listos para producción:
1. En tu editor o consola del proyecto en AI Studio, asegúrate de que el proyecto compila correctamente (el botón superior de compilación o ejecutando `npm run build` en la terminal).
2. Esto generará una carpeta llamada **`dist`** en la raíz de tu proyecto. 
   * *Nota: La carpeta `dist` ahora contendrá la estructura final con tu `index.html`, la carpeta `assets/`, el archivo `.htaccess` y la carpeta `api/index.php`.*

### Paso 2: Descargar el Proyecto
Puedes exportar y descargar el proyecto directamente desde AI Studio:
1. Dirígete al menú de configuración en la barra lateral o barra superior de la interfaz de AI Studio.
2. Elige la opción de **Exportar como ZIP** para tener todos los archivos listos en tu computadora local.

### Paso 3: Subir los Archivos a Hostinger
1. Inicia sesión en tu panel de control de **Hostinger (hPanel)**.
2. Ve a la sección de **Sitios Web** y haz clic en **Administrar** sobre tu dominio (`atziluthgraficd.com`).
3. Abre el **Administrador de Archivos (File Manager)** y entra en la carpeta **`public_html`** (este es el directorio raíz público de tu sitio web).
4. **¡IMPORTANTE!** Sube únicamente el **contenido** que se encuentra dentro de la carpeta **`dist/`** de tu proyecto compilado. 
   - No subas la carpeta `dist` en sí, sino lo que hay **adentro** de ella.
   - Deberás ver los siguientes archivos y carpetas en la raíz de tu `public_html`:
     - `index.html` (Tu archivo de entrada principal)
     - `.htaccess` (El archivo de configuración de Apache actualizado)
     - `api/` (Carpeta que contiene `index.php`)
     - `assets/` (La carpeta que contiene el código CSS, Javascript e imágenes de la interfaz)
5. **Permisos de Escritura (Muy Importante)**:
   - Para que puedas guardar configuraciones y subir imágenes desde el panel de control, asegúrate de que la carpeta raíz `public_html` (y sus subcarpetas) tengan permisos de escritura en Hostinger (generalmente `755` para carpetas y `644` para archivos, lo cual es el valor predeterminado en Hostinger). El backend creará los archivos `custom_images_config.json` y la carpeta `uploads/` de manera automática al usarlos por primera vez.

### Paso 4: ¡Listo!
Abre tu navegador, escribe tu dominio (`atziluthgraficd.com`) y tu panel de administración junto a todo el sitio web estarán funcionando al 100% de manera dinámica sobre Hostinger.

---

*Si tienes alguna duda o necesitas alguna otra adaptación técnica, ¡estaré encantado de ayudarte!*
