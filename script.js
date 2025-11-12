let markersFound = new Set();

// Map de marker-id a la entidad que queremos mostrar (tipo + atributos)
// marker1 -> estrella (plano con textura generada en canvas)
// marker2 -> círculo (a-circle)
// marker3 -> cuadrado (a-box)
const markerToEntity = {
    marker1: { type: 'star', tag: 'a-plane', attrs: { position: '0 0.5 0', width: '1', height: '1' } },
    marker2: { type: 'circle', tag: 'a-circle', attrs: { position: '0 0.5 0', color: 'deepskyblue', radius: '0.5' } },
    marker3: { type: 'square', tag: 'a-box', attrs: { position: '0 0.5 0', color: 'tomato', depth: '0.2', height: '0.6', width: '0.6' } }
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

    // Crear textura si es estrella
    if (spec.type === 'star') {
        const imgRef = createStarImage(id);
        // material: src: #id
        el.setAttribute('material', `src: ${imgRef}; side: double; transparent: true`);
        // asignar atributos geométricos (width/height para plane)
        Object.entries(spec.attrs || {}).forEach(([k, v]) => {
            el.setAttribute(k, v);
        });
        return el;
    }

    // Añadir atributos normales
    Object.entries(spec.attrs || {}).forEach(([k, v]) => {
        el.setAttribute(k, v);
    });

    return el;
}

// Genera una imagen con una estrella dibujada en canvas y la inserta como <img> en el DOM.
// Devuelve el selector id del <img> (por ejemplo: '#marker1-tex-img') para usar como material src.
function createStarImage(id, size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Fondo transparente
    ctx.clearRect(0, 0, size, size);

    // Dibujar estrella
    const cx = size / 2, cy = size / 2;
    const spikes = 5;
    const outer = size * 0.4;
    const inner = size * 0.17;
    let rot = Math.PI / 2 * 3;
    let x = cx, y = cy;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outer);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outer;
        y = cy + Math.sin(rot) * outer;
        ctx.lineTo(x, y);
        rot += Math.PI / spikes;

        x = cx + Math.cos(rot) * inner;
        y = cy + Math.sin(rot) * inner;
        ctx.lineTo(x, y);
        rot += Math.PI / spikes;
    }
    ctx.closePath();

    // Sombra/halo
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'gold';
    ctx.fill();
    ctx.restore();

    ctx.lineWidth = 6;
    ctx.strokeStyle = 'orange';
    ctx.stroke();

    const dataURL = canvas.toDataURL();
    const imgId = `${id}-tex-img`;
    let img = document.getElementById(imgId);
    if (!img) {
        img = document.createElement('img');
        img.id = imgId;
        img.style.display = 'none';
        document.body.appendChild(img);
    }
    img.src = dataURL;
    return `#${imgId}`;
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
