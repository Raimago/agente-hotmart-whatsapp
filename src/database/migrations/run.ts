import { db } from '../db';
import fs from 'fs';
import path from 'path';

// Tenta encontrar o arquivo SQL no diretório src ou dist
const getMigrationFile = (): string => {
  const srcPath = path.join(__dirname, '../../..', 'src/database/migrations/001_create_tables.sql');
  const distPath = path.join(__dirname, '001_create_tables.sql');
  
  if (fs.existsSync(srcPath)) {
    return srcPath;
  }
  if (fs.existsSync(distPath)) {
    return distPath;
  }
  return distPath; // Retorna dist como fallback
};

export const runMigrations = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const migrationFile = getMigrationFile();
    
    if (!fs.existsSync(migrationFile)) {
      reject(new Error(`Arquivo de migração não encontrado: ${migrationFile}`));
      return;
    }

    const sql = fs.readFileSync(migrationFile, 'utf8');

    db.exec(sql, (err) => {
      if (err) {
        console.error('Erro ao executar migração:', err);
        reject(err);
      } else {
        console.log('✅ Migrações executadas com sucesso');
        resolve();
      }
    });
  });
};

// Executar se chamado diretamente
if (require.main === module) {
  runMigrations()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

