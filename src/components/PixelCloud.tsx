import { motion } from "framer-motion";

/**
 * Decorative pixel-art cloud component for arcade aesthetic
 */
const PixelCloud = ({
  className = "",
  color = "neon-purple",
  size = "md",
}: {
  className?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}) => {
  const scale = size === "sm" ? 0.6 : size === "lg" ? 1.4 : 1;
  const w = 60 * scale;
  const h = 24 * scale;
  const u = 4 * scale; // pixel unit

  return (
    <motion.svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={`absolute pointer-events-none opacity-20 ${className}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      {/* Bottom row */}
      <rect x={u * 0} y={u * 3} width={u * 14} height={u * 3} rx={0} fill="currentColor" className={`text-${color}`} />
      {/* Middle row */}
      <rect x={u * 2} y={u * 1} width={u * 10} height={u * 3} rx={0} fill="currentColor" className={`text-${color}`} />
      {/* Top row */}
      <rect x={u * 4} y={u * 0} width={u * 5} height={u * 2} rx={0} fill="currentColor" className={`text-${color}`} />
    </motion.svg>
  );
};

export default PixelCloud;
