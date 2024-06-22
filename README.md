# PDF Merger

Esta aplicación de escritorio permite fusionar un archivo PDF sobre una serie de archivos PDF en una carpeta utilizando Node.js y Electron.js.

## Requisitos
```sh
- Node.js
- npm
- Electron.js
```

## Instalación

1. Clonar el repositorio:
```sh
git clone https://github.com/tu-usuario/pdf-merger.git
cd pdf-merger
```

2. Instalar las dependencias:
```sh
npm install
```

## Uso

1. Ejecutar la aplicación:
```sh
npm start
```

2. En la aplicación:
- Haz clic en "Seleccionar Directorio" y elige la carpeta que contiene los archivos PDF a fusionar.
- Selecciona el archivo PDF de origen utilizando el input correspondiente.
- Haz clic en "Fusionar PDFs" para iniciar el proceso de fusión.

3. Ver el mensaje de estado que indica dónde se guardaron los archivos PDF fusionados y el tiempo que tomó el proceso.

## Estructura del Proyecto

```sh
pdf-merger/
│
├── main.js
├── package.json
├── preload.js
├── renderer.js
├── index.html
├── README.md
├── .gitignore
└── assets/
└── icon.png
```

## Descripción de Archivos

- `main.js`: Archivo principal que configura y lanza la aplicación Electron. Contiene la lógica para manejar la fusión de PDFs.
- `preload.js`: Archivo que expone las funciones de Electron al contexto del navegador.
- `renderer.js`: Archivo que maneja la lógica del frontend, incluyendo la interacción con los botones y la comunicación con el proceso principal.
- `index.html`: Archivo HTML que define la interfaz de usuario.
- `package.json`: Archivo de configuración del proyecto Node.js, incluye las dependencias y los scripts de la aplicación.
- `README.md`: Este archivo, contiene la documentación del proyecto.
- `.gitignore`: Archivo que especifica qué archivos y directorios deben ser ignorados por Git.


## Licencia

MIT


## Comandos para Correr el Proyecto

1. Para instalar las dependencias:
```sh
npm install
```

2. Para correr el proyecto:
```sh
npm start
```




