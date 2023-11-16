import { CartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";

export class CartsController {
  //get carts
  static getCarts = async (req, res) => {
    try {
      const carts = await CartsService.getCarts();
      res.json({ data: carts });
    } catch (error) {
      res.json({ error: error.message });
    }
  };

  //add cart
  static addCart = async (req, res) => {
    try {
      const cart = await CartsService.addCart();
      res.json({
        status: "success",
        message: "cart added successfully",
        data: cart,
      });
    } catch (error) {
      res.json({ error: error.message });
    }
  };

  //get cart id
  static getCartById = async (req, res) => {
    try {
      const cid = req.params.cid;
      const cart = await CartsService.getCartById(cid);
      res.json({ data: `cart ID: ${cid}`, cart });
    } catch (error) {
      res.json({ error: error.message });
    }
  };

  //delete cart
  static deleteCart = async (req, res) => {
    try {
      const cid = req.params.cid;
      await CartsService.deleteCart(cid);
      res.json({
        status: "success",
        message: "cart deleted successfully",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //agregar productos al arreglo del carrito seleccionado
  static addProduct = async (req, res) => {
    try {
      const { cid, pid } = req.params;

      //verificar que el cart y el product existan
      await CartsService.getCartById(cid);
      await ProductsService.getProductById(pid);

      const result = await CartsService.addProduct(cid, pid);

      res.json({
        status: "success",
        message: `product ${pid} added to cart ${cid} successfully`,
        data: result,
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //eliminar product del cart
  static deleteProductCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      await CartsService.getCartById(cid);
      const result = await CartsService.deleteProductCart(cid, pid);
      res.json({
        status: "success",
        message: "product deleted from cart successfully",
        result,
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //actualizar quantity del product en el cart
  static updateProductCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { newQuantity } = req.body;
      await CartsService.getCartById(cid);
      const result = await CartsService.updateProductCart(
        cid,
        pid,
        newQuantity
      );
      res.json({
        data: result,
        status: "success",
        message: "product updated successfully",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };
}
