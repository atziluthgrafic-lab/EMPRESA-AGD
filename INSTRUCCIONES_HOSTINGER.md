# Guía de Despliegue en Hostinger — Atziluth Grafic Digital

¡Hola! He creado y configurado los archivos necesarios para que puedas subir tu sitio web de **Atziluth Grafic Digital** a tu hosting de Hostinger de manera exitosa y sin errores de enrutamiento o de carga de recursos.

Aquí tienes los detalles de lo que se ha configurado y el paso a paso exacto para publicarlo:

---

## 🛠️ ¿Qué hemos solucionado y configurado?

1. **Archivo `.htaccess` creado en `/public`**:
   - Hostinger utiliza servidores basados en **Apache**. Cuando usas React y Vite, el enrutamiento se maneja del lado del cliente. Si un usuario recarga la página o entra directamente a una sección, Hostinger puede mostrar un error `404` o `403`.
   - He configurado un archivo `.htaccess` optimizado que le indica a Hostinger que redirija todas las peticiones que no sean archivos físicos directamente a tu `index.html`.
   - Adicionalmente, incluye compresión **GZIP** para que tu sitio cargue a máxima velocidad y define correctamente los **MIME-Types** para que los archivos CSS y JS de Vite se carguen de inmediato sin bloqueos de seguridad.

2. **Copiado automático al construir**:
   - Al colocar el archivo `.htaccess` dentro de la carpeta `/public` de tu proyecto, Vite lo copiará automáticamente en la raíz de la carpeta `/dist` cada vez que ejecutes el comando de construcción (`npm run build`).

---

## 🚀 Paso a Paso para subir tu Web a Hostinger

Sigue estos sencillos pasos para compilar tu proyecto e instalarlo en Hostinger:

### Paso 1: Generar la Carpeta de Producción (`dist`)
Antes de subir los archivos, debes compilar el sitio web para generar los archivos optimizados listos para producción:
1. En tu editor o consola del proyecto en AI Studio, asegúrate de que el proyecto compila correctamente (el botón superior de compilación o ejecutando `npm run build` en la terminal).
2. Esto generará una carpeta llamada **`dist`** en la raíz de tu proyecto. 
   * *Nota: La carpeta `dist` contendrá la estructura final con tu `index.html`, la carpeta `assets` (con los estilos y el código comprimido) y el archivo `.htaccess`.*

### Paso 2: Descargar el Proyecto
Puedes exportar y descargar el proyecto directamente desde AI Studio:
1. Dirígete al menú de configuración en la barra lateral o barra superior de la interfaz de AI Studio.
2. Elige la opción de **Exportar como ZIP** o **Exportar a GitHub** para tener todos los archivos listos en tu computadora local.

### Paso 3: Subir los Archivos a Hostinger
1. Inicia sesión en tu panel de control de **Hostinger (hPanel)**.
2. Ve a la sección de **Sitios Web** y haz clic en **Administrar** sobre tu dominio.
3. Abre el **Administrador de Archivos (File Manager)** y entra en la carpeta **`public_html`** (este es el directorio raíz público de tu sitio web).
4. **¡IMPORTANTE!** Sube únicamente el **contenido** que se encuentra dentro de la carpeta **`dist/`** de tu proyecto compilado. 
   - No subas la carpeta `dist` en sí, sino lo que hay **adentro** de ella.
   - Deberás ver los siguientes archivos en la raíz de tu `public_html`:
     - `index.html` (Tu archivo de entrada principal)
     - `.htaccess` (El archivo de configuración de Apache que acabamos de crear)
     - `assets/` (La carpeta que contiene el código CSS, Javascript e imágenes)

### Paso 4: ¡Listo!
Abre tu navegador, escribe tu dominio y tu sitio web estará funcionando al 100% con rutas amigables, carga rápida y sin errores de recarga.

---

*Si tienes alguna duda o necesitas alguna otra adaptación técnica, ¡estaré encantado de ayudarte!*
