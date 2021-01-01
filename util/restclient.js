class RestClient {

    static loadRooms(onLoad) {
        fetch('https://matthiasbaldauf.com/swi1hs20/rooms')
        .then(response => response.json())
        .then(onLoad)
        .catch(RestClient.handleError);
    }

    static handleError(response) {
        alert('Es ist ein Fehler aufgetreten. Bitte laden Sie die Seite erneut oder versuchen Sie es später noch einmal.')
        console.log(`error occured (status code ${response.status})`);
    }

}