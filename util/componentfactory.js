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

    static createRoomPanel(room, listenerStorage) {
        const roomPanel = document.createElement('div');
        roomPanel.classList.add('row');
        roomPanel.id = 'room-panel';

        const detailPanel = new RoomDetailPanelBuilder()
            .withName(room.name)
            .withShortname(room.shortname)
            .withAvailable(room.available)
            .withAddress(room.address)
            .withMaxPersons(room.maxpersons)
            .withPrice(room.price)
            .build();
        detailPanel.classList.add('col-12', 'col-md-6', 'mb-2');
        roomPanel.appendChild(detailPanel);

        const mapElement = document.createElement('div');
        mapElement.id = 'map';
        mapElement.classList.add('col-12', 'col-md-6', 'mb-2');
        roomPanel.appendChild(mapElement);
        listenerStorage.storeComponentInit(() => ComponentFactory._initMap(room.lat, room.lon));

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

    static createOutlinePrimaryButton(id, caption) {
        const button = document.createElement('button');
        button.type = "button";
        button.className = "btn btn-outline-primary";
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

    static createSuccessBadge(caption) {
        const badge = document.createElement('span');
        badge.className = "badge badge-success";
        badge.innerHTML = caption;
        return badge;
    }

    static _initMap(lat, lon) {
        const map = L.map('map').setView([lat, lon], 17);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiYmFsZHJpYW4iLCJhIjoiY2tqZWcwbmYxMmtzZDJ1bXRydnR6c3lsZyJ9.EHYZtCxET1MGmNMsyuunKg'
        }).addTo(map);
        const marker = L.marker([lat, lon]).addTo(map);
    }

}