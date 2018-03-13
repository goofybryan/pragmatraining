
class Todo {
    constructor(id, description, status = false) {
        this.setId(id);
        this.setDescription(description);
        this.setStatus(status);
    }

    getId() {
        return this.id;
    }

    setId(value) {
        this.id = value;
    }
    getDescription() {
        return this.description;
    }

    setDescription(value) {
        this.description = value;
    }

    getStatus() {
        return this.status;
    }

    setStatus(value) {
        this.status = value;
    }
}

class ViewModel {
    constructor() {
        this.isDeleting = false;
        this.itemMap = new Map();
    }

    getIsDeleting() {
        return this.isDeleting;
    }

    setIsDeleting(value) {
        this.isDeleting = value;
    }

    getListItem(id) {
        return this.itemMap.get(id);
    }

    getIdByListItem(li) {
        for (let [key, value] of this.itemMap.entries()) {
            if (value == li){
                return key;
            }
        }
    }

    setListItem(id, value) {
        this.itemMap.set(id, value);
    }
}


const listItems = [];
const viewModel = new ViewModel();
let searchItems = [];
let selectedItems = [];
const itemKey = "todo-items";
let listElement;
let itemTemplate;
let defaultHeader;
let addHeader;
let addTodoButton;
let addTodoText;
let deleteTodoButton;
let inputTodoSearch;

async function init() {
    listElement = document.getElementById('todo-list');
    defaultHeader = document.getElementById('defaultHeader');
    addHeader = document.getElementById('addHeader');
    addTodoButton = document.getElementById('addTodoButton');
    addTodoText = document.getElementById('addTodoText');
    deleteTodoButton = document.getElementById('deleteTodoButton');
    inputTodoSearch = document.getElementById('inputTodoSearch');

    //await loadData();
    //await displayData();
}

window.onload = function () {
    init();
};

async function loadData() {
    items = JSON.parse(localStorage.getItem(itemKey));
    if (items !== null) {
        items.forEach(async element => {
            listItems.push(new Todo(listItems.length + 1, element.description, element.status));
        });
    };
}

function saveItem(value) {
    if (listItems.includes(value) === false) {
        listItems.push(value);
    }
    saveStorage();
}

function saveStorage() {
    localStorage[itemKey] = JSON.stringify(listItems, (key, value) => {
        if (key == "id")
            return undefined;
        return value;
    });
}

async function displayData() {
    if (listItems.length > 0) {
        searchItems = Array.from(listItems);
    }
    displayTodoItems();
}

function displayTodoItems() {
    while (listElement.firstChild) {
        listElement.removeChild(listElement.firstChild);
    }

    const comparer = new Intl.Collator();
    searchItems.sort((a, b) => comparer.compare(a.getDescription(), b.getDescription()));
    searchItems.forEach(item => {
        addTodoItem(item);
    });
}

async function addTodoItem(item) {
    const template = document.importNode(itemTemplate.content, true);
    const li = template.querySelector("li");
    const div = li.querySelector("div");
    const input = li.querySelector("input");

    div.dataset.title = item.getDescription();
    input.checked = item.getStatus();
    addTodoEventListeners(div, input);
    
    listElement.appendChild(template);
    viewModel.setListItem(item.getId(), li);
}

function addTodoEventListeners(item, status) {
    console.info('adding event listener for click');
    item.addEventListener('click', itemSelected, false);
    status.addEventListener('click', statusChanged, false);
}

function removeTodoEventListeners(item, status) {
    console.info('removing event listener for click');
    item.removeEventListener('click', itemSelected, false);
    status.removeEventListener('click', statusChanged, false);
}

function removeItemFromArray(array, item, index = undefined) {
    if (array.length == 0)
        return;

    if (!index) {
        index = array.indexOf(item);
    }

    if (index < 0) {
        return;
    }

    array.splice(index, 1);
}

async function statusChanged(event) {
    const changed = event.target;
    const id = viewModel.getIdByListItem(changed.parentNode);
    const statusItem = listItems.find(item => item.getId() == id);
    statusItem.setStatus(changed.checked);
    saveItem(statusItem);
}

async function itemSelected(event) {
    updateSelectedItems(event.target, event.shiftKey);
    deleteTodoButton.disabled = selectedItems.length == 0;
}

//TODO: Optimize perhaps, also check multiselect then back to single select, already must stay slected if selected.
function updateSelectedItems(selectedDiv, isMultiSelect) {
    const index = selectedItems.indexOf(selectedDiv);

    if (!isMultiSelect) {
        clearSelected();
    }

    if (index != -1) {
        removeItemFromArray(selectedItems, selectedDiv, index);
        selectedDiv.dataset.selected = false;
        return;
    }

    selectedItems.push(selectedDiv);
    selectedDiv.dataset.selected = true;

    return;
}

function textAcceptEvents(event) {
    if (event.defaultPrevented) {
        return; // Should do nothing if the default action has been cancelled
    }
    let handled = false;

    const key = event.keyCode;

    switch (key) {
        case 0x0d:
            handled = true;
            saveNewTodo();
            break;
        case 0x1b:
            handled = true;
            cancelTodoAdd();
            break;
    }

    if (handled) {
        event.preventDefault();
    }
}

function textChanged(event) {
    const textControl = event.target;
    const textValue = textControl.value;

    addTodoButton.disabled = !textValue || textValue.trim().length == 0;
}

function clearSelected() {
    selectedItems.forEach(item => {
        item.dataset.selected = false;
    });
    selectedItems = new Array();
    deleteTodoButton.disabled = true;
}

async function addNewTodo() {
    if (viewModel.getIsDeleting()) {
        setDeletionMode(false);
        return;
    }

    displayHeader(false);
    addTodoText.focus();
}

async function deleteTodo() {
    if (selectedItems.length == 0) {
        return;
    }

    if (viewModel.getIsDeleting()) {
        setDeletionMode(false);
        deleteSelectedItems();
        return;
    }

    setDeletionMode(true);
}

function setDeletionMode(isDeleting) {
    viewModel.setIsDeleting(isDeleting);
    defaultHeader.dataset.isDeleting = isDeleting;
}

function deleteSelectedItems() {
    selectedItems.forEach(item => {
        removeTodoListElement(item);
    });
    saveStorage();
    clearSelected();
}

function removeTodoListElement(item) {
    const parent = item.parentNode;
    listElement.removeChild(parent);
    const input = parent.querySelector("input");
    removeTodoEventListeners(item, input);
    removeTodo(viewModel.getIdByListItem(parent));
}

function removeTodo(id) {
    const item = findItemById(id);
    removeItemFromArray(searchItems, item);
    removeItemFromArray(listItems, item);
}

function findItemById(id) {
    const item = listItems.find(i => {
        return id == i.getId();
    });

    return item;
}

async function cancelTodoAdd() {
    displayHeader(true);
    clearNewText();
}

function clearNewText() {
    addTodoText.value = '';
}

function displayHeader(showDefault) {
    defaultHeader.dataset.display = showDefault;
    addHeader.dataset.display = !showDefault;
    inputTodoSearch.focus();
}

async function saveNewTodo() {
    const todoText = addTodoText.value;
    if (todoText == undefined || todoText == "") {
        return;
    }
    const t = new Todo(listItems.length + 1, todoText);

    saveItem(t);
    searchItems.push(t);
    //TODO: see if we cannot focus element.
    displayTodoItems();
    clearNewText();
    scrollTodoIntoView(t.getId());

}

function scrollTodoIntoView(id) {
    const item = viewModel.getListItem(id);

    if (item) {
        item.scrollIntoView();
    }
}
async function search(event){
    const value = event.target.value;

    searchItems = (value == undefined || value == '') ?
        Array.from(listItems) :
        listItems.filter(item => item.getDescription().toLowerCase().search(value.toLowerCase())>=0);
    
    displayTodoItems();
}