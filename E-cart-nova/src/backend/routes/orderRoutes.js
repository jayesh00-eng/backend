import Order from "../models/Order.js";
import Product from "../models/Product.js";

// =========================
// SEND RESPONSE
// =========================

const send = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(data));
};


// =========================
// CREATE ORDER
// =========================

export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      address,
      paymentMethod,
    } = req.body;

    // Customer check
    if (!customer) {
      return send(res, 400, {
        message: "Customer is required",
      });
    }

    // Cart check
    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return send(res, 400, {
        message: "Cart is empty",
      });
    }

    // Payment method
    const method = [
      "COD",
      "UPI",
      "Card",
    ].includes(paymentMethod)
      ? paymentMethod
      : "COD";

    // =========================
    // CHECK STOCK + TOTAL
    // =========================

    let serverTotal = 0;

    for (const item of items) {
      const product =
        await Product.findById(
          item.product
        );

      if (!product) {
        return send(res, 400, {
          message:
            `${item.name} is no longer available`,
        });
      }

      if (
        product.stock <
        Number(item.quantity)
      ) {
        return send(res, 400, {
          message:
            `Only ${product.stock} left in stock for ${product.name}`,
        });
      }

      serverTotal +=
        product.price *
        Number(item.quantity);
    }

    // =========================
    // REDUCE STOCK
    // =========================

    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock:
              -Number(item.quantity),
          },
        }
      );
    }

    // =========================
    // CREATE ORDER
    // =========================

    const order =
      await Order.create({
        customer,
        items,
        totalAmount:
          serverTotal,
        address,
        paymentMethod:
          method,

        // COD = Pending
        // UPI/Card = Demo Paid
        paymentStatus:
          method === "COD"
            ? "Pending"
            : "Paid",

        status: "Pending",
      });

    return send(res, 201, {
      message:
        "Order created successfully",
      order,
    });

  } catch (error) {
    console.log(error);

    return send(res, 500, {
      message:
        "Failed to create order",
    });
  }
};


// =========================
// GET ALL ORDERS - ADMIN
// =========================

export const getOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find()
        .populate(
          "customer",
          "name email phone"
        )
        .sort({
          createdAt: -1,
        });

    return send(
      res,
      200,
      orders
    );

  } catch (error) {
    console.log(error);

    return send(res, 500, {
      message:
        "Failed to get orders",
    });
  }
};


// =========================
// UPDATE ORDER STATUS - ADMIN
// =========================

export const updateOrderStatus =
  async (
    req,
    res,
    id
  ) => {
    try {

      const update = {
        status:
          req.body.status,
      };

      // Delivered hone par
      // payment Paid
      if (
        req.body.status ===
        "Delivered"
      ) {
        update.paymentStatus =
          "Paid";
      }

      const order =
        await Order.findByIdAndUpdate(
          id,
          update,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!order) {
        return send(res, 404, {
          message:
            "Order not found",
        });
      }

      return send(res, 200, {
        message:
          "Order status updated",
        order,
      });

    } catch (error) {
      console.log(error);

      return send(res, 500, {
        message:
          "Failed to update order",
      });
    }
  };


// =========================
// GET CUSTOMER ORDERS
// =========================

export const getCustomerOrders =
  async (
    req,
    res,
    customerId
  ) => {
    try {

      const orders =
        await Order.find({
          customer:
            customerId,
        }).sort({
          createdAt: -1,
        });

      return send(
        res,
        200,
        orders
      );

    } catch (error) {
      console.log(error);

      return send(res, 500, {
        message:
          "Failed to get customer orders",
      });
    }
  };


// =========================
// CANCEL ORDER - CUSTOMER
// =========================

export const cancelOrder =
  async (
    req,
    res,
    orderId
  ) => {
    try {

      // Find order
      const order =
        await Order.findById(
          orderId
        );

      // Order not found
      if (!order) {
        return send(res, 404, {
          message:
            "Order not found",
        });
      }

      // Already cancelled
      if (
        order.status ===
        "Cancelled"
      ) {
        return send(res, 400, {
          message:
            "Order is already cancelled",
        });
      }

      // Delivered order
      // cannot be cancelled
      if (
        order.status ===
        "Delivered"
      ) {
        return send(res, 400, {
          message:
            "Delivered order cannot be cancelled",
        });
      }

      // =========================
      // RESTORE PRODUCT STOCK
      // =========================

      for (
        const item of order.items
      ) {

        if (!item.product) {
          continue;
        }

        await Product.findByIdAndUpdate(
          item.product,
          {
            $inc: {
              stock:
                Number(
                  item.quantity
                ),
            },
          }
        );
      }

      // =========================
      // CANCEL ORDER
      // =========================

      order.status =
        "Cancelled";

      // COD
      if (
        order.paymentMethod ===
        "COD"
      ) {
        order.paymentStatus =
          "Pending";
      }

      // UPI / Card
      // Demo payment
      if (
        order.paymentMethod ===
          "UPI" ||
        order.paymentMethod ===
          "Card"
      ) {
        order.paymentStatus =
          "Refunded";
      }

      await order.save();

      return send(res, 200, {
        message:
          "Order cancelled successfully",
        order,
      });

    } catch (error) {
      console.log(error);

      return send(res, 500, {
        message:
          "Failed to cancel order",
      });
    }
  };