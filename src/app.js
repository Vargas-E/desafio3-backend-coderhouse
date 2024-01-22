const express = require("express");
const ProductManager = require("./product-manager");

const app = express();
const PUERTO = 8080;
const path = "./src/db.json";

const productManager = new ProductManager(path);

app.get("/products", async (req, res) => {
  const limit = req.query.limit;
  const products = await productManager.getProducts();
  try {
    if (limit) {
      res.json(products.slice(0, parseInt(limit)));
    } else {
      res.json(products);
    }
  } catch (err) {
    res.status(500).json({ error: "Error de servidor" });
  }
});

app.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(parseInt(pid));
  try {
    if (product) {
      res.json(product);
    } else {
      res.json({ error: "Producto no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error de servidor" });
  }
});

app.listen(PUERTO, () => {
  console.log(`Listening to port ${PUERTO}`);
});
