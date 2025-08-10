const API_BASE = 'https://YOUR_BACKEND_URL'; // REPLACE with deployed backend URL

async function loadCars() {
  try {
    const res = await fetch(`${API_BASE}/api/cars`);
    const cars = await res.json();
    const grid = document.getElementById('car-grid');
    if (!Array.isArray(cars)) { grid.textContent = 'No cars'; return; }
    cars.forEach(car => {
      const el = document.createElement('div');
      el.className = 'card';
      const imgHTML = (car.images && car.images.length) ? `<div class="card-images"><img src="${car.images[0]}" alt=""></div>` : '';
      el.innerHTML = `
        ${imgHTML}
        <h2 class="card-title">${car.year || ''} ${car.make} ${car.model}</h2>
        <p class="card-price">$${car.price || ''}</p>
        <p class="card-desc">${car.description || ''}</p>
        <a class="view-btn" href="car.html?id=${car._id}">View</a>
      `;
      grid.appendChild(el);
    });
  } catch (err) {
    document.getElementById('car-grid').textContent = 'Failed to load';
    console.error(err);
  }
}

loadCars();
