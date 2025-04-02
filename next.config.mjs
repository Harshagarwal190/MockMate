// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
    },
  };
  
  export default nextConfig;
  
