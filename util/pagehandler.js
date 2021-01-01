class PageHandler {

    static navigateToOverview() {
        const listenerStorage = new ListenerStorage();
        const breadcrumb = new BreadCrumbBuilder()
            .withActiveItem(UEBERSICHT)
            .build();
        const storeListener = (id, room) => listenerStorage.storeClickListener(id, () => PageHandler.navigateToRoom(room));
        const content = ComponentFactory.createCardPanel(RestClient.getRooms(), storeListener);
        PageHandler.updatePage(RAUMRESERVIERUNG, breadcrumb, content, listenerStorage);
    }

    static navigateToRoom(room) {
        const listenerStorage = new ListenerStorage();
        const overviewPageLinkId = 'go-to-overview';
        const breadcrumb = new BreadCrumbBuilder()
            .withNonActiveItem(overviewPageLinkId, UEBERSICHT)
            .withActiveItem(RAUMINFORMATIONEN)
            .build();
        listenerStorage.storeClickListener(overviewPageLinkId, PageHandler.navigateToOverview);
        const storeListener = id => listenerStorage.storeClickListener(id, () => PageHandler.navigateToBooking(room));
        const content = ComponentFactory.createRoomPanel(room, storeListener);
        PageHandler.updatePage(RAUMRESERVIERUNG, breadcrumb, content, listenerStorage);
    }

    static navigateToBooking(room) {
        const listenerStorage = new ListenerStorage();
        const overviewPageLinkId = 'go-to-overview';
        const roomPageLinkId = 'go-to-room';
        const breadcrumb = new BreadCrumbBuilder()
            .withNonActiveItem(overviewPageLinkId, UEBERSICHT)
            .withNonActiveItem(roomPageLinkId, RAUMINFORMATIONEN)
            .withActiveItem(RESERVIEREN)
            .build();
        listenerStorage.storeClickListener(overviewPageLinkId, PageHandler.navigateToOverview);
        listenerStorage.storeClickListener(roomPageLinkId, () => PageHandler.navigateToRoom(room));
        const content = ComponentFactory.createBookingPanel(room);
        PageHandler.updatePage(RAUMRESERVIERUNG, breadcrumb, content, listenerStorage);
    }

    static updatePage(title, breadcrumb, content, listenerStorage) {
        const body = document.createElement('div');

        body.classList.add('container');

        if (title != null) {
            body.append(ComponentFactory.createTitle(title))
        }

        if (breadcrumb != null) {
            body.append(breadcrumb);
        }

        if (content != null) {
            body.append(content);
        }

        document.body.innerHTML = body.outerHTML;

        listenerStorage.applyListeners();
    }

}

class ListenerStorage {

    constructor() {
        this._listeners = [];
    }

    storeClickListener(id, onClick) {
        this._listeners.push(() => document.getElementById(id).addEventListener('click', onClick));
    }

    applyListeners() {
        this._listeners.forEach(listener => listener())
    }

}