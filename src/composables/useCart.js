import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';

export function useCart() {
  // Create a reactive cartItems reference that syncs with localStorage.
  const cartItems = useLocalStorage('cartItems', []);

  // Compute total items in the cart.
  const totalItems = computed(() =>
    cartItems.value.reduce((total, item) => total + (item.quantity || 0), 0)
  );

  // Compute total price of the cart.
  const total = computed(() =>
    cartItems.value.reduce((sum, item) => sum + (item.price * (item.quantity || 0)), 0)
  );

  // Add an item to the cart.
  const addToCart = (product) => {
    const index = cartItems.value.findIndex(item => item.id === product.id);
    if (index !== -1) {
      // Increase quantity if product already exists.
      cartItems.value[index].quantity += 1;
    } else {
      // Add new product to cart.
      cartItems.value.push({
        id: product.id,
        title: product.title,
        price: parseFloat(product.price), // Ensure price is a number.
        thumbnail: product.thumbnail,
        quantity: 1
      });
    }
  };

  // Update the quantity of an item.
  const updateItemQuantity = ({ id, quantity }) => {
    const index = cartItems.value.findIndex(item => item.id === id);
    if (index !== -1) {
      if (quantity > 0) {
        cartItems.value[index].quantity = quantity;
      } else {
        // Remove item if quantity is set to 0.
        cartItems.value.splice(index, 1);
      }
    }
  };

  // Remove an item from the cart.
  const removeFromCart = (id) => {
    const index = cartItems.value.findIndex(item => item.id === id);
    if (index !== -1) {
      cartItems.value.splice(index, 1);
    }
  };

  // Clear the entire cart.
  const clearCart = () => {
    cartItems.value = [];
  };

  function redirectToWhatsApp(cartItems, totalAmount) {
    const phoneNumber = '+2347038055097'; // Replace with the merchant's WhatsApp number in international format
  
    let message = '*Order Details:*\n';
    cartItems.forEach((item, index) => {
      message += `\n*${index + 1}. ${item.title}*`;
      message += `\n   - Price: $${item.price.toFixed(2)}`;
      message += `\n   - Quantity: ${item.quantity}`;
      message += `\n   - Subtotal: $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*Total Amount:* $${totalAmount.toFixed(2)}`;
  
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
    window.location.href = whatsappUrl;
  }
  

  // Checkout functionality.
  const checkout = () => {
    redirectToWhatsApp(cartItems.value, total.value);
    clearCart();
  };

  return {
    cartItems,
    totalItems,
    total,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    checkout
  };
}
