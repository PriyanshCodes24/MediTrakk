import { motion } from "framer-motion";
import type { ComponentType } from "react";

type NavItemProps = {
  label?: string;
  icon?: ComponentType<{ size?: number; title?: string }>;
  active: boolean;
  title?: string;
  onClick: () => void;
  size?: number;
};

const Navitem = ({
  icon: Icon,
  label,
  active,
  title,
  onClick,
  size = 18,
}: NavItemProps) => {
  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.25, ease: "easeInOut" } }}
      onClick={onClick}
      className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md transition-colors font-semibold  ${active ? "bg-white/10 text-white" : "text-gray-300 hover:text-white"}`}
    >
      {Icon && <Icon title={title} size={size} />}
      {label && (
        <motion.span
          animate={{
            opacity: active ? 1 : 0,
            width: active ? "auto" : 0,
            marginLeft: active ? 4 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="text-sm whitespace-nowrap overflow-hidden"
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
};

export default Navitem;
