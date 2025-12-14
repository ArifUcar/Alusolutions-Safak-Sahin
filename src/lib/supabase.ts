import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Page {
  id: string
  title: string
  slug: string
  content: string
  meta_description?: string
  page_type: 'content' | 'configurator'
  is_published: boolean
  show_in_header: boolean
  header_order: number
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  url: string
  alt: string
  category: string
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  image_url?: string
  gallery_images: string[]
  specifications: Record<string, string>
  is_active: boolean
  created_at: string
}

export interface Appointment {
  id: string
  name: string
  email: string
  phone: string
  service_type: string
  preferred_date: string
  preferred_time: string
  message?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export interface Offerte {
  id: string
  // Stap 1-4: Overkapping configuratie
  overkapping_type: string
  goot_type: string
  kleur: string
  materiaal: string
  // Stap 5: Afmetingen
  breedte: string
  lengte: string
  // Stap 6: Verlichting
  verlichting: string
  // Stap 7-8: Extra opties
  meer_opties: boolean
  rechter_kant?: string
  rechter_spie?: string
  linker_kant?: string
  linker_spie?: string
  voorkant?: string
  achterkant?: string
  // Stap 9: Montage
  montage: string
  // Stap 10: Klant gegevens
  naam: string
  straat: string
  woonplaats: string
  email: string
  telefoon: string
  opmerking?: string
  // Status tracking
  status: 'new' | 'viewed' | 'quoted' | 'accepted' | 'rejected'
  created_at: string
  updated_at?: string
  // New fields for dynamic configurator system
  configurator_id?: string
  configuration_data?: Record<string, any>
  is_legacy?: boolean
}

// ============================================
// DYNAMIC CONFIGURATOR SYSTEM - TYPE DEFINITIONS
// ============================================

/**
 * Multi-language text object
 * Each key is a language code (nl, en, tr, de, fr, it)
 */
export type MultiLanguageText = {
  nl: string
  en?: string
  tr?: string
  de?: string
  fr?: string
  it?: string
}

/**
 * Conditional display logic for steps
 */
export type StepCondition = {
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains'
  value: any
}

/**
 * Input types for configurator steps
 */
export type StepInputType =
  | 'radio-image'
  | 'radio'
  | 'checkbox'
  | 'text'
  | 'number'
  | 'select'
  | 'textarea'

/**
 * Main configurator definition
 */
export interface Configurator {
  id: string
  slug: string
  name: MultiLanguageText
  description?: MultiLanguageText
  category?: string
  image_url?: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

/**
 * Configurator step definition
 */
export interface ConfiguratorStep {
  id: string
  configurator_id: string
  step_order: number
  title: MultiLanguageText
  subtitle?: MultiLanguageText
  input_type: StepInputType
  field_name: string
  is_required: boolean
  min_value?: number
  max_value?: number
  validation_regex?: string
  help_text?: MultiLanguageText
  show_condition?: StepCondition | StepCondition[]
  show_preview_image: boolean
  preview_image_base_path?: string
  created_at: string
  updated_at: string
  // Nested relations (loaded with Supabase select)
  configurator_options?: ConfiguratorOption[]
}

/**
 * Step option definition
 */
export interface ConfiguratorOption {
  id: string
  step_id: string
  option_value: string
  label: MultiLanguageText
  description?: MultiLanguageText
  image_url?: string
  display_order: number
  is_active: boolean
  price_modifier: number
  created_at: string
}

/**
 * User submission from configurator
 */
export interface ConfiguratorSubmission {
  id: string
  configurator_id?: string
  configuration_data: Record<string, any>
  contact_name: string
  contact_email: string
  contact_phone: string
  contact_address?: string
  contact_city?: string
  notes?: string
  status: 'new' | 'viewed' | 'quoted' | 'accepted' | 'rejected'
  submitted_at: string
  updated_at: string
  viewed_at?: string
  selected_gallery_images?: string[]
  created_at: string
}

/**
 * Extended configurator with nested steps and options (for admin editing)
 */
export interface ConfiguratorWithSteps extends Configurator {
  configurator_steps: (ConfiguratorStep & {
    configurator_options: ConfiguratorOption[]
  })[]
}
