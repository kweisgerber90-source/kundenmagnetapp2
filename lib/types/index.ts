// lib/types/index.ts
// Zentrale Type-Exports für die gesamte Anwendung

// Campaign Types
export type {
  Campaign,
  CampaignCreatePayload,
  CampaignStatus,
  CampaignUpdatePayload,
  CampaignWithStats,
} from './campaign'

// Testimonial Types
export type {
  Testimonial,
  TestimonialCreatePayload,
  TestimonialStats,
  TestimonialStatus,
  TestimonialUpdatePayload,
} from './testimonial'

// QR Code Types
export type {
  QRCode,
  QRCodeCreatePayload,
  QRCodeDesign,
  QRCodeStats,
  QRCodeUpdatePayload,
  QRScan,
} from './qr'
