-- =============================================================================
-- MisInfo — Schema inicial MVP v1
-- Migración: 0001_initial_schema.sql
-- =============================================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- FUNCIÓN HELPER: updated_at automático
-- =============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 1. PROFILES
-- Extiende auth.users. Se crea automáticamente al registrarse.
-- =============================================================================
CREATE TABLE profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL DEFAULT '',
  avatar_url      TEXT,
  role            TEXT        NOT NULL DEFAULT 'propietario'
                              CHECK (role IN ('propietario', 'inquilino')),
  shares_expenses BOOLEAN     NOT NULL DEFAULT false,
  currency        TEXT        NOT NULL DEFAULT 'ARS'
                              CHECK (currency IN ('ARS', 'USD')),
  plan            TEXT        NOT NULL DEFAULT 'free'
                              CHECK (plan IN ('free', 'premium')),
  dark_mode       BOOLEAN     NOT NULL DEFAULT false,
  balance_hidden  BOOLEAN     NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger: crea el perfil automáticamente cuando el usuario se registra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- 2. ACCOUNTS — cuentas bancarias del usuario
-- =============================================================================
CREATE TABLE accounts (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  num        TEXT,                          -- "**** 4321" ya maskeado
  balance    NUMERIC(12,2) NOT NULL DEFAULT 0,
  icon       TEXT        NOT NULL DEFAULT 'bank',
  color      TEXT,
  domain     TEXT,                          -- para logo Clearbit
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX accounts_user_id_idx ON accounts(user_id);

CREATE TRIGGER accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- 3. SUBSCRIPTIONS — suscripciones recurrentes
-- =============================================================================
CREATE TABLE subscriptions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  icon         TEXT,
  color        TEXT,
  domain       TEXT,
  price        NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  billing_day  SMALLINT    NOT NULL CHECK (billing_day BETWEEN 1 AND 31),
  paused       BOOLEAN     NOT NULL DEFAULT false,
  warning_text TEXT,                        -- "Sube a $749 próx. mes"
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX subscriptions_billing_day_idx ON subscriptions(billing_day) WHERE paused = false;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- 4. PROPERTIES — inmuebles
-- =============================================================================
CREATE TABLE properties (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  address    TEXT,
  value      NUMERIC(14,2) CHECK (value >= 0),
  type       TEXT        NOT NULL DEFAULT 'Propietario'
                         CHECK (type IN ('Propietario', 'Inquilino', 'Inversión')),
  icon       TEXT        NOT NULL DEFAULT 'home',
  gradient   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX properties_user_id_idx ON properties(user_id);

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- 5. PROPERTY_SERVICES — servicios del hogar por propiedad
-- =============================================================================
CREATE TABLE property_services (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID        NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,          -- 'Electricidad' | 'Agua' | etc.
  company     TEXT,                          -- 'Edenor' | 'AySA' | etc.
  amount      NUMERIC(10,2) CHECK (amount >= 0),
  period_type TEXT        NOT NULL DEFAULT 'variable'
                          CHECK (period_type IN ('fijo', 'variable')),
  status      TEXT        NOT NULL DEFAULT 'pendiente'
                          CHECK (status IN ('pendiente', 'pagado', 'vencido')),
  due_date    DATE,
  paid_at     TIMESTAMPTZ,
  payment_url TEXT,                          -- link directo al portal
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX property_services_property_id_idx ON property_services(property_id);
CREATE INDEX property_services_status_idx ON property_services(status) WHERE status != 'pagado';

CREATE TRIGGER property_services_updated_at
  BEFORE UPDATE ON property_services
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- 6. ACTIVITIES — historial de movimientos
-- =============================================================================
CREATE TABLE activities (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id  UUID        REFERENCES accounts(id) ON DELETE SET NULL,
  name        TEXT        NOT NULL,
  amount      NUMERIC(12,2) NOT NULL,         -- positivo=ingreso, negativo=gasto
  category    TEXT        NOT NULL
              CHECK (category IN ('ingreso', 'gasto', 'servicios', 'compras')),
  icon        TEXT,
  domain      TEXT,
  source_type TEXT        CHECK (source_type IN ('manual', 'subscription', 'property_service', 'email_parsed')),
  source_id   UUID,                           -- FK polimórfica al origen
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX activities_user_id_idx ON activities(user_id);
CREATE INDEX activities_occurred_at_idx ON activities(user_id, occurred_at DESC);
CREATE INDEX activities_category_idx ON activities(user_id, category);

-- =============================================================================
-- 7. CREDENTIALS — vault de credenciales (cifrado client-side AES-256)
-- RIESGO CRÍTICO: el backend NUNCA descifra estos campos.
-- =============================================================================
CREATE TABLE credentials (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_name TEXT        NOT NULL,
  portal_url   TEXT,
  username_enc TEXT        NOT NULL,          -- AES-256, cifrado client-side
  password_enc TEXT        NOT NULL,          -- AES-256, cifrado client-side
  notes_enc    TEXT,                          -- AES-256, cifrado client-side
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX credentials_user_id_idx ON credentials(user_id);

CREATE TRIGGER credentials_updated_at
  BEFORE UPDATE ON credentials
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- 8. NOTIFICATIONS — centro de notificaciones in-app
-- =============================================================================
CREATE TABLE notifications (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT        NOT NULL
              CHECK (type IN ('vencimiento', 'alerta_precio', 'confirmacion_pago', 'sync_completada', 'email_parsed')),
  title       TEXT        NOT NULL,
  body        TEXT,
  severity    TEXT        NOT NULL DEFAULT 'info'
              CHECK (severity IN ('info', 'warning', 'error')),
  read        BOOLEAN     NOT NULL DEFAULT false,
  source_type TEXT,
  source_id   UUID,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_unread_idx ON notifications(user_id, created_at DESC) WHERE read = false;

-- =============================================================================
-- 9. EMAIL_PARSES — detecciones automáticas desde Gmail (F3 - Jul 2026)
-- =============================================================================
CREATE TABLE email_parses (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  gmail_message_id TEXT        NOT NULL UNIQUE,
  raw_subject      TEXT,
  raw_sender       TEXT,
  parsed_service   TEXT,                      -- resultado Gemini Flash
  parsed_amount    NUMERIC(10,2),
  parsed_currency  TEXT,
  parsed_date      DATE,
  parsed_category  TEXT,
  status           TEXT        NOT NULL DEFAULT 'pending_review'
                               CHECK (status IN ('pending_review', 'confirmed', 'rejected', 'failed')),
  confirmed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX email_parses_user_id_idx ON email_parses(user_id);
CREATE INDEX email_parses_status_idx ON email_parses(user_id, status) WHERE status = 'pending_review';

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Cada usuario solo accede a sus propios datos. Sin excepciones.
-- =============================================================================

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties        ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities        ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_parses      ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles: usuario propio"
  ON profiles FOR ALL
  USING (id = auth.uid());

-- accounts
CREATE POLICY "accounts: usuario propio"
  ON accounts FOR ALL
  USING (user_id = auth.uid());

-- subscriptions
CREATE POLICY "subscriptions: usuario propio"
  ON subscriptions FOR ALL
  USING (user_id = auth.uid());

-- properties
CREATE POLICY "properties: usuario propio"
  ON properties FOR ALL
  USING (user_id = auth.uid());

-- property_services: acceso vía propiedad del usuario
CREATE POLICY "property_services: usuario propio"
  ON property_services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_services.property_id
        AND properties.user_id = auth.uid()
    )
  );

-- activities
CREATE POLICY "activities: usuario propio"
  ON activities FOR ALL
  USING (user_id = auth.uid());

-- credentials
CREATE POLICY "credentials: usuario propio"
  ON credentials FOR ALL
  USING (user_id = auth.uid());

-- notifications
CREATE POLICY "notifications: usuario propio"
  ON notifications FOR ALL
  USING (user_id = auth.uid());

-- email_parses
CREATE POLICY "email_parses: usuario propio"
  ON email_parses FOR ALL
  USING (user_id = auth.uid());

-- =============================================================================
-- VISTA: balance total del usuario (suma de cuentas)
-- =============================================================================
CREATE OR REPLACE VIEW user_balance AS
  SELECT user_id, COALESCE(SUM(balance), 0) AS total
  FROM accounts
  GROUP BY user_id;

-- =============================================================================
-- VISTA: suscripciones activas con próximo vencimiento
-- =============================================================================
CREATE OR REPLACE VIEW upcoming_subscriptions AS
  SELECT
    s.*,
    -- días hasta el próximo cobro (simplificado, asume mes corriente)
    CASE
      WHEN s.billing_day >= EXTRACT(DAY FROM CURRENT_DATE)
        THEN s.billing_day - EXTRACT(DAY FROM CURRENT_DATE)
      ELSE
        (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::DATE
        + s.billing_day - 1
        - CURRENT_DATE
    END AS days_until_billing
  FROM subscriptions s
  WHERE s.paused = false
  ORDER BY days_until_billing ASC;
