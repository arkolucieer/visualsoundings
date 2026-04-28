(function () {
  const markers = window.VISUAL_SOUNDINGS_MARKERS || [];
  const worldUrl = window.VISUAL_SOUNDINGS_WORLD;
  const container = document.getElementById('image-location-map');
  if (!container || !markers.length || !window.L) {
    if (container) container.innerHTML = '<p>Image locations are unavailable.</p>';
    return;
  }

  container.replaceChildren();

  const map = L.map(container, {
    attributionControl: false,
    maxBounds: [[-86, -220], [86, 220]],
    maxBoundsViscosity: 0.35,
    minZoom: 2,
    maxZoom: 7,
    scrollWheelZoom: true,
    zoomControl: true,
  });
  map.createPane('visualSoundingsMarkers');
  map.getPane('visualSoundingsMarkers').style.zIndex = 650;

  const bounds = L.latLngBounds();
  markers.forEach((marker) => {
    const lat = Number(marker.lat);
    const lon = Number(marker.lon);
    const label = `${marker.title}${marker.detail ? ' - ' + marker.detail : ''}`;
    bounds.extend([lat, lon]);
    L.circleMarker([lat, lon], {
      className: 'vs-map-marker',
      pane: 'visualSoundingsMarkers',
      radius: 6,
      color: '#e7f7ff',
      weight: 2,
      fillColor: '#0099ff',
      fillOpacity: 0.98,
      opacity: 1,
    })
      .bindTooltip(label, {
        className: 'vs-map-tooltip',
        direction: 'top',
        opacity: 1,
        offset: [0, -8],
      })
      .on('mouseover', function () {
        this.setStyle({ radius: 8, fillColor: '#62c2ff', weight: 3 });
      })
      .on('mouseout', function () {
        this.setStyle({ radius: 6, fillColor: '#0099ff', weight: 2 });
      })
      .on('click', () => {
        window.location.href = marker.url;
      })
      .addTo(map);
  });

  function fitMap() {
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.45), { maxZoom: 3, animate: false });
    } else {
      map.setView([18, 18], 2);
    }
  }

  fetch(worldUrl)
    .then((response) => response.json())
    .then((geojson) => {
      L.geoJSON(geojson, {
        interactive: false,
        style: {
          color: '#395362',
          weight: 0.75,
          fillColor: '#162a34',
          fillOpacity: 0.92,
        },
      }).addTo(map);
      fitMap();
    })
    .catch(() => {
      fitMap();
      container.classList.add('map-geometry-error');
    });
})();
