function renderWishlist() {
  const wishlistGrid = document.getElementById("wishlistGrid");
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlist.length === 0) {
    document.getElementById("wishlistGrid").style.display = "none";
    document.getElementById("emptyWishlist").style.display = "block";
    return;
  }

  document.getElementById("emptyWishlist").style.display = "none";
  document.getElementById("wishlistGrid").style.display = "grid";

  wishlistGrid.innerHTML = "";

  wishlist.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" data-front="${product.image}" data-back="${product.backImage}" />
        <button class="favorite-btn" onclick="removeFromWishlistPage(${product.id})">
          <i data-feather="heart" style="fill: currentColor;"></i>
        </button>
      </div>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">Rp${product.price.toLocaleString("id-ID")}</p>
      <p class="product-category">${product.category}</p>
      <div class="wish-card-action">
        <button class="btn-add-cart-wish" onclick="goToDetail(${product.id})">LIHAT DETAIL</button>
        <button class="btn-remove-wish" onclick="removeFromWishlistPage(${product.id})">HAPUS</button>
      </div>
    `;

    const productImg = card.querySelector(".product-image img");
    card.addEventListener("mouseenter", () => {
      productImg.src = productImg.dataset.back;
    });
    card.addEventListener("mouseleave", () => {
      productImg.src = productImg.dataset.front;
    });

    wishlistGrid.appendChild(card);
  });

  feather.replace();
}

function removeFromWishlistPage(productId) {
  removeFromWishlist(productId);
  renderWishlist();
}

function goToDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
  updateCartBadge();
});

