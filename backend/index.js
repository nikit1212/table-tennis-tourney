const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const nowIso = () => new Date().toISOString();

/* -------------------- PLAYERS -------------------- */

// GET /api/players?activeOnly=true
app.get('/api/players', (req, res) => {
  const activeOnly = req.query.activeOnly !== 'false';
  const sql = activeOnly
    ? 'SELECT * FROM players WHERE is_active = 1'
    : 'SELECT * FROM players';
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/players/:id
app.get('/api/players/:id', (req, res) => {
  db.get('SELECT * FROM players WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Player not found' });
    res.json(row);
  });
});

// POST /api/players
app.post('/api/players', (req, res) => {
  const { first_name, last_name, gender } = req.body;
  if (!first_name || !last_name || !gender) {
    return res.status(400).json({ error: 'first_name, last_name, gender are required' });
  }
  db.run(
    `
      INSERT INTO players (first_name, last_name, gender, created_at)
      VALUES (?, ?, ?, ?)
    `,
    [first_name, last_name, gender, nowIso()],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM players WHERE id = ?', [this.lastID], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(201).json(row);
      });
    }
  );
});

// PUT /api/players/:id
app.put('/api/players/:id', (req, res) => {
  const { first_name, last_name, gender } = req.body;
  db.run(
    `
      UPDATE players
      SET first_name = ?, last_name = ?, gender = ?
      WHERE id = ?
    `,
    [first_name, last_name, gender, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Player not found' });
      db.get('SELECT * FROM players WHERE id = ?', [req.params.id], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json(row);
      });
    }
  );
});

// DELETE /api/players/:id  (мягкое удаление)
app.delete('/api/players/:id', (req, res) => {
  db.run(
    'UPDATE players SET is_active = 0 WHERE id = ?',
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Player not found' });
      res.status(204).send();
    }
  );
});

/* -------------------- TOURNAMENTS -------------------- */

// GET /api/tournaments
app.get('/api/tournaments', (req, res) => {
  const { status } = req.query; // finished, in_progress, draft, all
  let sql = 'SELECT * FROM tournaments';
  const params = [];
  if (status && status !== 'all') {
    sql += ' WHERE status = ?';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/tournaments
app.post('/api/tournaments', (req, res) => {
  const {
    name,
    mode = 'round_robin',
    team_type = 'single',
    points_to_win = 11,
    best_of = 3
  } = req.body;

  if (!name) return res.status(400).json({ error: 'name is required' });

  db.run(
    `
      INSERT INTO tournaments
        (name, mode, team_type, points_to_win, best_of, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'draft', ?)
    `,
    [name, mode, team_type, points_to_win, best_of, nowIso()],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM tournaments WHERE id = ?', [this.lastID], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(201).json(row);
      });
    }
  );
});

// GET /api/tournaments/:id (детали + участники + матчи)
app.get('/api/tournaments/:id', (req, res) => {
  const tournamentId = req.params.id;
  db.get('SELECT * FROM tournaments WHERE id = ?', [tournamentId], (err, tournament) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const result = { tournament, participants: [], matches: [] };

    db.all(
      `
        SELECT tp.id as tp_id, t.id as team_id, t.team_type,
               p.id as player_id, p.first_name, p.last_name, p.gender
        FROM tournament_participants tp
               JOIN teams t ON t.id = tp.team_id
               JOIN team_players tp2 ON tp2.team_id = t.id
               JOIN players p ON p.id = tp2.player_id
        WHERE tp.tournament_id = ? AND tp.is_active = 1
      `,
      [tournamentId],
      (err2, participants) => {
        if (err2) return res.status(500).json({ error: err2.message });
        result.participants = participants;

        db.all(
          `
            SELECT * FROM matches
            WHERE tournament_id = ?
            ORDER BY round_number, match_number
          `,
          [tournamentId],
          (err3, matches) => {
            if (err3) return res.status(500).json({ error: err3.message });
            result.matches = matches;
            res.json(result);
          }
        );
      }
    );
  });
});

// POST /api/tournaments/:id/finish
app.post('/api/tournaments/:id/finish', (req, res) => {
  const id = req.params.id;
  db.run(
    `
      UPDATE tournaments
      SET status = 'finished', finished_at = ?
      WHERE id = ?
    `,
    [nowIso(), id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Tournament not found' });
      db.get('SELECT * FROM tournaments WHERE id = ?', [id], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json(row);
      });
    }
  );
});

/* -------------------- PARTICIPANTS -------------------- */

// POST /api/tournaments/:id/participants
// body: { player_ids: [1,2,3] }
app.post('/api/tournaments/:id/participants', (req, res) => {
  const tournamentId = req.params.id;
  const { player_ids } = req.body;
  if (!Array.isArray(player_ids) || player_ids.length === 0) {
    return res.status(400).json({ error: 'player_ids must be non-empty array' });
  }

  db.get('SELECT * FROM tournaments WHERE id = ?', [tournamentId], (err, tournament) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const teamType = tournament.team_type; // 'single' пока

    db.serialize(() => {
      const now = nowIso();

      player_ids.forEach(playerId => {
        // создаём команду из одного игрока
        db.run(
          `
            INSERT INTO teams (name, team_type, created_at)
            VALUES (?, ?, ?)
          `,
          [null, teamType, now],
          function (err2) {
            if (err2) {
              console.error(err2);
              return;
            }
            const teamId = this.lastID;
            db.run(
              'INSERT INTO team_players (team_id, player_id) VALUES (?, ?)',
              [teamId, playerId],
              function (err3) {
                if (err3) {
                  console.error(err3);
                  return;
                }
                db.run(
                  `
                    INSERT INTO tournament_participants (tournament_id, team_id, is_active)
                    VALUES (?, ?, 1)
                  `,
                  [tournamentId, teamId],
                  function (err4) {
                    if (err4) {
                      console.error(err4);
                    }
                  }
                );
              }
            );
          }
        );
      });

      res.status(201).json({ added: player_ids.length });
    });
  });
});

// DELETE /api/tournaments/:id/participants/:teamId  (деактивация команды)
app.delete('/api/tournaments/:id/participants/:teamId', (req, res) => {
  db.run(
    `
      UPDATE tournament_participants
      SET is_active = 0
      WHERE tournament_id = ? AND team_id = ?
    `,
    [req.params.id, req.params.teamId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Participant not found' });
      res.status(204).send();
    }
  );
});

/* -------------------- MATCHES (round-robin) -------------------- */

// Генерация матчей "каждый с каждым"
app.post('/api/tournaments/:id/generate-matches', (req, res) => {
  const tournamentId = req.params.id;
  db.all(
    `
      SELECT tp.team_id
      FROM tournament_participants tp
      WHERE tp.tournament_id = ? AND tp.is_active = 1
    `,
    [tournamentId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const teamIds = rows.map(r => r.team_id);
      if (teamIds.length < 2) {
        return res.status(400).json({ error: 'Not enough participants to generate matches' });
      }

      const pairs = [];
      for (let i = 0; i < teamIds.length; i++) {
        for (let j = i + 1; j < teamIds.length; j++) {
          pairs.push([teamIds[i], teamIds[j]]);
        }
      }

      const now = nowIso();
      let matchNumber = 1;
      db.serialize(() => {
        pairs.forEach(([t1, t2]) => {
          db.run(
            `
              INSERT INTO matches
              (tournament_id, round_number, match_number, team1_id, team2_id, status, created_at)
              VALUES (?, 1, ?, ?, ?, 'scheduled', ?)
            `,
            [tournamentId, matchNumber++, t1, t2, now]
          );
        });
      });

      res.status(201).json({ created: pairs.length });
    }
  );
});

// GET /api/tournaments/:id/matches
app.get('/api/tournaments/:id/matches', (req, res) => {
  db.all(
    `
      SELECT * FROM matches
      WHERE tournament_id = ?
      ORDER BY round_number, match_number
    `,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Обновление счёта матча (итог по сетам)
app.put('/api/matches/:id/score', (req, res) => {
  const matchId = req.params.id;
  const { team1_score, team2_score } = req.body;
  if (typeof team1_score !== 'number' || typeof team2_score !== 'number') {
    return res.status(400).json({ error: 'team1_score and team2_score must be numbers' });
  }

  db.get('SELECT * FROM matches WHERE id = ?', [matchId], (err, match) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!match) return res.status(404).json({ error: 'Match not found' });

    let winnerTeamId = null;
    if (team1_score > team2_score) winnerTeamId = match.team1_id;
    else if (team2_score > team1_score) winnerTeamId = match.team2_id;

    db.run(
      `
        UPDATE matches
        SET team1_score = ?, team2_score = ?, winner_team_id = ?, status = 'finished', finished_at = ?
        WHERE id = ?
      `,
      [team1_score, team2_score, winnerTeamId, nowIso(), matchId],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        db.get('SELECT * FROM matches WHERE id = ?', [matchId], (err3, updated) => {
          if (err3) return res.status(500).json({ error: err3.message });

          updateRatingsAfterMatch(updated, err4 => {
            if (err4) console.error(err4);
            res.json(updated);
          });
        });
      }
    );
  });
});

/* -------------------- STANDINGS -------------------- */

// GET /api/tournaments/:id/standings
app.get('/api/tournaments/:id/standings', (req, res) => {
  const tournamentId = req.params.id;

  const participantsSql = `
    SELECT tp.team_id,
           p.id as player_id,
           p.first_name,
           p.last_name
    FROM tournament_participants tp
    JOIN teams t ON t.id = tp.team_id
    JOIN team_players tp2 ON tp2.team_id = t.id
    JOIN players p ON p.id = tp2.player_id
    WHERE tp.tournament_id = ? AND tp.is_active = 1
  `;

  db.all(participantsSql, [tournamentId], (err, participants) => {
    if (err) return res.status(500).json({ error: err.message });

    if (participants.length === 0) {
      return res.json([]);
    }

    const matchesSql = `
      SELECT * FROM matches
      WHERE tournament_id = ? AND status = 'finished'
    `;

    db.all(matchesSql, [tournamentId], (err2, matches) => {
      if (err2) return res.status(500).json({ error: err2.message });

      const statsMap = new Map();

      participants.forEach(p => {
        if (!statsMap.has(p.player_id)) {
          statsMap.set(p.player_id, {
            player_id: p.player_id,
            first_name: p.first_name,
            last_name: p.last_name,
            played: 0,
            won: 0,
            lost: 0,
            sets_won: 0,
            sets_lost: 0,
            points: 0
          });
        }
      });

      const teamPlayersSql = `
        SELECT tp.player_id
        FROM team_players tp
        WHERE tp.team_id = ?
      `;

      matches.forEach(m => {
        db.all(teamPlayersSql, [m.team1_id], (err3, t1Players) => {
          if (err3) {
            console.error(err3);
            return;
          }
          db.all(teamPlayersSql, [m.team2_id], (err4, t2Players) => {
            if (err4) {
              console.error(err4);
              return;
            }

            if (!t1Players.length || !t2Players.length) return;

            const p1 = statsMap.get(t1Players[0].player_id);
            const p2 = statsMap.get(t2Players[0].player_id);
            if (!p1 || !p2) return;

            p1.played++;
            p2.played++;

            p1.sets_won += m.team1_score;
            p1.sets_lost += m.team2_score;
            p2.sets_won += m.team2_score;
            p2.sets_lost += m.team1_score;

            if (m.winner_team_id === m.team1_id) {
              p1.won++;
              p2.lost++;
              p1.points += 2;
            } else if (m.winner_team_id === m.team2_id) {
              p2.won++;
              p1.lost++;
              p2.points += 2;
            } else {
              p1.points += 1;
              p2.points += 1;
            }
          });
        });
      });

      setTimeout(() => {
        const standings = Array.from(statsMap.values()).sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          const diffA = a.sets_won - a.sets_lost;
          const diffB = b.sets_won - b.sets_lost;
          if (diffB !== diffA) return diffB - diffA;
          return a.last_name.localeCompare(b.last_name);
        });
        res.json(standings);
      }, 100);
    });
  });
});

/* -------------------- RATINGS -------------------- */

function updateRatingsAfterMatch(match, callback) {
  const teamPlayersSql = `
    SELECT tp.player_id
    FROM team_players tp
    WHERE tp.team_id = ?
  `;

  db.all(teamPlayersSql, [match.team1_id], (err1, t1) => {
    if (err1) return callback && callback(err1);
    db.all(teamPlayersSql, [match.team2_id], (err2, t2) => {
      if (err2) return callback && callback(err2);

      if (!t1.length || !t2.length) return callback && callback();

      const p1 = t1[0].player_id;
      const p2 = t2[0].player_id;

      const mode = 'single_1x1';
      const players = [p1, p2];

      db.serialize(() => {
        players.forEach(pid => {
          db.get(
            'SELECT * FROM ratings WHERE player_id = ? AND mode = ?',
            [pid, mode],
            (err3, ratingRow) => {
              if (err3) {
                console.error(err3);
                return;
              }
              const base = ratingRow ? ratingRow.value : 1000;

              let delta = 0;
              if (match.winner_team_id === match.team1_id && pid === p1) delta = 10;
              if (match.winner_team_id === match.team2_id && pid === p2) delta = 10;
              if (match.winner_team_id === match.team1_id && pid === p2) delta = -5;
              if (match.winner_team_id === match.team2_id && pid === p1) delta = -5;

              const newValue = Math.max(0, base + delta);

              if (ratingRow) {
                db.run(
                  'UPDATE ratings SET value = ?, updated_at = ? WHERE id = ?',
                  [newValue, nowIso(), ratingRow.id],
                  err4 => err4 && console.error(err4)
                );
              } else {
                db.run(
                  `
                  INSERT INTO ratings (player_id, mode, value, updated_at)
                  VALUES (?, ?, ?, ?)
                  `,
                  [pid, mode, newValue, nowIso()],
                  err4 => err4 && console.error(err4)
                );
              }
            }
          );
        });
      });

      if (callback) callback();
    });
  });
}

// GET /api/ratings/:playerId
app.get('/api/ratings/:playerId', (req, res) => {
  db.all(
    'SELECT * FROM ratings WHERE player_id = ?',
    [req.params.playerId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// GET /api/leaderboard?mode=single_1x1&limit=10
app.get('/api/leaderboard', (req, res) => {
  const mode = req.query.mode || 'single_1x1';
  const limit = parseInt(req.query.limit || '10', 10);

  const sql = `
    SELECT r.player_id, r.value, p.first_name, p.last_name
    FROM ratings r
    JOIN players p ON p.id = r.player_id
    WHERE r.mode = ?
    ORDER BY r.value DESC
    LIMIT ?
  `;

  db.all(sql, [mode, limit], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* -------------------- START SERVER -------------------- */

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
