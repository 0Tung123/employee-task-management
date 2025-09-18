const { Vonage } = require('@vonage/server-sdk');

const vonageConfig = {
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  brandName: process.env.VONAGE_BRAND_NAME
};

const createVonageClient = () => {
  return new Vonage({
    apiKey: vonageConfig.apiKey,
    apiSecret: vonageConfig.apiSecret
  });
};

module.exports = {
  vonageConfig,
  createVonageClient
};