import axios from "axios";
import crypto from "node:crypto";

type PayStationInitiateResponse = {
  status_code: string;
  status: string;
  message: string;
  payment_amount?: string;
  invoice_number?: string;
  payment_url?: string;
};

type PayStationTxnData = {
  invoice_number: string;
  trx_status: string;
  trx_id: string;
  payment_amount: string;
  payer_mobile_no?: string;
  payment_method?: string;
  reference?: string;
};

export type PayStationVerifyResponse = {
  status_code: string;
  status: string;
  message: string;
  data?: PayStationTxnData;
};

type InitiatePaymentPayload = {
  invoice_number: string;
  payment_amount: number;
  cust_name: string;
  cust_phone: string;
  cust_email: string;
  cust_address?: string;
  reference?: string;
  pay_with_charge?: string;
};

function getEnvOrThrow(name: string): string {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return val;
}

function getBaseUrl(): string {
  const base =
    process.env.PAYSTATION_BASE_URL || "https://api.paystation.com.bd";
  return base.replace(/\/$/, "");
}

function getServerUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SERVER_URL || "";
  return base.replace(/\/$/, "");
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const datePart = `${y}${m}${d}`;
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `DON-${datePart}-${rand}`;
}

export async function initiatePayment(
  payload: InitiatePaymentPayload,
): Promise<PayStationInitiateResponse> {
  const merchantId = getEnvOrThrow("PAYSTATION_MERCHANT_ID");
  const password = getEnvOrThrow("PAYSTATION_PASSWORD");
  const baseUrl = getBaseUrl();
  const serverUrl = getServerUrl();

  const callbackUrl = `${serverUrl}/api/payment/callback`;

  console.log("[PayStation] INIT env check — baseUrl:", baseUrl);
  console.log(
    "[PayStation] INIT env check — merchantId:",
    merchantId,
    "(length:",
    merchantId.length,
    ")",
  );
  console.log(
    "[PayStation] INIT env check — password.length:",
    password.length,
    "startsWith quote:",
    password.startsWith("'"),
    password.startsWith('"'),
  );
  console.log("[PayStation] INIT env check — callbackUrl:", callbackUrl);

  const formData = new URLSearchParams();
  formData.append("merchantId", merchantId);
  formData.append("password", password);
  formData.append("invoice_number", payload.invoice_number);
  formData.append("currency", "BDT");
  formData.append("payment_amount", String(payload.payment_amount));
  formData.append("cust_name", payload.cust_name);
  formData.append("cust_phone", payload.cust_phone);
  formData.append("cust_email", payload.cust_email);
  formData.append("callback_url", callbackUrl);
  formData.append("reference", payload.reference || "Invoice");
  if (payload.cust_address) {
    formData.append("cust_address", payload.cust_address);
  }
  if (payload.pay_with_charge) {
    formData.append("pay_with_charge", payload.pay_with_charge);
  }

  try {
    const { data, status, statusText } =
      await axios.post<PayStationInitiateResponse>(
        `${baseUrl}/initiate-payment`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          timeout: 30_000,
        },
      );
    console.log(
      "[PayStation] INIT HTTP",
      status,
      statusText,
      "→ response:",
      JSON.stringify(data),
    );
    return data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error(
        "[PayStation] INIT axios error — status:",
        err.response?.status,
        "statusText:",
        err.response?.statusText,
        "data:",
        JSON.stringify(err.response?.data),
        "msg:",
        err.message,
      );
      if (err.response?.data) {
        return err.response.data as PayStationInitiateResponse;
      }
    }
    console.error("[PayStation] initiatePayment error:", err);
    throw err;
  }
}

export async function verifyTransactionByInvoice(
  invoiceNumber: string,
): Promise<PayStationVerifyResponse> {
  const merchantId = getEnvOrThrow("PAYSTATION_MERCHANT_ID");
  const baseUrl = getBaseUrl();

  const formData = new URLSearchParams();
  formData.append("invoice_number", invoiceNumber);

  const { data } = await axios.post<PayStationVerifyResponse>(
    `${baseUrl}/transaction-status`,
    formData,
    {
      headers: {
        merchantId,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 30_000,
    },
  );
  return data;
}
