import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { API_URL } from "../config";

function AdminCustomers() {

  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  // =====================================================
  // LOAD CUSTOMERS + ORDERS
  // =====================================================

  useEffect(() => {

    const loadData = async () => {

      try {

        const [cRes, oRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/customers`),
          fetch(`${API_URL}/api/orders`),
        ]);


        const c = await cRes.json();
        const o = await oRes.json();


        // =================================================
        // CUSTOMERS
        // Backend response:
        // {
        //   success: true,
        //   customers: [...]
        // }
        // =================================================

        if (c && Array.isArray(c.customers)) {

          setCustomers(c.customers);

        } else {

          setCustomers([]);

        }


        // =================================================
        // ORDERS
        // =================================================

        if (Array.isArray(o)) {

          setOrders(o);

        } else if (
          o &&
          Array.isArray(o.orders)
        ) {

          setOrders(o.orders);

        } else {

          setOrders([]);

        }


      } catch (error) {

        console.log(
          "Customer Load Error:",
          error
        );

        setCustomers([]);
        setOrders([]);

      } finally {

        setLoading(false);

      }

    };


    loadData();

  }, []);


  // =====================================================
  // COUNT CUSTOMER ORDERS
  // =====================================================

  const orderCount = (id) => {

    return orders.filter(
      (o) =>
        o.customer?._id === id
    ).length;

  };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="admin-layout">

      <AdminSidebar />


      <main className="admin-main">

        {/* HEADER */}

        <div className="admin-header">

          <div>

            <h1>
              Customers
            </h1>

            <p>
              Registered customers ({customers.length})
            </p>

          </div>

        </div>


        {/* CUSTOMER BOX */}

        <div className="admin-box">

          {loading ? (

            <p>
              Loading customers...
            </p>

          ) : customers.length === 0 ? (

            <p>
              Abhi tak koi customer register nahi hua.
            </p>

          ) : (

            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    <th>#</th>

                    <th>
                      Name
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Joined
                    </th>

                    <th>
                      Total Orders
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {customers.map(
                    (customer, index) => (

                      <tr
                        key={customer._id}
                      >

                        <td>
                          {index + 1}
                        </td>


                        <td>
                          {customer.name}
                        </td>


                        <td>
                          {customer.email}
                        </td>


                        <td>

                          {customer.createdAt
                            ? new Date(
                                customer.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}

                        </td>


                        <td>
                          {orderCount(
                            customer._id
                          )}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>

  );

}

export default AdminCustomers;