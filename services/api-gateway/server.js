const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Define backend service URLs
const BACKEND_SERVICE_1 = "http://localhost:5001";
const BACKEND_SERVICE_2 = "http://localhost:5002";
const BACKEND_SERVICE_3 = "http://localhost:5003";
const BACKEND_SERVICE_4 = "http://localhost:5004";
const BACKEND_SERVICE_5 = "http://localhost:5005";
const BACKEND_SERVICE_6 = "http://localhost:5006";

// API Gateway routes
app.use(
  "/service1",
  createProxyMiddleware({
    target: BACKEND_SERVICE_1,
    changeOrigin: true,
    pathRewrite: { "^/service1": "" }, // Optional: Rewrite path if needed
  })
);

app.use(
  "/service2",
  createProxyMiddleware({
    target: BACKEND_SERVICE_2,
    changeOrigin: true,
    pathRewrite: { "^/service2": "" }, // Optional: Rewrite path if needed
  })
);

app.use(
  "/service3",
  createProxyMiddleware({
    target: BACKEND_SERVICE_3,
    changeOrigin: true,
    pathRewrite: { "^/service3": "" }, // Optional: Rewrite path if needed
  })
);

app.use(
  "/service4",
  createProxyMiddleware({
    target: BACKEND_SERVICE_4,
    changeOrigin: true,
    pathRewrite: { "^/service4": "" }, // Optional: Rewrite path if needed
  })
);

app.use(
  "/service5",
  createProxyMiddleware({
    target: BACKEND_SERVICE_5,
    changeOrigin: true,
    pathRewrite: { "^/service5": "" }, // Optional: Rewrite path if needed
  })
);


app.use(
  "/service6",
  createProxyMiddleware({
    target: BACKEND_SERVICE_6,
    changeOrigin: true,
    pathRewrite: { "^/service6": "" }, // Optional: Rewrite path if needed
  })
);
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
