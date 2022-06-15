export default function maps() {
    const elements = Array.from(document.querySelectorAll('.js-map'));
    console.log('MAP ELEMNTS', elements);
    elements.forEach(element => {
        ymaps.ready(initMap);
        function initMap() {
            console.log('MAP');
            const mapElement = element.querySelector('.js-map-element');

            const center = element.getAttribute('data-center').split(',');
            const coords = element.getAttribute('data-coords').split(',');
            const zoom = element.getAttribute('data-zoom');

            const pin = {
                // preset: 'islands#blueStarCircleIcon',
                // iconColor: 'red'
            };

            const mapInstance = new ymaps.Map(mapElement, {
                center: center,
                zoom: zoom ? zoom : 12,
                controls: []
            });

            mapInstance.behaviors.disable('scrollZoom');

            const zoomControl = new ymaps.control.ZoomControl({
                options: {
                    size: 'small',
                    position: {
                        right: 10,
                        top: 10
                    }
                }
            });
            mapInstance.controls.add(zoomControl);

            var objectManager = new ymaps.ObjectManager({
                geoObjectOpenBalloonOnClick: false,
                clusterize: false
            });
            mapInstance.geoObjects.add(objectManager);

            const objectToAdd = {
                id: coords.join('-'),
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: coords
                },
                options: {
                    ...pin,
                    balloonShadow: false,
                    hideIconOnBalloonOpen: false
                }
            };

            objectManager.add(objectToAdd);
        }
    });
}
