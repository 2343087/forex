declare module 'midtrans-client' {
  interface Config {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface CustomerDetails {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }

  interface ItemDetail {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }

  interface TransactionParameter {
    transaction_details: TransactionDetails;
    customer_details?: CustomerDetails;
    item_details?: ItemDetail[];
    [key: string]: any;
  }

  interface SnapResponse {
    token: string;
    redirect_url: string;
  }

  class Snap {
    constructor(config: Config);
    createTransaction(parameter: TransactionParameter): Promise<SnapResponse>;
    createTransactionToken(parameter: TransactionParameter): Promise<string>;
    createTransactionRedirectUrl(parameter: TransactionParameter): Promise<string>;
  }

  class CoreApi {
    constructor(config: Config);
    charge(parameter: any): Promise<any>;
    capture(parameter: any): Promise<any>;
    cardRegister(parameter: any): Promise<any>;
    cardToken(parameter: any): Promise<any>;
    cardPointInquiry(tokenId: string): Promise<any>;
  }

  export { Snap, CoreApi };
  export default { Snap, CoreApi };
}
