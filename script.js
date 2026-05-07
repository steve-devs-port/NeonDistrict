function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('hamburger');
  menu.classList.toggle('open');
  btn.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  document.body.style.overflow = '';
}


const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

document.addEventListener('mousemove', e => {
  dot.style.left  = e.clientX + 'px';
  dot.style.top   = e.clientY + 'px';
  ring.style.left = e.clientX + 'px';
  ring.style.top  = e.clientY + 'px';
});

document.querySelectorAll('a, button, input, select').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
});


window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});


const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + btn.dataset.tab);
    panel.classList.add('active');
    panel.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => revealObserver.observe(el), 50);
    });
  });
});


let cart = [];

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateBadge();
  showToast(name);
}

function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
  updateBadge();
  renderModal();
}

function updateBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-count');
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}


function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderModal();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function overlayClick(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function renderModal() {
  const container = document.getElementById('modal-order-items');
  const totalEl   = document.getElementById('modal-total');
  const countEl   = document.getElementById('modal-item-count');
  const formSec   = document.getElementById('checkout-form-section');
  const placeBtn  = document.getElementById('place-order-btn');

  if (cart.length === 0) {
    container.innerHTML = '<p style="color:rgba(245,234,216,.35);font-size:.9rem;font-style:italic;padding:1rem 0">Your cart is empty. Add items from the menu!</p>';
    totalEl.textContent = '\u20B10';
    countEl.textContent = '0 items';
    formSec.style.opacity = '.4';
    formSec.style.pointerEvents = 'none';
    placeBtn.disabled = true;
    return;
  }

  formSec.style.opacity = '1';
  formSec.style.pointerEvents = 'auto';
  placeBtn.disabled = false;

  let total = 0, totalQty = 0, html = '';
  cart.forEach(item => {
    total    += item.price * item.qty;
    totalQty += item.qty;
    html += `
      <div class="order-row">
        <span class="order-row-name">${item.name}</span>
        <div class="order-row-qty">
          <button class="qty-btn" onclick="changeQty('${item.name}', -1)">&minus;</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
        </div>
        <span class="order-row-price">&#8369;${(item.price * item.qty).toLocaleString()}</span>
        <button class="order-remove" onclick="changeQty('${item.name}', -99)" title="Remove">&times;</button>
      </div>`;
  });

  container.innerHTML = html;
  totalEl.textContent  = '\u20B1' + total.toLocaleString();
  countEl.textContent  = totalQty + ' item' + (totalQty !== 1 ? 's' : '');
}


function selectPay(el) {
  document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}


function toggleDelivery() {
  const v = document.getElementById('f-type').value;
  document.getElementById('delivery-fields').style.display = v === 'delivery' ? 'block' : 'none';
  document.getElementById('table-field').style.display     = v === 'dine'     ? 'block' : 'none';
}


function placeOrder() {
  if (cart.length === 0) return;
  const name  = document.getElementById('f-firstname').value.trim() || 'friend';
  const types = { dine: 'Dine In', pickup: 'Ready for Pickup', delivery: 'Out for Delivery' };
  const type  = types[document.getElementById('f-type').value];
  const num   = 'GG-' + Math.floor(1000 + Math.random() * 9000);

  document.getElementById('success-name').textContent      = name;
  document.getElementById('success-order-type').textContent = type;
  document.getElementById('success-order-num').textContent  = 'Order #' + num;
  document.getElementById('modal-form-view').style.display  = 'none';
  document.getElementById('modal-success').classList.add('show');

  cart = [];
  updateBadge();
}

function closeAndReset() {
  closeModal();
  setTimeout(() => {
    document.getElementById('modal-form-view').style.display = 'block';
    document.getElementById('modal-success').classList.remove('show');
    ['f-firstname', 'f-lastname', 'f-email', 'f-phone', 'f-notes'].forEach(id => {
      document.getElementById(id).value = '';
    });
  }, 400);
}


let toastTimer;

function showToast(name) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-name').textContent = name;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}
