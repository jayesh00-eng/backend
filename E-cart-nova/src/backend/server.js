import http from "http";
import connectDB from "./config/db.js";

import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./routes/productRoutes.js";

import {
  createOrder,
  getOrders,
  updateOrderStatus,
  getCustomerOrders,
  cancelOrder,
} from "./routes/orderRoutes.js";

import {
  registerUser,
  loginUser,
  loginAdmin,
  seedAdmin,
} from "./routes/userRoutes.js";

import Product from "./models/Product.js";
import User from "./models/User.js";
import Order from "./models/Order.js";

const PORT = 5000;

// =====================================================
// DATABASE + DEFAULT ADMIN
// =====================================================

await connectDB();
await seedAdmin();

// =====================================================
// SEND RESPONSE
// =====================================================

const send = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods":
      "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type",
  });

  res.end(JSON.stringify(data));
};

// =====================================================
// PARSE REQUEST BODY
// =====================================================

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });

// =====================================================
// CREATE SERVER
// =====================================================

const server = http.createServer(
  async (req, res) => {
    // =================================================
    // CORS
    // =================================================

    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );

    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type"
    );

    // =================================================
    // OPTIONS
    // =================================================

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      // =================================================
      // URL
      // =================================================

      const url = new URL(
        req.url,
        `http://${
          req.headers.host ||
          "localhost:5000"
        }`
      );

      const pathname = url.pathname;
      const method = req.method;

      // =================================================
      // REQUEST BODY
      // =================================================

      req.body =
        method === "POST" ||
        method === "PUT"
          ? await parseBody(req)
          : {};

      // =================================================
      // TEST ROUTE
      // =================================================

      if (
        method === "GET" &&
        pathname === "/"
      ) {
        return send(res, 200, {
          success: true,
          message:
            "E-Cart Nova Backend Running",
        });
      }

      // =================================================
      // AUTH
      // =================================================

      // -------------------------------------------------
      // REGISTER
      // -------------------------------------------------

      if (
        method === "POST" &&
        pathname === "/register"
      ) {
        const result =
          await registerUser(req.body);

        if (result.error) {
          return send(res, 400, {
            success: false,
            message: result.error,
          });
        }

        return send(res, 201, {
          success: true,
          message:
            "Registration successful",
          user: result.user,
        });
      }

      // -------------------------------------------------
      // CUSTOMER LOGIN
      // -------------------------------------------------

      if (
        method === "POST" &&
        pathname === "/login"
      ) {
        const user =
          await loginUser(
            req.body.email,
            req.body.password
          );

        if (!user) {
          return send(res, 401, {
            success: false,
            message:
              "Invalid email or password",
          });
        }

        return send(res, 200, {
          success: true,
          message:
            "Login successful",
          user,
        });
      }

      // -------------------------------------------------
      // ADMIN LOGIN
      // -------------------------------------------------

      if (
        method === "POST" &&
        pathname === "/admin-login"
      ) {
        const user =
          await loginAdmin(
            req.body.email,
            req.body.password
          );

        if (!user) {
          return send(res, 401, {
            success: false,
            message:
              "Invalid admin email or password",
          });
        }

        return send(res, 200, {
          success: true,
          message:
            "Admin login successful",
          user,
        });
      }

      // =================================================
      // PRODUCTS
      // =================================================

      // -------------------------------------------------
      // GET ALL PRODUCTS
      // -------------------------------------------------

      if (
        method === "GET" &&
        pathname ===
          "/api/products"
      ) {
        return getProducts(
          req,
          res
        );
      }

      // -------------------------------------------------
      // ADD PRODUCT
      // -------------------------------------------------

      if (
        method === "POST" &&
        pathname ===
          "/api/products"
      ) {
        return addProduct(
          req,
          res
        );
      }

      // -------------------------------------------------
      // SINGLE PRODUCT
      // -------------------------------------------------

      if (
        pathname.startsWith(
          "/api/products/"
        )
      ) {
        const id =
          pathname.split("/")[3];

        // GET SINGLE PRODUCT
        if (method === "GET") {
          return getProduct(
            req,
            res,
            id
          );
        }

        // UPDATE PRODUCT
        if (method === "PUT") {
          return updateProduct(
            req,
            res,
            id
          );
        }

        // DELETE PRODUCT
        if (method === "DELETE") {
          return deleteProduct(
            req,
            res,
            id
          );
        }
      }

      // =================================================
      // DEMO PAYMENT
      // =================================================

      if (
        method === "POST" &&
        pathname ===
          "/api/payment/demo"
      ) {
        const {
          paymentMethod,
          amount,
        } = req.body;

        // Payment method check

        if (!paymentMethod) {
          return send(res, 400, {
            success: false,
            message:
              "Payment method is required",
          });
        }

        // Allowed methods

        const allowedMethods = [
          "UPI",
          "DEBIT_CARD",
        ];

        if (
          !allowedMethods.includes(
            paymentMethod
          )
        ) {
          return send(res, 400, {
            success: false,
            message:
              "Invalid demo payment method",
          });
        }

        // Amount check

        if (
          !amount ||
          Number(amount) <= 0
        ) {
          return send(res, 400, {
            success: false,
            message:
              "Invalid payment amount",
          });
        }

        // Demo payment ID

        const demoPaymentId =
          "DEMO_" +
          paymentMethod +
          "_" +
          Date.now();

        return send(res, 200, {
          success: true,
          message:
            "Demo payment successful",
          paymentId:
            demoPaymentId,
          paymentMethod:
            paymentMethod,
          amount:
            Number(amount),
          demo: true,
        });
      }

      // =================================================
      // ORDERS
      // =================================================

      // -------------------------------------------------
      // GET ALL ORDERS - ADMIN
      // -------------------------------------------------

      if (
        method === "GET" &&
        pathname ===
          "/api/orders"
      ) {
        return getOrders(
          req,
          res
        );
      }

      // -------------------------------------------------
      // CREATE ORDER - CUSTOMER
      // -------------------------------------------------

      if (
        method === "POST" &&
        pathname ===
          "/api/orders"
      ) {
        return createOrder(
          req,
          res
        );
      }

      // -------------------------------------------------
      // CANCEL ORDER - CUSTOMER
      // -------------------------------------------------

      if (
        method === "PUT" &&
        pathname.startsWith(
          "/api/orders/cancel/"
        )
      ) {
        const orderId =
          pathname.split("/")[4];

        return cancelOrder(
          req,
          res,
          orderId
        );
      }

      // -------------------------------------------------
      // UPDATE ORDER STATUS - ADMIN
      // -------------------------------------------------

      if (
        method === "PUT" &&
        pathname.startsWith(
          "/api/orders/"
        ) &&
        pathname.endsWith(
          "/status"
        )
      ) {
        const id =
          pathname.split("/")[3];

        return updateOrderStatus(
          req,
          res,
          id
        );
      }

      // -------------------------------------------------
      // GET CUSTOMER ORDERS
      // -------------------------------------------------

      if (
        method === "GET" &&
        pathname.startsWith(
          "/api/orders/customer/"
        )
      ) {
        const customerId =
          pathname.split("/")[4];

        return getCustomerOrders(
          req,
          res,
          customerId
        );
      }

      // =================================================
      // ADMIN STATS
      // =================================================

      if (
        method === "GET" &&
        pathname ===
          "/api/admin/stats"
      ) {
        const totalProducts =
          await Product.countDocuments();

        const totalCustomers =
          await User.countDocuments({
            role: "customer",
          });

        const totalOrders =
          await Order.countDocuments();

        const salesData =
          await Order.aggregate([
            {
              $match: {
                status: {
                  $ne: "Cancelled",
                },
              },
            },

            {
              $group: {
                _id: null,

                total: {
                  $sum:
                    "$totalAmount",
                },
              },
            },
          ]);

        return send(res, 200, {
          success: true,

          totalProducts,

          totalCustomers,

          totalOrders,

          totalSales:
            salesData.length > 0
              ? salesData[0].total
              : 0,
        });
      }

      // =================================================
      // ADMIN CUSTOMERS
      // =================================================

      if (
        method === "GET" &&
        pathname ===
          "/api/admin/customers"
      ) {
        const customers =
          await User.find({
            role: "customer",
          }).select(
            "-password"
          );

        return send(res, 200, {
          success: true,
          customers,
        });
      }

      // =================================================
      // 404
      // =================================================

      return send(res, 404, {
        success: false,
        message:
          "Route not found",
      });

    } catch (error) {
      console.error(
        "SERVER ERROR:",
        error
      );

      return send(res, 500, {
        success: false,
        message:
          "Server error",
        error:
          error.message,
      });
    }
  }
);

// =====================================================
// START SERVER
// =====================================================

server.listen(
  PORT,
  () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  }
);