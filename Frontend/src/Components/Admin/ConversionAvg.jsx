"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

const ConversionAvg = ({ conversion, avgDays }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Conversion Rates */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="mb-4 font-bold text-lg text-gray-700">Conversion Rates</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={conversion || []}>
            <XAxis dataKey="to" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="conversionRate" name="%" fill="#10B981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Average Days */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="mb-4 font-bold text-lg text-gray-700">Average Days Between Stages</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={avgDays || []}>
            <XAxis dataKey={(d) => `${d.from}->${d.to}`} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="averageDays" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default ConversionAvg;
