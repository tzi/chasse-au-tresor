(function() {
    function getPoint(i) {
        function getCoordinates() {
            const input = form[`point${i}.coordinates`].value;

            return input.split(',')
                .map(coordinate => parseFloat(coordinate.trim()))
        }

        function getDistance() {
            return parseInt(form[`point${i}.distance`].value) / 1000;
        }

        return {
            coordinates: getCoordinates(),
            distance: getDistance(),
        }
    }

    const form = document.forms.triangulation;
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const point1 = getPoint(1);
        const point2 = getPoint(2);

        const circle1 = turf.circle(point1.coordinates, point1.distance, {
            steps: 10000,
            units: 'kilometers',
        });
        const circle2 = turf.circle(point2.coordinates, point2.distance, {
            steps: 10000,
            units: 'kilometers',
        });

        const intersectionList = turf.lineIntersect(circle1, circle2);
        const output = intersectionList.features
            .map(point => point.geometry.coordinates.map(coordinate => coordinate.toFixed(5)).toString())
            .join(' et ');

        alert(output);
    });
})();