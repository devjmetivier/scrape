import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileAsync';

const adapter = new FileSync('db.json');

export async function initDB() {
  const db = await low(adapter);
  db.defaults({ twitter: [], instagram: [] }).write();
  return db;
}
