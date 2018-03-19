class ViewModel{
    constructor(){
        this.listItems = [];
        this.itemKey = "todo-items";
        this.load();
        this.todoChangedEventHandler = this.todoChanged.bind(this);
        document.addEventListener(Todo.todoEventName, this.todoChangedEventHandler, false);
    }

    dispose(){
        document.removeEventListener(Todo.todoEventName, this.todoChangedEventHandler);
        delete this.todoChangedEventHandler;
    }

    load() {
        const items = JSON.parse(localStorage.getItem(this.itemKey));
        if (items !== null) {
            items.forEach(item => {
                this.newTodo(item._description, item._completed);
            });
        };
    }

    filter(value){
        return (value == undefined || value == '') ? 
            Array.from(this.listItems) : this.listItems.filter(item => item.description.toLowerCase().search(value.toLowerCase())>=0);
    }

    todoChanged(){
        this.save();
    }

    save(){
        console.info('Saving to do list to local storage');
        localStorage[this.itemKey] = JSON.stringify(this.listItems);
    }

    newTodo(description, completed = false){
        const todo = new Todo(description, completed);
        this.listItems.push(todo);
        return todo;
    }

    removeTodo(item){
        removeItemFromArray(this.listItems, item);
    }
}

class Todo{
    constructor(description, completed = false){
        this._description = description;
        this._completed = completed;
    }

    get description(){
        return this._description;
    }

    set description(value) {
        this._description = value;
        this.propertyChanged('description');
    }

    get completed() {
        return this._completed;
    }

    set completed(value) {
        this._completed = value;
        this.propertyChanged('completed');
    }

    propertyChanged(propertyName){
        console.info('Property changed: ' + propertyName);
        document.dispatchEvent(new CustomEvent(Todo.todoEventName, {bubbles: true, detail: {obj: this, propertyName: propertyName}}));
    }

    static todoEventName(){
        return 'todoChanged';
    }
}