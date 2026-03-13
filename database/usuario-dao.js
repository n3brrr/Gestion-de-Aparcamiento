import Database from 'better-sqlite3';

export default class UsuarioDAO {
    constructor(dbFilePath) {
        this.db = new Database(dbFilePath);
        
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `).run();
    }

    crear(username, password) {
        try {
            const stmt = this.db.prepare('INSERT INTO usuarios (username, password) VALUES (?, ?)');
            const info = stmt.run(username, password);
            return info.lastInsertRowid;
        } catch (error) {
            return null;
        }
    }

    obtenerPorUsername(username) {
        const stmt = this.db.prepare('SELECT * FROM usuarios WHERE username = ?');
        return stmt.get(username);
    }
}