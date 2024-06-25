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
    width: 750,  // Ancho de la ventana
    height: 900, // Alto de la ventana
    icon: path.join(__dirname, 'assets', 'cjf.ico'), // Ruta al icono
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload script
      contextIsolation: true, // Aislar el contexto
      enableRemoteModule: false, // Deshabilitar módulo remoto
      nodeIntegration: false // Deshabilitar integración de Node.js
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
  return result.filePaths[0]; // Devuelve la ruta del directorio seleccionado
});

// Manejo de operaciones desde el frontend
ipcMain.handle('execute-operation', async (event, { folderPath, sourceFile, operation }) => {
  try {
    const sourcePdfBytes = fs.readFileSync(sourceFile); // Leer el archivo PDF de origen
    const sourcePdfDoc = await PDFDocument.load(sourcePdfBytes); // Cargar el archivo PDF de origen
    const [sourcePage] = await sourcePdfDoc.copyPages(sourcePdfDoc, [0]); // Copiar la primera página del PDF de origen

    // Listar archivos PDF en la carpeta
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.pdf'));

    const startTime = Date.now(); // Tiempo de inicio

    let processedFiles = [];
    if (operation === 'merge') {
      const mergedFiles = [];
      for (const file of files) {
        const filePath = path.join(folderPath, file); // Ruta completa del archivo
        const targetPdfBytes = fs.readFileSync(filePath); // Leer el archivo PDF de destino
        const targetPdfDoc = await PDFDocument.load(targetPdfBytes); // Cargar el archivo PDF de destino

        const embeddedPage = await targetPdfDoc.embedPage(sourcePage); // Incrustar la página de origen en el PDF de destino
        const pages = targetPdfDoc.getPages(); // Obtener las páginas del PDF de destino
        pages.forEach((page) => {
          page.drawPage(embeddedPage); // Dibujar la página de origen incrustada en cada página del PDF de destino
        });

        const mergedPdfBytes = await targetPdfDoc.save(); // Guardar el PDF fusionado
        const mergedFilePath = path.join(folderPath, `cert_${file}`); // Ruta del nuevo archivo fusionado
        fs.writeFileSync(mergedFilePath, mergedPdfBytes); // Escribir el archivo PDF fusionado
        mergedFiles.push(mergedFilePath);
        processedFiles.push(`cert_${file}`);
      }
    } else if (operation === 'append') {
      const appendedFiles = [];
      for (const file of files) {
        const filePath = path.join(folderPath, file); // Ruta completa del archivo
        const targetPdfBytes = fs.readFileSync(filePath); // Leer el archivo PDF de destino
        const targetPdfDoc = await PDFDocument.load(targetPdfBytes); // Cargar el archivo PDF de destino

        const [appendedPage] = await targetPdfDoc.copyPages(sourcePdfDoc, [0]); // Copiar la primera página del PDF de origen
        targetPdfDoc.addPage(appendedPage); // Agregar la página de origen al final del PDF de destino

        const appendedPdfBytes = await targetPdfDoc.save(); // Guardar el PDF modificado
        const appendedFilePath = path.join(folderPath, `cert_${file}`); // Ruta del nuevo archivo modificado
        fs.writeFileSync(appendedFilePath, appendedPdfBytes); // Escribir el archivo PDF modificado
        appendedFiles.push(appendedFilePath);
        processedFiles.push(`cert_${file}`);
      }
    }

    const endTime = Date.now(); // Tiempo de finalización
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // Calcular el tiempo de ejecución en segundos

    return { folderPath, processedFiles, timeTaken };
  } catch (error) {
    console.error('Error durante la operación de PDFs:', error); // Log para errores
    return null;
  }
});