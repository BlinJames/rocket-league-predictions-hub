-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  random_username TEXT;
BEGIN
  -- Generate a random username from email or id
  random_username := COALESCE(
    split_part(NEW.email, '@', 1),
    'user'
  ) || '_' || substr(md5(random()::text), 1, 6);

  -- Insert profile
  INSERT INTO public.profiles (id, user_id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.id,
    random_username,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If username already exists, append more random characters
    random_username := random_username || '_' || substr(md5(random()::text), 1, 4);
    INSERT INTO public.profiles (id, user_id, username, display_name, avatar_url)
    VALUES (
      NEW.id,
      NEW.id,
      random_username,
      COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
    );
    RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();