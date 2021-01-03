class MapUtil {

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

}

class DatePicker {

    constructor() {
        this.id = 'datepicker';
        this.separator = ' - ';
        this.start = null;
        this.end = null;
    }

    createInput() {
        const durationInput = document.createElement('input');
        durationInput.id = this.id;

        durationInput.classList.add('form-control');
        durationInput.setAttribute('type', 'text');
        durationInput.setAttribute('required', 'true');
        durationInput.setAttribute('placeholder', 'Wählen Sie eine Zeitspanne');

        return durationInput;
    }

    initDatePicker(onSelect, showTime, startDate, endDate) {
        this.start = startDate;
        this.end = endDate;
        this._getDatePicker().daterangepicker({
            startDate: this.start,
            endDate: this.end,
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
        const that = this;
        this._getDatePicker().on('apply.daterangepicker', function (ev, picker) {
            that.setValues(onSelect, picker.startDate, picker.endDate);
        });
        this._getDatePicker().on('cancel.daterangepicker', function (ev, picker) {
            that.clear();
        });
    }

    setValues(onSelect, startDate, endDate){
        this.start = startDate;
        this.end = endDate;
        onSelect(this.start, this.end);
        this._getDatePicker().val(this.start.format(DATE_FORMAT_HUMAN) + this.separator + this.end.format(DATE_FORMAT_HUMAN));
    }

    clear(){
        this.start = null;
        this.end = null;
        this._getDatePicker().val('');
    }

    getValues(){
        return {
            start: moment(this.start, DATE_FORMAT_HUMAN),
            end: moment(this.end, DATE_FORMAT_HUMAN)
        }
    }

    _getDatePicker() {
        return $(`input[id="${this.id}"]`);
    }

}