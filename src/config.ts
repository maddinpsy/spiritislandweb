const location = window.location;
const DEFAULT_PORT = process.env.PORT || 8000;
const protocol = location.protocol
const hostname = location.hostname
export const isProduction = process.env.NODE_ENV === "production";

export const SERVER_URL = isProduction
    ? origin
    : `${protocol}//${hostname}:${DEFAULT_PORT}`;

export const S3_PREFIX = process.env.REACT_APP_S3_URL