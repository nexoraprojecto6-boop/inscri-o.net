import { z } from 'zod';

/**
 * Esquema de validação partilhado entre o formulário (frontend)
 * e a rota /api/registrations (backend).
 */
export const registrationSchema = z.object({
  fullName: z
    .string({ required_error: 'Indica o teu nome completo.' })
    .trim()
    .min(3, 'O nome deve ter pelo menos 3 caracteres.')
    .max(120, 'O nome é demasiado longo.')
    .refine((v) => v.split(/\s+/).length >= 2, 'Indica o nome e o apelido.'),
  email: z
    .string({ required_error: 'Indica o teu email.' })
    .trim()
    .toLowerCase()
    .max(254, 'O email é demasiado longo.')
    .email('Indica um email válido.'),
  countryCode: z
    .string({ required_error: 'Seleciona o indicativo.' })
    .regex(/^\+\d{1,4}$/, 'Indicativo inválido.'),
  phone: z
    .string({ required_error: 'Indica o teu número de telefone.' })
    .transform((v) => v.replace(/[\s\-().]/g, ''))
    .pipe(z.string().regex(/^\d{6,14}$/, 'Indica um número de telefone válido (apenas dígitos).')),
  hasDerivAccount: z.boolean({ required_error: 'Responde se já tens conta na Deriv.' }),
  smsConsent: z.boolean().default(false),
  whatsappConsent: z.boolean().default(false),
});

export type RegistrationInput = z.input<typeof registrationSchema>;
export type RegistrationData = z.output<typeof registrationSchema>;

export const sessionIdSchema = z.string().regex(/^[A-Za-z0-9_-]{8,64}$/);
export const uuidSchema = z.string().uuid();
