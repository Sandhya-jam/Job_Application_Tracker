import { useEffect, useState } from "react";
import { useGetAvgTimeMutation, useGetConvRateMutation } from "../../Redux/api/jobsApiSlice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Analytics() {
  const [avgData, setAvgData] = useState([]);
  const [convData, setConvData] = useState([]);

  const [getAvgTime] = useGetAvgTimeMutation();
  const [getConvRate] = useGetConvRateMutation();

  // Pairs for Average Days
  const avgPairs = [
    { from: "Applied", to: "Interview" },
    { from: "Applied", to: "Offer" },
    { from: "Applied", to: "Rejected" },
    { from: "Interview", to: "Offer" },
    { from: "Interview", to: "Rejected" }
  ];

  // Pairs for Conversion Rates
  const convPairs = [
    { from: "Applied", to: "Interview" },
    { from: "Interview", to: "Offer" },
    { from: "Interview", to: "Rejected" }
  ];

  useEffect(() => {
    const fetchAvgDays = async () => {
      let data = [];
      for (const pair of avgPairs) {
        try {
          const avgRes = await getAvgTime({ data: { from: pair.from, to: pair.to } }).unwrap();
          data.push({
            stagePair: `${pair.from} → ${pair.to}`,
            avgDays: avgRes.averageDays ?? 0
          });
        } catch (err) {
          toast.error(`Error fetching avg days for ${pair.from} → ${pair.to}`);
        }
      }
      setAvgData(data);
    };

    const fetchConv = async () => {
      let data = [];
      for (const pair of convPairs) {
        try {
          const convRes = await getConvRate({ data: { from: pair.from, to: pair.to } }).unwrap();
          data.push({
            stagePair: `${pair.from} → ${pair.to}`,
            conversionRate: convRes.conversionRate ?? 0
          });
        } catch (err) {
          toast.error(`Error fetching conversion for ${pair.from} → ${pair.to}`);
        }
      }
      setConvData(data);
    };

    fetchAvgDays();
    fetchConv();
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Avg Days Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-6 bg-white rounded-xl shadow-lg h-[500px]"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Average Time Between Key Stages</h2>
          {avgData.length > 0 && (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={avgData} margin={{ top: 20, right: 20, left: 0, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="stagePair"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="avgDays"
                  fill="#8884d8"
                  name="Avg Days"
                  animationDuration={1200} // bar grow animation
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Conversion Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="p-6 bg-white rounded-xl shadow-lg h-[500px]"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Conversion Rates</h2>
          {convData.length > 0 && (
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={convData} margin={{ top: 20, right: 20, left: 0, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="stagePair"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="conversionRate"
                  fill="#82ca9d"
                  name="Conversion Rate (%)"
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
    </div>
  );
}
