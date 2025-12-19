BEGIN;

-- 1. Create the Enum Type
-- We create a specific type for the status values.
CREATE TYPE public.testimonial_status AS ENUM ('public', 'hidden', 'archived');

-- 2. Drop the existing checks and defaults on the column
ALTER TABLE public.testimonials DROP CONSTRAINT IF EXISTS testimonials_status_check;
ALTER TABLE public.testimonials ALTER COLUMN status DROP DEFAULT;

-- 3. Normalize existing data
-- Ensure all current string values map validly to the new Enum values.
-- pending -> hidden
UPDATE public.testimonials SET status = 'hidden' WHERE status = 'pending';
-- approved -> public
UPDATE public.testimonials SET status = 'public' WHERE status = 'approved';
-- rejected -> hidden
UPDATE public.testimonials SET status = 'hidden' WHERE status = 'rejected';
-- Catch-all: set anything else to 'hidden'
UPDATE public.testimonials SET status = 'hidden' WHERE status NOT IN ('public', 'hidden', 'archived');

-- 4. Convert the column to use the new Enum type given the cleaned data
ALTER TABLE public.testimonials 
  ALTER COLUMN status TYPE public.testimonial_status USING status::public.testimonial_status;

-- 5. Set the new default value using the Enum
ALTER TABLE public.testimonials 
  ALTER COLUMN status SET DEFAULT 'hidden'::public.testimonial_status;

COMMIT;
