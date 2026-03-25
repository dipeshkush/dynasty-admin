// src/pages/Tickets.jsx
import { useState } from 'react';
import { useGetAllTicketsQuery, useUpdateTicketStatusMutation } from '../services/ticketsApi';
import { Clock, CheckCircle, XCircle, AlertCircle, User, Mail, Phone,RefreshCw } from 'lucide-react';

const statusColors = {
    Open: 'bg-yellow-100 text-yellow-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Resolved: 'bg-green-100 text-green-700',
    Closed: 'bg-gray-100 text-gray-700',
};

const statusIcons = {
    Open: <AlertCircle className="h-4 w-4" />,
    'In Progress': <Clock className="h-4 w-4" />,
    Resolved: <CheckCircle className="h-4 w-4" />,
    Closed: <XCircle className="h-4 w-4" />,
};

export default function Tickets() {
    const { data, isLoading, isError, refetch } = useGetAllTicketsQuery();
    const [updateStatus, { isLoading: updating }] = useUpdateTicketStatusMutation();

    const tickets = data?.tickets || [];

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            await updateStatus({ ticketId, status: newStatus }).unwrap();
            alert(`Ticket status updated to ${newStatus}`);
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading tickets...</div>;
    }

    if (isError) {
        return <div className="p-8 text-center text-red-500">Failed to load tickets. Please try again.</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Support Tickets</h1>
                    <p className="text-gray-600 mt-1">Manage customer support tickets</p>
                </div>
                <button
                    onClick={refetch}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-300">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-6 py-3  text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tickets.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No tickets found
                                </td>
                            </tr>
                        ) : (
                            tickets.map((ticket) => (
                                <tr key={ticket._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-2 font-medium text-gray-900">
                                        {ticket.ticketNumber}
                                    </td>

                                    <td className="px-6 py-2">
                                        <div>
                                            <p className="font-medium">{ticket.name}</p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {ticket.email}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Phone className="h-3 w-3" /> {ticket.phone}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-6 py-2 text-sm text-gray-600 max-w-md">
                                        {ticket.message}
                                    </td>

                                    <td className="px-6 py-2">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium ${statusColors[ticket.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {statusIcons[ticket.status]}
                                            {ticket.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-2 text-sm text-gray-500">
                                        {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>

                                    <td className="px-6 py-2">
                                        <select
                                            value={ticket.status}
                                            onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                            disabled={updating}
                                            className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                        >
                                            <option value="Open">Open</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}