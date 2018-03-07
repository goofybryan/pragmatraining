
class todo {
    constructor(id, description, status = false) {
        this.setId(id);
        this.setDescription(description);
        this.setStatus(status);
    }

    getId(){
        return this.id;
    }

    setId(value){
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