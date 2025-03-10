let newX = 0, newY = 0, startX = 0, startY = 0;
const card = document.getElementById('card');
const slots = document.querySelectorAll('.slot'); // Get all slots

const snapThreshold = 100; // Distance in pixels to trigger snapping

card.addEventListener('mousedown', mouseDown);

function mouseDown(e) {
    const cardRect = card.getBoundingClientRect();
    const clickX = e.clientX - cardRect.left;

    if (clickX > cardRect.width / 3) return; // Only allow dragging if clicked on the left third

    startX = e.clientX;
    startY = e.clientY;

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
}

function mouseMove(e) {
    newX = startX - e.clientX;
    newY = startY - e.clientY;
  
    startX = e.clientX;
    startY = e.clientY;

    card.style.top = (card.offsetTop - newY) + 'px';
    card.style.left = (card.offsetLeft - newX) + 'px';
}

function mouseUp() {
    document.removeEventListener('mousemove', mouseMove);

    checkSnap();
}

function checkSnap() {
    const cardRect = card.getBoundingClientRect();

    let closestSlot = null;
    let minDistance = Infinity;

    slots.forEach(slot => {
        const slotRect = slot.getBoundingClientRect();
        const distanceX = Math.abs(cardRect.left - slotRect.left);
        const distanceY = Math.abs(cardRect.top - slotRect.top);
        const totalDistance = distanceX + distanceY;

        if (totalDistance < minDistance && totalDistance < snapThreshold) {
            minDistance = totalDistance;
            closestSlot = slot;
        }
    });

    if (closestSlot) {
        card.style.transition = "top 0.3s ease-out, left 0.3s ease-out"; // Smooth transition
        card.style.top = closestSlot.offsetTop + 'px';
        card.style.left = closestSlot.offsetLeft + 'px';

        // Remove transition after animation completes to avoid affecting future dragging
        setTimeout(() => {
            card.style.transition = "";
        }, 300);
    }
}
