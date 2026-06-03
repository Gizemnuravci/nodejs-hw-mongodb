import joi from 'joi';

export const createContactSchema = joi.object({
  name: joi.string().min(3).max(20).required(),
  phoneNumber: joi.string().min(3).max(20).required(),
  email: joi.string().email().optional(),
  isFavourite: joi.boolean().default(false),
  contactType: joi
    .string()
    .valid('work', 'home', 'personal')
    .default('personal'),
});

export const updateContactSchema = joi.object({
  name: joi.string().min(3).max(20).optional(),
  phoneNumber: joi.string().min(3).max(20).optional(),
  email: joi.string().email().optional(),
  isFavourite: joi.boolean().optional(),
  contactType: joi.string().valid('work', 'home', 'personal').optional(),
});
