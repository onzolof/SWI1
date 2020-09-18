class ComponentFactory {

    createCardPanel(rooms) {
        const cardPanel = document.createElement('div');
        cardPanel.id = 'card-panel';
        rooms.map(this.createCard)
            .forEach(element => cardPanel.appendChild(element));
        return cardPanel;
    }

    createCard(room) {
        return new CardBuilder().withTitle(room.name).withSubtitle(room.id).build();
    }

}