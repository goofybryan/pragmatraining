import {menuItems, quickItems} from './menu-items';
import {isMobile} from "pragma-views";

export class App {
    router = null;

    constructor() {
        this.menuItems = menuItems;
        this.quickItems = quickItems;
    }

    configureRouter(config, router) {
        config.title = 'Application Title';
        config.map([
            { route: ['', 'welcome'], name: 'welcome', moduleId: 'views/welcome/welcome', nav: true, title: 'Welcome' },
            { route: ["crud"], name: 'crud', moduleId: 'views/crud-example/crud-example', nav: true, title: 'Crud' },
        ]);

        this.router = router;
    }

    attached() {
        if (isMobile()) {
            this.closeAssistant();
        }
    }

    closeAssistant() {
        this.assistant.au["assistant"].viewModel.isOpen = false;
    }
}