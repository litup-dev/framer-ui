import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps extends MotionProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
}

const FadeIn = ({
  children,
  duration = 0.5,
  delay = 0,
  ...motionProps
}: FadeInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
