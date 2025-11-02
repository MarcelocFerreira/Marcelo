import {
  User,
  Tournament,
  Player,
  Court,
  Category,
  Match,
  Team,
  Group,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'tournament_users',
  CURRENT_USER: 'tournament_current_user',
  TOURNAMENTS: 'tournament_tournaments',
  PLAYERS: 'tournament_players',
  COURTS: 'tournament_courts',
  CATEGORIES: 'tournament_categories',
  MATCHES: 'tournament_matches',
  TEAMS: 'tournament_teams',
  GROUPS: 'tournament_groups',
} as const;

class LocalStorageService {
  // Generic methods
  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  // User methods
  getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS) || [];
  }

  saveUsers(users: User[]): void {
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  getCurrentUser(): User | null {
    return this.getItem<User>(STORAGE_KEYS.CURRENT_USER);
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      this.setItem(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      this.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find((u) => u.email === email) || null;
  }

  // Tournament methods
  getTournaments(): Tournament[] {
    return this.getItem<Tournament[]>(STORAGE_KEYS.TOURNAMENTS) || [];
  }

  saveTournaments(tournaments: Tournament[]): void {
    this.setItem(STORAGE_KEYS.TOURNAMENTS, tournaments);
  }

  addTournament(tournament: Tournament): void {
    const tournaments = this.getTournaments();
    tournaments.push(tournament);
    this.saveTournaments(tournaments);
  }

  updateTournament(id: string, data: Partial<Tournament>): void {
    const tournaments = this.getTournaments();
    const index = tournaments.findIndex((t) => t.id === id);
    if (index !== -1) {
      tournaments[index] = { ...tournaments[index], ...data };
      this.saveTournaments(tournaments);
    }
  }

  deleteTournament(id: string): void {
    const tournaments = this.getTournaments();
    const filtered = tournaments.filter((t) => t.id !== id);
    this.saveTournaments(filtered);
  }

  getTournamentById(id: string): Tournament | null {
    const tournaments = this.getTournaments();
    return tournaments.find((t) => t.id === id) || null;
  }

  // Player methods
  getPlayers(): Player[] {
    return this.getItem<Player[]>(STORAGE_KEYS.PLAYERS) || [];
  }

  savePlayers(players: Player[]): void {
    this.setItem(STORAGE_KEYS.PLAYERS, players);
  }

  addPlayer(player: Player): void {
    const players = this.getPlayers();
    players.push(player);
    this.savePlayers(players);
  }

  updatePlayer(id: string, data: Partial<Player>): void {
    const players = this.getPlayers();
    const index = players.findIndex((p) => p.id === id);
    if (index !== -1) {
      players[index] = { ...players[index], ...data };
      this.savePlayers(players);
    }
  }

  deletePlayer(id: string): void {
    const players = this.getPlayers();
    const filtered = players.filter((p) => p.id !== id);
    this.savePlayers(filtered);
  }

  getPlayerById(id: string): Player | null {
    const players = this.getPlayers();
    return players.find((p) => p.id === id) || null;
  }

  // Court methods
  getCourts(): Court[] {
    return this.getItem<Court[]>(STORAGE_KEYS.COURTS) || [];
  }

  saveCourts(courts: Court[]): void {
    this.setItem(STORAGE_KEYS.COURTS, courts);
  }

  addCourt(court: Court): void {
    const courts = this.getCourts();
    courts.push(court);
    this.saveCourts(courts);
  }

  updateCourt(id: string, data: Partial<Court>): void {
    const courts = this.getCourts();
    const index = courts.findIndex((c) => c.id === id);
    if (index !== -1) {
      courts[index] = { ...courts[index], ...data };
      this.saveCourts(courts);
    }
  }

  deleteCourt(id: string): void {
    const courts = this.getCourts();
    const filtered = courts.filter((c) => c.id !== id);
    this.saveCourts(filtered);
  }

  getCourtsByTournamentId(tournamentId: string): Court[] {
    const courts = this.getCourts();
    return courts.filter((c) => c.tournamentId === tournamentId);
  }

  // Category methods
  getCategories(): Category[] {
    const categories = this.getItem<Category[]>(STORAGE_KEYS.CATEGORIES);
    if (!categories || categories.length === 0) {
      // Return default categories
      return [
        { id: '1', name: 'Infantil', color: '#4CAF50' },
        { id: '2', name: 'Juvenil', color: '#2196F3' },
        { id: '3', name: 'Adulto', color: '#FF9800' },
        { id: '4', name: 'Master', color: '#9C27B0' },
      ];
    }
    return categories;
  }

  saveCategories(categories: Category[]): void {
    this.setItem(STORAGE_KEYS.CATEGORIES, categories);
  }

  addCategory(category: Category): void {
    const categories = this.getCategories();
    categories.push(category);
    this.saveCategories(categories);
  }

  updateCategory(id: string, data: Partial<Category>): void {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...data };
      this.saveCategories(categories);
    }
  }

  deleteCategory(id: string): void {
    const categories = this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    this.saveCategories(filtered);
  }

  // Match methods
  getMatches(): Match[] {
    return this.getItem<Match[]>(STORAGE_KEYS.MATCHES) || [];
  }

  saveMatches(matches: Match[]): void {
    this.setItem(STORAGE_KEYS.MATCHES, matches);
  }

  addMatch(match: Match): void {
    const matches = this.getMatches();
    matches.push(match);
    this.saveMatches(matches);
  }

  updateMatch(id: string, data: Partial<Match>): void {
    const matches = this.getMatches();
    const index = matches.findIndex((m) => m.id === id);
    if (index !== -1) {
      matches[index] = { ...matches[index], ...data };
      this.saveMatches(matches);
    }
  }

  deleteMatch(id: string): void {
    const matches = this.getMatches();
    const filtered = matches.filter((m) => m.id !== id);
    this.saveMatches(filtered);
  }

  getMatchesByTournamentId(tournamentId: string): Match[] {
    const matches = this.getMatches();
    return matches.filter((m) => m.tournamentId === tournamentId);
  }

  // Team methods
  getTeams(): Team[] {
    return this.getItem<Team[]>(STORAGE_KEYS.TEAMS) || [];
  }

  saveTeams(teams: Team[]): void {
    this.setItem(STORAGE_KEYS.TEAMS, teams);
  }

  addTeam(team: Team): void {
    const teams = this.getTeams();
    teams.push(team);
    this.saveTeams(teams);
  }

  updateTeam(id: string, data: Partial<Team>): void {
    const teams = this.getTeams();
    const index = teams.findIndex((t) => t.id === id);
    if (index !== -1) {
      teams[index] = { ...teams[index], ...data };
      this.saveTeams(teams);
    }
  }

  deleteTeam(id: string): void {
    const teams = this.getTeams();
    const filtered = teams.filter((t) => t.id !== id);
    this.saveTeams(filtered);
  }

  getTeamsByTournamentId(tournamentId: string): Team[] {
    const teams = this.getTeams();
    return teams.filter((t) => t.tournamentId === tournamentId);
  }

  // Group methods
  getGroups(): Group[] {
    return this.getItem<Group[]>(STORAGE_KEYS.GROUPS) || [];
  }

  saveGroups(groups: Group[]): void {
    this.setItem(STORAGE_KEYS.GROUPS, groups);
  }

  addGroup(group: Group): void {
    const groups = this.getGroups();
    groups.push(group);
    this.saveGroups(groups);
  }

  updateGroup(id: string, data: Partial<Group>): void {
    const groups = this.getGroups();
    const index = groups.findIndex((g) => g.id === id);
    if (index !== -1) {
      groups[index] = { ...groups[index], ...data };
      this.saveGroups(groups);
    }
  }

  deleteGroup(id: string): void {
    const groups = this.getGroups();
    const filtered = groups.filter((g) => g.id !== id);
    this.saveGroups(filtered);
  }

  getGroupsByTournamentId(tournamentId: string): Group[] {
    const groups = this.getGroups();
    return groups.filter((g) => g.tournamentId === tournamentId);
  }

  // Clear all data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      this.removeItem(key);
    });
  }
}

export const localStorageService = new LocalStorageService();
