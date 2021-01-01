class ComponentFactory {

    static createTitle(text) {
        const title = document.createElement('h1');
        title.classList.add('pb-2');
        title.id = 'title';
        title.innerHTML = text;
        return title;
    }

    static createSubtitle(text) {
        const subtitle = document.createElement('h4');
        subtitle.id = 'subtitle';
        subtitle.innerHTML = text;
        return subtitle;
    }

    static createCardPanel(rooms, storeClickListener) {
        const cardPanel = document.createElement('div');
        cardPanel.classList.add('row');
        cardPanel.id = 'card-panel';
        rooms.map(room => {
            const elementId = 'card-' + room.id;
            storeClickListener(elementId, room);
            return new CardBuilder()
                .withId(elementId)
                .withTitle(room.name)
                .withSubtitle(room.shortname)
                .withAddress(room.address)
                .withMaxPersons(room.maxpersons)
                .isAvailable(room.available)
                .build();
        }).forEach(element => cardPanel.appendChild(element));
        return cardPanel;
    }

    static createRoomPanel(room) {
        const roomPanel = document.createElement('div');
        roomPanel.id = 'room-panel';

        const detailPanel = new RoomDetailPanelBuilder()
            .build();
        roomPanel.appendChild(detailPanel);

        return roomPanel;
    }

    static createBookingPanel(room) {
        const bookingPanel = document.createElement('div');
        bookingPanel.id = 'booking-panel';
        const dummyElement = document.createElement('p');
        dummyElement.innerHTML = 'book room with id ' + room.id;
        bookingPanel.appendChild(dummyElement);
        return bookingPanel;
    }

    static createPrimaryButtonElement(id, caption) {
        const button = document.createElement('button');
        button.type = "button";
        button.className = "btn btn-primary";
        button.id = id;
        button.innerHTML = caption;
        return button;
    }

    static createWarningBadge(caption) {
        const badge = document.createElement('span');
        badge.className = "badge badge-warning";
        badge.innerHTML = caption;
        return badge;
    }

}