(function formTriangulation() {
    const result = initOutput();
    result.setMedia('<div id="map"></div>');

    function update(formData) {
        function getPoint(i) {
            const input = formData.get(`point${i}.coordinates`);
            if (!input.trim()) {
                return false;
            }

            const coordinates = input.split(',')
                .map(coordinate => parseFloat(coordinate.trim()))
                .reverse();

            return turf.point(coordinates);
        }

        initMap(function (map) {

            // Centers
            const point1 = getPoint(1);
            const point2 = getPoint(2);
            map.addPoints('points', map.createFeatureCollections([
                map.createFeaturePoint(point1.geometry.coordinates, { name: 'Point 1' }),
                map.createFeaturePoint(point2.geometry.coordinates, { name: 'Point 2' }),
            ]), '#7FDBFF');

            // Line
            const line = turf.lineString([point1.geometry.coordinates, point2.geometry.coordinates],{ name: 'Line' });
            map.addPolygon('line', map.createFeatureCollections([line]), '#FF4136');

            // Angle
            const angle = turf.bearing(point1.geometry.coordinates, point2.geometry.coordinates);

            // Output
            result.setTitle('Résultat');
            result.setDetails(`L'angle est le nord est : ${angle}°`);
        });
    }

    initForm('angle', update);
})();