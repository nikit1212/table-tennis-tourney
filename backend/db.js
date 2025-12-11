const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'tournament.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Игроки
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
                                         id          INTEGER PRIMARY KEY AUTOINCREMENT,
                                         first_name  TEXT    NOT NULL,
                                         last_name   TEXT    NOT NULL,
                                         gender      TEXT    NOT NULL, -- 'M' | 'F' | 'O'
                                         created_at  TEXT    NOT NULL,
                                         is_active   INTEGER NOT NULL DEFAULT 1
    )
  `);

  // Команды (single/double, на будущее)
  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
                                       id          INTEGER PRIMARY KEY AUTOINCREMENT,
                                       name        TEXT,
                                       team_type   TEXT    NOT NULL, -- 'single' | 'double'
                                       created_at  TEXT    NOT NULL
    )
  `);

  // Связь команда–игроки
  db.run(`
    CREATE TABLE IF NOT EXISTS team_players (
                                              id         INTEGER PRIMARY KEY AUTOINCREMENT,
                                              team_id    INTEGER NOT NULL,
                                              player_id  INTEGER NOT NULL,
                                              FOREIGN KEY (team_id) REFERENCES teams(id),
      FOREIGN KEY (player_id) REFERENCES players(id)
      )
  `);

  // Турниры
  db.run(`
    CREATE TABLE IF NOT EXISTS tournaments (
                                             id            INTEGER PRIMARY KEY AUTOINCREMENT,
                                             name          TEXT    NOT NULL,
                                             mode          TEXT    NOT NULL, -- 'round_robin', 'playoff', 'groups'
                                             team_type     TEXT    NOT NULL, -- 'single' | 'double'
                                             points_to_win INTEGER NOT NULL,
                                             best_of       INTEGER NOT NULL,
                                             status        TEXT    NOT NULL, -- 'draft', 'in_progress', 'finished', 'cancelled'
                                             created_at    TEXT    NOT NULL,
                                             finished_at   TEXT
    )
  `);

  // Участники турнира (через команды)
  db.run(`
    CREATE TABLE IF NOT EXISTS tournament_participants (
                                                         id            INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         tournament_id INTEGER NOT NULL,
                                                         team_id       INTEGER NOT NULL,
                                                         is_active     INTEGER NOT NULL DEFAULT 1,
                                                         FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
      FOREIGN KEY (team_id) REFERENCES teams(id)
      )
  `);

  // Матчи
  db.run(`
    CREATE TABLE IF NOT EXISTS matches (
                                         id              INTEGER PRIMARY KEY AUTOINCREMENT,
                                         tournament_id   INTEGER NOT NULL,
                                         round_number    INTEGER NOT NULL,
                                         match_number    INTEGER NOT NULL,
                                         team1_id        INTEGER NOT NULL,
                                         team2_id        INTEGER NOT NULL,
                                         team1_score     INTEGER NOT NULL DEFAULT 0,
                                         team2_score     INTEGER NOT NULL DEFAULT 0,
                                         winner_team_id  INTEGER,
                                         status          TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled','in_progress','finished','walkover'
                                         created_at      TEXT NOT NULL,
                                         finished_at     TEXT,
                                         FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
      FOREIGN KEY (team1_id) REFERENCES teams(id),
      FOREIGN KEY (team2_id) REFERENCES teams(id),
      FOREIGN KEY (winner_team_id) REFERENCES teams(id)
      )
  `);

  // Сеты (по сетам, до 11 очков)
  db.run(`
    CREATE TABLE IF NOT EXISTS sets (
                                      id         INTEGER PRIMARY KEY AUTOINCREMENT,
                                      match_id   INTEGER NOT NULL,
                                      set_index  INTEGER NOT NULL,
                                      team1_pts  INTEGER NOT NULL,
                                      team2_pts  INTEGER NOT NULL,
                                      FOREIGN KEY (match_id) REFERENCES matches(id)
      )
  `);

  // Рейтинги игроков по режимам
  db.run(`
    CREATE TABLE IF NOT EXISTS ratings (
                                         id         INTEGER PRIMARY KEY AUTOINCREMENT,
                                         player_id  INTEGER NOT NULL,
                                         mode       TEXT    NOT NULL,
                                         value      REAL    NOT NULL DEFAULT 0,
                                         updated_at TEXT    NOT NULL,
                                         UNIQUE (player_id, mode),
      FOREIGN KEY (player_id) REFERENCES players(id)
      )
  `);
});

module.exports = db;
