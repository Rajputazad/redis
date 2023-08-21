const express = require('express');
const bodyParser = require('body-parser');

const Redis = require('ioredis');

const app = express();

const Item= require("./db")
require("./config")
// const redis = new Redis({
//     host: 'redis://red-cjhgavr6fquc73bpdf4g', // Redis server's IP address
//   port: 6379,
//   tls: {
//     // If using TLS/SSL
//     rejectUnauthorized: false, // Make sure to use proper verification
//   },
// });
const redis = new Redis('rediss://red-cjhgavr6fquc73bpdf4g:HMEWicbfLH9qeOpEMo2sSdq5i1mBQibh@oregon-redis.render.com:6379');


app.use(bodyParser.json());

// Create a new item
app.post('/items', async (req, res) => {
  const newItem = req.body;
  const createdItem = await Item.create(newItem);
  await redis.del('items');
  res.json(createdItem);
});

// Get all items
app.get('/items', async (req, res) => {
  const cachedItems = await redis.get('items');
  console.log(cachedItems);
  if (cachedItems) {
    res.json(JSON.parse(cachedItems));
  } else {
    const items = await Item.find();
    await redis.set('items', JSON.stringify(items));
    res.json(items);
  }
});

// Get a specific item
app.get('/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const item = await Item.findById(itemId);
  
  if (!item) {
    res.status(404).json({ message: 'Item not found' });
  } else {
    res.json(item);
  }
});

// Update an item
app.put('/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;
  
  const result = await Item.findByIdAndUpdate(itemId, updatedItem);
  
  if (!result) {
    res.status(404).json({ message: 'Item not found' });
  } else {
    await redis.del('items'); // Clear the cached items
    res.json(updatedItem);
  }
});

// Delete an item
app.delete('/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const result = await Item.findByIdAndDelete(itemId);
  
  if (!result) {
    res.status(404).json({ message: 'Item not found' });
  } else {
    await redis.del('items'); // Clear the cached items
    res.json({ message: 'Item deleted' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
