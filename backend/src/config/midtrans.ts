import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

// Create Core API / Snap instance (we use Snap for easy frontend integration)
export const snap = new midtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

// We can also export coreApi if we want custom UI, but Snap is best for starting
export const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

export { isProduction };
