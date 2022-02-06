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

// Selecting calendar box
const calendarBox = document.querySelector('.calendar-box');
//============================================================================

//--------------------------------Variables and Objects----------------------------------
const date = new Date();
let tempDate = new Date();
const currentDate = new Date();
let curentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const days = printDaysInMonth(curentMonth, currentYear);
const monthStartDay = getWeekDay(curentMonth, currentYear);

let cardHeader, cardTitle, cardDate, cardTime;
const quickInfoCards = [];

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

  getRefactoredDate(date, month, year) {
    return `${this.months[month]} ${date}, ${year}`;
  },

  getCurrentYearMonthInfo(month, year) {
    return `${this.months[month]} ${year}`;
  },

  getRefactoredDateFromCalendar(dateString) {
    let date, month, year;
    const dateArray = dateString.split(" ");
    dateArray.forEach(arrayElement => {
      if (arrayElement.length <= 2) {
        date = arrayElement;
      }

      if (arrayElement.length <= 4) {
        year = arrayElement;
      }

      if (/^[A-Za-z\s]*$/.test(arrayElement)) {
        month = arrayElement;
      }
    });

    return `${month} ${date}, ${year}`;
  }
};
//=======================================================================================
//--Refactoring date and extracting header, title, date and time for quick event cards.--
//--Header, title, date and time will be part of cardObject which later we will append---
//--to quickInfoCards array for quicker and easier data monipulation.--------------------
webinarCards.forEach((card, index) => {
  //Creating cardObject where we are going to store header, title, date and time data
  let cardObject = new Object();
  //Extracting information from card by looping through its children.
  for (let i = 0; i < card.children.length; i++) {

    if (card.children[i].classList.contains('webinar-card-header')) {
      //Creating new property in cardObject and assigning to it data from card
      cardObject.header = card.children[i].textContent;
    }

    if (card.children[i].classList.contains('webinar-card-content')) {

      for (let j = 0; j < card.children[i].children.length; j++) {
        // For a better understandig we are assigning childs child to variable each eteration.
        let contentElement = card.children[i].children[j];

        if (contentElement.classList.contains('webinarTitle')) {
          //Creating new property in cardObject and assigning to it data from card
          cardObject.title = contentElement.textContent;
        }

        // Checking if any element has a class of 'date'.
        if (contentElement.classList.contains('date')) {
          // Pasing to changeDate function text content of date and replacing all '-' with '/'.
          // The reason for replacing is that HubSpot has its dates in 31-12-2021 format
          // but for Date object we need 31/12/2021 date format.
          // 'changeDate()' function changes the 'tempDate' object.
          changeDate(contentElement.textContent.replaceAll('-', '/'));
          // Then we pass 'tempDate' to 'dateRefactor' object to get nice readable date.
          contentElement.textContent = dateRefactor.getRefactoredDate(tempDate.getDate(), tempDate.getMonth(), tempDate.getFullYear());
          //--Creating new property in cardObject and assigning to it data from card.
          cardObject.date = contentElement.textContent;
          // Here we are creating eventCard for side panel next to calendar based on 3 recent events/webinars.
        }

        if (contentElement.classList.contains('time')) {
          //Creating new property in cardObject and assigning to it data from card.
          cardObject.time = contentElement.textContent;
        }

        //Changing link text between "Watch" and "Register" based on date.
        if (contentElement.classList.contains('link-to-webinar') && date.getTime() >= tempDate.getTime()) {
          contentElement.textContent = 'Watch';
        } else if (contentElement.classList.contains('link-to-webinar') && date.getTime() < tempDate.getTime()) {
          contentElement.textContent = 'Register';
        }

      }

    }

  }
  //--When all information is gathered, we are pushing cardObject to quickInforCard array.
  quickInfoCards.push(cardObject);
});

//Creating 3 most recent event cards for side panel
renderFirstFewCards(3);

//===========================================================================
//------------------------The Calendar Script--------------------------------
monthYearInfo.textContent = dateRefactor.getCurrentYearMonthInfo(curentMonth, currentYear);

renderDaysOfTheMonth(monthStartDay, days);

let calendarCells = document.querySelectorAll('.monthday');
heighlightCurentDay(calendarCells);

let monthAndYearInfo = document.querySelector('.month-year-info');
highlightingEventsInTheCalendar(calendarCells, monthAndYearInfo);

previousButton.addEventListener('click', () => {

  let monthEmptyCellsToReset = document.querySelectorAll('.emptyCell');
  let monthDaysToReset = document.querySelectorAll('.monthday');

  monthDaysReset(monthEmptyCellsToReset, monthDaysToReset);

  if (curentMonth > 0) {
    curentMonth = curentMonth - 1;
  } else if (curentMonth <= 0) {
    curentMonth = 11;
    currentYear = currentYear - 1;
  }

  const days = printDaysInMonth(curentMonth, currentYear);
  const monthStartDay = getWeekDay(curentMonth, currentYear);

  monthYearInfo.textContent = dateRefactor.getCurrentYearMonthInfo(curentMonth, currentYear);

  renderDaysOfTheMonth(monthStartDay, days);

  calendarCells = document.querySelectorAll('.monthday');
  monthAndYearInfo = document.querySelector('.month-year-info');
  highlightingEventsInTheCalendar(calendarCells, monthAndYearInfo);

  if (curentMonth === date.getMonth()) {
    heighlightCurentDay(calendarCells);
  }
});

nextButton.addEventListener('click', () => {

  let monthEmptyCellsToReset = document.querySelectorAll('.emptyCell');
  let monthDaysToReset = document.querySelectorAll('.monthday');

  monthDaysReset(monthEmptyCellsToReset, monthDaysToReset);

  if (curentMonth < 11) {
    curentMonth = curentMonth + 1;
  } else if (curentMonth => 11) {
    curentMonth = 0;
    currentYear = currentYear + 1;
  }
  const days = printDaysInMonth(curentMonth, currentYear);
  const monthStartDay = getWeekDay(curentMonth, currentYear);

  monthYearInfo.textContent = dateRefactor.getCurrentYearMonthInfo(curentMonth, currentYear);

  renderDaysOfTheMonth(monthStartDay, days);

  calendarCells = document.querySelectorAll('.monthday');
  monthAndYearInfo = document.querySelector('.month-year-info');
  highlightingEventsInTheCalendar(calendarCells, monthAndYearInfo);

  if (curentMonth === date.getMonth()) {
    heighlightCurentDay(calendarCells);
  }
});


calendarBox.addEventListener('click', e => {
  if (!e.target.classList.contains('business-central') || !e.target.classList.contains('finance-and-operations')) {
    let allCardsOnSidePanel = document.querySelectorAll('div .side-info-card');
    allCardsOnSidePanel.forEach(sidePanelCard => {
      sidePanelCard.remove();
    });
    renderFirstFewCards(3);
  }

  let refactoredDateOnClick = dateRefactor.getRefactoredDateFromCalendar(`${e.target.textContent} ${monthAndYearInfo.textContent}`);
  quickInfoCards.forEach(card => {
    if (refactoredDateOnClick === card.date) {
      let allCardsOnSidePanel = document.querySelectorAll('div .side-info-card');
      allCardsOnSidePanel.forEach(sidePanelCard => {
        sidePanelCard.remove();
      });
      cardBuilder(card.header, card.title, card.date, card.time);
    }
  });
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
function cardBuilder(cardHeader, cardTitle, cardDate, cardTime) {
  const webinarInfoCard = document.createElement('div');
  webinarInfoCard.className = 'side-info-card';
  //Creating Header in "side info card".
  const webinarInfoCardHeader = document.createElement('div');
  webinarInfoCardHeader.className = 'side-info-card-header';

  const webinarHeader = document.createElement('h4');
  webinarHeader.textContent = cardHeader;

  webinarInfoCardHeader.append(webinarHeader);

  //Creating Content area in "side info card".
  const webinarInfoCardContent = document.createElement('div');
  webinarInfoCardContent.classList = 'side-info-card-content';

  const webinarTitle = document.createElement('h5');
  webinarTitle.textContent = cardTitle;

  const webinarDate = document.createElement('p');
  webinarDate.className = 'date';
  webinarDate.textContent = cardDate;

  const webinarTime = document.createElement('p');
  webinarTime.className = 'time';
  webinarTime.textContent = cardTime;

  if (cardHeader === 'Finance & Operations') {
    webinarInfoCardHeader.classList.add('finance-and-operations');
    webinarInfoCardContent.classList.add('finance-and-operations-border');
  } else if (cardHeader === 'Business Central') {
    webinarInfoCardHeader.classList.add('business-central');
    webinarInfoCardContent.classList.add('business-central-border');
  }

  webinarInfoCardContent.append(webinarTitle, webinarDate, webinarTime);

  webinarInfoCard.append(webinarInfoCardHeader, webinarInfoCardContent);

  quickEventInfoSection.appendChild(webinarInfoCard);
}

function renderFirstFewCards(numberOfCardsToRender) {
  for (let i = 0; i < numberOfCardsToRender; i++) {
    let cardHeader = quickInfoCards[i].header;
    let cardTitle = quickInfoCards[i].title;
    let cardDate = quickInfoCards[i].date;
    let cardTime = quickInfoCards[i].time;
    cardBuilder(cardHeader, cardTitle, cardDate, cardTime);
  }
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
// 3. Change temporary date.
function changeDate(dateString) {
  tempDate = new Date(dateString);
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

function renderDaysOfTheMonth(monthStartDay, days) {
  for (let i = 1; i < monthStartDay; i++) {
    monthDays.appendChild(printEmptyCell());
  }
  for (let i = 0; i < days.length; i++) {
    monthDays.appendChild(createDayOfTheMonth(days[i]));
  }
}

function monthDaysReset(monthEmptyCells, monthDays) {
  monthEmptyCells.forEach(empty => {
    empty.remove();
  });
  monthDays.forEach(day => {
    day.remove();
  });
}

function highlightingEventsInTheCalendar(daysCells, monthYearInfo) {
  daysCells.forEach(cell => {
    let cellDateRefactored = dateRefactor.getRefactoredDateFromCalendar(`${cell.textContent} ${monthYearInfo.textContent}`);
    quickInfoCards.forEach(card => {
      if (cellDateRefactored === card.date) {

        if (card.header === 'Finance & Operations') {
          cell.classList.add('finance-and-operations');
        }

        if (card.header === 'Business Central') {
          cell.classList.add('business-central');
        }

      }
    });
  });
}
//===========================================================================