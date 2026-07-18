-- Development only. Never run this seed against production.
insert into public.class_sessions (
  product_key, title, session_date, start_time, end_time, timezone,
  location_type, location_name, location_address, meeting_url, capacity, status
)
select * from (values
  ('beginner', 'AI Clarity Beginner Session', current_date + 14, '18:00'::time, '20:00'::time, 'America/Chicago', 'in_person', 'Dallas area venue', 'Venue details shared after registration', null, 12, 'published'),
  ('workshop', 'AI Practical Workshop', current_date + 21, '09:00'::time, '13:00'::time, 'America/Chicago', 'online', 'Live online classroom', null, 'https://example.invalid/development-only', 16, 'published'),
  ('bootcamp', 'AI Clarity Bootcamp', current_date + 35, '09:00'::time, '16:00'::time, 'America/Chicago', 'in_person', 'Dallas area venue', 'Venue details shared after registration', null, 10, 'published')
) as seed(product_key,title,session_date,start_time,end_time,timezone,location_type,location_name,location_address,meeting_url,capacity,status)
where current_setting('app.environment', true) = 'development';
