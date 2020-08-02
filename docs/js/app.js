const initMap = function(callback) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtdHppIiwiYSI6ImNrZGFwb3NzaDAzbHYyeW5iemUwbWZyNWUifQ.lQeBlGs6ZgcPyc78HZ3MBg';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [4.8467100, 45.7484600],
        zoom: 4
    });
    map.on('load', callback);

    function displayPoint(point) {
        if (!point.properties.name) {
            return displayCoordinates(point.geometry.coordinates);
        }

        return `${point.properties.name} : ${displayCoordinates(point.geometry.coordinates)}`;
    }

    function displayCoordinates(coordinates) {
        return coordinates
            .reverse()
            .map(coordinate => coordinate.toFixed(5))
            .join(', ');
    }

    function addData(name, data) {
        map.addSource(name, {
            type: 'geojson',
            data
        });
    }

    function createFeatureCollections(features) {
        return {
            type: "FeatureCollection",
            features,
        }
    }

    function createFeaturePoint(coordinates, properties = {}) {
        return {
            type: "Feature",
            properties,
            geometry: {
                "type": "Point",
                coordinates
            }
        };
    }

    function addPoints(name, data, color) {
        addData(name, data);
        map.addLayer({
            id: name,
            type: 'circle',
            source: name,
            layout: {},
            paint: {
                'circle-radius': 7,
                'circle-color': color,
            }
        });

        const popup = new mapboxgl.Popup();
        map.on('mousemove', function(e) {
            const features = map.queryRenderedFeatures(e.point, { layers: [name] });
            if (!features.length) {
                popup.remove();
                return;
            }
            const feature = features[0];

            popup.setLngLat(feature.geometry.coordinates)
                .setHTML(displayPoint(feature))
                .addTo(map);

            map.getCanvas().style.cursor = features.length ? 'pointer' : '';
        });

    }

    function addPolygon(name, data, color) {
        addData(name, data);
        map.addLayer({
            id: `${name}-fill`,
            type: 'fill',
            source: name,
            layout: {},
            paint: {
                'fill-color': color,
                'fill-opacity': 0.2,
            }
        });
        map.addLayer({
            id: `${name}-line`,
            type: 'line',
            source: name,
            layout: {},
            paint: {
                'line-color': color,
                'line-width': 3,
            }
        });
        fitBounds(turf.bbox(data));
    }

    function fitBounds(bounds) {
        map.fitBounds(bounds, {
            padding: 20
        });
    }

    return {
        map,
        addPoints,
        addPolygon,
        createFeatureCollections,
        createFeaturePoint,
        displayPoint,
        displayCoordinates,
    }
};

const output = (function() {

    function displayTitle(title) {
        document.getElementById('result-title').innerHTML = title;
    }

    function displayText(text) {
        document.getElementById('result-details').innerHTML = text;
    }

    return {
        displayTitle,
        displayText,
    };
})();

(function() {
    function getCenter(i) {
        function getCoordinates() {
            const input = form[`point${i}.coordinates`].value;
            if (!input.trim()) {
                return false;
            }

            return input.split(',')
                .map(coordinate => parseFloat(coordinate.trim()))
                .reverse();
        }

        function getDistance() {
            return parseInt(
                form[`point${i}.distance`].value.replace(/\s/g, '')
            ) / 1000;
        }

        return {
            coordinates: getCoordinates(),
            distance: getDistance()
        }
    }

    function updateMap() {
        if (
            !form[`point1.coordinates`].value.trim() ||
            !form[`point1.distance`].value.trim() ||
            !form[`point2.coordinates`].value.trim() ||
            !form[`point2.distance`].value.trim()
        ) {
            return false;
        }

        const map = initMap(function () {

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

            output.displayTitle(`${intersections.features.length} intersections trouvées`);
            output.displayText(`
                <ul>
                    ${intersections.features.map(point => `
                        <li><p>${map.displayPoint(point)}</p></li>
                    `).join('')}
                </ul>    
            `);
        });
    }

    let mode = 'update';
    url2form.init('triangulation');
    const form = document.forms.triangulation;
    form.update.addEventListener('click', () => mode = 'update');
    form.save.addEventListener('click', () => mode = 'save');
    form.addEventListener('submit', function (event) {
        if (mode === 'update') {
            event.preventDefault();
            updateMap();
        }
    });
    updateMap();
})();