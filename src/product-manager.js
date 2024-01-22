/* Since you can't see the return on the console running "node index.js" with each return 
we use a console.log too */

// NOTE: Default value for .json file is db.json

const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path || "./src/db.json";
    this.products;
  }

  async checkDb() {
    if (!this.products) {
      try {
        let db;
        if (fs.existsSync(this.path)) {
          db = await fs.promises.readFile(this.path);
        } else {
          await fs.promises.writeFile(this.path, JSON.stringify([]));
          db = await fs.promises.readFile(this.path);
        }
        this.products = JSON.parse(db);
      } catch (err) {
        console.log("error while checkingDb");
      }
    }
  }

  async addProduct(product) {
    try {
      await this.checkDb();
      if (this.products.some((e) => e?.code == product.code)) {
        console.log("Product already exists");
      } else if (this.checkNewProduct(product)) {
        const newId = this.generateId();
        this.products = [...this.products, { ...product, id: newId }];
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products, null, 4)
        );
        console.log(`Product added with id ${newId}`);
        return newId;
      } else {
        console.log("invalid product");
      }
    } catch (err) {
      console.log("error while trying to add product");
    }
  }

  async getProducts() {
    await this.checkDb();
    console.log(this.products)
    return this.products;
  }

  async getProductById(id) {
    await this.checkDb();
    const response = this.products.find((e) => e.id === id);
    console.log(`product with id "${id}":`, response);
    return response;
  }

  async updateProductById(id, fields) {
    try {
      await this.checkDb();
      const checkProduct = this.products.find((e) => e.id == id);
      if (checkProduct) {
        this.products = this.products.map((e) =>
          e.id == id ? { ...e, ...fields } : e
        );
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products, null, 4)
        );
        console.log("Updated product:", { ...checkProduct, ...fields });
      } else {
        console.log("Product to update not found");
      }
    } catch (err) {
      console.log("error while trying to update product");
    }
  }

  async deleteProductById(id) {
    try {
      await this.checkDb();
      const checkProduct = this.products.find((e) => e.id == id);
      if (checkProduct) {
        this.products = this.products.filter((e) => e.id != id);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products, null, 4)
        );
      } else {
        console.log("Product to delete not found");
      }
    } catch (err) {
      console.log("error while trying to delete product");
    }
  }

  checkNewProduct(product) {
    const fields = [
      "title",
      "description",
      "price",
      "thumbnail",
      "code",
      "stock",
    ];
    if (fields.every((e) => product[e])) return true;
    return false;
  }

  generateId() {
    const newId = Date.now().toString(36) + Math.random().toString(36);
    if (this.products.some((e) => e.id == newId)) {
      return generateId();
    } else {
      return newId;
    }
  }
}

// async function test(path) {
//   // Instance creation and tests
//   console.log(" ")
//   console.log("**********************************");
//   console.log(
//     "note: These test work according to the commentary when running it for the first time. Since the db is different after the first time running it, the comments wont reflect on the action of the function."
//   );
//   console.log("**********************************");
//   console.log(" ")

//   const newProdManager = new ProductManager(path);

//   console.log("**********************************");
//   console.log("getProducts shows empty array");
//   await newProdManager.getProducts();

//   console.log("**********************************");
//   console.log("addProduct adds product");
//   const product1Id = await newProdManager.addProduct({
//     title: "producto prueba",
//     description: "Este es un producto prueba",
//     price: 200,
//     thumbnail: "Sin imagen",
//     code: "abc123",
//     stock: 25,
//   });

//   console.log("**********************************");
//   console.log("addProduct adds second product");
//   const product2Id = await newProdManager.addProduct({
//     title: "producto prueba 2",
//     description: "Este es un producto prueba 2",
//     price: 200,
//     thumbnail: "Sin imagen",
//     code: "abc456",
//     stock: 30,
//   });

//   console.log("**********************************");
//   console.log("addProduct doesn't add invalid product (description missing)");
//   await newProdManager.addProduct({
//     title: "producto prueba 3",
//     price: 200,
//     thumbnail: "Sin imagen",
//     code: "def456",
//     stock: 30,
//   });

//   console.log("**********************************");
//   console.log("addProduct doesnt add product with existing code in products");
//   await newProdManager.addProduct({
//     title: "producto prueba",
//     description: "Este es un producto prueba",
//     price: 200,
//     thumbnail: "Sin imagen",
//     code: "abc123",
//     stock: 25,
//   });

//   console.log("**********************************");
//   console.log("getProducts shows product added");
//   await newProdManager.getProducts();

//   console.log("**********************************");
//   console.log("getProductById returns product by id");
//   await newProdManager.getProductById(product1Id);

//   console.log("**********************************");
//   console.log("getProductById doesnt return if id is not found in products");
//   await newProdManager.getProductById("asdasdasdasd");

//   console.log("**********************************");
//   console.log("updateProduct updates field title of product");
//   await newProdManager.updateProductById(product1Id, {
//     title: "Titulo modificado",
//   });

//   console.log("**********************************");
//   console.log("delete product by id");
//   await newProdManager.deleteProductById(product2Id);
//   console.log("products after deletion:");
//   await newProdManager.getProducts();
// }

// test("./db.json");

module.exports = ProductManager;
