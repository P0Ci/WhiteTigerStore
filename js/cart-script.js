function renderCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    document.getElementById("cartItems").style.display = "none";
    document.getElementById("cartSummary").style.display = "none";
    document.getElementById("emptyCart").style.display = "block";
    return;
  }

  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item";

    cartItemDiv.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="cart-item-details">
        <div class="cart-item-header">
          <div>
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-size">Ukuran: ${item.selectedSize}</div>
          </div>
          <button class="btn-remove" onclick="removeFromCart(${index})">Hapus</button>
        </div>
        <div class="cart-item-footer">
          <div class="cart-item-price">Rp${(item.price * item.quantity).toLocaleString("id-ID")}</div>
          <div class="item-quantity">
            <button onclick="decreaseItemQuantity(${index})">−</button>
            <input type="number" value="${item.quantity}" readonly />
            <button onclick="increaseItemQuantity(${index})">+</button>
          </div>
        </div>
      </div>
    `;

    cartItemsContainer.appendChild(cartItemDiv);
  });

  updateCartSummary();
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

function increaseItemQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

function decreaseItemQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
    renderCart();
  }
}

function updateCartSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const summaryDiv = document.getElementById("cartSummary");

  let subtotal = 0;
  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  const shipping = subtotal > 0 ? 20000 : 0;
  const total = subtotal + shipping;

  summaryDiv.innerHTML = `
    <div class="summary-title">Ringkasan Belanja</div>
    <div class="summary-row">
      <span>Total Item (${cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
      <span>Rp${subtotal.toLocaleString("id-ID")}</span>
    </div>
    <div class="summary-row">
      <span>Ongkir</span>
      <span>Rp${shipping.toLocaleString("id-ID")}</span>
    </div>
    <div class="summary-row total">
      <span>Total</span>
      <span>Rp${total.toLocaleString("id-ID")}</span>
    </div>
    <button class="btn-checkout" onclick="checkout()">LANJUT KE PEMBAYARAN</button>
  `;
}

function checkout() {
  window.location.href = "checkout.html";
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartBadge();
});

