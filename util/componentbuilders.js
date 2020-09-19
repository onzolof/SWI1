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

    isAvailable(isAvailable) {
        this.isAvailable = isAvailable;
        return this;
    }

    build() {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = this.id;

        const body = document.createElement('div');
        body.className = 'card-body';
        card.appendChild(body);

        const title = document.createElement('h5');
        title.className = 'card-title';

        title.innerHTML = this.title;

        if (this.isAvailable) {
            const badge = ComponentFactory.createSuccessBadge(VERFUEGBAR);
            badge.classList.add('badge-available');
            title.appendChild(badge);
        }

        body.appendChild(title);

        const subtitle = document.createElement('h6');
        subtitle.className = 'card-subtitle';
        subtitle.innerHTML = this.subtitle;
        body.appendChild(subtitle);

        return card;
    }

}

class BreadCrumbBuilder {

    constructor() {
        this.nonActiveItemSuppliers = [];
    }

    withNonActiveItem(id, caption) {
        this.nonActiveItemSuppliers.push(() => BreadCrumbBuilder.buildNonActiveItem(id, caption))
        return this;
    }

    withActiveItem(caption) {
        this.activeItemSupplier = () => BreadCrumbBuilder.buildActiveItem(caption);
        return this;
    }

    build() {
        const ariaLabel = document.createElement('nav');
        ariaLabel.setAttribute('aria-label', 'breadcrumb');

        const orderedList = document.createElement('ol');
        orderedList.className = "breadcrumb";
        ariaLabel.appendChild(orderedList);

        this.nonActiveItemSuppliers.forEach(buildItem => orderedList.appendChild(buildItem()))

        orderedList.appendChild(this.activeItemSupplier());

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