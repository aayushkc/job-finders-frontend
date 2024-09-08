/** @type {import('next').NextConfig} */
const nextConfig = {
   
        images: {
          remotePatterns: [
            {
              protocol: 'http',
              hostname: '127.0.0.1',
              port: '8000',
            },
            {
                protocol:"https",
                hostname:"media.hiregurkha.com"
            },
            {
              protocol:"https",
              hostname:"api.hiregurkha.com"
          }
          ],
        },
        env:{
          'APIENDPOINT':'127.0.0.1:8000'
        }
      
};

module.exports = nextConfig
