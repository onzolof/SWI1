class CardBuilder {

    withId(id) {
        this.id = id;
        return this;
    }

    withTitle(title) {
        this.title = title;
        return this;
    }

    withSubtitle(subtitle) {
        this.subtitle = subtitle;
        return this;
    }

    withAddress(address) {
        this.address = address;
        return this;
    }

    withMaxPersons(maxPersons) {
        this.maxPersons = maxPersons;
        return this;
    }

    isAvailable(isAvailable) {
        this.isAvailable = isAvailable;
        return this;
    }

    build() {
        const cardWrapper = document.createElement('div');
        cardWrapper.classList.add('col-12', 'col-md-6', 'col-lg-4', 'p-1');

        const card = document.createElement('div');
        card.classList.add('card', 'col-12');
        card.id = this.id;

        cardWrapper.appendChild(card);

        const body = document.createElement('div');
        body.className = 'card-body';
        card.appendChild(body);

        const title = document.createElement('h5');
        title.classList.add('card-title', 'text-primary');

        title.innerHTML = this.title;

        if (this.isAvailable === '0') {
            const badge = ComponentFactory.createWarningBadge(NICHT_VERFUEGBAR);
            badge.classList.add('badge-occupied');
            title.appendChild(badge);
        }

        body.appendChild(title);

        const subtitle = document.createElement('h6');
        subtitle.classList.add('card-subtitle', 'mb-1');
        subtitle.innerHTML = this.subtitle;
        body.appendChild(subtitle);

        const address = document.createElement('p');
        address.classList.add('card-text', 'mb-0');
        address.innerHTML = this.address;
        body.appendChild(address);

        const maxPersons = document.createElement('p');
        maxPersons.classList.add('card-text');
        maxPersons.innerHTML = `${this.maxPersons} Personen`;
        body.appendChild(maxPersons);

        return cardWrapper;
    }

}

class BreadCrumbBuilder {

    constructor() {
        this._nonActiveItemSuppliers = [];
        this._headerButtons = [];
    }

    withNonActiveItem(id, caption) {
        this._nonActiveItemSuppliers.push(() => BreadCrumbBuilder.buildNonActiveItem(id, caption))
        return this;
    }

    withActiveItem(caption) {
        this.activeItemSupplier = () => BreadCrumbBuilder.buildActiveItem(caption);
        return this;
    }

    withHeaderButton(btn) {
        this._headerButtons.push(btn);
        return this;
    }

    build() {
        const ariaLabel = document.createElement('nav');
        ariaLabel.setAttribute('aria-label', 'breadcrumb');
        ariaLabel.classList.add('row', 'mb-3');

        const orderedList = document.createElement('ol');
        orderedList.classList.add('breadcrumb', 'flex-grow-1', 'mb-0');
        ariaLabel.appendChild(orderedList);

        this._nonActiveItemSuppliers.forEach(buildItem => orderedList.appendChild(buildItem()))

        orderedList.appendChild(this.activeItemSupplier());

        this._headerButtons.forEach(button => {
            button.classList.add('ml-2');
            ariaLabel.appendChild(button);
        });

        return ariaLabel;
    }

    static buildNonActiveItem(id, caption) {
        const item = document.createElement('li');
        item.id = id;
        item.className = 'breadcrumb-item';
        const link = document.createElement('a');
        link.href = "#";
        link.innerHTML = caption;
        item.appendChild(link);
        return item;
    }

    static buildActiveItem(caption) {
        const item = document.createElement('li');
        item.id = 'active-page';
        item.className = 'breadcrumb-item active';
        item.setAttribute('aria-current', 'page');
        item.innerHTML = caption;
        return item;
    }

}

class RoomDetailPanelBuilder {

    constructor() {

    }

    withName(name) {
        this.name = name;
        return this;
    }

    withShortname(shortname) {
        this.shortname = shortname;
        return this;
    }

    withAvailable(available) {
        this.available = available;
        return this;
    }

    withAddress(address) {
        this.address = address;
        return this;
    }

    withPrice(price) {
        this.price = price;
        return this;
    }

    withMaxPersons(maxPersons) {
        this.maxPersons = maxPersons;
        return this;
    }

    build() {
        const detailPanel = document.createElement('div');
        detailPanel.classList.add('pl-0');

        detailPanel.appendChild(this.createStringEntry('Name', this.name));
        detailPanel.appendChild(this.createStringEntry('Kurzname', this.shortname));
        detailPanel.appendChild(ComponentFactory.createEntry('Status', this.createValueLabelForStatus(this.available)));
        detailPanel.appendChild(this.createStringEntry('Adresse', this.address));
        detailPanel.appendChild(this.createStringEntry('Kapazität', `${this.maxPersons} Personen`));
        detailPanel.appendChild(this.createStringEntry('Preis pro Stunde', `CHF ${this.price}`));

        return detailPanel;
    }

    createStringEntry(caption, value) {
        const valueLabel = document.createElement('p');
        valueLabel.classList.add('mb-2');
        valueLabel.innerText = value;

        return ComponentFactory.createEntry(caption, valueLabel);
    }

    createValueLabelForStatus(status) {
        const valueLabel = document.createElement('p');
        valueLabel.classList.add('mb-2');

        if (status === '1') {
            valueLabel.classList.add('text-success');
            valueLabel.innerText = VERFUEGBAR;
        } else {
            valueLabel.classList.add('text-warning');;
            valueLabel.innerText = NICHT_VERFUEGBAR;
        }

        return valueLabel;
    }

}