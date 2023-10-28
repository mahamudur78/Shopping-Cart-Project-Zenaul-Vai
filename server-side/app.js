const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const app = express();


const productUpload = require("./productUpload");

const PORT = 3000;

const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('uploads'));


mongoose.connect('mongodb+srv://mahamudur789:iRq41JPW4irpjdDv@uttra.pt1sfo4.mongodb.net/brta_invoice_db?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("database connection successful!"))
.catch((err) => console.log(err));

const Product = mongoose.model('Product', {
  productName: String,
  price: Number,
  stock: Number,
  productImg: String,
});

// Get all products
app.get('/products', async (req, res) => {
	res.header('Cache-Control', 'no-store');
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
//   console.log(productId);
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
app.post('/products', productUpload, async (req, res) => {
  const newProduct = req.body;
  
  try {

    if (req.files && req.files.length > 0) {
      newProduct.productImg = req.files[0].filename
    }

    const createdProduct = await Product.create(newProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a product by ID
app.put('/products/:id', productUpload, async (req, res) => {
  const productId = req.params.id;
  
  const updatedProduct = req.body;

  try {
    if (req.files && req.files.length > 0) {
        updatedProduct.productImg = req.files[0].filename
    }
    console.log(updatedProduct);

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
app.put('/buyproducts', async (req, res) => {
  
  const buyProduct = req.body;
//   console.log(buyProduct);
  
  try {

    let updateStock = buyProduct.map(async (data) =>{
      	const product = await Product.findOne({ _id: data._id });
		return await Product.findOneAndUpdate({ _id: data._id }, {stock: (product.stock - data.cartTotal)}, { new: true });
    });

    if (updateStock) {
      res.json(updateStock);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error111' });
  }
});