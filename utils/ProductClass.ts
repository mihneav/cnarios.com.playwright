export class Product {
  productName: string;
  category: string;
  price: number;
  rating: number;
  stock: string | undefined;

  constructor(
    productName: string,
    category: string,
    price: number,
    rating: number,
    stock?: string
  ) {
    this.productName = productName;
    this.category = category;
    this.price = price;
    this.rating = rating;
    this.stock = stock;
  }

  addProduct(
    productName: string,
    category: string,
    price: number,
    rating: number
  ) {
    const newProduct = new Product(productName, category, price, rating);
    // Code to add newProduct to database or list
    return newProduct;
  }

  async getName() {
    return this.productName;
  }

  async getCategory() {
    return this.category;
  }

  async getPrice() {
    return this.price;
  }

  async getRating() {
    return this.rating;
  }

  async getStock() {
    return this.stock;
  }

  async getProduct(productName: string) {
    if (productName === this.productName) {
      return {
        name: this.productName,
        category: this.category,
        price: this.price,
        rating: this.rating,
        stock: this.stock,
      };
    }
    return null;
  }
}
