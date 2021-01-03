class ExternalComponentUtil{

    static initLeafletMap(lat, lon) {
        const map = L.map('map').setView([lat, lon], 17);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiYmFsZHJpYW4iLCJhIjoiY2tqZWcwbmYxMmtzZDJ1bXRydnR6c3lsZyJ9.EHYZtCxET1MGmNMsyuunKg'
        }).addTo(map);
        L.marker([lat, lon]).addTo(map);
    }

    static initDatePicker(onSelect, showTime, start, end) {
        $('input[name="datefilter"]').daterangepicker({
            startDate: start,
            endDate: end,
            autoUpdateInput: false,
            minYear: 2000,
            maxYear: 2100,
            timePicker: showTime,
            timePicker24Hour: showTime,
            locale: {
                cancelLabel: 'Abbrechen',
                applyLabel: 'Übernehmen',
                format: showTime ? DATE_TIME_FORMAT_HUMAN : DATE_FORMAT_HUMAN
            }
        });
        $('input[name="datefilter"]').on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format(DATE_FORMAT_HUMAN) + ' - ' + picker.endDate.format(DATE_FORMAT_HUMAN));
            onSelect(picker.startDate, picker.endDate);
        });
        $('input[name="datefilter"]').on('cancel.daterangepicker', function (ev, picker) {
            $(this).val('');
        });
    }

}