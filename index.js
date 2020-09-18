const restClient = new RestClient();
const componentFactory = new ComponentFactory();

setTitle(RAUMRESERVIERUNG)
setSubtitle(UEBERSICHT)

const rooms = restClient.getRooms();
setContent(componentFactory.createCardPanel(rooms));

function setSubtitle(subtitle) {
    setOnId("subtitle", subtitle);
}

function setTitle(title) {
    setOnId("title", title);
}

function setContent(component) {
    setOnId("content", component.outerHTML);
}

function setOnId(id, innerHtml) {
    document.querySelector("#" + id).innerHTML = innerHtml;
}