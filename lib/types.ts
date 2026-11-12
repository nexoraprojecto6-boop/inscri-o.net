export type Stats = {
  total_participants: number;
  total_phones: number;
  with_deriv_account: number;
  without_deriv_account: number;
  total_clicks: number;
  unique_clicks: number;
  registrations_today: number;
  registrations_7d: number;
};

export type Participant = {
  id: string;
  full_name: string;
  email: string;
  country_code: string;
  phone: string;
  has_deriv_account: boolean;
  sms_consent: boolean;
  whatsapp_consent: boolean;
  created_at: string;
};

export type AdminData = {
  stats: Stats;
  participants: Participant[];
  matching: number;
  limit: number;
};
