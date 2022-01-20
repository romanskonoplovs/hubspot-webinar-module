//----------------------------QuerySelectors---------------------------------
// Selecting calendar controls
const monthDays = document.querySelector('.monthdays');
const monthYearInfo = document.querySelector('.month-year-info');
const previousButton = document.querySelector('.button-previous');
const nextButton = document.querySelector('.button-next');
// Selecting quick-event-info section.
const quickEventInfoSection = document.querySelector('.quick-event-info');
// Selecting webinar card controls
const cardControls = document.querySelectorAll('ul.webinar-card-controls');
const cardControlSwitches = document.querySelectorAll('ul.webinar-card-controls li');

// Selecting all webinar cards
const webinarCards = document.querySelectorAll('.webinar-card-container .webinar-card');
const webinarCardContent = document.querySelectorAll('.webinar-card-container .webinar-card .webinar-card-content');
//============================================================================

//--------------------------------Variables and Objects----------------------------------
const date = new Date();
let tempDate = new Date();
const currentDate = new Date();
let curentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const days = printDaysInMonth(curentMonth, currentYear);
const monthStartDay = getWeekDay(curentMonth, currentYear);

const dateRefactor = {
  months: {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  },

  getRefactoredDate(date, month, day, year) {
    return `${this.months[month]} ${date}, ${year}`;
  },

  getCurrentYearMonthInfo(month, year) {
    return `${this.months[month]} ${year}`;
  }
};
//=======================================================================================
//-----Changing text content of the "link button" in webinar cards based on the date.----
webinarCardContent.forEach(cardContent => {
  let arrayWithCardContent = Array.prototype.slice.call(cardContent.children);
  arrayWithCardContent.forEach(childElement => {
    if (childElement.classList.contains('date')) {
      changeDate(childElement.textContent.replaceAll('-', '/'));
      childElement.textContent = dateRefactor.getRefactoredDate(tempDate.getDate(), tempDate.getMonth(), tempDate.getDay(), tempDate.getFullYear());
    }
    if (childElement.classList.contains('link-to-webinar') && date.getTime() >= tempDate.getTime()) {
      childElement.textContent = 'Watch';
    } else if (childElement.classList.contains('link-to-webinar') && date.getTime() < tempDate.getTime()) {
      childElement.textContent = 'Register';
    }
  });
});

function changeDate(dateString) {
  tempDate = new Date(dateString);
}

//===========================================================================
//------------------------The Calendar Script--------------------------------
monthYearInfo.textContent = dateRefactor.getCurrentYearMonthInfo(curentMonth, currentYear);

for (let i = 1; i < monthStartDay; i++) {
  monthDays.appendChild(printEmptyCell());
}
for (let i = 0; i < days.length; i++) {
  monthDays.appendChild(createDayOfTheMonth(days[i]));
}

let calendarCells = document.querySelectorAll('.monthday');
heighlightCurentDay(calendarCells);

previousButton.addEventListener('click', () => {
  let monthDaysToReset = document.querySelectorAll('.monthday');
  let monthEmptyCellsToReset = document.querySelectorAll('.emptyCell');
  monthEmptyCellsToReset.forEach(empty => {
    empty.remove();
  });
  monthDaysToReset.forEach(day => {
    day.remove();
  });

  if (curentMonth > 0) {
    curentMonth = curentMonth - 1;
  } else if (curentMonth <= 0) {
    curentMonth = 11;
    currentYear = currentYear - 1;
  }

  const days = printDaysInMonth(curentMonth, currentYear);
  const monthStartDay = getWeekDay(curentMonth, currentYear);

  monthYearInfo.textContent = dateRefactor.getCurrentYearMonthInfo(curentMonth, currentYear);

  for (let i = 1; i < monthStartDay; i++) {
    monthDays.appendChild(printEmptyCell());
  }
  for (let i = 0; i < days.length; i++) {
    monthDays.appendChild(createDayOfTheMonth(days[i]));
  }

  if (curentMonth === date.getMonth()) {
    calendarCells = document.querySelectorAll('.monthday');
    heighlightCurentDay(calendarCells);
  }
});

nextButton.addEventListener('click', () => {
  let monthDaysToReset = document.querySelectorAll('.monthday');
  let monthEmptyCellsToReset = document.querySelectorAll('.emptyCell');
  monthEmptyCellsToReset.forEach(empty => {
    empty.remove();
  });
  monthDaysToReset.forEach(day => {
    day.remove();
  });

  if (curentMonth < 11) {
    curentMonth = curentMonth + 1;
  } else if (curentMonth => 11) {
    curentMonth = 0;
    currentYear = currentYear + 1;
  }
  const days = printDaysInMonth(curentMonth, currentYear);
  const monthStartDay = getWeekDay(curentMonth, currentYear);

  monthYearInfo.textContent = dateRefactor.getCurrentYearMonthInfo(curentMonth, currentYear);

  for (let i = 1; i < monthStartDay; i++) {
    monthDays.appendChild(printEmptyCell());
  }
  for (let i = 0; i < days.length; i++) {
    monthDays.appendChild(createDayOfTheMonth(days[i]));
  }

  if (curentMonth === date.getMonth()) {
    calendarCells = document.querySelectorAll('.monthday');
    heighlightCurentDay(calendarCells);
  }
});

//===========================================================================
//-------------Adding correct class to paint webinar cards headings.---------
webinarCards.forEach(element => {
  if (element.childNodes[1].textContent === "Business Central") {
    element.childNodes[1].classList.add('business-central');
  } else if (element.childNodes[1].textContent === "Finance & Operations") {
    element.childNodes[1].classList.add('finance-and-operations');
  }
});
//===========================================================================


//---------------------Filtering cards by topic------------------------------
cardControls.forEach(element => {
  element.addEventListener('click', (e) => {
    addActiveClass(e);
    hideShowTopics(e);
  });
});
//===========================================================================
//------------------------------FUNCTIONS------------------------------------

//--------------------------Event info section-------------------------------
function createQuickEventCard(header, title, date, time) {
  const eventInfoCard = document.createElement('div');
  eventInfoCard.className = '.event-info-card';
}

//--------------------------------Cards--------------------------------------
// 1. Add active class 
function addActiveClass(e) {
  cardControlSwitches.forEach(element => {
    if (e.target.textContent === element.textContent) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  });
}
// 2. Hide and show cards by topic.
function hideShowTopics(e) {
  webinarCards.forEach(element => {
    if (e.target.textContent === element.childNodes[1].textContent) {
      element.classList.remove('hidden');
    } else if (e.target.textContent === "All") {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  });
}

//-------------------------------Calendar------------------------------------
function createDayOfTheMonth(day) {
  const element = document.createElement('div');
  element.textContent = day;
  element.className = 'monthday';
  return element;
}

function printDaysInMonth(month, year) {
  let date = new Date(year, month, 1);
  let days = [];
  while (date.getMonth() === month) {
    days.push(date.getDate());
    date.setDate(date.getDate() + 1);
  }

  return days;
}

function printEmptyCell() {
  const emptyCell = document.createElement('div');
  emptyCell.className = 'emptyCell';
  return emptyCell;
}

function getWeekDay(month, year) {
  let tmpDate = new Date(year, month, 1);
  let weekDay = tmpDate.getDay();
  if (weekDay === 0) {
    weekDay = 7;
  }
  return weekDay;
}

function heighlightCurentDay(cells) {
  let date = new Date();
  cells.forEach(cell => {
    if (parseInt(cell.textContent) === date.getDate()) {
      cell.classList.add('currentDate');
    }
  });
}
//===========================================================================