function initMap(callback) {
    let map;
    window.requestAnimationFrame(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtdHppIiwiYSI6ImNrZGFwb3NzaDAzbHYyeW5iemUwbWZyNWUifQ.lQeBlGs6ZgcPyc78HZ3MBg';
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [4.8467100, 45.7484600],
            zoom: 4
        });
        map.on('load', () => callback({
            map,
            addPoints,
            addPolygon,
            createFeatureCollections,
            createFeaturePoint,
            displayPoint,
            displayCoordinates,
        }));
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
}