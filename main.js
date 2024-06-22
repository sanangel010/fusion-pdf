/*
*By: Mtro. José Ángel Haro Juárez
Date: 22/06/2024
Desc: Aplicación de consola que permite unificar-fusionar documentos pdf.
*/

const { app, BrowserWindow, ipcMain, dialog } = require('electron'); // Importar módulos necesarios
const path = require('path'); // Importar path para manejo de rutas
const fs = require('fs'); // Importar fs para manejo de archivos
const { PDFDocument } = require('pdf-lib'); // Importar PDFDocument de pdf-lib

// Función para crear la ventana principal
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,  // Ancho de la ventana
    height: 600, // Alto de la ventana
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload script
      contextIsolation: true, // Aislar el contexto
      enableRemoteModule: false, // Deshabilitar módulo remoto
      nodeIntegration: false // Deshabilitar integración de Node.js, por razones de seguridad al usar electronjs.
    }
  });

  mainWindow.loadFile('index.html'); // Cargar el archivo HTML

  // Abrir las herramientas de desarrollo
  // mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow); // Crear la ventana cuando la app está lista

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Maneja el evento para seleccionar un directorio
ipcMain.handle('select-directory', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  // console.log('9. Directorio seleccionado:', result.filePaths[0]); // Log para el directorio seleccionado
  return result.filePaths[0]; // Devuelve la ruta del directorio seleccionado
});

// Manejo de fusión de PDFs desde el frontend
ipcMain.handle('merge-pdfs', async (event, { folderPath, sourceFile }) => {
  try {
    // console.log('10. Inicio de fusión de PDFs'); // Log para inicio de fusión

    const sourcePdfBytes = fs.readFileSync(sourceFile); // Leer el archivo PDF de origen
    // console.log('11. Archivo PDF de origen leído'); // Log para archivo leído

    const sourcePdfDoc = await PDFDocument.load(sourcePdfBytes); // Cargar el archivo PDF de origen
    // console.log('12. Archivo PDF de origen cargado'); // Log para archivo cargado

    const [sourcePage] = await sourcePdfDoc.copyPages(sourcePdfDoc, [0]); // Copiar la primera página del PDF de origen
    // console.log('13. Página del PDF de origen copiada'); // Log para página copiada

    // Listar archivos PDF en la carpeta
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.pdf'));
    // console.log('14. Archivos en la carpeta leídos', files); // Log para archivos listados

    const mergedFiles = [];

    for (const file of files) {
      // console.log(`15. Procesando archivo: ${file}`); // Log para archivo en proceso
      const filePath = path.join(folderPath, file); // Ruta completa del archivo
      // console.log(`16. Ruta completa del archivo: ${filePath}`); // Log para la ruta completa del archivo
      const targetPdfBytes = fs.readFileSync(filePath); // Leer el archivo PDF de destino
      const targetPdfDoc = await PDFDocument.load(targetPdfBytes); // Cargar el archivo PDF de destino
      // console.log('17. Archivo PDF de destino cargado'); // Log para archivo PDF de destino cargado

      const embeddedPage = await targetPdfDoc.embedPage(sourcePage); // Incrustar la página de origen en el PDF de destino
      const pages = targetPdfDoc.getPages(); // Obtener las páginas del PDF de destino
      pages.forEach((page) => {
        page.drawPage(embeddedPage); // Dibujar la página de origen incrustada en cada página del PDF de destino
      });

      const mergedPdfBytes = await targetPdfDoc.save(); // Guardar el PDF fusionado
      const mergedFilePath = path.join(folderPath, `cert_${file}`); // Ruta del nuevo archivo fusionado
      fs.writeFileSync(mergedFilePath, mergedPdfBytes); // Escribir el archivo PDF fusionado
      mergedFiles.push(mergedFilePath);
      // console.log(`18. Archivo fusionado guardado: ${mergedFilePath}`); // Log para archivo fusionado guardado
    }

    // console.log('19. Todos los archivos procesados'); // Log para todos los archivos procesados
    return folderPath;
  } catch (error) {
    console.error('Error durante la fusión de PDFs:', error); // Log para errores
    return null;
  }
});