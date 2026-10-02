import apiClient from './client';

export const orderApi = {
  async createOrder(orderData) {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    } catch {
      // Simulate order placement
      const savedOrders = JSON.parse(localStorage.getItem('snitch_orders') || '[]');
      const newOrder = {
        id: 'SNITCH-' + Math.floor(100000 + Math.random() * 900000),
        ...orderData,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };
      savedOrders.unshift(newOrder);
      localStorage.setItem('snitch_orders', JSON.stringify(savedOrders));
      return { success: true, order: newOrder };
    }
  },

  async getUserOrders() {
    try {
      const response = await apiClient.get('/orders/my-orders');
      return response.data;
    } catch {
      return JSON.parse(localStorage.getItem('snitch_orders') || '[]');
    }
  },
};
