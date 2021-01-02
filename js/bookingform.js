class FormProvider {

    get(room) {
        const form = document.createElement('form');

        const errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.classList.add('form-grou');

        const nameId = 'name';
        const name = this._newGroup(
            this._createLabel(nameId, 'Name'),
            new InputBuilder(nameId).forText()
                .setRequired()
                .build()
        )

        const submitBtn = ComponentFactory.createPrimaryButton('submit-booking', 'Reservieren');
        submitBtn.classList.add('mt-3');

        form.appendChild(errorContainer);
        form.appendChild(name);
        form.appendChild(submitBtn);

        return form;
    }

    _newGroup(label, input, help) {
        const group = document.createElement('form-group');

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

    _createLabel(id, caption) {
        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.innerText = caption;
        return label;
    }

    _createHelp(text) {
        const help = document.createElement('small');
        help.classList.add('form-text', 'text-muted');
        help.innerText = text;
        return help;
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

    setText(text) {
        this.text = text;
        return this;
    }

    build() {
        const input = document.createElement('input');
        input.id = this.id;
        input.classList.add('form-control');
        input.setAttribute('name', this.id);
        input.setAttribute('type', this.type);

        if (this.readOnly !== undefined) {
            input.setAttribute('readOnly', this.readOnly);
        }

        if (this.required !== undefined) {
            input.setAttribute('required', this.required);
        }

        if (this.placeholder !== undefined) {
            input.setAttribute('placeholder', this.placeholder);
        }

        if (this.text !== undefined) {
            input.innerText = this.text;
        }

        return input;
    }

}