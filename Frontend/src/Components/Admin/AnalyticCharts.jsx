"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";

const AnalyticCharts = ({ jobsByMonth, byStatus, byRole, last7Days }) => {
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Jobs By Month */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="mb-4 font-bold text-lg text-gray-700">Jobs by Month</h3>
        {jobsByMonth?.length>0?(
          <ResponsiveContainer width="100%" height={280}>
          <BarChart data={jobsByMonth || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        ):(
          <p className="text-xl text-center font-sans text-gray-500">No Stats Available</p>
        )}
      </motion.div>

      {/* Jobs by Status */}
      <motion.div
      className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow group"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="mb-4 font-bold text-lg text-gray-700">Jobs by Status</h3>
      {byStatus?.length>0 ?(
        <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={byStatus || []}
            dataKey="count"
            nameKey="status"
            outerRadius={100}
            label
          >
            {(byStatus || []).map((_, idx) => (
              <Cell
                key={idx}
                fill={["#10B981", "#F59E0B", "#EF4444", "#3B82F6"][idx % 4]}
              />
            ))}
          </Pie>
          {/* Legend is hidden until hover */}
          <motion.g
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Legend />
          </motion.g>
        </PieChart>
      </ResponsiveContainer>
      ):(
        <p className="text-xl text-center font-sans text-gray-500">No Stats Available</p>
      )}
      </motion.div>


      {/* Jobs by Role */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="mb-4 font-bold text-lg text-gray-700">Jobs by Role</h3>
        {byRole?.length>0?(
          <ResponsiveContainer width="100%" height={280}>
          <BarChart data={byRole || []}>
            <XAxis dataKey="role" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        ):(
          <p className="text-xl text-center font-sans text-gray-500">No Jobs yet created</p>
        )}
      </motion.div>

      {/* Last 7 Days */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="mb-4 font-bold text-lg text-gray-700">
          Jobs Created (Last 7 Days)
        </h3>
        {last7Days?.length>0?(
          <ResponsiveContainer width="100%" height={280}>
          <LineChart data={last7Days || []}>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        ):(
          <p className="text-xl text-center font-sans text-gray-500">No Jobs created in last 7 Days</p>
        )}
      </motion.div>
    </div>
  );
};

export default AnalyticCharts;
