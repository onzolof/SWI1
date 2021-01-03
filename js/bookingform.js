class FormProvider {

    constructor(listenerStorage, onSuccess) {
        this.listenerStorage = listenerStorage;
        this.onSuccess = onSuccess;
    }

    get(room) {
        const form = document.createElement('form');
        const formId = 'booking-form';
        form.id = formId;
        form.setAttribute('action', '#');

        const errorContainer = document.createElement('div');
        errorContainer.classList.add('mb-2');
        errorContainer.id = ID_ERROR_CONTAINER;

        const nameId = 'name';
        const name = this._newGroup(
            this._createLabel(nameId, 'Name'),
            new InputBuilder(nameId)
                .forText()
                .setRequired()
                .setName('organizer')
                .build()
        )

        const emailId = 'email';
        const email = this._newGroup(
            this._createLabel(emailId, 'E-Mail'),
            new InputBuilder(emailId)
                .forEmail()
                .setPlaceholder('name@domain.com')
                .setRequired()
                .setName()
                .build()
        )

        const titleId = 'title-id';
        const title = this._newGroup(
            this._createLabelForOptional(titleId, 'Meetingtitel'),
            new InputBuilder(titleId)
                .forText()
                .setName('title')
                .build()
        )

        const datePicker = new DatePicker(true);
        const durationId = 'duration';
        const duration = this._newGroup(
            this._createLabel(durationId, 'Dauer'),
            datePicker.createInput()
        )

        const priceChfId = 'price-chf';
        const priceChfInput = new InputBuilder(priceChfId)
            .forNumber()
            .setReadonly()
            .setValue(0)
            .build();

        const priceEurId = 'price-eur';
        const priceEurInput = new InputBuilder(priceEurId)
            .forNumber()
            .setReadonly()
            .setValue(0)
            .build();
        const priceEurHelpId = 'price-eur-help';
        const priceEurHelp = this._createHelp(priceEurHelpId);

        const prices = this._createRow(
            this._newGroup(this._createLabel(priceChfId, 'Preis CHF'), priceChfInput),
            this._newGroup(this._createLabel(priceEurId, 'Preis EUR'), priceEurInput, priceEurHelp)
        )

        const onSelect = (start, end) => {
            const diff = this._calculateHours(start, end);
            const priceChf = diff * room.price;
            document.getElementById(priceChfId).value = priceChf.toFixed(2);
            RestClient.lookupEur((rate, date) => {
                document.getElementById(priceEurId).value = (rate * priceChf).toFixed(2);
                document.getElementById(priceEurHelpId).innerText = `Kurs vom ${moment(date).format(DATE_FORMAT_HUMAN)}`;
            })
        }

        this.listenerStorage.storeComponentInit(() => datePicker.initDatePicker(onSelect, true, moment(), moment().add(1, 'hour')));

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('mt-2', 'text-right');
        const submitBtnId = 'submitBooking';
        const submitBtn = ComponentFactory.createSubmitButton(submitBtnId, 'Reservieren');
        buttonContainer.appendChild(submitBtn);

        this.listenerStorage.storeSubmitListener(formId, (e) => {
            e.preventDefault();
            this._submit(formId, datePicker, room);
            return false;
        })

        form.appendChild(errorContainer);
        form.appendChild(name);
        form.appendChild(email);
        form.appendChild(title);
        form.appendChild(duration);
        form.appendChild(prices);
        form.appendChild(buttonContainer);

        return form;
    }

    _submit(formId, datePicker, room) {
        const data = new FormData(document.getElementById(formId));
        const values = datePicker.getValues();
        data.append('roomid', room.id);
        data.append('studid', STUDENT_ID);
        data.append('start', values.start.format(DATE_TIME_FORMAT_MACHINE));
        data.append('end', values.end.format(DATE_TIME_FORMAT_MACHINE));

        if (values.start.isValid() && values.start.isValid()) {
            RestClient.saveBooking(data, (success, message) => {
                return this._handleResult(success, message)
            });
        } else {
            this._displayError('Ungültiger Zeitraum eingegeben.');
        }
    }

    _handleResult(success, message) {
        if (success) {
            this.onSuccess(message);
        } else {
            ErrorHandler.displayError(message);
        }
    }

    _createRow(a, b) {
        const row = document.createElement('div');
        row.classList.add('form-row');

        const left = document.createElement('div');
        left.classList.add('col');
        left.appendChild(a);

        const right = document.createElement('div');
        right.classList.add('col');
        right.appendChild(b);

        row.appendChild(left);
        row.appendChild(right);

        return row;
    }

    _newGroup(label, input, help) {
        const group = document.createElement('div');
        group.classList.add('form-group');

        if (label !== undefined) {
            group.appendChild(label);
        }

        if (input !== undefined) {
            group.appendChild(input);
        }

        if (help !== undefined) {
            group.appendChild(help);
        }

        return group;
    }

    _createLabelForOptional(id, caption) {
        return this._createLabel(id, `${caption} <span class="text-muted">(Optional)</span>`);
    }

    _createLabel(id, caption) {
        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.innerHTML = caption;
        return label;
    }

    _createHelp(id) {
        const help = document.createElement('small');
        help.id = id;
        help.classList.add('form-text', 'text-muted');
        return help;
    }

    _calculateHours(start, end) {
        return moment.duration(end.diff(start)).asHours();
    }

}

class InputBuilder {

    constructor(id) {
        this.id = id;
    }

    forSubmit() {
        return new InputConfigurator(this.id, 'submit');
    }

    forEmail() {
        return new InputConfigurator(this.id, 'email');
    }

    forText() {
        return new InputConfigurator(this.id, 'text');
    }

    forNumber() {
        return new InputConfigurator(this.id, 'number');
    }

}

class InputConfigurator {

    constructor(id, type) {
        this.id = id;
        this.type = type;
    }

    setReadonly() {
        this.readOnly = true;
        return this;
    }

    setRequired() {
        this.required = true;
        return this;
    }

    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }

    setName(name) {
        this.name = name !== undefined ? name : this.id;
        return this;
    }

    setValue(value) {
        this.value = value;
        return this;
    }

    setText(text) {
        this.text = text;
        return this;
    }

    build() {
        const input = document.createElement('input');
        input.id = this.id;
        input.classList.add('form-control');
        input.setAttribute('type', this.type);

        if (this.name !== undefined) {
            input.setAttribute('name', this.name);
        }

        if (this.readOnly !== undefined) {
            input.setAttribute('readOnly', this.readOnly);
        }

        if (this.required !== undefined) {
            input.setAttribute('required', this.required);
        }

        if (this.placeholder !== undefined) {
            input.setAttribute('placeholder', this.placeholder);
        }

        if (this.value !== undefined) {
            input.setAttribute('value', this.value);
        }

        if (this.text !== undefined) {
            input.innerText = this.text;
        }

        return input;
    }

}