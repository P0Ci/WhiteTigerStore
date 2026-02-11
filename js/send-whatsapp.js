/*
Simple Express server to send WhatsApp messages via WhatsApp Cloud API.
Requirements:
- Node.js 16+
- Set environment variables: WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID

This endpoint expects POST /api/send-whatsapp with JSON body:
{ order: {...}, formData: {...} }

It will send a text message to the customer's WhatsApp number using the WhatsApp Cloud API.
*/

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
  console.warn(
    "Warning: WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID not set. Server will start but sending will fail.",
  );
}

function buildMessage(formData, order) {
  const cart = order.cart || [];
  let lines = [];
  lines.push("*KONFIRMASI PESANAN*");
  lines.push("WHITE TIGER - Fashion Store");
  lines.push("==============================");
  lines.push("");
  lines.push("*DATA PENGIRIMAN*");
  lines.push(`Nama: ${formData.fullName}`);
  lines.push(`Alamat: ${formData.address}`);
  lines.push(`No. WhatsApp: ${formData.whatsapp}`);
  lines.push("");
  lines.push("*DETAIL PESANAN*");
  lines.push("------------------------------");

  let subtotal = 0;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    lines.push(`${item.name} (${item.selectedSize})`);
    lines.push(
      `Qty: ${item.quantity} x Rp${item.price.toLocaleString("id-ID")}`,
    );
    lines.push(`Subtotal: Rp${itemTotal.toLocaleString("id-ID")}`);
    lines.push("");
  });

  const shipping = subtotal > 0 ? 20000 : 0;
  const total = subtotal + shipping;

  lines.push("------------------------------");
  lines.push(`Subtotal: Rp${subtotal.toLocaleString("id-ID")}`);
  lines.push(`Ongkir: Rp${shipping.toLocaleString("id-ID")}`);
  lines.push(`*TOTAL: Rp${total.toLocaleString("id-ID")}*`);
  lines.push("");
  lines.push("*METODE PEMBAYARAN*");
  lines.push(`${formData.paymentMethod}`);
  lines.push("");
  lines.push("Terima kasih telah berbelanja di WHITE TIGER!");
  lines.push("Hubungi kami jika ada pertanyaan: 081266117520");

  return lines.join("\n");
}

app.post("/api/send-whatsapp", async (req, res) => {
  try {
    const { order, formData } = req.body;
    if (!order || !formData || !formData.whatsapp) {
      return res
        .status(400)
        .json({ error: "order and formData.whatsapp required" });
    }

    console.log("Received /api/send-whatsapp request");
    console.log("formData:", JSON.stringify(formData));
    console.log("order id:", order && order.id);

    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      return res
        .status(500)
        .json({ error: "WhatsApp credentials not configured on server" });
    }

    // Ensure phone in international format without '+' (e.g., 628123...)
    const to = formData.whatsapp.replace(/\D/g, "");

    const body = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: {
        body: buildMessage(formData, order),
      },
    };

    const apiUrl = `https://graph.facebook.com/v16.0/${PHONE_NUMBER_ID}/messages`;

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const respText = await resp.text();
    console.log("WhatsApp API response status:", resp.status);
    console.log("WhatsApp API response body:", respText);

    if (!resp.ok) {
      return res
        .status(502)
        .json({
          error: "WhatsApp API error",
          status: resp.status,
          details: respText,
        });
    }

    let data;
    try {
      data = JSON.parse(respText);
    } catch (e) {
      data = respText;
    }

    // Optionally store/send order confirmation elsewhere here

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

app.listen(PORT, () => {
  console.log(`WhatsApp relay server running on port ${PORT}`);
});
