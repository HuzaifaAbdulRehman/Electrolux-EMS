'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  UserCheck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Employee {
  id: number;
  name: string;
  designation: string;
  department: string;
  assignedZone: string | null;
}

interface PendingRegistration {
  customerId: number;
  userId: number;
  accountNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  registeredAt: string;
  status: string;
  assignedEmployeeId: number | null;
  assignedEmployee: {
    id: number;
    name: string;
    designation: string;
    phone: string;
  } | null;
}

export default function PendingRegistrationsPage() {
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<{ [key: number]: number }>({});
  const [processing, setProcessing] = useState<{ [key: number]: boolean }>({});

  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pending-registrations');
      if (!response.ok) {
        throw new Error('Failed to fetch pending registrations');
      }

      const data = await response.json();
      setRegistrations(data.pendingRegistrations || []);
      setEmployees(data.availableEmployees || []);
    } catch (error) {
      console.error('Error fetching pending registrations:', error);
      toast.error('Failed to load pending registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  const handleApprove = async (customerId: number) => {
    const employeeId = selectedEmployee[customerId];

    if (!employeeId) {
      toast.error('Please select an employee for meter installation');
      return;
    }

    setProcessing({ ...processing, [customerId]: true });

    try {
      const response = await fetch('/api/admin/pending-registrations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          employeeId,
          action: 'approve'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to approve registration');
      }

      toast.success('Registration approved and employee assigned');
      await fetchPendingRegistrations();
    } catch (error: any) {
      console.error('Error approving registration:', error);
      toast.error(error.message || 'Failed to approve registration');
    } finally {
      setProcessing({ ...processing, [customerId]: false });
    }
  };

  const handleReject = async (customerId: number) => {
    if (!confirm('Are you sure you want to reject this registration?')) {
      return;
    }

    setProcessing({ ...processing, [customerId]: true });

    try {
      const response = await fetch('/api/admin/pending-registrations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          action: 'reject'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to reject registration');
      }

      toast.success('Registration rejected');
      await fetchPendingRegistrations();
    } catch (error: any) {
      console.error('Error rejecting registration:', error);
      toast.error(error.message || 'Failed to reject registration');
    } finally {
      setProcessing({ ...processing, [customerId]: false });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading pending registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pending Registrations
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Approve new customer registrations and assign employees for meter installation
            </p>
          </div>
        </div>
        <button
          onClick={fetchPendingRegistrations}
          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {registrations.filter(r => !r.assignedEmployeeId).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center space-x-3">
            <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Assigned for Installation</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {registrations.filter(r => r.assignedEmployeeId).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {registrations.length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Registrations List */}
      {registrations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
        >
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No pending registrations at the moment</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {registrations.map((registration, index) => (
            <motion.div
              key={registration.customerId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {registration.fullName}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm">{registration.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">{registration.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{registration.address}, {registration.city}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Account Number:</span>
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {registration.accountNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Registered:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date(registration.registeredAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                        {registration.assignedEmployeeId ? 'Assigned' : 'Pending Approval'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                {registration.assignedEmployeeId ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      Assigned to <strong>{registration.assignedEmployee?.name}</strong> ({registration.assignedEmployee?.designation})
                      for meter installation
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Assign Employee for Installation
                      </label>
                      <select
                        value={selectedEmployee[registration.customerId] || ''}
                        onChange={(e) => setSelectedEmployee({
                          ...selectedEmployee,
                          [registration.customerId]: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        disabled={processing[registration.customerId]}
                      >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} - {emp.designation}
                            {emp.assignedZone && ` (Zone: ${emp.assignedZone})`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(registration.customerId)}
                        disabled={processing[registration.customerId]}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing[registration.customerId] ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(registration.customerId)}
                        disabled={processing[registration.customerId]}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}