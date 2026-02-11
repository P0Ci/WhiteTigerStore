function loadOrderSummary() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const summaryItems = document.getElementById("summaryItems");

  if (cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  summaryItems.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemDiv = document.createElement("div");
    itemDiv.className = "summary-item";
    itemDiv.innerHTML = `
      <div class="summary-item-info">
        <div class="summary-item-name">${item.name}</div>
        <div class="summary-item-detail">
          Ukuran: ${item.selectedSize} | Qty: ${item.quantity}
        </div>
      </div>
      <div class="summary-item-price">
        Rp${itemTotal.toLocaleString("id-ID")}
      </div>
    `;
    summaryItems.appendChild(itemDiv);
  });

  const shipping = subtotal > 0 ? 20000 : 0;
  const total = subtotal + shipping;

  document.getElementById("subtotalPrice").textContent =
    `Rp${subtotal.toLocaleString("id-ID")}`;
  document.getElementById("shippingPrice").textContent =
    `Rp${shipping.toLocaleString("id-ID")}`;
  document.getElementById("totalPrice").textContent =
    `Rp${total.toLocaleString("id-ID")}`;
}

function validateWhatsApp(phone) {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
}

function formatWhatsAppNumber(phone) {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

function generateWhatsAppMessage(formData) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let message = "*KONFIRMASI PESANAN*\n";
  message += "WHITE TIGER - Fashion Store\n";
  message += "=" + "=".repeat(40) + "\n\n";

  message += "*DATA PENGIRIMAN*\n";
  message += `Nama: ${formData.fullName}\n`;
  message += `Alamat: ${formData.address}\n`;
  message += `No. WhatsApp: ${formData.whatsapp}\n\n`;

  message += "*DETAIL PESANAN*\n";
  message += "-".repeat(42) + "\n";

  let subtotal = 0;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    message += `${item.name} (${item.selectedSize})\n`;
    message += `Qty: ${item.quantity} x Rp${item.price.toLocaleString("id-ID")}\n`;
    message += `Subtotal: Rp${itemTotal.toLocaleString("id-ID")}\n\n`;
  });

  message += "-".repeat(42) + "\n";
  const shipping = subtotal > 0 ? 20000 : 0;
  const total = subtotal + shipping;

  message += `Subtotal: Rp${subtotal.toLocaleString("id-ID")}\n`;
  message += `Ongkir: Rp${shipping.toLocaleString("id-ID")}\n`;
  message += `*TOTAL: Rp${total.toLocaleString("id-ID")}*\n\n`;

  message += "*METODE PEMBAYARAN*\n";
  const paymentMethods = {
    transfer: "Transfer Bank (BCA, Mandiri, BNI)",
    ewallet: "E-Wallet (Dana, OVO, GoPay)",
    cod: "COD (Bayar saat tiba)",
  };
  message += `${paymentMethods[formData.paymentMethod]}\n\n`;

  message += "Terima kasih telah berbelanja di WHITE TIGER!\n";
  message += "Hubungi kami jika ada pertanyaan: 081266117520";

  return encodeURIComponent(message);
}

function sendAdminNotification(formData) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let adminMessage = "*📦 PESANAN BARU MASUK*\n";
  adminMessage += "=" + "=".repeat(40) + "\n\n";

  adminMessage += "*PELANGGAN*\n";
  adminMessage += `Nama: ${formData.fullName}\n`;
  adminMessage += `WA: ${formData.whatsapp}\n`;
  adminMessage += `Alamat: ${formData.address}\n\n`;

  adminMessage += "*ITEMS*\n";
  let subtotal = 0;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    adminMessage += `• ${item.name} (${item.selectedSize}) x${item.quantity}\n`;
  });

  const shipping = subtotal > 0 ? 20000 : 0;
  const total = subtotal + shipping;
  adminMessage += `\n*TOTAL: Rp${total.toLocaleString("id-ID")}*\n`;
  adminMessage += `Metode: ${formData.paymentMethod}`;

  const adminPhone = "628126611752";
  const adminURL = `https://wa.me/${adminPhone}?text=${encodeURIComponent(adminMessage)}`;

  fetch(adminURL, { mode: "no-cors" }).catch(() => {
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadOrderSummary();
  updateCartBadge();

  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();
    const address = document.getElementById("address").value.trim();
    const paymentMethod = document.querySelector(
      'input[name="paymentMethod"]:checked',
    ).value;

    if (!fullName || !whatsapp || !address) {
      alert("Harap isi semua data yang diperlukan");
      return;
    }

    if (!validateWhatsApp(whatsapp)) {
      alert(
        "Format nomor WhatsApp tidak valid. Gunakan format: 62812345678 atau 0812345678",
      );
      return;
    }

    const formattedPhone = formatWhatsAppNumber(whatsapp);

    const formData = {
      fullName,
      whatsapp: formattedPhone,
      address,
      paymentMethod,
    };

    const message = generateWhatsAppMessage(formData);

    const buyerPhone = formattedPhone;

    const whatsappURL = `https://wa.me/${buyerPhone}?text=${message}`;

    if (
      confirm(
        "Pesanan akan dikirim ke WhatsApp Anda (" +
          formattedPhone +
          "). Lanjutkan? Pastikan nomor WhatsApp sudah benar.",
      )
    ) {
      const order = {
        id: Date.now(),
        customer: formData,
        cart: JSON.parse(localStorage.getItem("cart")) || [],
        timestamp: new Date().toISOString(),
      };

      let orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      localStorage.setItem("cart", JSON.stringify([]));
      updateCartBadge();

      sendAdminNotification(formData);

      window.location.href = whatsappURL;
    }
  });
});

