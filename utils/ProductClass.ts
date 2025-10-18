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
