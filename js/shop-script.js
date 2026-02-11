function renderProducts() {
  const grid = document.getElementById("productsGrid");

  productsData.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.cursor = "pointer";

    const isInWlist = isInWishlist(product.id);

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" data-front="${product.image}" data-back="${product.backImage}" />
        <button class="favorite-btn" onclick="toggleWishlist(event, ${product.id})">
          <i data-feather="heart" ${isInWlist ? 'style="fill: currentColor;"' : ""}></i>
        </button>
      </div>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price">Rp.${product.price.toLocaleString("id-ID")}</p>
      <p class="product-category">${product.category}</p>
    `;

    const productImg = card.querySelector(".product-image img");
    card.addEventListener("mouseenter", () => {
      productImg.src = productImg.dataset.back;
    });
    card.addEventListener("mouseleave", () => {
      productImg.src = productImg.dataset.front;
    });

    card.addEventListener("click", (e) => {
      if (!e.target.closest(".favorite-btn")) {
        navigateToDetail(product.id);
      }
    });

    grid.appendChild(card);
  });

  feather.replace();
}

function toggleWishlist(event, productId) {
  event.stopPropagation();

  if (isInWishlist(productId)) {
    removeFromWishlist(productId);
  } else {
    addToWishlist(productId);
  }

  renderProducts();
}

function navigateToDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartBadge();
});

