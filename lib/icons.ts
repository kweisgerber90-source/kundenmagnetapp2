// lib/icons.ts
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BellOff,
  Briefcase,
  // Business
  Building2,
  Calendar,
  Camera,
  Check,
  // Status
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Code,
  // Actions
  Copy,
  CreditCard,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Gauge,
  Gift,
  Globe,
  // Misc
  Heart,
  HeartHandshake,
  HelpCircle,
  // Media
  Image,
  Inbox,
  Info,
  Key,
  Layers,
  // Security & Privacy
  Lock,
  Mail,
  MapPin,
  // Navigation & UI
  Menu,
  MessageCircle,
  MessageSquare,
  Mic,
  Minus,
  Monitor,
  // Communication
  Phone,
  PieChart,
  Plus,
  QrCode,
  Receipt,
  RefreshCw,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  Shuffle,
  Smartphone,
  Sparkles,
  // Features
  Star,
  Tablet,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TrendingDown,
  // Data & Analytics
  TrendingUp,
  Unlock,
  Upload,
  Users,
  Video,
  X,
  XCircle,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export type IconName =
  | 'menu'
  | 'close'
  | 'star'
  | 'qrcode'
  | 'shield'
  | 'zap'
  | 'users'
  | 'mail'
  | 'message'
  | 'globe'
  | 'chart'
  | 'clock'
  | 'phone'
  | 'check'
  | 'error'
  | 'warning'
  | 'info'
  | 'heart'
  | 'sparkles'
  | 'lock'
  | 'copy'
  | 'download'
  | 'settings'
  | 'help'

export const icons: Record<IconName, LucideIcon> = {
  menu: Menu,
  close: X,
  star: Star,
  qrcode: QrCode,
  shield: Shield,
  zap: Zap,
  users: Users,
  mail: Mail,
  message: MessageSquare,
  globe: Globe,
  chart: BarChart3,
  clock: Clock,
  phone: Smartphone,
  check: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  heart: Heart,
  sparkles: Sparkles,
  lock: Lock,
  copy: Copy,
  download: Download,
  settings: Settings,
  help: HelpCircle,
}

export {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BellOff,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Code,
  Copy,
  CreditCard,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Gauge,
  Gift,
  Globe,
  Heart,
  HeartHandshake,
  HelpCircle,
  Image,
  Inbox,
  Info,
  Key,
  Layers,
  Lock,
  Mail,
  MapPin,
  // Re-export all icons for direct import
  Menu,
  MessageCircle,
  MessageSquare,
  Mic,
  Minus,
  Monitor,
  Phone,
  PieChart,
  Plus,
  QrCode,
  Receipt,
  RefreshCw,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  Shuffle,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TrendingDown,
  TrendingUp,
  Unlock,
  Upload,
  Users,
  Video,
  X,
  XCircle,
  Zap,
}

// Kategorisierte Icon-Sets für verschiedene Anwendungsfälle
export const featureIcons = {
  testimonials: Star,
  qrcode: QrCode,
  moderation: Shield,
  performance: Zap,
  users: Users,
  analytics: BarChart3,
  widget: Code,
  integration: Layers,
  security: Lock,
  support: HeartHandshake,
} as const

export const statusIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  pending: Clock,
} as const

export const socialIcons = {
  email: Mail,
  phone: Phone,
  message: MessageSquare,
  share: Share2,
} as const
