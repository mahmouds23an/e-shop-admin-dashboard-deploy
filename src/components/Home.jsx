/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Package,
  CheckCircle,
  DollarSign,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";
import { isWithinInterval, startOfMonth } from "date-fns";
import { backendUrl } from "../App";

const Home = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState(
    startOfMonth(new Date()).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchAllData = async () => {
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } }),
        axios.get(`${backendUrl}/api/user/all-users`, { headers: { token } }),
        axios.get(`${backendUrl}/api/product/get-products`),
      ]);

      if (ordersRes.data.success) {
        setOrders(
          ordersRes.data.orders.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          ) // Fixed: Added closing parenthesis
        );
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.users);
      }
      if (productsRes.data.success) {
        setProducts(productsRes.data.products);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter orders by date range
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.date);
    return isWithinInterval(orderDate, {
      start: new Date(startDate),
      end: new Date(endDate),
    });
  });

  // Calculate analytics
  const analytics = {
    totalUsers: users.length,
    totalOrders: filteredOrders.length,
    orderStatus: {
      placed: filteredOrders.filter((order) => order.status === "Order Placed")
        .length,
      packing: filteredOrders.filter((order) => order.status === "Packing")
        .length,
      outForDelivery: filteredOrders.filter(
        (order) => order.status === "Out for delivery"
      ).length,
      delivered: filteredOrders.filter((order) => order.status === "Delivered")
        .length,
    },
    netProfit: filteredOrders
      .filter((order) => order.status === "Delivered")
      .reduce((total, order) => {
        const orderCost = order.items.reduce(
          (cost, item) => cost + item.costPrice,
          0
        );
        return (
          total +
          (order.amount - orderCost - order?.delivery_fee - order?.discount)
        );
      }, 0),
  };

  // Calculate best sellers
  const getBestSellers = (ordersList) => {
    const productSales = {};

    ordersList.forEach((order) => {
      order.items.forEach((item) => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            ...item,
            timesSold: 0,
          };
        }
        productSales[item.id].timesSold += 1;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.timesSold - a.timesSold)
      .slice(0, 5);
  };

  const currentPeriodBestSellers = getBestSellers(filteredOrders);
  const allTimeBestSellers = getBestSellers(orders);

  const orderStatusData = [
    { name: "Placed", value: analytics.orderStatus.placed },
    { name: "Packing", value: analytics.orderStatus.packing },
    { name: "Out for Delivery", value: analytics.orderStatus.outForDelivery },
    { name: "Delivered", value: analytics.orderStatus.delivered },
  ];

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981"];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div
      className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-xl 
      transform hover:scale-[1.02] transition-transform duration-200`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-white">{value}</h3>
        </div>
        <div className="p-3 bg-white/10 rounded-lg">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product, rank }) => (
    <div
      className="bg-white rounded-xl p-1 shadow-sm 
    hover:shadow-md transition-shadow duration-200 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 
          flex items-center justify-center text-white font-bold text-lg"
          >
            {rank}
          </div>
          <div>
            <h4
              className="font-semibold text-gray-800 
            group-hover:text-indigo-600 transition-colors"
            >
              {product.name}
            </h4>
            <p className="text-sm text-gray-500">
              {product.category} - {product.subCategory}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-indigo-600">
            {product.timesSold}
          </p>
          <p className="text-xs text-gray-500">units sold</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Analytics Dashboard
        </h1>
        <div
          className="flex flex-wrap gap-4 items-center bg-gradient-to-r 
        from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center space-x-3">
            <Calendar className="text-white w-6 h-6" />
            <span className="text-white font-medium text-lg">Date Range:</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white/10 text-white 
              focus:ring-2 focus:ring-white focus:border-white placeholder-white/50"
            />
            <span className="text-white/80">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white/10 text-white 
              focus:ring-2 focus:ring-white focus:border-white placeholder-white/50"
            />
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={Users}
          color="from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Total Orders"
          value={analytics.totalOrders}
          icon={Package}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Delivered Orders"
          value={analytics.orderStatus.delivered}
          icon={CheckCircle}
          color="from-pink-500 to-rose-500"
        />
        <StatCard
          title="Net Profit"
          value={`$${analytics.netProfit.toFixed(2)}`}
          icon={DollarSign}
          color="from-emerald-500 to-teal-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            Order Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label
              >
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.96)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Best Sellers (Current Period)
              </h3>
              <TrendingUp className="text-indigo-500 w-6 h-6" />
            </div>
            <div className="space-y-4">
              {currentPeriodBestSellers.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                All-Time Best Sellers
              </h3>
              <Award className="text-purple-500 w-6 h-6" />
            </div>
            <div className="space-y-4">
              {allTimeBestSellers.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
