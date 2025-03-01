import axios from "axios";
import React, { useEffect, useState } from "react";

export default function AdminCustomer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/customer", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate this customer?"
    );
    if (!confirmDeactivate) return;

    try {
      await axios.patch(
        `http://localhost:3000/api/customer/${id}/deactivate`,
        {}, // Empty body for PATCH request
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      fetchCustomers(); // Refresh the list
    } catch (error) {
      console.error("Error deactivating customer:", error);
      setError("Failed to deactivate customer");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Customer Management</h1>

      {customers.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-600">No customers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div
              key={customer._id}
              className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {customer.full_name}
              </h3>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Email:</span> {customer.email}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Contact:</span>{" "}
                {customer.contact_number}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Address:</span> {customer.address}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    customer.active ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {customer.active ? "Active" : "Inactive"}
                </span>
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDeactivate(customer._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  Deactivate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
