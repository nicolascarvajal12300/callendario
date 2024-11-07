// Variables globales
let currentMonth = new Date().getMonth(); // Mes actual
let currentYear = new Date().getFullYear(); // Año actual
let cases = JSON.parse(localStorage.getItem('cases')) || {}; // Cargar casos desde localStorage o usar un objeto vacío si no hay casos guardados
let currentSelectedDate = null; // Fecha seleccionada para agregar un caso

// Función para guardar los casos en localStorage
function saveToLocalStorage() {
  localStorage.setItem('cases', JSON.stringify(cases));
}

// Función para generar el calendario
function generateCalendar(month, year) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Actualizar el título
  document.getElementById('calendar-title').textContent = `${new Date(year, month).toLocaleString('es', { month: 'long' })} ${year}`;

  const calendarBody = document.getElementById('calendar-body');
  calendarBody.innerHTML = ''; // Limpiar el calendario

  // Espacios en blanco antes del primer día del mes
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('calendar-day');
    calendarBody.appendChild(emptyCell);
  }

  // Crear los días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('calendar-day');
    dayCell.textContent = day;

    // Agregar punto rojo si el día tiene casos
    const dateKey = `${year}-${month + 1}-${day}`;
    if (cases[dateKey] && cases[dateKey].length > 0) {
      dayCell.classList.add('has-case');
    }

    // Agregar evento para mostrar casos al hacer clic en un día
    dayCell.addEventListener('click', () => {
      // Eliminar la clase 'selected' de cualquier día previamente seleccionado
      if (currentSelectedDate) {
        const prevSelectedDay = document.querySelector('.calendar-day.selected');
        if (prevSelectedDay) {
          prevSelectedDay.classList.remove('selected');
        }
      }

      // Marcar el día seleccionado con la clase 'selected'
      dayCell.classList.add('selected');
      currentSelectedDate = { year, month, day };
      showCaseForm(year, month, day);
    });

    calendarBody.appendChild(dayCell);
  }
}

// Mostrar los casos para un día específico
function showCaseForm(year, month, day) {
  const dateKey = `${year}-${month + 1}-${day}`;
  const caseList = cases[dateKey] || [];
  const caseListElement = document.getElementById('case-list');
  
  // Limpiar la lista de casos
  caseListElement.innerHTML = '';

  // Mostrar los casos existentes
  caseList.forEach((caseItem, index) => {
    const caseItemElement = document.createElement('div');
    caseItemElement.classList.add('case-item');
    caseItemElement.innerHTML = `
      <span><b>Fecha:</b> ${caseItem.fecha} <b>Hora:</b> ${caseItem.hora} <b>Delito:</b> ${caseItem.delito} <b>Audiencia:</b> ${caseItem.audiencia} <b>Nombre:</b> ${caseItem.nombre}</span>
      <button onclick="deleteCase('${dateKey}', ${index})">Eliminar</button>
    `;
    caseListElement.appendChild(caseItemElement);
  });

  // Crear el formulario para agregar un nuevo caso debajo de los casos
  const newCaseForm = document.createElement('div');
  newCaseForm.classList.add('case-form');
  newCaseForm.innerHTML = `
    <h3>Agregar Caso Legal</h3>
    <label for="fecha">Fecha</label>
    <input type="date" id="fecha" value="${year}-${month + 1}-${day}" required>
    <label for="hora">Hora</label>
    <input type="time" id="hora" required>
    <label for="delito">Delito</label>
    <input type="text" id="delito" required>
    <label for="audiencia">Audiencia</label>
    <input type="text" id="audiencia" required>
    <label for="nombre">Nombre del Procesado</label>
    <input type="text" id="nombre" required>
    <button id="save-case">Guardar Caso</button>
    <button id="cancel-case">Cancelar</button>
  `;
  caseListElement.appendChild(newCaseForm);

  // Agregar los eventos del formulario
  document.getElementById('save-case').addEventListener('click', saveCase);
  document.getElementById('cancel-case').addEventListener('click', cancelCase);
}

// Guardar un caso
function saveCase() {
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const delito = document.getElementById('delito').value;
  const audiencia = document.getElementById('audiencia').value;
  const nombre = document.getElementById('nombre').value;

  if (!fecha || !hora || !delito || !audiencia || !nombre) {
    alert('Por favor complete todos los campos');
    return;
  }

  const dateKey = `${currentSelectedDate.year}-${currentSelectedDate.month + 1}-${currentSelectedDate.day}`;
  if (!cases[dateKey]) {
    cases[dateKey] = [];
  }

  // Guardar el caso
  cases[dateKey].push({ fecha, hora, delito, audiencia, nombre });

  // Guardar los casos en localStorage
  saveToLocalStorage();

  // Regenerar el calendario para actualizar los puntos rojos
  generateCalendar(currentMonth, currentYear);

  // Mostrar nuevamente los casos del día y cerrar el formulario
  showCaseForm(currentSelectedDate.year, currentSelectedDate.month, currentSelectedDate.day);
}

// Cancelar el formulario de agregar caso
function cancelCase() {
  const caseForm = document.querySelector('.case-form');
  caseForm.style.display = 'none';
}

// Eliminar un caso
function deleteCase(dateKey, caseIndex) {
  cases[dateKey].splice(caseIndex, 1);

  // Guardar los casos en localStorage después de eliminar
  saveToLocalStorage();

  // Regenerar el calendario para actualizar los puntos rojos
  generateCalendar(currentMonth, currentYear);

  // Mostrar los casos después de eliminar
  showCaseForm(currentSelectedDate.year, currentSelectedDate.month, currentSelectedDate.day);
}

// Navegar al mes anterior
document.getElementById('prev-month').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  generateCalendar(currentMonth, currentYear);
});

// Navegar al mes siguiente
document.getElementById('next-month').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  generateCalendar(currentMonth, currentYear);
});

// Mostrar el formulario de agregar caso al hacer clic en el botón
document.getElementById('add-case-btn').addEventListener('click', () => {
  if (currentSelectedDate) {
    showCaseForm(currentSelectedDate.year, currentSelectedDate.month, currentSelectedDate.day);
  } else {
    alert('Por favor seleccione un día primero');
  }
});

// Generar el calendario al cargar la página
generateCalendar(currentMonth, currentYear);
