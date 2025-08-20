"use client";

import { motion } from "framer-motion";
import { Users, Briefcase } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" },
  }),
  hover: { scale: 1.05, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" },
};

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    { label: "Users", value: stats.users, color: "bg-blue-500", icon: <Users className="w-6 h-6" /> },
    { label: "Jobs", value: stats.jobs, color: "bg-green-500", icon: <Briefcase className="w-6 h-6" /> },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          className="bg-white rounded-2xl p-6 shadow w-56 sm:w-72 flex flex-col items-center text-center"
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className={`w-14 h-14 flex items-center justify-center rounded-full ${card.color} text-white mb-3`}>
            {card.icon}
          </div>
          <h3 className="text-gray-500 text-lg">{card.label}</h3>
          <p className="text-3xl font-bold">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
