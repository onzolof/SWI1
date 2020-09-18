class CardBuilder {

    constructor() {
    }

    withTitle(title) {
        this.title = title;
        return this;
    }

    withSubtitle(subtitle) {
        this.subtitle = subtitle;
        return this;
    }

    setClickListener(listener) {
        this.listener = listener;
        return this;
    }

    build() {
        const card = document.createElement('div');
        card.className = 'card';
        card.style = 'width: 18rem;';

        if (this.listener != null) {
            card.onclick = this.listener;
        }

        const body = document.createElement('div');
        body.className = 'card-body';
        card.appendChild(body);

        if (this.title != null) {
            const title = document.createElement('h5');
            title.className = 'card-title';
            title.innerHTML = this.title;
            body.appendChild(title);
        }

        if (this.subtitle != null) {
            const subtitle = document.createElement('h6');
            subtitle.className = 'card-subtitle';
            subtitle.innerHTML = this.subtitle;
            body.appendChild(subtitle);
        }

        return card;
    }

}