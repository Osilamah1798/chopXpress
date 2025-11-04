import React, { useMemo, useState } from 'react';
import { useOrders } from '../../contexts/OrderContext';
import { Order, OrderStatus, ORDER_STATUSES } from '../../types';
import { Eye, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';

const ITEMS_PER_PAGE = 10;

const OrderManagementPage: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => statusFilter === 'all' || order.status === statusFilter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, statusFilter]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Order Received': return 'bg-blue-100 text-blue-800';
      case 'Preparing Your Meal': return 'bg-yellow-100 text-yellow-800';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-black text-secondary mb-2">Order Management</h1>
      <p className="text-gray-600 mb-6">Manage and track all incoming customer orders.</p>

      {/* Filter Controls */}
      <div className="mb-4">
        <label htmlFor="status-filter" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
          <SlidersHorizontal size={16} /> Filter by Status
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as OrderStatus | 'all');
            setCurrentPage(1); // Reset to first page on filter change
          }}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full max-w-xs p-2.5"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Orders List for Desktop (Table) and Mobile (Cards) */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {paginatedOrders.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Order ID</th>
                    <th scope="col" className="px-6 py-3">Customer</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Total</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order: Order) => (
                    <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono font-medium text-gray-900 whitespace-nowrap">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold">{order.customerDetails.name}</div>
                        <div className="text-xs text-gray-500">{order.customerDetails.phone}</div>
                      </td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 font-bold text-secondary">₦{order.total.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2"
                        >
                          {ORDER_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-500 hover:text-primary"><Eye size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
              {paginatedOrders.map((order) => (
                <div key={order.id} className="bg-white border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                             <p className="font-mono text-sm font-bold text-secondary">{order.id}</p>
                             <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                    </div>
                   <div className="border-t pt-2">
                     <p className="font-semibold">{order.customerDetails.name}</p>
                     <p className="text-sm text-gray-500">{order.customerDetails.phone}</p>
                     <p className="font-bold text-lg mt-2">₦{order.total.toLocaleString()}</p>
                   </div>
                   <div className="flex items-center gap-2 pt-2 border-t">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary p-2"
                        >
                          {ORDER_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-500 border rounded-lg"><Eye size={18} /></button>
                   </div>
                </div>
              ))}
            </div>

          </>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <h3 className="text-xl font-semibold">No orders found</h3>
            <p>No orders match the current filter.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-sm text-gray-700">
            Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default OrderManagementPage;