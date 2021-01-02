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

    static createOverviewPanel(rooms, storeClickListener) {
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
        detailPanel.classList.add('col-12', 'col-md-6');
        roomPanel.appendChild(detailPanel);

        const mapElement = document.createElement('div');
        mapElement.id = 'map';
        mapElement.classList.add('col-12', 'col-md-6');
        roomPanel.appendChild(mapElement);
        listenerStorage.storeComponentInit(() => ComponentFactory._initMap(room.lat, room.lon));

        const bookingsPanel = ComponentFactory.createBookingsPanel(room.id, listenerStorage);
        bookingsPanel.classList.add('col-12', 'mt-4');
        roomPanel.appendChild(bookingsPanel);

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

    static createBookingsPanel(roomId, listenerStorage) {
        const bookingsPanel = document.createElement('div');
        bookingsPanel.id = 'bookings-panel';

        const selector = ComponentFactory.createDurationSelector();
        const durationEntry = ComponentFactory.createEntry('Betrachtungszeitraum', selector);
        durationEntry.classList.add('mb-3');
        bookingsPanel.appendChild(durationEntry);

        const bookingsTableContainer = document.createElement('div');
        const idTableContainer = 'bookings-table-container';
        bookingsTableContainer.id = idTableContainer;
        bookingsPanel.appendChild(bookingsTableContainer);

        const showBookings = (start, end) => {
            RestClient.loadBookings(roomId, start, end, bookings => {
                document.getElementById(idTableContainer).innerHTML = ComponentFactory.createBookingsTable(bookings).outerHTML;
            });
        }

        listenerStorage.storeComponentInit(() => ComponentFactory._initDurationSelection(showBookings))

        listenerStorage.storeComponentInit(() => {
            const start = moment().add(-100, 'day');
            const end = moment();
            showBookings(start, end);
            $('input[name="datefilter"]').val(start.format(DATE_FORMAT_HUMAN) + ' - ' + end.format(DATE_FORMAT_HUMAN));
        });

        return bookingsPanel;
    }

    static createDurationSelector() {
        const durationEntry = document.createElement('input');

        durationEntry.id = 'duration-entry';
        durationEntry.classList.add('form-control');
        durationEntry.setAttribute('type', 'text');
        durationEntry.setAttribute('name', 'datefilter');
        durationEntry.setAttribute('placeholder', 'Wählen Sie eine Zeitspanne');

        return durationEntry;
    }

    static createBookingsTable(bookings) {
        const table = document.createElement('table');
        table.classList.add('table', 'table-striped');

        const header = ComponentFactory._createHeaderForBookingsTable();
        table.appendChild(header)

        const body = document.createElement('tbody')

        bookings.forEach(booking => {
            const row = ComponentFactory._createRowForBookingTable(booking);
            body.appendChild(row);
        })

        table.appendChild(body);

        return table;
    }

    static createEntry(caption, editor) {
        const row = document.createElement('div');
        row.classList.add('row', 'no-gutters');

        const captionLabel = document.createElement('p');
        captionLabel.classList.add('entry-caption', 'text-muted', 'mb-2');
        captionLabel.innerText = caption;

        row.appendChild(captionLabel);
        row.appendChild(editor);

        return row;
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
        L.marker([lat, lon]).addTo(map);
    }

    static _initDurationSelection(onSelect) {
        $('input[name="datefilter"]').daterangepicker({
            startDate: moment().add(-100, 'day'),
            endDate: moment(),
            autoUpdateInput: false,
            minYear: 2000,
            maxYear: 2100,
            locale: {
                cancelLabel: 'Abbrechen',
                applyLabel: 'Übernehmen',
                format: DATE_FORMAT_HUMAN
            }
          });
        $('input[name="datefilter"]').on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format(DATE_FORMAT_HUMAN) + ' - ' + picker.endDate.format(DATE_FORMAT_HUMAN));
            onSelect(picker.startDate, picker.endDate);
        });
        $('input[name="datefilter"]').on('cancel.daterangepicker', function (ev, picker) {
            $(this).val('');
        });
    }

    static _createHeaderForBookingsTable() {
        const header = document.createElement('thead');

        const row = document.createElement('tr');

        const organizer = document.createElement('th');
        organizer.innerText = 'Organisator';
        organizer.setAttribute('scope', 'column');
        row.appendChild(organizer);

        const email = document.createElement('th');
        email.innerText = 'E-Mail';
        email.setAttribute('scope', 'column');
        row.appendChild(email);

        const title = document.createElement('th');
        title.innerText = 'Titel';
        title.setAttribute('scope', 'column');
        row.appendChild(title);

        const start = document.createElement('th');
        start.innerText = 'Von';
        start.setAttribute('scope', 'column');
        row.appendChild(start);

        const end = document.createElement('th');
        end.innerText = 'Bis';
        end.setAttribute('scope', 'column');
        row.appendChild(end);

        header.appendChild(row);

        return header;
    }

    static _createRowForBookingTable(booking) {
        const row = document.createElement('tr');

        const organizer = document.createElement('td');
        organizer.innerText = booking.organizer;
        row.appendChild(organizer);

        const email = document.createElement('td');
        email.innerText = booking.email;
        row.appendChild(email);

        const title = document.createElement('td');
        title.innerText = booking.title;
        row.appendChild(title);

        const start = document.createElement('td');
        start.innerText = moment(booking.start).format(DATE_TIME_FORMAT_HUMAN);
        row.appendChild(start);

        const end = document.createElement('td');
        end.innerText = moment(booking.end).format(DATE_TIME_FORMAT_HUMAN);
        row.appendChild(end);

        return row;
    }

}