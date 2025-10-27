'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Home,
  RefreshCw,
  AlertCircle,
  Building,
  Factory,
  Sprout,
  Hash
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PendingInstallation {
  customerId: number;
  userId: number;
  accountNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  connectionType: string;
  registeredAt: string;
  status: string;
}

interface CompletedInstallation {
  customerId: number;
  meterNumber: string;
  fullName: string;
  installedAt: string;
}

const connectionTypeIcons: { [key: string]: any } = {
  'Residential': Home,
  'Commercial': Building,
  'Industrial': Factory,
  'Agricultural': Sprout
};

const ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];

export default function MeterInstallationsPage() {
  const [pendingInstallations, setPendingInstallations] = useState<PendingInstallation[]>([]);
  const [recentCompletions, setRecentCompletions] = useState<CompletedInstallation[]>([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState<{ [key: number]: boolean }>({});
  const [selectedZone, setSelectedZone] = useState<{ [key: number]: string }>({});

  const fetchInstallations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/employee/meter-installations');

      if (!response.ok) {
        throw new Error('Failed to fetch installations');
      }

      const data = await response.json();
      setPendingInstallations(data.pendingInstallations || []);
      setRecentCompletions(data.recentCompletions || []);
      setCompletedToday(data.completedToday || 0);
      setTotalPending(data.totalPending || 0);
    } catch (error) {
      console.error('Error fetching installations:', error);
      toast.error('Failed to load meter installations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallations();
  }, []);

  const handleInstallMeter = async (customerId: number) => {
    const zone = selectedZone[customerId];

    if (!zone) {
      toast.error('Please select a zone for this customer');
      return;
    }

    setInstalling({ ...installing, [customerId]: true });

    try {
      const response = await fetch('/api/employee/meter-installations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          zone
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to complete installation');
      }

      const result = await response.json();

      toast.success(`Meter installed successfully! Meter Number: ${result.data.meterNumber}`);

      // Refresh the list
      await fetchInstallations();

      // Clear selected zone
      setSelectedZone({ ...selectedZone, [customerId]: '' });
    } catch (error: any) {
      console.error('Error installing meter:', error);
      toast.error(error.message || 'Failed to install meter');
    } finally {
      setInstalling({ ...installing, [customerId]: false });
    }
  };

  const getConnectionIcon = (type: string) => {
    const Icon = connectionTypeIcons[type] || Home;
    return Icon;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading meter installations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Meter Installations
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete meter installations for new customers
            </p>
          </div>
        </div>
        <button
          onClick={fetchInstallations}
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
          className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800"
        >
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Installations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalPending}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedToday}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recent Completions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {recentCompletions.length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pending Installations */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Pending Installations
        </h2>

        {pendingInstallations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
          >
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No pending installations assigned to you</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingInstallations.map((installation, index) => {
              const ConnectionIcon = getConnectionIcon(installation.connectionType);

              return (
                <motion.div
                  key={installation.customerId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  {/* Customer Details */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {installation.fullName}
                      </h3>
                      <ConnectionIcon className="h-5 w-5 text-gray-500" />
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Hash className="h-4 w-4 mr-2" />
                        <span className="font-mono">{installation.accountNumber}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{installation.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{installation.phone}</span>
                      </div>
                      <div className="flex items-start text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                        <span className="flex-1">
                          {installation.address}, {installation.city}, {installation.state} - {installation.pincode}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Registered: {new Date(installation.registeredAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Zone Selection and Install Button */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedZone[installation.customerId] || ''}
                        onChange={(e) => setSelectedZone({
                          ...selectedZone,
                          [installation.customerId]: e.target.value
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        disabled={installing[installation.customerId]}
                      >
                        <option value="">Select Zone</option>
                        {ZONES.map((zone) => (
                          <option key={zone} value={zone}>{zone}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleInstallMeter(installation.customerId)}
                        disabled={installing[installation.customerId] || !selectedZone[installation.customerId]}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {installing[installation.customerId] ? 'Installing...' : 'Install Meter'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Completions */}
      {recentCompletions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Completions
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Meter Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Installed
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentCompletions.map((completion) => (
                    <tr key={completion.customerId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {completion.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                        {completion.meterNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(completion.installedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}