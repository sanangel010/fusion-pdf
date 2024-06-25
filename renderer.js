// Este archivo se encarga de la interacción del usuario, la comunicación con el proceso principal y la actualización dinámica de la interfaz de usuario,
// proporcionando una experiencia interactiva y fluida.

document.addEventListener('DOMContentLoaded', () => {
  const selectDirectoryButton = document.getElementById('select-directory'); // Botón para seleccionar el directorio
  const executeButton = document.getElementById('execute-button');  // Botón para iniciar la operación
  const sourceInput = document.getElementById('source-file');   // Input para el archivo PDF de origen
  const statusMessage = document.getElementById('status-message'); // Elemento para mostrar mensajes de estado
  const selectedDirectory = document.getElementById('selected-directory'); // Elemento para mostrar la carpeta seleccionada
  const mergeRadio = document.getElementById('merge'); // Opción para fusionar PDFs
  const appendRadio = document.getElementById('append'); // Opción para agregar una hoja al final

  let folderPath = ''; // Variable para almacenar la ruta de la carpeta seleccionada

  selectDirectoryButton.addEventListener('click', async () => {
    folderPath = await window.electron.selectDirectory(); // Abrir el diálogo de selección de directorio
    selectedDirectory.textContent = `Carpeta seleccionada: ${folderPath}`; // Mostrar la carpeta seleccionada en la interfaz
  });

  executeButton.addEventListener('click', async () => {
    if (!folderPath || sourceInput.files.length === 0) {
      statusMessage.textContent = 'Por favor, selecciona una carpeta y un archivo PDF.';
      return;
    }

    statusMessage.textContent = 'Procesando...';

    const sourceFile = sourceInput.files[0].path;
    const operation = mergeRadio.checked ? 'merge' : 'append';

    const result = await window.electron.executeOperation(folderPath, sourceFile, operation);
    
    if (result) {
      const { folderPath, processedFiles, timeTaken } = result;
      statusMessage.textContent = `Operación completada en ${timeTaken} segundos. Archivos procesados:\n${processedFiles.join('\n')}`;
    } else {
      statusMessage.textContent = 'Error durante la operación.';
    }
  });
});
