import { motion } from 'framer-motion';
import simrsZenLogo from '@/assets/images/simrs-zen-logo.png'; // 新增导入新logo

const Presentasi = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <motion.img
          src="/images/simrs-zen-logo.png" // 更新为新 logo 路径
          alt="SIMRS ZEN Logo"
          className="w-64 h-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-blue-900">SIMRS ZEN</h1>
        <p className="mt-4 text-gray-700">
          Sistem Informasi Manajemen Rumah Sakit
        </p>
      </motion.div>
    </div>
  );
};

export default Presentasi;
