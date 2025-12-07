import { z } from "zod";

export const emailSchema = z.string().email("Email không hợp lệ");
export const passwordSchema = z
  .string()
  .min(6, "Mật khẩu phải có ít nhất 6 ký tự");
export const phoneSchema = z
  .string()
  .regex(/^[0-9]{10}$/, "Số điện thoại không hợp lệ");
export const requiredString = (fieldName) =>
  z.string().min(1, `${fieldName} là bắt buộc`);
export const optionalString = z.string().optional();
export const numberSchema = z.number({ required_error: "Giá trị là bắt buộc" });
export const positiveNumber = z.number().positive("Giá trị phải lớn hơn 0");
export const dateSchema = z.date({ required_error: "Ngày là bắt buộc" });

export const createFormSchema = (fields) => z.object(fields);

export const loginFormSchema = createFormSchema({
  email: emailSchema,
  password: passwordSchema,
});
