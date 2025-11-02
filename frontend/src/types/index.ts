// Enums
export enum TournamentStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TournamentFormat {
  GROUP = 'GROUP',
  ELIMINATION = 'ELIMINATION',
  MIXED = 'MIXED',
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum MatchPhase {
  GROUP = 'GROUP',
  ROUND_32 = 'ROUND_32',
  ROUND_16 = 'ROUND_16',
  QUARTER = 'QUARTER',
  SEMI = 'SEMI',
  THIRD_PLACE = 'THIRD_PLACE',
  FINAL = 'FINAL',
}

export enum MatchStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  CONFLICT = 'CONFLICT',
}

export enum NextMatchPosition {
  TEAM_A = 'TEAM_A',
  TEAM_B = 'TEAM_B',
}

export enum ConflictType {
  COURT_UNAVAILABLE = 'COURT_UNAVAILABLE',
  PLAYER_UNAVAILABLE = 'PLAYER_UNAVAILABLE',
  DOUBLE_BOOKING = 'DOUBLE_BOOKING',
  TIME_CONSTRAINT = 'TIME_CONSTRAINT',
}

export enum ConflictStatus {
  UNRESOLVED = 'UNRESOLVED',
  RESOLVED = 'RESOLVED',
  IGNORED = 'IGNORED',
}

// Core Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Tournament {
  id: string;
  name: string;
  sport: string;
  category: string;
  startDate: Date;
  endDate: Date;
  status: TournamentStatus;
  format: TournamentFormat;
  matchDuration: number;
  breakBetweenMatches: number;
  createdAt: Date;
  updatedAt: Date;
  courts?: Court[];
  teams?: Team[];
  matches?: Match[];
  groups?: Group[];
}

export interface Court {
  id: string;
  tournamentId: string;
  name: string;
  location?: string;
  sport: string;
  isActive: boolean;
  createdAt: Date;
  timeSlots?: TimeSlot[];
  matches?: Match[];
}

export interface TimeSlot {
  id: string;
  courtId: string;
  dayOfWeek?: DayOfWeek;
  date?: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Team {
  id: string;
  tournamentId: string;
  name: string;
  seed?: number;
  groupId?: string;
  createdAt: Date;
  players?: Player[];
}

export interface Player {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category?: string;
  createdAt: Date;
  availabilities?: PlayerAvailability[];
}

export interface PlayerAvailability {
  id: string;
  playerId: string;
  tournamentId: string;
  dayOfWeek?: DayOfWeek;
  specificDate?: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  notes?: string;
}

export interface Group {
  id: string;
  tournamentId: string;
  name: string;
  advancingTeams: number;
  teams?: Team[];
  matches?: Match[];
}

export interface Match {
  id: string;
  tournamentId: string;
  phase: MatchPhase;
  groupId?: string;
  round?: number;
  teamAId: string;
  teamBId: string;
  courtId?: string;
  scheduledDate?: Date;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  actualStartTime?: Date;
  actualEndTime?: Date;
  status: MatchStatus;
  scoreTeamA?: number;
  scoreTeamB?: number;
  winnerId?: string;
  nextMatchId?: string;
  nextMatchPosition?: NextMatchPosition;
  createdAt: Date;
  teamA?: Team;
  teamB?: Team;
  court?: Court;
  conflicts?: Conflict[];
}

export interface Conflict {
  id: string;
  matchId: string;
  type: ConflictType;
  description: string;
  suggestedAlternatives: SuggestedAlternative[];
  status: ConflictStatus;
  createdAt: Date;
}

export interface SuggestedAlternative {
  courtId: string;
  courtName: string;
  date: Date;
  startTime: string;
  endTime: string;
  score: number;
  reason: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TournamentFormData {
  name: string;
  sport: string;
  category: string;
  startDate: Date;
  endDate: Date;
  format: TournamentFormat;
  matchDuration: number;
  breakBetweenMatches: number;
}

export interface PlayerFormData {
  name: string;
  email: string;
  phone?: string;
  category?: string;
  availabilities: PlayerAvailability[];
}

export interface CourtFormData {
  name: string;
  location?: string;
  sport: string;
  timeSlots: Omit<TimeSlot, 'id' | 'courtId'>[];
}

// State Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TournamentState {
  tournaments: Tournament[];
  selectedTournament: Tournament | null;
  isLoading: boolean;
  error: string | null;
}

export interface PlayerState {
  players: Player[];
  isLoading: boolean;
  error: string | null;
}

export interface CourtState {
  courts: Court[];
  isLoading: boolean;
  error: string | null;
}

export interface CategoryState {
  categories: Category[];
}
