let currentProduct = null;
let selectedSize = null;
let quantity = 1;
let isShowingFront = true;

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

function loadProductDetail() {
  const productId = getProductIdFromUrl();
  currentProduct = productsData.find((p) => p.id === productId);

  if (!currentProduct) {
    window.location.href = "shop.html";
    return;
  }

  document.getElementById("breadcrumbTitle").textContent = currentProduct.name;

  document.getElementById("productTitle").textContent = currentProduct.name;
  document.getElementById("productPrice").textContent =
    `Rp${currentProduct.price.toLocaleString("id-ID")}`;

  document.getElementById("mainImage").src = currentProduct.image;
  document.getElementById("thumb1").src = currentProduct.image;
  document.getElementById("thumb2").src = currentProduct.backImage;

  const descriptions = {
    1: "Kaos berkualitas tinggi dengan desain nyaman dan bahan yang breathable. Cocok untuk penggunaan sehari-hari dengan gaya yang kasual.",
    2: "Kaos klasik dengan warna putih yang timeless. Bahan premium yang tahan lama dan nyaman digunakan sepanjang hari.",
    3: "Kaos premium hitam dengan desain minimalis yang elegan. Perfect untuk ditampilkan dengan berbagai outfit.",
    4: "Kaos sporty dengan desain modern dan bahan yang perfect untuk aktivitas outdoor. Sangat nyaman dan stylish.",
    5: "Varsity premium dengan kualitas terbaik. Kombinasi warna yang menarik dan desain yang sophisticated untuk gaya yang lebih formal.",
  };

  document.getElementById("productDescription").textContent =
    descriptions[productId] ||
    "Produk berkualitas dengan bahan premium dan desain yang stylish.";

  updateWishlistButton();
}

function switchImage(index) {
  const mainImage = document.getElementById("mainImage");
  const thumb1 = document.getElementById("thumb1");
  const thumb2 = document.getElementById("thumb2");

  if (index === 0) {
    mainImage.src = currentProduct.image;
    thumb1.classList.add("active");
    thumb2.classList.remove("active");
    isShowingFront = true;
  } else {
    mainImage.src = currentProduct.backImage;
    thumb1.classList.remove("active");
    thumb2.classList.add("active");
    isShowingFront = false;
  }
}

function toggleImage() {
  if (isShowingFront) {
    switchImage(1);
  } else {
    switchImage(0);
  }
}

function increaseQuantity() {
  quantity++;
  document.getElementById("quantity").value = quantity;
}

function decreaseQuantity() {
  if (quantity > 1) {
    quantity--;
    document.getElementById("quantity").value = quantity;
  }
}

function selectSize(size) {
  selectedSize = size;

  const sizeBtns = document.querySelectorAll(".size-btn");
  sizeBtns.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.size === size) {
      btn.classList.add("active");
    }
  });
}

function addToCartFromDetail() {
  if (!selectedSize) {
    alert("Silakan pilih ukuran terlebih dahulu");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(
    (item) =>
      item.id === currentProduct.id && item.selectedSize === selectedSize,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      ...currentProduct,
      quantity: quantity,
      selectedSize: selectedSize,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();

  alert(
    `${currentProduct.name} (Ukuran ${selectedSize}) ditambahkan ke keranjang!`,
  );
  quantity = 1;
  document.getElementById("quantity").value = 1;
}

function toggleWishlistFromDetail() {
  if (isInWishlist(currentProduct.id)) {
    removeFromWishlist(currentProduct.id);
  } else {
    addToWishlist(currentProduct.id);
  }
  updateWishlistButton();
}

function updateWishlistButton() {
  const btn = document.querySelector(".btn-wishlist");
  if (isInWishlist(currentProduct.id)) {
    btn.innerHTML =
      '<i data-feather="heart" style="fill: currentColor;"></i> HAPUS DARI WISHLIST';
  } else {
    btn.innerHTML = '<i data-feather="heart"></i> TAMBAH KE WISHLIST';
  }
  feather.replace();
}

document.addEventListener("DOMContentLoaded", () => {
  const sizeBtns = document.querySelectorAll(".size-btn");
  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectSize(btn.dataset.size);
    });
  });

  loadProductDetail();
  updateCartBadge();
});

