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
        listenerStorage.storeComponentInit(() => ExternalComponentUtil.initLeafletMap(room.lat, room.lon));

        const bookingsPanel = ComponentFactory.createBookingsPanel(room.id, listenerStorage);
        bookingsPanel.classList.add('col-12', 'mt-4');
        roomPanel.appendChild(bookingsPanel);

        return roomPanel;
    }

    static createBookingPanel(listenerStorage, room) {
        const bookingPanel = document.createElement('div');
        bookingPanel.classList.add('row');

        const form = new FormProvider(listenerStorage).get(room);
        form.classList.add('offset-0', 'col-12', 'offset-md-2', 'col-md-8', 'offset-lg-3', 'col-lg-6');
        
        bookingPanel.appendChild(form);

        return bookingPanel;
    }

    static createPrimaryButton(id, caption) {
        const button = document.createElement('button');
        button.type = "button";
        button.className = "btn btn-primary";
        button.id = id;
        button.innerHTML = caption;
        return button;
    }

    static createOutlinePrimaryButton(id, caption) {
        const button = document.createElement('button');
        button.type = "button";
        button.className = "btn btn-outline-primary";
        button.id = id;
        button.innerHTML = caption;
        return button;
    }

    static createDeleteButton(id, caption) {
        const button = document.createElement('button');
        button.type = "button";
        button.className = "btn btn-outline-danger btn-sm";
        button.id = id;
        button.innerHTML = `<i class="far fa-trash-alt"></i><span class="d-none d-lg-inline"> ${caption}<span>`;
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
        bookingsPanel.classList.add('pr-0');

        const selector = ComponentFactory.createDurationInput();
        selector.classList.add('small-duration-input');
        const durationEntry = ComponentFactory.createEntry('Betrachtungszeitraum', selector);
        durationEntry.classList.add('mb-3');
        bookingsPanel.appendChild(durationEntry);

        const header = ComponentFactory._createHeaderForBookingsTable();
        bookingsPanel.appendChild(header)

        const bookingsTableBodyContainer = document.createElement('div');
        const idTableContainer = 'bookings-table-container';
        bookingsTableBodyContainer.id = idTableContainer;
        bookingsPanel.appendChild(bookingsTableBodyContainer);

        let showBookings;

        const registerDeleteListener = (elementId, bookingId) => listenerStorage.storeClickListener(elementId, () => {
            RestClient.deleteBooking(bookingId, () => {
                const dates = $('input[name="datefilter"]').val().split(' - ');
                showBookings(moment(dates[0], DATE_FORMAT_HUMAN), moment(dates[1], DATE_FORMAT_HUMAN));
            });
        });

        showBookings = (start, end) => {
            RestClient.loadBookings(roomId, start, end, bookings => {
                document.getElementById(idTableContainer).innerHTML = ComponentFactory.createBookingsTableBody(bookings, registerDeleteListener).outerHTML;
                listenerStorage.applyListeners();
            });
        }

        listenerStorage.storeComponentInit(() => ExternalComponentUtil.initDatePicker(showBookings, false, moment().add(-100, 'day'), moment()));

        listenerStorage.storeComponentInit(() => {
            const start = moment().add(-100, 'day');
            const end = moment();
            showBookings(start, end);
            $('input[name="datefilter"]').val(start.format(DATE_FORMAT_HUMAN) + ' - ' + end.format(DATE_FORMAT_HUMAN));
        });

        return bookingsPanel;
    }

    static createDurationInput() {
        const durationInput = document.createElement('input');

        durationInput.classList.add('form-control');
        durationInput.setAttribute('type', 'text');
        durationInput.setAttribute('name', 'datefilter');
        durationInput.setAttribute('placeholder', 'Wählen Sie eine Zeitspanne');

        return durationInput;
    }

    static createBookingsTableBody(bookings, registerDeleteListener) {
        const body = document.createElement('tbody')

        bookings.forEach(booking => {
            const row = ComponentFactory._createRowForBookingTable(booking, registerDeleteListener);
            body.appendChild(row);
        })

        return body;
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

    static _createHeaderForBookingsTable() {
        const header = document.createElement('thead');

        const row = document.createElement('div');
        row.classList.add('row', 'no-gutters', 'pb-3', 'pt-3', 'border-bottom', 'bookings-header');

        const organizer = document.createElement('div');
        organizer.classList.add('col-4', 'col-lg-2', 'font-weight-bold');
        organizer.innerText = 'Organisator';
        row.appendChild(organizer);

        const email = document.createElement('div');
        email.classList.add('col-4', 'col-lg-2', 'font-weight-bold');
        email.innerText = 'E-Mail';
        row.appendChild(email);

        const title = document.createElement('div');
        title.classList.add('col-4', 'col-lg-2', 'font-weight-bold');
        title.innerText = 'Titel';
        row.appendChild(title);
        
        const start = document.createElement('div');
        start.classList.add('col-4', 'col-lg-2', 'font-weight-bold');
        start.innerText = 'Von';
        row.appendChild(start);
        
        const end = document.createElement('div');
        end.classList.add('col-4', 'col-lg-2', 'font-weight-bold');
        end.innerText = 'Bis';
        row.appendChild(end);

        const actions = document.createElement('div');
        actions.classList.add('col-4', 'col-lg-2');
        row.appendChild(actions);

        header.appendChild(row);

        return header;
    }

    static _createRowForBookingTable(booking, registerDeleteListener) {
        const row = document.createElement('div');
        row.classList.add('row', 'no-gutters', 'pb-2', 'pt-2', 'border-bottom', 'align-items-center');

        const organizer = document.createElement('div');
        organizer.classList.add('col-4', 'col-lg-2');
        organizer.innerText = booking.organizer;
        organizer.setAttribute('scope', 'column');
        row.appendChild(organizer);

        const email = document.createElement('div');
        email.classList.add('col-4', 'col-lg-2');
        email.innerText = booking.email;
        email.setAttribute('scope', 'column');
        row.appendChild(email);

        const title = document.createElement('div');
        title.classList.add('col-4', 'col-lg-2');
        title.innerText = booking.title;
        title.setAttribute('scope', 'column');
        row.appendChild(title);

        const start = document.createElement('div');
        start.classList.add('col-4', 'col-lg-2');
        start.innerText = moment(booking.start).format(DATE_TIME_FORMAT_HUMAN);
        start.setAttribute('scope', 'column');
        row.appendChild(start);

        const end = document.createElement('div');
        end.classList.add('col-4', 'col-lg-2');
        end.innerText = moment(booking.end).format(DATE_TIME_FORMAT_HUMAN);
        end.setAttribute('scope', 'column');
        row.appendChild(end);

        const actions = document.createElement('div');
        actions.classList.add('col-4', 'col-lg-2', 'order-lg-6', 'text-right');
        const deleteButtonId = 'delete-btn-' + booking.id;
        const deleteButton = ComponentFactory.createDeleteButton(deleteButtonId, 'Löschen');
        registerDeleteListener(deleteButtonId, booking.id);
        actions.appendChild(deleteButton);
        row.appendChild(actions);

        return row;
    }

}