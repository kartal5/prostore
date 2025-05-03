import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Format a number to always show two decimal places (Danish style uses comma as decimal separator).
 */
export function formatNumberWithDecimal(num: number): string {
  return num.toFixed(2);
}

// Format error 
// esling-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: unknown): string {
  // First, ensure error is an object.
  if (typeof error === "object" && error !== null) {
    // Cast to a dictionary shape so we can read .name, .code, etc. carefully.
    const e = error as Record<string, unknown>;

    // Handle Zod error
    if (e.name === "ZodError" && typeof e.errors === "object" && e.errors !== null) {
      const errorsObj = e.errors as Record<string, { message: string }>;
      const fieldErrors = Object.keys(errorsObj).map((field) => errorsObj[field].message);
      return fieldErrors.join(". ");
    }

    // Handle Prisma unique constraint error
    if (
      e.name === "PrismaClientKnownRequestError" &&
      e.code === "P2002" &&
      typeof e.meta === "object" &&
      e.meta !== null
    ) {
      // meta?.target is usually an array of fields that caused the uniqueness error
      const meta = e.meta as { target?: string[] };
      const field = meta.target?.[0] ?? "Field";
      return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }

    // Handle a generic error with a message
    if (typeof e.message === "string") {
      return e.message;
    }

    // If .message is present but not a string, attempt JSON-stringifying
    if ("message" in e) {
      return JSON.stringify(e.message);
    }
  }

  // fallback if it's not an object or has no message
  return String(error);
}

/**
 * Round a number (or numeric string) to two decimal places.
 */
export function round2(value: number | string): number {
  const num = typeof value === 'string' ? Number(value) : value;
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

 const CURRENCY_FORMATTER = new Intl.NumberFormat('da-DK', {
  currency: 'DKK',
  style: 'currency',
  currencyDisplay: 'code', 
  minimumFractionDigits: 2,
});

/**
 * Format an amount (number or numeric string) as Danish currency.
 */
export function formatCurrency(amount: number | string | null): string {
  if (amount == null) return '–';
  const num = typeof amount === 'string' ? Number(amount) : amount;
  return CURRENCY_FORMATTER.format(num);
}

/**
 * Format an integer with locale-specific thousands separator (Danish).
 */
const INTEGER_FORMATTER = new Intl.NumberFormat('da-DK');
export function formatNumber(number: number): string {
  return INTEGER_FORMATTER.format(number);
}

/**
 * Shorten a UUID by keeping the last 6 characters, prefixing with “..”.
 */
export function formatId(id: string): string {
  return `..${id.slice(-6)}`;
}

/**
 * Format a Date object/string into Danish date/time formats.
 */
export const formatDateTime = (dateInput: string | Date) => {
  const date = new Date(dateInput);
  const dtOpts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  const dateOpts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };
  return {
    dateTime: date.toLocaleString('da-DK', dtOpts),
    dateOnly: date.toLocaleDateString('da-DK', dateOpts),
    timeOnly: date.toLocaleTimeString('da-DK', timeOpts),
  };
};


/**
 * Build a new query string by replacing or adding a key/value pair,
 * based on the current search params string. Works both server- and client-side.
 */
export function formUrlQuery(
  params: string,
  key: string,
  value: string | null
): string {
  const query = qs.parse(params);
  if (value == null) {
    delete query[key];
  } else {
    query[key] = value;
  }
  return qs.stringify(query, { skipNull: true, skipEmptyString: true });
}
