const express = require('express');
const router = express.Router();

// Placeholder product data
const products = [
  { id: 1, name: 'Wooden Bowl', price: 25.99, category: 'Kitchen', stock: 10 },
  { id: 2, name: 'Carved Frame', price: 45.00, category: 'Decor', stock: 5 },
  { id: 3, name: 'Wooden Stool', price: 89.99, category: 'Furniture', stock: 8 },
];

// GET all products
router.get('/', (req, res) => {
  res.json({ success: true, data: products });
});

// GET single product
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

module.exports = router;
