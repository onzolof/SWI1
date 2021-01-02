class RestClient {

    static loadRooms(onLoad) {
        console.log(`get all rooms`);
        fetch('https://matthiasbaldauf.com/swi1hs20/rooms')
            .then(response => response.json())
            .then(onLoad)
            .catch(RestClient._handleError);
    }

    static loadBookings(roomId, startDate, endDate, onLoad) {
        console.log(`get all bookings`);
        fetch(`https://matthiasbaldauf.com/swi1hs20/bookings?roomid=${roomId}&start=${startDate.format(DATE_FORMAT_MACHINE)}&end=${endDate.format(DATE_FORMAT_MACHINE)}&studid=${STUDENT_ID}`)
            .then(response => response.json())
            .then(onLoad)
            .catch(RestClient._handleError);
    }

    static deleteBooking(bookingId, reload) {
        console.log(`delete booking with id ${bookingId}`);
        fetch(`https://matthiasbaldauf.com/swi1hs20/booking?id=${bookingId}&studid=${STUDENT_ID}`, {
            method: 'DELETE'
        }).then(reload)
          .catch(RestClient._handleError);
    }

    static _handleError(response) {
        alert('Es ist ein Fehler aufgetreten. Bitte laden Sie die Seite erneut oder versuchen Sie es später noch einmal.')
        console.log(`error occured (status code: ${response.status})`);
    }

}