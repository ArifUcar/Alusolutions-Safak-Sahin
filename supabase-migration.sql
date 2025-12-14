-- ============================================
-- DYNAMIC CONFIGURATOR SYSTEM - DATABASE MIGRATION
-- Created: 2025-01-14
-- Purpose: Create dynamic configurator management system
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE 1: CONFIGURATORS (Main configurator table)
-- ============================================
CREATE TABLE IF NOT EXISTS configurators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name JSONB NOT NULL,
  description JSONB,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_configurators_slug ON configurators(slug);
CREATE INDEX IF NOT EXISTS idx_configurators_active ON configurators(is_active);
CREATE INDEX IF NOT EXISTS idx_configurators_category ON configurators(category);
CREATE INDEX IF NOT EXISTS idx_configurators_display_order ON configurators(display_order);

-- Comments
COMMENT ON TABLE configurators IS 'Main configurator definitions';
COMMENT ON COLUMN configurators.name IS 'Multi-language name: {"nl": "...", "en": "...", "tr": "...", "de": "...", "fr": "...", "it": "..."}';
COMMENT ON COLUMN configurators.slug IS 'URL-friendly identifier (e.g., "glazen-veranda")';

-- ============================================
-- TABLE 2: CONFIGURATOR_STEPS (Configurator steps)
-- ============================================
CREATE TABLE IF NOT EXISTS configurator_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  configurator_id UUID NOT NULL REFERENCES configurators(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  title JSONB NOT NULL,
  subtitle JSONB,
  input_type TEXT NOT NULL CHECK (
    input_type IN ('radio-image', 'radio', 'checkbox', 'text', 'number', 'select', 'textarea')
  ),
  field_name TEXT NOT NULL,
  is_required BOOLEAN DEFAULT true,
  min_value NUMERIC,
  max_value NUMERIC,
  validation_regex TEXT,
  help_text JSONB,
  show_condition JSONB,
  show_preview_image BOOLEAN DEFAULT false,
  preview_image_base_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(configurator_id, step_order),
  UNIQUE(configurator_id, field_name)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_steps_configurator ON configurator_steps(configurator_id);
CREATE INDEX IF NOT EXISTS idx_steps_order ON configurator_steps(configurator_id, step_order);
CREATE INDEX IF NOT EXISTS idx_steps_field_name ON configurator_steps(configurator_id, field_name);

-- Comments
COMMENT ON TABLE configurator_steps IS 'Steps for each configurator';
COMMENT ON COLUMN configurator_steps.input_type IS 'UI component type: radio-image, radio, checkbox, text, number, select, textarea';
COMMENT ON COLUMN configurator_steps.field_name IS 'Database field name (e.g., "goot_type", "kleur")';
COMMENT ON COLUMN configurator_steps.show_condition IS 'Conditional display logic: {"field": "meer_opties", "operator": "equals", "value": true}';
COMMENT ON COLUMN configurator_steps.preview_image_base_path IS 'Base path for preview images (e.g., "/Offorte/glazen-veranda/kleur/")';

-- ============================================
-- TABLE 3: CONFIGURATOR_OPTIONS (Step options)
-- ============================================
CREATE TABLE IF NOT EXISTS configurator_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  step_id UUID NOT NULL REFERENCES configurator_steps(id) ON DELETE CASCADE,
  option_value TEXT NOT NULL,
  label JSONB NOT NULL,
  description JSONB,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  price_modifier NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(step_id, option_value)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_options_step ON configurator_options(step_id);
CREATE INDEX IF NOT EXISTS idx_options_active ON configurator_options(is_active);
CREATE INDEX IF NOT EXISTS idx_options_display_order ON configurator_options(step_id, display_order);

-- Comments
COMMENT ON TABLE configurator_options IS 'Options for each configurator step';
COMMENT ON COLUMN configurator_options.option_value IS 'Value to save (e.g., "standaard", "wit", "glas")';
COMMENT ON COLUMN configurator_options.label IS 'Multi-language label: {"nl": "...", "en": "...", ...}';
COMMENT ON COLUMN configurator_options.price_modifier IS 'Price impact (future feature)';

-- ============================================
-- TABLE 4: CONFIGURATOR_SUBMISSIONS (User submissions)
-- ============================================
CREATE TABLE IF NOT EXISTS configurator_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  configurator_id UUID REFERENCES configurators(id),

  -- Dynamic configuration data
  configuration_data JSONB NOT NULL,

  -- Contact information
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_address TEXT,
  contact_city TEXT,
  notes TEXT,

  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (
    status IN ('new', 'viewed', 'quoted', 'accepted', 'rejected')
  ),

  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  viewed_at TIMESTAMPTZ,

  -- Additional data
  selected_gallery_images TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_submissions_configurator ON configurator_submissions(configurator_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON configurator_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted ON configurator_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_config ON configurator_submissions USING GIN (configuration_data);

-- Comments
COMMENT ON TABLE configurator_submissions IS 'User submissions from configurators';
COMMENT ON COLUMN configurator_submissions.configuration_data IS 'All form data as JSONB: {"goot_type": "rechte-goot", "kleur": "wit", ...}';

-- ============================================
-- UPDATE EXISTING OFFERTES TABLE (Backward compatibility)
-- ============================================
DO $$
BEGIN
  -- Add configurator_id column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'offertes' AND column_name = 'configurator_id'
  ) THEN
    ALTER TABLE offertes ADD COLUMN configurator_id UUID REFERENCES configurators(id);
  END IF;

  -- Add configuration_data column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'offertes' AND column_name = 'configuration_data'
  ) THEN
    ALTER TABLE offertes ADD COLUMN configuration_data JSONB;
  END IF;

  -- Add is_legacy column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'offertes' AND column_name = 'is_legacy'
  ) THEN
    ALTER TABLE offertes ADD COLUMN is_legacy BOOLEAN DEFAULT true;
  END IF;
END $$;

COMMENT ON COLUMN offertes.is_legacy IS 'Flag to identify old offerte submissions (before dynamic configurator system)';

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE configurators ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurator_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurator_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurator_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Public can view active configurators" ON configurators;
DROP POLICY IF EXISTS "Public can view steps" ON configurator_steps;
DROP POLICY IF EXISTS "Public can view options" ON configurator_options;
DROP POLICY IF EXISTS "Public can create submissions" ON configurator_submissions;
DROP POLICY IF EXISTS "Authenticated users can manage configurators" ON configurators;
DROP POLICY IF EXISTS "Authenticated users can manage steps" ON configurator_steps;
DROP POLICY IF EXISTS "Authenticated users can manage options" ON configurator_options;
DROP POLICY IF EXISTS "Authenticated users can view all submissions" ON configurator_submissions;
DROP POLICY IF EXISTS "Authenticated users can update submissions" ON configurator_submissions;

-- CONFIGURATORS: Public can view active configurators
CREATE POLICY "Public can view active configurators"
  ON configurators FOR SELECT
  USING (is_active = true);

-- CONFIGURATORS: Authenticated users can manage all
CREATE POLICY "Authenticated users can manage configurators"
  ON configurators FOR ALL
  USING (auth.role() = 'authenticated');

-- STEPS: Public can view steps of active configurators
CREATE POLICY "Public can view steps"
  ON configurator_steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM configurators
      WHERE configurators.id = configurator_steps.configurator_id
      AND configurators.is_active = true
    )
  );

-- STEPS: Authenticated users can manage all
CREATE POLICY "Authenticated users can manage steps"
  ON configurator_steps FOR ALL
  USING (auth.role() = 'authenticated');

-- OPTIONS: Public can view active options
CREATE POLICY "Public can view options"
  ON configurator_options FOR SELECT
  USING (is_active = true);

-- OPTIONS: Authenticated users can manage all
CREATE POLICY "Authenticated users can manage options"
  ON configurator_options FOR ALL
  USING (auth.role() = 'authenticated');

-- SUBMISSIONS: Public can insert (submit forms)
CREATE POLICY "Public can create submissions"
  ON configurator_submissions FOR INSERT
  WITH CHECK (true);

-- SUBMISSIONS: Authenticated users can view all
CREATE POLICY "Authenticated users can view all submissions"
  ON configurator_submissions FOR SELECT
  USING (auth.role() = 'authenticated');

-- SUBMISSIONS: Authenticated users can update (change status)
CREATE POLICY "Authenticated users can update submissions"
  ON configurator_submissions FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_configurators_updated_at ON configurators;
CREATE TRIGGER update_configurators_updated_at
  BEFORE UPDATE ON configurators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_configurator_steps_updated_at ON configurator_steps;
CREATE TRIGGER update_configurator_steps_updated_at
  BEFORE UPDATE ON configurator_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_configurator_submissions_updated_at ON configurator_submissions;
CREATE TRIGGER update_configurator_submissions_updated_at
  BEFORE UPDATE ON configurator_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Insert a sample configurator (Glazen Veranda)
INSERT INTO configurators (slug, name, description, category, is_active, display_order)
VALUES (
  'glazen-veranda',
  '{"nl": "Glazen Veranda", "en": "Glass Veranda", "tr": "Cam Veranda", "de": "Glas Veranda", "fr": "Véranda en Verre", "it": "Veranda in Vetro"}'::jsonb,
  '{"nl": "Configureer uw glazen veranda", "en": "Configure your glass veranda", "tr": "Cam verandanızı yapılandırın", "de": "Konfigurieren Sie Ihre Glasveranda", "fr": "Configurez votre véranda en verre", "it": "Configura la tua veranda in vetro"}'::jsonb,
  'veranda',
  true,
  1
)
ON CONFLICT (slug) DO NOTHING;

-- Get the configurator ID
DO $$
DECLARE
  config_id UUID;
  step1_id UUID;
  step2_id UUID;
BEGIN
  -- Get configurator ID
  SELECT id INTO config_id FROM configurators WHERE slug = 'glazen-veranda';

  IF config_id IS NOT NULL THEN
    -- Step 1: Overkapping Type
    INSERT INTO configurator_steps (
      configurator_id, step_order, title, input_type, field_name,
      is_required, show_preview_image, preview_image_base_path
    )
    VALUES (
      config_id,
      1,
      '{"nl": "Waar wilt u overkapping", "en": "Where do you want the canopy", "tr": "Üstü örtülü alanı nerede istiyorsunuz", "de": "Wo möchten Sie die Überdachung", "fr": "Où voulez-vous la canopée", "it": "Dove vuoi la tettoia"}'::jsonb,
      'radio-image',
      'overkapping_type',
      true,
      true,
      '/Offorte/glazen-veranda/overkapping/'
    )
    RETURNING id INTO step1_id;

    -- Options for Step 1
    INSERT INTO configurator_options (step_id, option_value, label, image_url, display_order)
    VALUES
      (step1_id, 'standaard', '{"nl": "Standaard", "en": "Standard", "tr": "Standart", "de": "Standard", "fr": "Standard", "it": "Standard"}'::jsonb, '/Offorte/glazen-veranda/overkapping/Standaard.png', 1),
      (step1_id, 'vrijstaand', '{"nl": "Vrijstaand", "en": "Freestanding", "tr": "Bağımsız", "de": "Freistehend", "fr": "Autoportant", "it": "Indipendente"}'::jsonb, '/Offorte/glazen-veranda/overkapping/Vrijstaand.png', 2);

    -- Step 2: Goot Type
    INSERT INTO configurator_steps (
      configurator_id, step_order, title, input_type, field_name,
      is_required, show_preview_image, preview_image_base_path
    )
    VALUES (
      config_id,
      2,
      '{"nl": "Goot type", "en": "Gutter type", "tr": "Oluk tipi", "de": "Rinnentyp", "fr": "Type de gouttière", "it": "Tipo di grondaia"}'::jsonb,
      'radio-image',
      'goot_type',
      true,
      true,
      '/Offorte/glazen-veranda/goot-type/'
    )
    RETURNING id INTO step2_id;

    -- Options for Step 2
    INSERT INTO configurator_options (step_id, option_value, label, image_url, display_order)
    VALUES
      (step2_id, 'rechte-goot', '{"nl": "Rechte Goot", "en": "Straight Gutter", "tr": "Düz Oluk", "de": "Gerade Rinne", "fr": "Gouttière droite", "it": "Grondaia dritta"}'::jsonb, '/Offorte/glazen-veranda/goot-type/Rechte-Goot.png', 1),
      (step2_id, 'halfronde-goot', '{"nl": "Halfronde Goot", "en": "Half-round Gutter", "tr": "Yarım Yuvarlak Oluk", "de": "Halbrunde Rinne", "fr": "Gouttière demi-ronde", "it": "Grondaia semicircolare"}'::jsonb, '/Offorte/glazen-veranda/goot-type/Halfronde-Goot.png', 2);

  END IF;
END $$;

-- ============================================
-- VERIFICATION QUERIES (For testing)
-- ============================================

-- Uncomment to verify tables were created successfully
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'configurator%';
-- SELECT * FROM configurators;
-- SELECT * FROM configurator_steps;
-- SELECT * FROM configurator_options;

-- ============================================
-- END OF MIGRATION
-- ============================================
