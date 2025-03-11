let newX = 0, newY = 0, startX = 0, startY = 0;
const card = document.getElementById('card');
const slots = document.querySelectorAll('.slot'); // Get all slots

const snapThreshold = 150; // Distance in pixels to trigger snapping

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

    // Get the card's current position and the container's dimensions
    const cardRect = card.getBoundingClientRect();
    const containerRect = document.getElementById('container').getBoundingClientRect();

    // Prevent the card from moving outside the container's bounds (left and top)
    let newTop = card.offsetTop - newY;
    let newLeft = card.offsetLeft - newX;

    // Enforce boundaries for the card to stay within the container
    if (newLeft < containerRect.left) {
        newLeft = containerRect.left; // Prevent card from going left
    }
    if (newTop < containerRect.top) {
        newTop = containerRect.top; // Prevent card from going up
    }
    if (newLeft + cardRect.width > containerRect.right) {
        newLeft = containerRect.right - cardRect.width; // Prevent card from going right
    }
    if (newTop + cardRect.height > containerRect.bottom) {
        newTop = containerRect.bottom - cardRect.height; // Prevent card from going down
    }

    // Apply the new position
    card.style.top = newTop + 'px';
    card.style.left = newLeft + 'px';
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
        const slotRect = closestSlot.getBoundingClientRect();
        
        // Ensure we correctly align the top-left of the card to the top-left of the slot
        const newLeft = slotRect.left + window.scrollX;
        const newTop = slotRect.top + window.scrollY;

        // Apply smooth transition
        card.style.transition = "top 0.3s ease-out, left 0.3s ease-out";
        card.style.position = "absolute"; // Ensure proper placement
        card.style.left = `${newLeft}px`;
        card.style.top = `${newTop}px`;

        // Remove transition after animation completes
        setTimeout(() => {
            card.style.transition = "";
        }, 300);
    }
}




