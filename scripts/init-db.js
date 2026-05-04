const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe("PRAGMA foreign_keys=ON");
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Student (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      level TEXT NOT NULL,
      targetMinutesDaily INTEGER NOT NULL DEFAULT 15,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Question (
      id TEXT PRIMARY KEY NOT NULL,
      level TEXT NOT NULL,
      type TEXT NOT NULL,
      question TEXT NOT NULL,
      choices TEXT NOT NULL,
      answer TEXT NOT NULL,
      explanation TEXT NOT NULL,
      difficulty INTEGER NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Attempt (
      id TEXT PRIMARY KEY NOT NULL,
      studentId TEXT,
      questionId TEXT NOT NULL,
      selected TEXT NOT NULL,
      isCorrect BOOLEAN NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT Attempt_studentId_fkey FOREIGN KEY (studentId) REFERENCES Student (id) ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT Attempt_questionId_fkey FOREIGN KEY (questionId) REFERENCES Question (id) ON DELETE RESTRICT ON UPDATE CASCADE
    )
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS WritingSubmission (
      id TEXT PRIMARY KEY NOT NULL,
      studentId TEXT,
      level TEXT NOT NULL,
      prompt TEXT NOT NULL,
      content TEXT NOT NULL,
      feedback TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT WritingSubmission_studentId_fkey FOREIGN KEY (studentId) REFERENCES Student (id) ON DELETE SET NULL ON UPDATE CASCADE
    )
  `);
  await prisma.$executeRawUnsafe("CREATE INDEX IF NOT EXISTS Attempt_questionId_idx ON Attempt(questionId)");
  await prisma.$executeRawUnsafe("CREATE INDEX IF NOT EXISTS WritingSubmission_studentId_idx ON WritingSubmission(studentId)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("SQLite database initialized at prisma/dev.db");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

