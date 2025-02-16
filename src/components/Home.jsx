/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Package,
  TruckIcon,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Award,
} from "lucide-react";
import { backendUrl } from "../App";

const Home = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const fetchAllData = async () => {
    try {
      // Fetch orders
      const ordersResponse = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (ordersResponse.data.success) {
        const sortedOrders = ordersResponse.data.orders.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setOrders(sortedOrders);
      }

      // Fetch users
      const usersResponse = await axios.get(
        `${backendUrl}/api/user/all-users`,
        {
          headers: { token },
        }
      );
      if (usersResponse.data.success) {
        setUsers(usersResponse.data.users);
      }

      // Fetch products
      const productsResponse = await axios.get(
        `${backendUrl}/api/product/get-products`
      );
      if (productsResponse.data.success) {
        setProducts(productsResponse.data.products);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter orders by selected month
  const filteredOrders = orders.filter((order) => {
    const orderMonth = new Date(order.date).toISOString().slice(0, 7);
    return orderMonth === selectedMonth;
  });

  // Calculate analytics
  const analytics = {
    totalUsers: users.length,
    totalOrders: filteredOrders.length,
    orderStatus: {
      placed: filteredOrders.filter((order) => order.status === "order placed")
        .length,
      packing: filteredOrders.filter((order) => order.status === "packing")
        .length,
      outForDelivery: filteredOrders.filter(
        (order) => order.status === "out for delivery"
      ).length,
      delivered: filteredOrders.filter((order) => order.status === "delivered")
        .length,
    },
    netProfit: filteredOrders
      .filter((order) => order.status === "delivered")
      .reduce((total, order) => {
        const orderCost = order.items.reduce(
          (cost, item) => cost + item.costPrice,
          0
        );
        return total + (order.amount - orderCost);
      }, 0),
  };

  // Calculate best sellers
  const bestSellers = products
    .map((product) => {
      const timesSold = filteredOrders.reduce((count, order) => {
        const productInOrder = order.items.filter(
          (item) => item.id === product.id
        ).length;
        return count + productInOrder;
      }, 0);
      return { ...product, timesSold };
    })
    .sort((a, b) => b.timesSold - a.timesSold)
    .slice(0, 5);

  // Prepare chart data
  const orderStatusData = [
    { name: "Placed", value: analytics.orderStatus.placed },
    { name: "Packing", value: analytics.orderStatus.packing },
    { name: "Out for Delivery", value: analytics.orderStatus.outForDelivery },
    { name: "Delivered", value: analytics.orderStatus.delivered },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">{analytics.totalUsers}</h3>
            </div>
            <Users className="text-blue-500 w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">{analytics.totalOrders}</h3>
            </div>
            <Package className="text-green-500 w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Delivered Orders</p>
              <h3 className="text-2xl font-bold">
                {analytics.orderStatus.delivered}
              </h3>
            </div>
            <CheckCircle className="text-purple-500 w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Net Profit</p>
              <h3 className="text-2xl font-bold">
                ${analytics.netProfit.toFixed(2)}
              </h3>
            </div>
            <DollarSign className="text-yellow-500 w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Order Status Distribution</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={orderStatusData}
              cx={200}
              cy={150}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {orderStatusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Best Selling Products</h3>
          <div className="space-y-4">
            {bestSellers.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-lg font-semibold mr-2">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.category} - {product.subCategory}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{product.timesSold} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
