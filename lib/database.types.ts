export type ClassSession = {
  id: string;
  product_key: "beginner" | "workshop" | "bootcamp";
  title: string;
  session_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  location_type: "online" | "in_person" | "hybrid";
  location_name: string | null;
  location_address: string | null;
  capacity: number;
  seats_reserved: number;
  seats_remaining: number;
  status: "published" | "sold_out";
  instructor_name: string;
};

export type PrivateClassSession = ClassSession & {
  meeting_url: string | null;
  notes: string | null;
};

export type Registration = {
  id: string;
  session_id: string;
  stripe_checkout_session_id: string;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  quantity: number;
  payment_status: string;
  registration_status: string;
  confirmation_sent_at: string | null;
  internal_notification_sent_at: string | null;
  reminder_24h_sent_at: string | null;
  reminder_2h_sent_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ApprovedReview = {
  id: string;
  student_name: string;
  student_role: string | null;
  organization: string | null;
  review_text: string;
  rating: number;
  photo_url: string | null;
  featured: boolean;
  approved_at: string;
};
