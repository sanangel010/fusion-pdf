// Este archivo se encarga de la interacción del usuario, la comunicación con el proceso principal y la actualización dinámica de la interfaz de usuario,
// proporcionando una experiencia interactiva y fluida.

document.addEventListener('DOMContentLoaded', () => {
  const selectDirectoryButton = document.getElementById('select-directory'); // Botón para seleccionar el directorio
  const mergeButton = document.getElementById('merge-button');  // Botón para iniciar la fusión
  const sourceInput = document.getElementById('source-file');   // Input para el archivo PDF de origen
  const statusMessage = document.getElementById('status-message'); // Elemento para mostrar mensajes de estado
  const selectedDirectory = document.getElementById('selected-directory'); // Elemento para mostrar la carpeta seleccionada

  let folderPath = ''; // Variable para almacenar la ruta de la carpeta seleccionada

  selectDirectoryButton.addEventListener('click', async () => {
    //console.log('1. Botón de selección de directorio clicado'); // Log para el clic del botón de selección de directorio
    folderPath = await window.electron.selectDirectory(); // Abrir el diálogo de selección de directorio
    //console.log('2. Carpeta seleccionada:', folderPath); // Log de la carpeta seleccionada
    selectedDirectory.textContent = `Carpeta seleccionada: ${folderPath}`; // Mostrar la carpeta seleccionada en la interfaz
  });

  mergeButton.addEventListener('click', async () => {
    //console.log('3. Botón de fusión presionado'); // Log para el clic del botón de fusión

    if (!folderPath || sourceInput.files.length === 0) {
      statusMessage.textContent = 'Por favor, selecciona una carpeta y un archivo PDF.';
      //console.log('4. Faltan archivos para la fusión'); // Log si faltan archivos
      return;
    }

    statusMessage.textContent = 'Procesando...';
    //console.log('5. Iniciando el procesamiento'); // Log para el inicio del procesamiento

    const sourceFile = sourceInput.files[0].path;
    //console.log('6. Archivo PDF de origen seleccionado:', sourceFile); // Log del archivo PDF de origen seleccionado

    const startTime = performance.now();
    const resultPath = await window.electron.mergePdfs(folderPath, sourceFile);
    const endTime = performance.now();
    
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
    if (resultPath) {
      statusMessage.textContent = `PDFs fusionados guardados en: ${resultPath} en ${timeTaken} segundos.`;
      //console.log('7. Fusión completada'); // Log para la fusión completada
    } else {
      statusMessage.textContent = 'Error al fusionar los PDFs.';
      //console.log('8. Error al fusionar los PDFs'); // Log para el error de fusión
    }
  });
});