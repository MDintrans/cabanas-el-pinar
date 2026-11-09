# Cabañas El Pinar

Landing page estática y responsive para Cabañas El Pinar, preparada para publicarse con GitHub Pages.

## Estructura

```text
cabanas-el-pinar/
├─ index.html             Página principal
├─ assets/                Fotografías, video y logo
├─ css/
│  └─ styles.css          Estilos responsive
├─ js/
│  └─ script.js           Interacciones y formulario de WhatsApp
├─ .nojekyll              Desactiva el procesamiento de Jekyll
├─ .gitignore
└─ README.md
```

## Vista local

Desde la raíz del repositorio:

```powershell
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Publicar en GitHub Pages

El código está preparado para publicarse directamente desde la raíz de la rama `main`.

1. En GitHub abre **Settings → Pages**.
2. En **Build and deployment**, selecciona **Deploy from a branch**.
3. Selecciona la rama **main**, la carpeta **/ (root)** y guarda.

## Notas

- El formulario genera una solicitud y abre WhatsApp; no necesita servidor.
- El mapa usa OpenStreetMap y el botón de navegación abre Google Maps.
- `assets/logo-el-pinar-temporal.png` es el logo temporal y puede reemplazarse manteniendo el mismo nombre.
- No hay claves privadas ni variables de entorno en el repositorio.
