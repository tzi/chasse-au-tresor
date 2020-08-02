const initMap = function(callback) {
    let map;
    output.addMap();
    window.requestAnimationFrame(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtdHppIiwiYSI6ImNrZGFwb3NzaDAzbHYyeW5iemUwbWZyNWUifQ.lQeBlGs6ZgcPyc78HZ3MBg';
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [4.8467100, 45.7484600],
            zoom: 4
        });
        map.on('load', callback);
    });

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
    function createDOM(parentNode, html) {
        const fragment = document.createElement('div');
        fragment.innerHTML = html;

        while (fragment.firstChild) {
            parentNode.appendChild(fragment.firstChild);
        }
    }

    function getResultDOM() {
        return document.getElementById('result');
    }

    function whenReady(callback) {
        const exist = Boolean(getResultDOM());
        if (exist) {
            callback();
            return null;
        }

        createDOM(document.body, `
            <div class="o-section" id="result">
                <div class="o-container">
                    <h3 id="result-title">Résultat</h3>
                    <div id="result-details"></div>
                </div>
            </div>
        `);
        window.requestAnimationFrame(callback);
    }

    function displayTitle(title) {
        whenReady(() => {
            document.getElementById('result-title').innerHTML = title;
        });
    }

    function displayText(text) {
        whenReady(() => {
            document.getElementById('result-details').innerHTML = text;
        });
    }

    function displayHtml(html) {
        whenReady(() => {
            console.log(html);
            createDOM(document.querySelector('#result .o-container'), html);
        });
    }

    function addMap() {
        displayHtml('<div id="map"></div>');
    }

    return {
        displayTitle,
        displayText,
        addMap,
    };
})();

(function formTriangulation() {
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

    const form = document.forms.triangulation;
    if (!form) {
        return null;
    }
    let mode = 'update';
    url2form.init('triangulation');
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

(function formCueillette() {
    function updatePick() {
        if (
            !form.reference.value.trim() ||
            !form.pick.value.trim()
        ) {
            return false;
        }

        let reference = form.reference.value.trim();
        if (!form.withSpaces.checked) {
            reference = reference.replace(/\s/g, '');
        }

        let result = '';
        const pick = form.pick.value.trim().replace(/\s+/g, ' ').split(' ');
        console.log({ reference, pick }, form.withSpaces.checked);
        pick.forEach(position => {
            const index = parseInt(position, 10);
            if (!index) {
                return null;
            }
            if (!reference[index - 1]) {
                return null;
            }
            result += reference[index - 1];
        });

        output.displayTitle('Résultat');
        output.displayText(result);
    }

    const form = document.forms.cueillette;
    if (!form) {
        return null;
    }
    let mode = 'update';
    url2form.init('cueillette');
    form.update.addEventListener('click', () => mode = 'update');
    form.save.addEventListener('click', () => mode = 'save');
    form.addEventListener('submit', function (event) {
        if (mode === 'update') {
            event.preventDefault();
            updatePick();
        }
    });
    updatePick();
})();