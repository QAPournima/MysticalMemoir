// Database adapter - provides unified interface for SQLite and PostgreSQL
const config = require('./config');

class DatabaseAdapter {
  constructor() {
    this.isPostgreSQL = config.pool !== undefined;
    this.db = config;
  }

  // Convert SQLite ? placeholders to PostgreSQL $1, $2, etc.
  convertSqlToPostgreSQL(sql, params) {
    if (!this.isPostgreSQL) return { sql, params };
    
    let paramIndex = 1;
    const convertedSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    return { sql: convertedSql, params };
  }

  // Unified query method
  async query(sql, params = []) {
    try {
      if (this.isPostgreSQL) {
        // Convert ? to $1, $2, etc. for PostgreSQL
        const { sql: convertedSql, params: convertedParams } = this.convertSqlToPostgreSQL(sql, params);
        const result = await this.db.query(convertedSql, convertedParams);
        return {
          rows: result.rows,
          rowCount: result.rowCount,
          lastID: result.insertId || null
        };
      } else {
        // SQLite - wrap in Promise
        return new Promise((resolve, reject) => {
          if (sql.trim().toUpperCase().startsWith('SELECT')) {
            this.db.all(sql, params, (err, rows) => {
              if (err) reject(err);
              else resolve({ rows, rowCount: rows.length });
            });
          } else {
            this.db.run(sql, params, function(err) {
              if (err) reject(err);
              else resolve({ 
                rows: [], 
                rowCount: this.changes,
                lastID: this.lastID
              });
            });
          }
        });
      }
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Get single row
  async get(sql, params = []) {
    const result = await this.query(sql, params);
    return result.rows[0] || null;
  }

  // Get all rows
  async all(sql, params = []) {
    const result = await this.query(sql, params);
    return result.rows;
  }

  // Insert and return the inserted row
  async insert(table, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = this.isPostgreSQL 
      ? values.map((_, i) => `$${i + 1}`).join(', ')
      : values.map(() => '?').join(', ');

    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    if (this.isPostgreSQL) {
      // PostgreSQL - return the inserted row
      const returningSql = `${sql} RETURNING *`;
      const result = await this.query(returningSql, values);
      return result.rows[0];
    } else {
      // SQLite - insert then select
      const result = await this.query(sql, values);
      if (result.lastID) {
        return await this.get(`SELECT * FROM ${table} WHERE rowid = ?`, [result.lastID]);
      }
      return null;
    }
  }

  // Update rows
  async update(table, data, where, whereParams = []) {
    const values = Object.values(data);
    const allParams = [...values, ...whereParams];
    
    if (this.isPostgreSQL) {
      // PostgreSQL - build with proper parameter numbering
      const setClause = Object.keys(data)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(', ');
      
      // Convert WHERE clause parameters
      let paramIndex = values.length + 1;
      const whereClauseConverted = where.replace(/\?/g, () => `$${paramIndex++}`);
      
      const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClauseConverted}`;
      return await this.query(sql, allParams);
    } else {
      // SQLite
      const setClause = Object.keys(data)
        .map(key => `${key} = ?`)
        .join(', ');
      const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
      return await this.query(sql, allParams);
    }
  }

  // Delete rows
  async delete(table, where, params = []) {
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    return await this.query(sql, params);
  }

  // Begin transaction
  async beginTransaction() {
    if (this.isPostgreSQL) {
      const client = await this.db.getClient();
      await client.query('BEGIN');
      return client;
    } else {
      await this.query('BEGIN TRANSACTION');
      return this.db;
    }
  }

  // Commit transaction
  async commitTransaction(client) {
    if (this.isPostgreSQL) {
      await client.query('COMMIT');
      client.release();
    } else {
      await this.query('COMMIT');
    }
  }

  // Rollback transaction
  async rollbackTransaction(client) {
    if (this.isPostgreSQL) {
      await client.query('ROLLBACK');
      client.release();
    } else {
      await this.query('ROLLBACK');
    }
  }

  // Full-text search (PostgreSQL optimized)
  async searchDiaryEntries(searchTerm, limit = 50) {
    if (this.isPostgreSQL) {
      const sql = `
        SELECT *, 
               ts_rank(to_tsvector('english', title || ' ' || content), plainto_tsquery('english', $1)) as rank
        FROM diary_entries 
        WHERE to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', $1)
        ORDER BY rank DESC, created_at DESC
        LIMIT $2
      `;
      return await this.all(sql, [searchTerm, limit]);
    } else {
      // SQLite fallback with LIKE
      const sql = `
        SELECT * FROM diary_entries 
        WHERE title LIKE ? OR content LIKE ?
        ORDER BY created_at DESC
        LIMIT ?
      `;
      const likePattern = `%${searchTerm}%`;
      return await this.all(sql, [likePattern, likePattern, limit]);
    }
  }
}

// Export singleton instance
module.exports = new DatabaseAdapter(); 