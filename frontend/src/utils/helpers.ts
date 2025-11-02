import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format date
export const formatDate = (date: Date | string, formatStr = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: ptBR });
};

// Format date and time
export const formatDateTime = (
  date: Date | string,
  formatStr = 'dd/MM/yyyy HH:mm'
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: ptBR });
};

// Format time
export const formatTime = (time: string): string => {
  return time;
};

// Parse time (HH:mm) to minutes
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convert minutes to time (HH:mm)
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Check if time is in range
export const isTimeInRange = (
  time: string,
  startTime: string,
  endTime: string
): boolean => {
  const timeMin = timeToMinutes(time);
  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);
  return timeMin >= startMin && timeMin <= endMin;
};

// Get status badge color
export const getStatusColor = (
  status: string
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status.toUpperCase()) {
    case 'DRAFT':
      return 'default';
    case 'SCHEDULED':
      return 'info';
    case 'IN_PROGRESS':
      return 'warning';
    case 'COMPLETED':
      return 'success';
    case 'CANCELLED':
    case 'CONFLICT':
      return 'error';
    case 'PENDING':
      return 'default';
    default:
      return 'default';
  }
};

// Get format label
export const getFormatLabel = (format: string): string => {
  switch (format.toUpperCase()) {
    case 'GROUP':
      return 'Grupos';
    case 'ELIMINATION':
      return 'Eliminatórias';
    case 'MIXED':
      return 'Misto';
    default:
      return format;
  }
};

// Get phase label
export const getPhaseLabel = (phase: string): string => {
  switch (phase.toUpperCase()) {
    case 'GROUP':
      return 'Fase de Grupos';
    case 'ROUND_32':
      return 'Oitavas de Final (32)';
    case 'ROUND_16':
      return 'Oitavas de Final';
    case 'QUARTER':
      return 'Quartas de Final';
    case 'SEMI':
      return 'Semifinal';
    case 'THIRD_PLACE':
      return 'Terceiro Lugar';
    case 'FINAL':
      return 'Final';
    default:
      return phase;
  }
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/;
  return phoneRegex.test(phone);
};

// Format phone
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  }
  return phone;
};

// Calculate statistics
export const calculateWinRate = (wins: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
};

// Sort by date
export const sortByDate = <T extends { createdAt: Date | string }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = typeof a.createdAt === 'string' ? parseISO(a.createdAt) : a.createdAt;
    const dateB = typeof b.createdAt === 'string' ? parseISO(b.createdAt) : b.createdAt;
    return order === 'asc'
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
};

// Day of week to number (0 = Monday, 6 = Sunday)
export const dayOfWeekToNumber = (day: string): number => {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  return days.indexOf(day.toUpperCase());
};

// Number to day of week
export const numberToDayOfWeek = (num: number): string => {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  return days[num] || 'MONDAY';
};

// Get day of week label
export const getDayOfWeekLabel = (day: string): string => {
  switch (day.toUpperCase()) {
    case 'MONDAY':
      return 'Segunda-feira';
    case 'TUESDAY':
      return 'Terça-feira';
    case 'WEDNESDAY':
      return 'Quarta-feira';
    case 'THURSDAY':
      return 'Quinta-feira';
    case 'FRIDAY':
      return 'Sexta-feira';
    case 'SATURDAY':
      return 'Sábado';
    case 'SUNDAY':
      return 'Domingo';
    default:
      return day;
  }
};
