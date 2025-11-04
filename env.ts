// It's a best practice to load sensitive keys from environment variables.
// This file centralizes the access to them.

// IMPORTANT: To run this project, you must have a .env file or configure environment
// variables with your Paystack Public Key.
export const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_...';
