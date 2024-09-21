import { motion } from 'framer-motion';

import rocket from '../../../../assets/rocket.svg';

export const Rocket = () => {
  return (
    <motion.img
      className="rocket"
      style={{
        position: 'absolute',
        left: '5vw',
        top: '40vh',
        display: 'sticky',
        height: '10vw',
      }}
      src={rocket}
      animate={{
        y: '10vh',
      }}
      transition={{
        duration: 5,
        yoyo: Infinity,
      }}
    />
  );
};
