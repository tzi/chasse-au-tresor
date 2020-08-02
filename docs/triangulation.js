(function formTriangulation() {
    const result = initOutput();
    result.setMedia('<div id="map"></div>');

    function update(formData) {
        function getCenter(i) {
            function getCoordinates() {
                const input = formData.get(`point${i}.coordinates`);
                if (!input.trim()) {
                    return false;
                }

                return input.split(',')
                    .map(coordinate => parseFloat(coordinate.trim()))
                    .reverse();
            }

            function getDistance() {
                return parseInt(
                    formData.get(`point${i}.distance`).replace(/\s/g, '')
                ) / 1000;
            }

            return {
                coordinates: getCoordinates(),
                distance: getDistance()
            }
        }

        initMap(function (map) {

            // Centers
            const center1 = getCenter(1);
            const center2 = getCenter(2);
            map.addPoints('centers', map.createFeatureCollections([
                map.createFeaturePoint(center1.coordinates, {name: 'Point 1'}),
                map.createFeaturePoint(center2.coordinates, {name: 'Point 2'}),
            ]), '#7FDBFF');

            // Circles
            const circle1 = turf.circle(center1.coordinates, center1.distance, {
                steps: 1000,
                units: 'kilometers',
            });
            const circle2 = turf.circle(center2.coordinates, center2.distance, {
                steps: 1000,
                units: 'kilometers',
            });
            map.addPolygon('circles', map.createFeatureCollections([circle1, circle2]), '#7FDBFF');

            // Intersections
            const intersections = turf.lineIntersect(circle1, circle2);
            map.addPoints('intersections', intersections,'#FF4136');
            if (!intersections) {
                ouput('Aucune intersection trouvée');
                return false;
            }

            result.setTitle(`${intersections.features.length} intersections trouvées`);
            result.setDetails(`
                <ul>
                    ${intersections.features.map(point => `
                        <li><p>${map.displayPoint(point)}</p></li>
                    `).join('')}
                </ul>    
            `);
        });
    }

    initForm('triangulation', update);
})();