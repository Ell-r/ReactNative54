const isDevelopment = __DEV__;

export const BASE_URL = isDevelopment
    ? process.env.EXPO_PUBLIC_API_URL_DEV
    : process.env.EXPO_PUBLIC_API_URL_PROD;

const url = process.env.EXPO_PUBLIC_HUB_URL_DEV;

if (!url) {
    throw new Error("Warning: HUB_URL is undefined. Check your .env configuration.");
}

export const HUB_URL : string = url;

if (!BASE_URL) {
    console.warn("Warning: BASE_URL is undefined. Check your .env configuration.");
}
