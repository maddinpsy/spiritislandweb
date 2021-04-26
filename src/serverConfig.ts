import dotenv from "dotenv";

dotenv.config();
if(!process.env.REACT_APP_S3_URL) throw new Error("S3_URL is not set.");

export const S3_PREFIX = process.env.REACT_APP_S3_URL

