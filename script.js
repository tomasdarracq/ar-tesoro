let markersFound = new Set();

// Map de marker-id a la entidad que queremos mostrar (tag + atributos)
const markerToEntity = {
    marker1: { tag: 'a-box', attrs: { position: '0 0.5 0', color: 'red' } },
    marker2: { tag: 'a-sphere', attrs: { position: '0 0.5 0', color: 'blue', radius: '0.5' } },
    marker3: { tag: 'a-cylinder', attrs: { position: '0 0.5 0', color: 'gold', height: '0.6', radius: '0.3' } }
};

window.addEventListener('load', () => {
    const markers = Object.keys(markerToEntity);
    markers.forEach(id => {
        const marker = document.querySelector(`#${id}`);
        if (!marker) {
            console.warn(`No se encontró el elemento con id ${id}`);
            return;
        }

        // Cuando el marker se encuentra
        marker.addEventListener('markerFound', () => {
            console.log(`Marcador detectado: ${id}`);
            markersFound.add(id);
            showEntityForMarker(marker, id);
            checkProgress();
        });

        // Cuando el marker se pierde
        marker.addEventListener('markerLost', () => {
            console.log(`Marcador perdido: ${id}`);
            markersFound.delete(id);
            hideEntityForMarker(marker, id);
            checkProgress();
        });
    });
});

function createEntity(id) {
    const spec = markerToEntity[id];
    if (!spec) return null;

    const el = document.createElement(spec.tag);
    el.classList.add('ar-object');
    el.setAttribute('id', `${id}-obj`);

    // Añadir atributos
    Object.entries(spec.attrs || {}).forEach(([k, v]) => {
        el.setAttribute(k, v);
    });

    return el;
}

function showEntityForMarker(markerEl, id) {
    // Si ya existe, sólo la hacemos visible
    let child = markerEl.querySelector(`#${id}-obj`);
    if (!child) {
        child = createEntity(id);
        if (child) markerEl.appendChild(child);
    }

    if (child) child.setAttribute('visible', true);
}

function hideEntityForMarker(markerEl, id) {
    const child = markerEl.querySelector(`#${id}-obj`);
    if (child) child.setAttribute('visible', false);
}

function checkProgress() {
    const finalText = document.querySelector('#finalText');
    if (markersFound.size === 3) {
        if (finalText) finalText.setAttribute('visible', true);
        // Mensaje opcional al usuario
        // alert('¡Encontraste todos los tesoros!');
    } else {
        if (finalText) finalText.setAttribute('visible', false);
    }
}
