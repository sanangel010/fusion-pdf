// Se carga antes de que la página web se ejecute en el contexto de la ventana. 
//En este script se pueden exponer APIs seguras desde el lado de Node.js/Electron al contexto web.
// El usar scripts de pre-carga para exponer de manera segura las APIs necesarias al contexto del navegador. 
// Esto permite un control más fino sobre qué partes de Node.js y Electron están disponibles para el contenido web.

const { ipcRenderer, contextBridge } = require('electron');

// Exponer funciones de ipcRenderer en el contexto del navegador
contextBridge.exposeInMainWorld('electron', {
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  mergePdfs: (folderPath, sourceFile) => ipcRenderer.invoke('merge-pdfs', { folderPath, sourceFile })
});