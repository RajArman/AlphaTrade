import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password is too short"),
});

export const buyOrderSchema = z.object({
  name: z.string().min(1, "Stock name is required"),
  qty: z.coerce.number().positive("Quantity must be a positive number"),
  price: z.coerce.number().positive("Price must be a positive number"),
});

export const sellOrderSchema = z.object({
  name: z.string().min(1, "Stock name is required"),
  qty: z.coerce.number().positive("Quantity must be a positive number"),
  price: z.coerce.number().positive("Price must be a positive number"),
});