const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://mahamudur789:iRq41JPW4irpjdDv@uttra.pt1sfo4.mongodb.net/brta_invoice_db?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Product = mongoose.model('Product', {
  productName: String,
  price: Number,
  stock: Number,
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single product by ID
app.get('/products/:id', async (req, res) => {
  const productId = req.params.id;
  console.log(productId);
  try {
    const product = await Product.findOne({ _id: productId });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new product
app.post('/products', async (req, res) => {
  const newProduct = req.body;
  try {
    const createdProduct = await Product.create(newProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a product by ID
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  
  const updatedProduct = req.body;
  console.log(updatedProduct);
  try {
    const product = await Product.findOneAndUpdate({ _id: productId }, updatedProduct, { new: true });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a product by ID
app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;
  
  try {
    const product = await Product.findOneAndRemove({ _id: productId });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Buy product
app.put('/products/buy', async (req, res) => {
  
  const updatedProduct = req.body;
  console.log(updatedProduct);
  
  // console.log(updatedProduct);
  // try {
  //   const product = await Product.findOneAndUpdate({ _id: productId }, updatedProduct, { new: true });
  //   if (product) {
  //     res.json(product);
  //   } else {
  //     res.status(404).json({ message: 'Product not found' });
  //   }
  // } catch (error) {
  //   res.status(500).json({ error: 'Internal Server Error' });
  // }
});