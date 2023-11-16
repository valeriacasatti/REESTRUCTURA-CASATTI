import { productsDao } from "../dao/index.js";

export class ProductsService {
  //get products
  static getProducts = () => {
    return productsDao.getProducts();
  };
  //get products paginate
  static getProductsPaginate = (query, options) => {
    return productsDao.getProductsPaginate(query, options);
  };
  //add product
  static addProducts = (productInfo) => {
    return productsDao.addProduct(productInfo);
  };
  //get product by id
  static getProductById = (id) => {
    return productsDao.getProductById(id);
  };
  //update product
  static updateProduct = (id, updatedContent) => {
    return productsDao.updateProduct(id, updatedContent);
  };
  //delete product
  static deleteProduct = (id) => {
    return productsDao.deleteProduct(id);
  };
}
