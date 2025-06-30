const products = [
  { id: 1, name: "Foxtail Millet", price: 120, image: "images/Foxtail Millet.jpg" },
  { id: 2, name: "Millet Seeds", price: 100, image: "images/Glassjar.jpg" },
  { id: 3, name: "Organic Millet", price: 140, image: "images/image-millet.avif" },
  { id: 4, name: "Millet Harvest", price: 110, image: "images/pexels-photo.jpeg" }
];

let cart = {};

function renderProductButtons() {
  const items = document.querySelectorAll(".item");
  items.forEach((item, index) => {
    const controls = document.createElement("div");
    controls.className = "quantity-controls";
    controls.innerHTML = `
      <button onclick="updateQuantity(${products[index].id}, -1)">−</button>
      <span id="qty-${products[index].id}">0</span>
      <button onclick="updateQuantity(${products[index].id}, 1)">+</button>
    `;
    item.appendChild(controls);
  });
}

function updateQuantity(productId, change) {
  if (!cart[productId]) cart[productId] = 0;
  cart[productId] += change;
  if (cart[productId] < 0) cart[productId] = 0;
  document.getElementById(`qty-${productId}`).textContent = cart[productId];
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const total = document.getElementById("total");
  cartItems.innerHTML = "";
  let sum = 0;

  for (const id in cart) {
    const qty = cart[id];
    if (qty > 0) {
      const product = products.find(p => p.id == id);
      const itemTotal = product.price * qty;
      cartItems.innerHTML += `<p>${product.name} × ${qty} = ₹${itemTotal}</p>`;
      sum += itemTotal;
    }
  }

  total.textContent = sum;
}

function checkout() {
  const name = document.getElementById("rzp-name").value;
  const email = document.getElementById("rzp-email").value;
  const contact = document.getElementById("rzp-contact").value;

  if (!name || !email || !contact) {
    return alert("Please fill in all details before checkout.");
  }

  const amount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id == id);
    return sum + product.price * qty;
  }, 0) * 100;

  if (!amount) return alert("Your cart is empty!");

  const options = {
    key: "rzp_test_YourApiKeyHere", // 🔁 Replace with your Razorpay Test Key
    amount: amount,
    currency: "INR",
    name: "Preetreat",
    description: "Millet Purchase",
    handler: function (response) {
      alert("✅ Payment successful! Payment ID: " + response.razorpay_payment_id);
      cart = {};
      renderProductButtons();
      updateCart();
    },
    prefill: {
      name: name,
      email: email,
      contact: contact
    },
    theme: {
      color: "#1e5631"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}


window.onload = () => {
  renderProductButtons();
};
