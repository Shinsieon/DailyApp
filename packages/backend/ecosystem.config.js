module.exports = {
  apps: [
    {
      name: "nest-server-prod",
      script: "/home/ubuntu/DailyApp2/packages/backend/dist/main.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
