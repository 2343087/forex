import crypto from 'crypto';

interface MidtransResponse {
  token: string;
  redirect_url: string;
}

/**
 * Simulasi atau Helper class untuk konek ke Midtrans API.
 * Nanti pas API Key beneran ada, bisa ganti pakai library resmi 'midtrans-client'.
 */
export class PaymentService {
  private serverKey: string;
  private isProduction: boolean;

  constructor() {
    this.serverKey = process.env.MIDTRANS_SERVER_KEY || 'sandbox-server-key';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  // Bikin token bayar (Snap)
  async createTransaction(orderId: string, grossAmount: number, customerDetails: any): Promise<MidtransResponse> {
    // TODO: implement actual HTTP Request to Midtrans Snap API
    console.log(`[Midtrans] Creating order ${orderId} for Rp${grossAmount}`);
    
    // Fake response for now
    return {
      token: "dummy_snap_token_123",
      redirect_url: "https://app.sandbox.midtrans.com/snap/v2/vtweb/dummy_snap_token_123"
    };
  }

  // Verifikasi Webhook Signature dari Midtrans (Anti-Fraud)
  verifySignature(orderId: string, statusCode: string, grossAmount: string, signatureKey: string): boolean {
    const rawString = `${orderId}${statusCode}${grossAmount}${this.serverKey}`;
    const hash = crypto.createHash('sha512').update(rawString).digest('hex');
    return hash === signatureKey;
  }
}

export const paymentService = new PaymentService();
