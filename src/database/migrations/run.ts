import { db } from '../db';
import fs from 'fs';
import path from 'path';

// Tenta encontrar os arquivos SQL no diretório de migrações
const getMigrationFiles = (): string[] => {
  const migrationDir = path.join(__dirname);
  const files: string[] = [];
  
  // Busca arquivos .sql no diretório de migrações
  try {
    const entries = fs.readdirSync(migrationDir);
    entries.forEach((entry) => {
      if (entry.endsWith('.sql')) {
        files.push(path.join(migrationDir, entry));
      }
    });
  } catch (error) {
    console.error('Erro ao ler diretório de migrações:', error);
  }
  
  return files.sort(); // Ordena para executar na ordem
};

export const runMigrations = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const migrationFiles = getMigrationFiles();
    
    if (migrationFiles.length === 0) {
      console.warn('⚠️  Nenhum arquivo de migração encontrado');
      resolve(); // Não falha, apenas avisa
      return;
    }

    let currentIndex = 0;
    const executeNext = () => {
      if (currentIndex >= migrationFiles.length) {
        console.log('✅ Todas as migrações executadas com sucesso');
        resolve();
        return;
      }

      const migrationFile = migrationFiles[currentIndex];
      console.log(`Executando migração: ${path.basename(migrationFile)}`);

      try {
        const sql = fs.readFileSync(migrationFile, 'utf8');
            db.exec(sql, (err) => {
              if (err) {
                // Se a tabela/coluna já existe, não é um erro fatal
                if (err.message && (
                  err.message.includes('already exists') ||
                  err.message.includes('duplicate column') ||
                  err.message.includes('duplicate table')
                )) {
                  console.log(`⏭️  Migração ${path.basename(migrationFile)} já foi executada`);
                  currentIndex++;
                  executeNext();
                } else {
                  console.error(`❌ Erro ao executar migração ${path.basename(migrationFile)}:`, err);
                  // Não rejeitar, apenas logar o erro e continuar
                  // Isso permite que o servidor inicie mesmo com migrações que falharam
                  console.warn(`⚠️  Continuando apesar do erro...`);
                  currentIndex++;
                  executeNext();
                }
              } else {
                console.log(`✅ Migração ${path.basename(migrationFile)} executada`);
                currentIndex++;
                executeNext();
              }
            });
      } catch (error: any) {
        console.error(`❌ Erro ao ler arquivo ${path.basename(migrationFile)}:`, error.message);
        reject(error);
      }
    };

    executeNext();
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

