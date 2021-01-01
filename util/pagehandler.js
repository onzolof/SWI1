class PageHandler {

    static showOverview() {
        const listenerStorage = new ListenerStorage();
        const breadcrumb = new BreadCrumbBuilder()
            .withActiveItem(UEBERSICHT)
            .build();
        const storeListener = (id, room) => listenerStorage.storeClickListener(id, () => PageHandler.showRoom(room));
        RestClient.loadRooms(rooms => {
        const content = ComponentFactory.createCardPanel(rooms, storeListener);
        PageHandler.updatePage(RAUMRESERVIERUNG, breadcrumb, content, listenerStorage);
        });
    }

    static showRoom(room) {
        const listenerStorage = new ListenerStorage();
        const overviewPageLinkId = 'go-to-overview';

        const bookButtonId = "booking-button";
        listenerStorage.storeClickListener(bookButtonId, () => PageHandler.showBooking(room));
        const bookButton = ComponentFactory.createOutlinePrimaryButton(bookButtonId, RESERVIEREN);

        const breadcrumb = new BreadCrumbBuilder()
            .withNonActiveItem(overviewPageLinkId, UEBERSICHT)
            .withActiveItem(RAUMINFORMATIONEN)
            .withHeaderButton(bookButton)
            .build();

        listenerStorage.storeClickListener(overviewPageLinkId, PageHandler.showOverview);
        const content = ComponentFactory.createRoomPanel(room, listenerStorage);
        PageHandler.updatePage(RAUMRESERVIERUNG, breadcrumb, content, listenerStorage);
    }

    static showBooking(room) {
        const listenerStorage = new ListenerStorage();
        const overviewPageLinkId = 'go-to-overview';
        const roomPageLinkId = 'go-to-room';
        const breadcrumb = new BreadCrumbBuilder()
            .withNonActiveItem(overviewPageLinkId, UEBERSICHT)
            .withNonActiveItem(roomPageLinkId, RAUMINFORMATIONEN)
            .withActiveItem(RESERVIEREN)
            .build();
        listenerStorage.storeClickListener(overviewPageLinkId, PageHandler.showOverview);
        listenerStorage.storeClickListener(roomPageLinkId, () => PageHandler.showRoom(room));
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

    storeComponentInit(initComponent){
        this._listeners.push(initComponent);
    }

    applyListeners() {
        this._listeners.forEach(listener => listener())
    }


}