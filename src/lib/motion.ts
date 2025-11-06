export const fadeInUp = (delay = 0, duration = 0.6) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration, delay },
    viewport: { once: true, margin: "-10% 0px -10% 0px" },
  });