import Database from 'better-sqlite3';

export default class AparcamientoDAO {
    constructor(dbFilePath) {
        this.db = new Database(dbFilePath);
        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS aparcamientos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_usuario INTEGER,
                latitud REAL NOT NULL,
                longitud REAL NOT NULL,
                fecha INTEGER NOT NULL,
                activo INTEGER DEFAULT 1
            )
        `).run();
    }

    crear(id_usuario, latitud, longitud, fecha) {
        const stmt = this.db.prepare('INSERT INTO aparcamientos (id_usuario, latitud, longitud, fecha, activo) VALUES (?, ?, ?, ?, 1)');
        const info = stmt.run(id_usuario, latitud, longitud, fecha);
        return info.lastInsertRowid;
    }

    obtenerPorUsuario(id_usuario) {
        const stmt = this.db.prepare('SELECT * FROM aparcamientos WHERE id_usuario = ? ORDER BY fecha DESC');
        return stmt.all(id_usuario);
    }

    finalizar(id) {
        const stmt = this.db.prepare('UPDATE aparcamientos SET activo = 0 WHERE id = ?');
        const info = stmt.run(id);
        return info.changes;
    }
}