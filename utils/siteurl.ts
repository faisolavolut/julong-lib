import dotenv from 'dotenv';
dotenv.config();
export const siteurl = (param: string) => {
    return `${process.env.NEXT_PUBLIC_BASE_URL + param}`
}