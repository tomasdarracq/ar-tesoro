let markersFound = new Set();

window.addEventListener('load', () => {
    const markers = ['marker1', 'marker2', 'marker3'];
    markers.forEach(id => {
        const marker = document.querySelector(`#${id}`);
        marker.addEventListener('markerFound', () => {
            console.log(`Marcador detectado: ${id}`);
            markersFound.add(id);
            checkProgress();
        });
    });
});

function checkProgress() {
    if (markersFound.size === 3) {
        const finalText = document.querySelector('#finalText');
        finalText.setAttribute('visible', true);
        alert('🎉 ¡Encontraste todos los tesoros!');
    }
}
