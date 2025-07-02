import { z } from "zod/v4";

const specialCharRegex = /[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/;
const domain =
  /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
export const userZodSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must not exceed 20 characters")
    .regex(
      /^(?![.-])[a-zA-Z0-9._-]{1,18}[a-zA-Z0-9]$/,
      "Username must only contain letters, numbers, underscores, dots or hyphens — and cannot start or end with a dot or hyphen"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      specialCharRegex,
      "Password must contain at least one special character (!@#$%^&...)"
    ),
});

export const contentZodSchema = z.object({
  type: z.enum(['image', 
    'video', 
    'article', 
    'audio',
    'post'], {
    message: "The content type is not valid",
  }),

  link: z.url({ protocol: /^https?$/, hostname: z.regexes.domain }),
  title: z.string().min(1, "Title is required"),

  tags: z.array(z.string().min(1)).nonempty("At least one tag is required").optional() //assuming the tags will be an array

});
export type UserSchemaType = z.infer<typeof userZodSchema>;
export type ContentSchemaType = z.infer<typeof contentZodSchema>;


