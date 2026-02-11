const productsData = [
  {
    id: 1,
    name: "Kaos Hitam White Tiger V1",
    price: 180000,
    category: "Casual",
    image: "image/baju/kaos1 depan.png",
    backImage: "image/baju/kaos1 belakang.png",
    type: "kaos",
  },
  {
    id: 2,
    name: "Kaos Putih White Tiger V1",
    price: 180000,
    category: "Casual",
    image: "image/baju/kaos2 depan.png",
    backImage: "image/baju/kaos2 belakang.png",
    type: "kaos",
  },
  {
    id: 3,
    name: "Kaos Putih WT V2",
    price: 180000,
    category: "Casual",
    image: "image/baju/kaos3 depan.png",
    backImage: "image/baju/kaos3 belakang.png",
    type: "kaos",
  },
  {
    id: 4,
    name: "Kaos Hitam WT V2",
    price: 180000,
    category: "Casual",
    image: "image/baju/kaos4 depan.png",
    backImage: "image/baju/kaos4 belakang.png",
    type: "kaos",
  },
  {
    id: 5,
    name: "Varsity Premium White Tiger",
    price: 450000,
    category: "Formal",
    image: "image/baju/varsity1 depan.png",
    backImage: "image/baju/varsity1 belakang.png",
    type: "varsity",
  },
];

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = productsData.find((p) => p.id === productId);

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
      selectedSize: null,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const product = productsData.find((p) => p.id === productId);

  const existingItem = wishlist.find((item) => item.id === productId);
  if (!existingItem) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
}

function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter((item) => item.id !== productId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function isInWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  return wishlist.some((item) => item.id === productId);
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badge = document.getElementById("cartBadge");
  if (badge) {
    badge.textContent = totalItems;
  }
}

document.addEventListener("DOMContentLoaded", updateCartBadge);

(() => {
  let lastScrollPosition = 0;
  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  window.addEventListener("scroll", () => {
    const currentScrollPosition = window.scrollY;

    if (
      currentScrollPosition > lastScrollPosition &&
      currentScrollPosition > 50
    ) {
      navbar.classList.add("navbar-hidden");
    } else {
      navbar.classList.remove("navbar-hidden");
    }

    lastScrollPosition = currentScrollPosition <= 0 ? 0 : currentScrollPosition;
  });
})();
