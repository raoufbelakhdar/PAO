// Initialize data structures
let characters = {};
let actions = {};
let objects = {};
let birthdays = {};
let historicalDates = {};

// Default items (will be used if no data exists)
const DEFAULT_ITEMS = {
    characters: {
        "00": {
            name: "Default Character",
            image: "https://via.placeholder.com/300x400/FF5733/FFFFFF?text=Character+00"
        }
    },
    actions: {
        "00": {
            name: "Default Action",
            image: "https://via.placeholder.com/300x400/33FF57/FFFFFF?text=Action+00"
        }
    },
    objects: {
        "00": {
            name: "Default Object",
            image: "https://via.placeholder.com/300x400/3357FF/FFFFFF?text=Object+00"
        }
    },
    birthdays: {},
    historicalDates: {}
};

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('paoSystemData');
    if (savedData) {
        const data = JSON.parse(savedData);
        characters = data.characters || DEFAULT_ITEMS.characters;
        actions = data.actions || DEFAULT_ITEMS.actions;
        objects = data.objects || DEFAULT_ITEMS.objects;
        birthdays = data.birthdays || DEFAULT_ITEMS.birthdays;
        historicalDates = data.historicalDates || DEFAULT_ITEMS.historicalDates;
    } else {
        // Use default items if no saved data exists
        characters = DEFAULT_ITEMS.characters;
        actions = DEFAULT_ITEMS.actions;
        objects = DEFAULT_ITEMS.objects;
        birthdays = DEFAULT_ITEMS.birthdays;
        historicalDates = DEFAULT_ITEMS.historicalDates;
        saveData();
    }
    refreshLists();
    loadDefaultItems();
}

// Save data to localStorage
function saveData() {
    const data = {
        characters,
        actions,
        objects,
        birthdays,
        historicalDates
    };
    localStorage.setItem('paoSystemData', JSON.stringify(data));
}

// Load default items when page loads
function loadDefaultItems() {
    // Set default values in input fields
    document.getElementById('character-code').value = '00';
    document.getElementById('action-code').value = '00';
    document.getElementById('object-code').value = '00';
    
    // Load the default items
    loadCharacter();
    loadAction();
    loadObject();
}

// Tab navigation
function openTab(tabName) {
    // Update sidebar tabs
    const sidebarTabs = document.getElementsByClassName('sidebar-tab');
    for (let i = 0; i < sidebarTabs.length; i++) {
        sidebarTabs[i].classList.remove('active');
        if (sidebarTabs[i].getAttribute('onclick').includes(tabName)) {
            sidebarTabs[i].classList.add('active');
        }
    }
    
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Show the selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Refresh lists if needed
    if (tabName === 'characters') refreshCharacterList();
    if (tabName === 'actions') refreshActionList();
    if (tabName === 'objects') refreshObjectList();
    if (tabName === 'birthdays') refreshBirthdayList();
    if (tabName === 'historical-dates') refreshHistoricalDateList();
    
    // Reset exercise states if needed
    if (tabName === 'flashcards') {
        document.getElementById('flashcard-area').style.display = 'none';
    }
    if (tabName === 'recall-quiz') {
        document.getElementById('quiz-area').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'none';
    }
    if (tabName === 'speed-test') {
        document.getElementById('speed-area').style.display = 'none';
    }
    if (tabName === 'story-challenge') {
        document.getElementById('story-challenge-area').style.display = 'none';
    }
}

// PAO Viewer functions
function loadCharacter() {
    const input = document.getElementById('character-code');
    const errorElement = document.getElementById('character-error');
    let code = input.value;
    
    if (code === '') {
        errorElement.textContent = "Please enter a code";
        return;
    }
    
    code = code.padStart(2, '0');
    
    if (code < 0 || code > 99 || isNaN(code)) {
        errorElement.textContent = "Please enter a number between 00 and 99";
        return;
    }
    
    errorElement.textContent = "";
    
    if (characters[code]) {
        document.getElementById('character-img').src = characters[code].image;
        document.getElementById('character-img').alt = '';
        document.getElementById('character-name').textContent = characters[code].name;
    } else {
        document.getElementById('character-img').src = '';
        document.getElementById('character-name').textContent = `Character ${code} not found`;
    }
}

function loadAction() {
    const input = document.getElementById('action-code');
    const errorElement = document.getElementById('action-error');
    let code = input.value;
    
    if (code === '') {
        errorElement.textContent = "Please enter a code";
        return;
    }
    
    code = code.padStart(2, '0');
    
    if (code < 0 || code > 99 || isNaN(code)) {
        errorElement.textContent = "Please enter a number between 00 and 99";
        return;
    }
    
    errorElement.textContent = "";
    
    if (actions[code]) {
        document.getElementById('action-img').src = actions[code].image;
        document.getElementById('action-img').alt = '';
        document.getElementById('action-name').textContent = actions[code].name;
    } else {
        document.getElementById('action-img').src = '';
        document.getElementById('action-name').textContent = `Action ${code} not found`;
    }
}

function loadObject() {
    const input = document.getElementById('object-code');
    const errorElement = document.getElementById('object-error');
    let code = input.value;
    
    if (code === '') {
        errorElement.textContent = "Please enter a code";
        return;
    }
    
    code = code.padStart(2, '0');
    
    if (code < 0 || code > 99 || isNaN(code)) {
        errorElement.textContent = "Please enter a number between 00 and 99";
        return;
    }
    
    errorElement.textContent = "";
    
    if (objects[code]) {
        document.getElementById('object-img').src = objects[code].image;
        document.getElementById('object-img').alt = '';
        document.getElementById('object-name').textContent = objects[code].name;
    } else {
        document.getElementById('object-img').src = '';
        document.getElementById('object-name').textContent = `Object ${code} not found`;
    }
}

// Character management
function saveCharacter() {
    const code = document.getElementById('edit-character-code').value.padStart(2, '0');
    const name = document.getElementById('edit-character-name').value;
    const image = document.getElementById('edit-character-image').value;
    
    if (!code || code < 0 || code > 99 || isNaN(code)) {
        alert("Please enter a valid code between 00 and 99");
        return;
    }
    
    if (!name) {
        alert("Please enter a name");
        return;
    }
    
    characters[code] = { name, image };
    saveData();
    refreshCharacterList();
    clearCharacterForm();
    
    if (document.getElementById('character-code').value === code) {
        loadCharacter();
    }
}

function clearCharacterForm() {
    document.getElementById('edit-character-code').value = '';
    document.getElementById('edit-character-name').value = '';
    document.getElementById('edit-character-image').value = '';
}

function editCharacter(code) {
    const character = characters[code];
    document.getElementById('edit-character-code').value = code;
    document.getElementById('edit-character-name').value = character.name;
    document.getElementById('edit-character-image').value = character.image;
}

function deleteCharacter(code) {
    if (confirm(`Are you sure you want to delete character ${code}?`)) {
        delete characters[code];
        saveData();
        refreshCharacterList();
        
        if (document.getElementById('character-code').value === code) {
            document.getElementById('character-code').value = '';
            document.getElementById('character-img').src = '';
            document.getElementById('character-name').textContent = '';
        }
    }
}

function refreshCharacterList() {
    const list = document.getElementById('character-list');
    list.innerHTML = '';
    
    const codes = Object.keys(characters).sort();
    
    if (codes.length === 0) {
        list.innerHTML = '<p>No characters saved yet.</p>';
        return;
    }
    
    codes.forEach(code => {
        const character = characters[code];
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
            <div class="item-code">${code}</div>
            <div class="item-name">${character.name}</div>
            <img src="${character.image}" class="item-image">
            <div class="item-actions">
                <button onclick="editCharacter('${code}')">Edit</button>
                <button onclick="deleteCharacter('${code}')">Delete</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// Action management
function saveAction() {
    const code = document.getElementById('edit-action-code').value.padStart(2, '0');
    const name = document.getElementById('edit-action-name').value;
    const image = document.getElementById('edit-action-image').value;
    
    if (!code || code < 0 || code > 99 || isNaN(code)) {
        alert("Please enter a valid code between 00 and 99");
        return;
    }
    
    if (!name) {
        alert("Please enter a name");
        return;
    }
    
    actions[code] = { name, image };
    saveData();
    refreshActionList();
    clearActionForm();
    
    if (document.getElementById('action-code').value === code) {
        loadAction();
    }
}

function clearActionForm() {
    document.getElementById('edit-action-code').value = '';
    document.getElementById('edit-action-name').value = '';
    document.getElementById('edit-action-image').value = '';
}

function editAction(code) {
    const action = actions[code];
    document.getElementById('edit-action-code').value = code;
    document.getElementById('edit-action-name').value = action.name;
    document.getElementById('edit-action-image').value = action.image;
}

function deleteAction(code) {
    if (confirm(`Are you sure you want to delete action ${code}?`)) {
        delete actions[code];
        saveData();
        refreshActionList();
        
        if (document.getElementById('action-code').value === code) {
            document.getElementById('action-code').value = '';
            document.getElementById('action-img').src = '';
            document.getElementById('action-name').textContent = '';
        }
    }
}

function refreshActionList() {
    const list = document.getElementById('action-list');
    list.innerHTML = '';
    
    const codes = Object.keys(actions).sort();
    
    if (codes.length === 0) {
        list.innerHTML = '<p>No actions saved yet.</p>';
        return;
    }
    
    codes.forEach(code => {
        const action = actions[code];
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
            <div class="item-code">${code}</div>
            <div class="item-name">${action.name}</div>
            <img src="${action.image}" class="item-image">
            <div class="item-actions">
                <button onclick="editAction('${code}')">Edit</button>
                <button onclick="deleteAction('${code}')">Delete</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// Object management
function saveObject() {
    const code = document.getElementById('edit-object-code').value.padStart(2, '0');
    const name = document.getElementById('edit-object-name').value;
    const image = document.getElementById('edit-object-image').value;
    
    if (!code || code < 0 || code > 99 || isNaN(code)) {
        alert("Please enter a valid code between 00 and 99");
        return;
    }
    
    if (!name) {
        alert("Please enter a name");
        return;
    }
    
    objects[code] = { name, image };
    saveData();
    refreshObjectList();
    clearObjectForm();
    
    if (document.getElementById('object-code').value === code) {
        loadObject();
    }
}

function clearObjectForm() {
    document.getElementById('edit-object-code').value = '';
    document.getElementById('edit-object-name').value = '';
    document.getElementById('edit-object-image').value = '';
}

function editObject(code) {
    const object = objects[code];
    document.getElementById('edit-object-code').value = code;
    document.getElementById('edit-object-name').value = object.name;
    document.getElementById('edit-object-image').value = object.image;
}

function deleteObject(code) {
    if (confirm(`Are you sure you want to delete object ${code}?`)) {
        delete objects[code];
        saveData();
        refreshObjectList();
        
        if (document.getElementById('object-code').value === code) {
            document.getElementById('object-code').value = '';
            document.getElementById('object-img').src = '';
            document.getElementById('object-name').textContent = '';
        }
    }
}

function refreshObjectList() {
    const list = document.getElementById('object-list');
    list.innerHTML = '';
    
    const codes = Object.keys(objects).sort();
    
    if (codes.length === 0) {
        list.innerHTML = '<p>No objects saved yet.</p>';
        return;
    }
    
    codes.forEach(code => {
        const object = objects[code];
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
            <div class="item-code">${code}</div>
            <div class="item-name">${object.name}</div>
            <img src="${object.image}" class="item-image">
            <div class="item-actions">
                <button onclick="editObject('${code}')">Edit</button>
                <button onclick="deleteObject('${code}')">Delete</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// Birthday functions
function saveBirthday() {
    const name = document.getElementById('birthday-name').value;
    const day = document.getElementById('birthday-day').value.padStart(2, '0');
    const month = document.getElementById('birthday-month').value.padStart(2, '0');
    const image = document.getElementById('birthday-image').value;
    
    if (!name) {
        alert("Please enter a name");
        return;
    }
    
    if (!day || day < 1 || day > 31) {
        alert("Please enter a valid day (1-31)");
        return;
    }
    
    if (!month || month < 1 || month > 12) {
        alert("Please enter a valid month (1-12)");
        return;
    }
    
    const id = `${name}-${day}-${month}`;
    birthdays[id] = { name, day, month, image };
    saveData();
    refreshBirthdayList();
    
    // Clear form
    document.getElementById('birthday-name').value = '';
    document.getElementById('birthday-day').value = '';
    document.getElementById('birthday-month').value = '';
    document.getElementById('birthday-image').value = '';
}

function refreshBirthdayList() {
    const list = document.getElementById('birthday-list');
    list.innerHTML = '';
    
    const birthdayIds = Object.keys(birthdays);
    
    if (birthdayIds.length === 0) {
        list.innerHTML = '<p>No birthdays saved yet.</p>';
        return;
    }
    
    birthdayIds.forEach(id => {
        const birthday = birthdays[id];
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
            <div class="item-name">${birthday.name}</div>
            <div class="item-date">${birthday.day}/${birthday.month}</div>
            <img src="${birthday.image || 'https://via.placeholder.com/100x100?text=No+Image'}" class="item-image">
            <div class="item-actions">
                <button onclick="generateBirthdayStoryFromSaved('${id}')">Generate Story</button>
                <button onclick="deleteBirthday('${id}')">Delete</button>
            </div>
        `;
        list.appendChild(item);
    });
}

function deleteBirthday(id) {
    if (confirm(`Are you sure you want to delete ${birthdays[id].name}'s birthday?`)) {
        delete birthdays[id];
        saveData();
        refreshBirthdayList();
    }
}

function generateBirthdayStory() {
    const day = document.getElementById('birthday-day').value.padStart(2, '0');
    const month = document.getElementById('birthday-month').value.padStart(2, '0');
    
    if (!day || !month) {
        alert("Please enter both day and month");
        return;
    }
    
    generateBirthdayStoryFromDate(day, month);
}

function generateBirthdayStoryFromSaved(id) {
    const birthday = birthdays[id];
    generateBirthdayStoryFromDate(birthday.day, birthday.month);
}

function generateBirthdayStoryFromDate(day, month) {
    // Get PAO components
    const dayPerson = characters[day] ? {
        name: characters[day].name,
        image: characters[day].image
    } : {
        name: `Person ${day}`,
        image: ''
    };
    
    const monthAction = actions[month] ? {
        name: actions[month].name,
        image: actions[month].image
    } : {
        name: `Action ${month}`,
        image: ''
    };

    // Create story elements array for cards
    const storyElements = [
        {
            type: "Person",
            pair: day,
            name: dayPerson.name,
            image: dayPerson.image
        },
        {
            type: "Action",
            pair: month,
            name: monthAction.name,
            image: monthAction.image
        }
    ];

    // Generate simple story text
    const story = `${dayPerson.name} ${monthAction.name}`;
    
    document.getElementById('generated-birthday-story').textContent = story;
    document.getElementById('generated-birthday-story').dataset.storyElements = JSON.stringify(storyElements);
    document.getElementById('birthday-story-container').style.display = 'block';
    document.getElementById('birthday-story-cards').style.display = 'none';
}

// Historical Date functions
function saveHistoricalDate() {
    const name = document.getElementById('event-name').value;
    const day = document.getElementById('event-day').value.padStart(2, '0');
    const month = document.getElementById('event-month').value.padStart(2, '0');
    const year = document.getElementById('event-year').value;
    const image = document.getElementById('event-image').value;
    
    if (!name) {
        alert("Please enter an event name");
        return;
    }
    
    if (!day || day < 1 || day > 31) {
        alert("Please enter a valid day (1-31)");
        return;
    }
    
    if (!month || month < 1 || month > 12) {
        alert("Please enter a valid month (1-12)");
        return;
    }
    
    if (!year || year < 1000 || year > 9999) {
        alert("Please enter a valid year (1000-9999)");
        return;
    }
    
    const id = `${name}-${day}-${month}-${year}`;
    historicalDates[id] = { name, day, month, year, image };
    saveData();
    refreshHistoricalDateList();
    
    // Clear form
    document.getElementById('event-name').value = '';
    document.getElementById('event-day').value = '';
    document.getElementById('event-month').value = '';
    document.getElementById('event-year').value = '';
    document.getElementById('event-image').value = '';
}

function refreshHistoricalDateList() {
    const list = document.getElementById('historical-date-list');
    list.innerHTML = '';
    
    const dateIds = Object.keys(historicalDates);
    
    if (dateIds.length === 0) {
        list.innerHTML = '<p>No historical dates saved yet.</p>';
        return;
    }
    
    dateIds.forEach(id => {
        const date = historicalDates[id];
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
            <div class="item-name">${date.name}</div>
            <div class="item-date">${date.day}/${date.month}/${date.year}</div>
            <img src="${date.image || 'https://via.placeholder.com/100x100?text=No+Image'}" class="item-image">
            <div class="item-actions">
                <button onclick="generateHistoricalDateStoryFromSaved('${id}')">Generate Story</button>
                <button onclick="deleteHistoricalDate('${id}')">Delete</button>
            </div>
        `;
        list.appendChild(item);
    });
}

function deleteHistoricalDate(id) {
    if (confirm(`Are you sure you want to delete ${historicalDates[id].name}?`)) {
        delete historicalDates[id];
        saveData();
        refreshHistoricalDateList();
    }
}

function generateHistoricalDateStory() {
    const day = document.getElementById('event-day').value.padStart(2, '0');
    const month = document.getElementById('event-month').value.padStart(2, '0');
    const year = document.getElementById('event-year').value;
    
    if (!day || !month || !year) {
        alert("Please enter day, month, and year");
        return;
    }
    
    generateHistoricalDateStoryFromDate(day, month, year);
}

function generateHistoricalDateStoryFromSaved(id) {
    const date = historicalDates[id];
    generateHistoricalDateStoryFromDate(date.day, date.month, date.year);
}

function generateHistoricalDateStoryFromDate(day, month, year) {
    // Split year into two 2-digit parts
    const yearPart1 = year.substring(0, 2);
    const yearPart2 = year.substring(2, 4);
    
    // Get PAO components
    const dayPerson = characters[day] ? {
        name: characters[day].name,
        image: characters[day].image
    } : {
        name: `Person ${day}`,
        image: ''
    };
    
    const monthAction = actions[month] ? {
        name: actions[month].name,
        image: actions[month].image
    } : {
        name: `Action ${month}`,
        image: ''
    };
    
    const year1Person = characters[yearPart1] ? {
        name: characters[yearPart1].name,
        image: characters[yearPart1].image
    } : {
        name: `Person ${yearPart1}`,
        image: ''
    };
    
    const year2Action = actions[yearPart2] ? {
        name: actions[yearPart2].name,
        image: actions[yearPart2].image
    } : {
        name: `Action ${yearPart2}`,
        image: ''
    };

    // Create story elements array for cards
    const storyElements = [
        {
            type: "Person",
            pair: day,
            name: dayPerson.name,
            image: dayPerson.image
        },
        {
            type: "Action",
            pair: month,
            name: monthAction.name,
            image: monthAction.image
        },
        {
            type: "Person",
            pair: yearPart1,
            name: year1Person.name,
            image: year1Person.image
        },
        {
            type: "Action",
            pair: yearPart2,
            name: year2Action.name,
            image: year2Action.image
        }
    ];

    // Generate story text
    const story = `${dayPerson.name} ${monthAction.name} ${year1Person.name} ${year2Action.name}`;
    
    document.getElementById('generated-historical-story').textContent = story;
    document.getElementById('generated-historical-story').dataset.storyElements = JSON.stringify(storyElements);
    document.getElementById('historical-story-container').style.display = 'block';
    document.getElementById('historical-story-cards').style.display = 'none';
}

// Show Birthday Story Cards (called when clicking the story text)
function showBirthdayStoryCards() {
    const storyElements = JSON.parse(document.getElementById('generated-birthday-story').dataset.storyElements);
    const container = document.getElementById('birthday-story-cards');
    container.innerHTML = '';
    
    const cardsRow = document.createElement('div');
    cardsRow.style.display = 'flex';
    cardsRow.style.flexWrap = 'wrap';
    cardsRow.style.gap = '15px';
    cardsRow.style.justifyContent = 'center';
    
    storyElements.forEach(element => {
        const card = document.createElement('div');
        card.className = 'mini-card';
        
        // Card header with type and pair
        const header = document.createElement('div');
        header.className = 'mini-card-header';
        header.textContent = `${element.type} (${element.pair})`;
        card.appendChild(header);
        
        // Card image
        const imgContainer = document.createElement('div');
        imgContainer.className = 'mini-card-image';
        const img = document.createElement('img');
        img.src = element.image || '';
        img.alt = element.name;
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);

        // Card filter
        const filterDiv = document.createElement('div');
        filterDiv.className = 'mini-card-filter';
        card.appendChild(filterDiv);
        
        // Card name
        const nameDiv = document.createElement('div');
        nameDiv.className = 'mini-card-name';
        nameDiv.textContent = element.name;
        card.appendChild(nameDiv);
        
        cardsRow.appendChild(card);
    });
    
    container.appendChild(cardsRow);
    container.style.display = 'flex';
}

// Show Historical Date Story Cards (called when clicking the story text)
function showHistoricalStoryCards() {
    const storyElements = JSON.parse(document.getElementById('generated-historical-story').dataset.storyElements);
    const container = document.getElementById('historical-story-cards');
    container.innerHTML = '';
    
    const cardsRow = document.createElement('div');
    cardsRow.style.display = 'flex';
    cardsRow.style.flexWrap = 'wrap';
    cardsRow.style.gap = '15px';
    cardsRow.style.justifyContent = 'center';
    
    storyElements.forEach(element => {
        const card = document.createElement('div');
        card.className = 'mini-card';
        
        // Card header with type and pair
        const header = document.createElement('div');
        header.className = 'mini-card-header';
        header.textContent = `${element.type} (${element.pair})`;
        card.appendChild(header);
        
        // Card image
        const imgContainer = document.createElement('div');
        imgContainer.className = 'mini-card-image';
        const img = document.createElement('img');
        img.src = element.image || '';
        img.alt = element.name;
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);

        // Card filter
        const filterDiv = document.createElement('div');
        filterDiv.className = 'mini-card-filter';
        card.appendChild(filterDiv);
        
        // Card name
        const nameDiv = document.createElement('div');
        nameDiv.className = 'mini-card-name';
        nameDiv.textContent = element.name;
        card.appendChild(nameDiv);
        
        cardsRow.appendChild(card);
    });
    
    container.appendChild(cardsRow);
    container.style.display = 'flex';
}


// Data export/import
function exportData() {
    const data = {
        characters,
        actions,
        objects,
        birthdays,
        historicalDates,
        version: '1.0',
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportName = 'pao-system-data_' + new Date().toISOString().slice(0,10) + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
}

function importData() {
    const fileInput = document.getElementById('import-file');
    const file = fileInput.files[0];
    
    if (!file) {
        document.getElementById('import-status').textContent = "Please select a file first";
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (!data.characters || !data.actions || !data.objects) {
                throw new Error("Invalid PAO system data format");
            }
            
            if (confirm("This will overwrite your current data. Continue?")) {
                characters = data.characters || {};
                actions = data.actions || {};
                objects = data.objects || {};
                birthdays = data.birthdays || {};
                historicalDates = data.historicalDates || {};
                
                saveData();
                refreshLists();
                document.getElementById('import-status').textContent = "Data imported successfully!";
                fileInput.value = '';
                
                // Reload the currently displayed items if they exist
                const charCode = document.getElementById('character-code').value;
                const actionCode = document.getElementById('action-code').value;
                const objectCode = document.getElementById('object-code').value;
                
                if (charCode) loadCharacter();
                if (actionCode) loadAction();
                if (objectCode) loadObject();
            }
        } catch (error) {
            document.getElementById('import-status').textContent = "Error importing data: " + error.message;
        }
    };
    reader.readAsText(file);
}

function resetData() {
    if (confirm("Are you sure you want to reset ALL data? This cannot be undone!")) {
        characters = DEFAULT_ITEMS.characters;
        actions = DEFAULT_ITEMS.actions;
        objects = DEFAULT_ITEMS.objects;
        birthdays = DEFAULT_ITEMS.birthdays;
        historicalDates = DEFAULT_ITEMS.historicalDates;
        
        saveData();
        refreshLists();
        loadDefaultItems();
        alert("All data has been reset to defaults");
    }
}

// Handle image uploads
function setupImageUploads() {
    // Character image upload
    document.getElementById('edit-character-image-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('edit-character-image').value = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Action image upload
    document.getElementById('edit-action-image-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('edit-action-image').value = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Object image upload
    document.getElementById('edit-object-image-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('edit-object-image').value = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Birthday image upload
    document.getElementById('birthday-image-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('birthday-image').value = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Historical date image upload
    document.getElementById('event-image-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('event-image').value = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Phone number story functions
function generateStory() {
    const phoneNumber = document.getElementById('phone-number').value.replace(/\D/g, '');
    
    if (phoneNumber.length < 2) {
        alert("Please enter a valid phone number with at least 2 digits");
        return;
    }
    
    // Split into pairs
    const pairs = [];
    for (let i = 0; i < phoneNumber.length; i += 2) {
        const pair = phoneNumber.substr(i, 2);
        pairs.push(pair);
    }
    
    // Generate story alternating between Person, Action, Object
    let story = "";
    const storyElements = [];
    let typeIndex = 0; // 0=Person, 1=Action, 2=Object
    
    pairs.forEach(pair => {
        let element, type;
        
        if (typeIndex === 0) {
            // Person
            element = characters[pair] ? characters[pair].name : `Person ${pair}`;
            type = "Person";
            storyElements.push({
                pair,
                type,
                name: element,
                image: characters[pair] ? characters[pair].image : '',
                fullInfo: {
                    person: characters[pair] ? characters[pair].name : `Person ${pair}`,
                    action: actions[pair] ? actions[pair].name : `Action ${pair}`,
                    object: objects[pair] ? objects[pair].name : `Object ${pair}`
                }
            });
        } else if (typeIndex === 1) {
            // Action
            element = actions[pair] ? actions[pair].name : `Action ${pair}`;
            type = "Action";
            storyElements.push({
                pair,
                type,
                name: element,
                image: actions[pair] ? actions[pair].image : '',
                fullInfo: {
                    person: characters[pair] ? characters[pair].name : `Person ${pair}`,
                    action: actions[pair] ? actions[pair].name : `Action ${pair}`,
                    object: objects[pair] ? objects[pair].name : `Object ${pair}`
                }
            });
        } else {
            // Object
            element = objects[pair] ? objects[pair].name : `Object ${pair}`;
            type = "Object";
            storyElements.push({
                pair,
                type,
                name: element,
                image: objects[pair] ? objects[pair].image : '',
                fullInfo: {
                    person: characters[pair] ? characters[pair].name : `Person ${pair}`,
                    action: actions[pair] ? actions[pair].name : `Action ${pair}`,
                    object: objects[pair] ? objects[pair].name : `Object ${pair}`
                }
            });
        }
        
        story += `${element}. `;
        typeIndex = (typeIndex + 1) % 3; // Cycle through 0,1,2
    });
    
    document.getElementById('generated-story').textContent = story;
    document.getElementById('generated-story').dataset.storyElements = JSON.stringify(storyElements);
    document.getElementById('story-container').style.display = 'block';
    document.getElementById('story-cards').style.display = 'none';
}

function showStoryCards() {
    const storyElements = JSON.parse(document.getElementById('generated-story').dataset.storyElements);
    const container = document.getElementById('story-cards');
    container.innerHTML = '';
    
    // Create a row for all cards
    const cardsRow = document.createElement('div');
    cardsRow.style.display = 'flex';
    cardsRow.style.flexWrap = 'wrap';
    cardsRow.style.gap = '15px';
    cardsRow.style.justifyContent = 'center';
    
    storyElements.forEach(element => {
        const card = document.createElement('div');
        card.className = 'mini-card';
        
        // Card header with type and pair
        const header = document.createElement('div');
        header.className = 'mini-card-header';
        header.textContent = `${element.type} (${element.pair})`;
        card.appendChild(header);
        
        // Card image
        const imgContainer = document.createElement('div');
        imgContainer.className = 'mini-card-image';
        
        const img = document.createElement('img');
        img.src = element.image || '';
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);

        // Card filter
        const filterDiv = document.createElement('div');
        filterDiv.className = 'mini-card-filter';
        card.appendChild(filterDiv);
        
        // Card name
        const nameDiv = document.createElement('div');
        nameDiv.className = 'mini-card-name';
        nameDiv.textContent = element.name;
        card.appendChild(nameDiv);
        
        // Add hover effect to show full PAO info
        card.addEventListener('mouseover', function() {
            nameDiv.textContent = `${element.fullInfo.person} ${element.fullInfo.action} ${element.fullInfo.object}`;
        });
        
        card.addEventListener('mouseout', function() {
            nameDiv.textContent = element.name;
        });
        
        cardsRow.appendChild(card);
    });
    
    container.appendChild(cardsRow);
    container.style.display = 'flex';
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
    
    // Store preference in localStorage
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// Check for saved sidebar state on load
window.addEventListener('load', function() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        document.querySelector('.sidebar').classList.add('collapsed');
    }
});

function refreshLists() {
    refreshCharacterList();
    refreshActionList();
    refreshObjectList();
    refreshBirthdayList();
    refreshHistoricalDateList();
}

// Initialize the app
// Initialize the app
window.onload = function() {
    loadData();
    setupImageUploads();
    
    // Set up auto-load when numbers are entered
    document.getElementById('character-code').addEventListener('input', function() {
        if (this.value.length === 2) {
            loadCharacter();
        }
    });
    
    document.getElementById('action-code').addEventListener('input', function() {
        if (this.value.length === 2) {
            loadAction();
        }
    });
    
    document.getElementById('object-code').addEventListener('input', function() {
        if (this.value.length === 2) {
            loadObject();
        }
    });

    // Add these new event listeners for story cards
    document.getElementById('generated-birthday-story').addEventListener('click', showBirthdayStoryCards);
    document.getElementById('generated-historical-story').addEventListener('click', showHistoricalStoryCards);
    
    // Check for saved sidebar state
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        document.querySelector('.sidebar').classList.add('collapsed');
    }
};