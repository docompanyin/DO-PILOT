export interface McqOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  explanationIfWrong?: string;
}

export interface McqQuestion {
  id?: string;
  question: string;
  options: McqOption[];
  correctAnswer: string;
  explanationNote: string;
}

export interface TheoryBlock {
  heading: string;
  text: string;
  codeSnippet?: string;
  terminalOutput?: string;
  tip?: string;
  warning?: string;
  sampleInput?: string;
  mcq?: McqQuestion;
  retestMcq?: McqQuestion;
  questionPool?: McqQuestion[];
}

export interface SectionContent {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  readTime: string;
  objectives: string[];
  theoryBlocks: TheoryBlock[];
}

export const FULLSTACK_PART_13_SECTIONS: SectionContent[] = [
  {
    id: "13-1-relational-databases-and-postgres",
    number: "13.1",
    title: "Relational Databases & PostgreSQL Basics",
    subtitle: "Understand the relational model vs document stores, run psql commands, execute SQL queries, and manage keys.",
    readTime: "13 min",
    objectives: [
      "Compare relational tables and strict schemas to document-based NoSQL stores",
      "Interact with PostgreSQL using the psql command line interface",
      "Execute DDL statements and DQL SELECT queries with filtering and sorting",
      "Insert records using PostgreSQL's RETURNING clause",
      "Enforce data integrity with Primary Keys, Foreign Keys, and CASCADE rules"
    ],
    theoryBlocks: [
      {
        heading: "Relational vs Document Model",
        text: "Relational databases store structured records in predefined tables with columns and enforce relationships with foreign keys, whereas NoSQL stores flexible schema-less documents.",
        codeSnippet: `CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) UNIQUE NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`,
        mcq: {
          id: "q-13.1-0-v1",
          question: "What is a core distinction between relational databases (like PostgreSQL) and document databases (like MongoDB)?",
          options: [
            { id: "A", text: "Relational databases enforce rigid schemas with tables, rows, columns, and foreign key relations, while document databases store flexible JSON-like documents" },
            { id: "B", text: "Relational databases do not support indexing or search queries" },
            { id: "C", text: "MongoDB requires a strict SQL query parser for all operations" },
            { id: "D", text: "PostgreSQL only runs in browser WebAssembly" }
          ],
          correctAnswer: "A",
          explanationNote: "Relational databases organize data into rigid two-dimensional tables with strict schemas and foreign key constraints to eliminate data duplication and enforce referential integrity."
        },
        retestMcq: {
          id: "q-13.1-0-v2",
          question: "When is a relational database (PostgreSQL) typically preferred over a document database (MongoDB)?",
          options: [
            { id: "A", text: "When data has complex relationships, strict ACID transaction requirements, and demands referential integrity across entities" },
            { id: "B", text: "When you want completely unvalidated data schemas without any structure" },
            { id: "C", text: "When storing raw unstructured sensor telemetry without foreign keys" },
            { id: "D", text: "Only when developing mobile apps for iOS" }
          ],
          correctAnswer: "A",
          explanationNote: "PostgreSQL excels when your domain model features interconnected entities (users, orders, invoices, payments) requiring strict ACID transactions and relational constraints."
        }
      },
      {
        heading: "The PostgreSQL Interactive Shell (psql)",
        text: "psql is the terminal client for PostgreSQL. Connect using a database URI, view tables with \\dt, inspect schema with \\d <table_name>, and quit with \\q.",
        codeSnippet: `psql postgres://postgres:secret@localhost:5432/blog_app\n\\dt\n\\d users\n\\q`,
        mcq: {
          id: "q-13.1-1-v1",
          question: "In the `psql` command-line utility, which meta-command lists all tables in the currently connected database schema?",
          options: [
            { id: "A", text: "\\dt" },
            { id: "B", text: "SHOW ALL TABLES;" },
            { id: "C", text: "\\list" },
            { id: "D", text: "SELECT * FROM all;" }
          ],
          correctAnswer: "A",
          explanationNote: "In `psql`, backslash meta-commands control the CLI environment; `\\dt` lists tables, while `\\l` lists databases and `\\q` exits."
        },
        retestMcq: {
          id: "q-13.1-1-v2",
          question: "What meta-command in `psql` inspects the detailed column definitions, data types, and constraints of a table named \"notes\"?",
          options: [
            { id: "A", text: "\\d notes" },
            { id: "B", text: "\\inspect notes" },
            { id: "C", text: "DESCRIBE notes;" },
            { id: "D", text: "\\schema notes" }
          ],
          correctAnswer: "A",
          explanationNote: "In `psql`, `\\d <tablename>` displays the table schema, including columns, data types, nullability, defaults, indexes, and foreign keys."
        }
      },
      {
        heading: "SQL Data Query Language (SELECT)",
        text: "Query rows using SELECT <columns> FROM <table> WHERE <condition> ORDER BY <col> LIMIT <n>. Filter using operators like =, >, LIKE, and IN.",
        codeSnippet: `SELECT id, title, likes \nFROM blogs \nWHERE likes > 10 AND title ILIKE '%react%'\nORDER BY likes DESC \nLIMIT 5;`,
        mcq: {
          id: "q-13.1-2-v1",
          question: "What does the `ILIKE` operator do in PostgreSQL queries compared to standard SQL `LIKE`?",
          options: [
            { id: "A", text: "Performs a case-insensitive pattern match" },
            { id: "B", text: "Performs an encrypted integer comparison" },
            { id: "C", text: "Inverts the boolean result of LIKE" },
            { id: "D", text: "Searches across all database columns simultaneously" }
          ],
          correctAnswer: "A",
          explanationNote: "In PostgreSQL, `ILIKE` provides case-insensitive string matching, so '%react%' matches 'React', 'REACT', and 'react'."
        },
        retestMcq: {
          id: "q-13.1-2-v2",
          question: "Which SQL clause limits the query result to the top 10 rows sorted from highest to lowest score?",
          options: [
            { id: "A", text: "ORDER BY score DESC LIMIT 10;" },
            { id: "B", text: "SORT BY score MAX 10;" },
            { id: "C", text: "TOP 10 FILTER BY score DESC;" },
            { id: "D", text: "GROUP BY score ASC FETCH 10;" }
          ],
          correctAnswer: "A",
          explanationNote: "`ORDER BY score DESC` arranges rows in descending numerical order, and `LIMIT 10` restricts the output to the first 10 rows."
        }
      },
      {
        heading: "Inserting and Returning Rows (INSERT)",
        text: "Insert records with INSERT INTO <table> (cols) VALUES (vals). In PostgreSQL, append RETURNING * to instantly receive the generated primary key ID and timestamps.",
        codeSnippet: `INSERT INTO blogs (title, author, url, likes)\nVALUES ('Building with Postgres', 'Martin Fowler', 'https://example.com', 42)\nRETURNING id, created_at;`,
        mcq: {
          id: "q-13.1-3-v1",
          question: "What is the utility of PostgreSQL's `RETURNING` clause in an `INSERT` statement?",
          options: [
            { id: "A", text: "It immediately returns specified values (such as auto-generated SERIAL IDs or default timestamps) from the inserted row without needing a second query" },
            { id: "B", text: "It rolls back the insertion if the client connection drops" },
            { id: "C", text: "It sends an email notification to the database administrator" },
            { id: "D", text: "It returns the entire database table size in bytes" }
          ],
          correctAnswer: "A",
          explanationNote: "`RETURNING` allows returning columns from modified rows directly to the client, eliminating an extra `SELECT` to discover newly generated auto-increment IDs."
        },
        retestMcq: {
          id: "q-13.1-3-v2",
          question: "What happens if you omit the `WHERE` clause in an `UPDATE` or `DELETE` SQL statement?",
          options: [
            { id: "A", text: "The operation modifies or deletes EVERY row in the entire table" },
            { id: "B", text: "The database throws an error preventing execution" },
            { id: "C", text: "Only the first row in the table is affected" },
            { id: "D", text: "The query runs in dry-run simulation mode" }
          ],
          correctAnswer: "A",
          explanationNote: "Without a `WHERE` clause, `UPDATE` modifies every row in the table, and `DELETE` empties the entire table."
        }
      },
      {
        heading: "Primary Keys and SERIAL / UUID",
        text: "Every table should have a Primary Key uniquely identifying each row. PostgreSQL uses `SERIAL` (or `IDENTITY`) for auto-incrementing integers or `UUID` for distributed IDs.",
        codeSnippet: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\nCREATE TABLE orders (\n  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n  total_cents INT NOT NULL\n);`,
        mcq: {
          id: "q-13.1-4-v1",
          question: "What is the primary constraint enforced by a PRIMARY KEY column in PostgreSQL?",
          options: [
            { id: "A", text: "The column values must be strictly UNIQUE and NOT NULL across all rows in the table" },
            { id: "B", text: "The column values must be even numbers only" },
            { id: "C", text: "The column cannot be read without root password permissions" },
            { id: "D", text: "The column must contain at least 16 characters" }
          ],
          correctAnswer: "A",
          explanationNote: "A Primary Key uniquely identifies each row in a database table and inherently combines `UNIQUE` and `NOT NULL` constraints."
        },
        retestMcq: {
          id: "q-13.1-4-v2",
          question: "Why are UUID primary keys often favored over auto-incrementing integer IDs (`SERIAL`) in modern distributed microservice architectures?",
          options: [
            { id: "A", text: "UUIDs can be generated independently on client or server nodes without coordinating with a central database sequence, preventing ID enumeration attacks" },
            { id: "B", text: "UUIDs consume less disk storage than 32-bit integers" },
            { id: "C", text: "UUIDs speed up SQL sorting operations by 10x" },
            { id: "D", text: "UUIDs eliminate the need for foreign key indexes" }
          ],
          correctAnswer: "A",
          explanationNote: "UUIDs are globally unique and can be safely generated without colliding or contacting a central sequencer, and they prevent attackers from guessing sequential record IDs."
        }
      },
      {
        heading: "Foreign Key Constraints & Referential Integrity",
        text: "A Foreign Key points to a Primary Key in another table, guaranteeing referential integrity and preventing orphan records with actions like `ON DELETE CASCADE`.",
        codeSnippet: `CREATE TABLE comments (\n  id SERIAL PRIMARY KEY,\n  content TEXT NOT NULL,\n  blog_id INT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE\n);`,
        mcq: {
          id: "q-13.1-5-v1",
          question: "What is the behavior of `ON DELETE CASCADE` in a foreign key constraint definition?",
          options: [
            { id: "A", text: "When the parent row is deleted, all associated child rows referencing that foreign key are automatically deleted as well" },
            { id: "B", text: "It blocks the parent row from being deleted under all circumstances" },
            { id: "C", text: "It sets the child row foreign key value to NULL" },
            { id: "D", text: "It makes a backup copy of the parent table in AWS S3" }
          ],
          correctAnswer: "A",
          explanationNote: "`ON DELETE CASCADE` cascades the deletion of a parent record down to all child records referencing it, preventing orphan records."
        },
        retestMcq: {
          id: "q-13.1-5-v2",
          question: "What error occurs if you attempt to insert a child row with a foreign key ID that does not exist in the referenced parent table?",
          options: [
            { id: "A", text: "Foreign key constraint violation error (violates foreign key constraint)" },
            { id: "B", text: "PostgreSQL automatically creates a dummy parent record" },
            { id: "C", text: "The database silently sets the foreign key to 0" },
            { id: "D", text: "The query hangs indefinitely" }
          ],
          correctAnswer: "A",
          explanationNote: "PostgreSQL enforces referential integrity: attempting to reference a non-existent parent primary key triggers a foreign key constraint violation and rejects the insert."
        }
      }
    ]
  },
  {
    id: "13-2-connecting-sequelize-orm",
    number: "13.2",
    title: "Connecting Node.js with Sequelize ORM",
    subtitle: "Map database tables to JavaScript models, establish connection pools, execute CRUD queries, and add schema validations.",
    readTime: "14 min",
    objectives: [
      "Understand Object-Relational Mapping (ORM) principles",
      "Connect Node.js to PostgreSQL using Sequelize connection URIs",
      "Define models using Model.init and DataTypes",
      "Query rows using findAll, findByPk, and Op operators",
      "Implement model-level data validation rules"
    ],
    theoryBlocks: [
      {
        heading: "What is an ORM (Object-Relational Mapping)?",
        text: "An ORM maps relational database tables to JavaScript/TypeScript classes and rows to object instances, allowing database operations with typed methods instead of raw SQL strings.",
        codeSnippet: `import { Sequelize } from 'sequelize';\n\nconst sequelize = new Sequelize(process.env.DATABASE_URL!, {\n  dialect: 'postgres',\n});`,
        mcq: {
          id: "q-13.2-0-v1",
          question: "What is the principal role of an Object-Relational Mapper (ORM) like Sequelize in a Node.js application?",
          options: [
            { id: "A", text: "It abstracts database tables into JavaScript models and rows into objects, handling SQL query generation and parameter sanitization automatically" },
            { id: "B", text: "It converts SQL queries into HTML web pages" },
            { id: "C", text: "It replaces the PostgreSQL database server entirely" },
            { id: "D", text: "It compiles Node.js JavaScript into C++" }
          ],
          correctAnswer: "A",
          explanationNote: "Sequelize maps SQL tables to JavaScript classes and objects, enabling developers to query, insert, and associate relational data using idiomatic JavaScript methods while protecting against SQL injection."
        },
        retestMcq: {
          id: "q-13.2-0-v2",
          question: "Which driver package must be installed alongside `sequelize` to enable communication with a PostgreSQL database?",
          options: [
            { id: "A", text: "pg (and pg-hstore)" },
            { id: "B", text: "mysql2" },
            { id: "C", text: "mongodb" },
            { id: "D", text: "sqlite3" }
          ],
          correctAnswer: "A",
          explanationNote: "Sequelize requires the underlying database client driver for the chosen dialect; for PostgreSQL, `pg` and `pg-hstore` provide network protocols."
        }
      },
      {
        heading: "Testing the Connection with authenticate()",
        text: "Call `sequelize.authenticate()` during application startup to verify database credentials, network reachability, and active connection pool status.",
        codeSnippet: `const connectToDatabase = async () => {\n  try {\n    await sequelize.authenticate();\n    console.log('Connected to PostgreSQL successfully');\n  } catch (err) {\n    console.error('Database connection failed:', err);\n    process.exit(1);\n  }\n};`,
        mcq: {
          id: "q-13.2-1-v1",
          question: "What does `await sequelize.authenticate()` do when executed in a Node.js server startup function?",
          options: [
            { id: "A", text: "Tests the database connection by running a simple query and throws an error if credentials or network reachability fail" },
            { id: "B", text: "Generates a new JWT authentication token for users" },
            { id: "C", text: "Deletes all existing tables and reinitializes the database" },
            { id: "D", text: "Encrypts the server disk drive with a master password" }
          ],
          correctAnswer: "A",
          explanationNote: "`sequelize.authenticate()` sends a test probe to the database to ensure the host, port, database name, and credentials are valid and reachable."
        },
        retestMcq: {
          id: "q-13.2-1-v2",
          question: "Why is it standard practice to call `process.exit(1)` if `sequelize.authenticate()` throws an error on boot?",
          options: [
            { id: "A", text: "Because the web server cannot function without a connected database, and terminating signals orchestrators (Docker/K8s) to restart or report the failure" },
            { id: "B", text: "Because PostgreSQL permanently locks tables if an error is caught" },
            { id: "C", text: "Because process.exit(1) automatically fixes invalid database passwords" },
            { id: "D", text: "It resets the operating system kernel" }
          ],
          correctAnswer: "A",
          explanationNote: "If a database-backed API cannot connect to its data store on startup, failing fast prevents the server from serving broken requests."
        }
      },
      {
        heading: "Defining Models with Model.init and DataTypes",
        text: "Define models by extending Model and invoking Model.init(attributes, options). Map columns with DataTypes (e.g. INTEGER, TEXT, BOOLEAN).",
        codeSnippet: `import { Model, DataTypes } from 'sequelize';\n\nclass Blog extends Model {}\nBlog.init({\n  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },\n  title: { type: DataTypes.TEXT, allowNull: false },\n  likes: { type: DataTypes.INTEGER, defaultValue: 0 }\n}, { sequelize, underscored: true, modelName: 'blog' });`,
        mcq: {
          id: "q-13.2-2-v1",
          question: "What is the purpose of the `{ underscored: true }` option in `Blog.init(..., options)`?",
          options: [
            { id: "A", text: "Maps JavaScript camelCase attributes (`createdAt`) to snake_case column names (`created_at`) standard in PostgreSQL" },
            { id: "B", text: "Adds leading underscores to all private methods in the class" },
            { id: "C", text: "Forces all string values in the database to be lowercase" },
            { id: "D", text: "Underlines text printed in the server terminal logs" }
          ],
          correctAnswer: "A",
          explanationNote: "In PostgreSQL, table columns conventionally use `snake_case`. `underscored: true` automatically maps JavaScript `camelCase` model fields to `snake_case` database columns."
        },
        retestMcq: {
          id: "q-13.2-2-v2",
          question: "What constraint is enforced when setting `allowNull: false` on an attribute in Sequelize?",
          options: [
            { id: "A", text: "The database enforces a `NOT NULL` constraint, rejecting any insert or update where the column is null or undefined" },
            { id: "B", text: "The attribute cannot be read by non-admin users" },
            { id: "C", text: "The attribute value must be a non-empty string of length greater than 10" },
            { id: "D", text: "The attribute cannot be modified once set" }
          ],
          correctAnswer: "A",
          explanationNote: "`allowNull: false` creates a SQL `NOT NULL` constraint on the column, preventing null values from being stored."
        }
      },
      {
        heading: "Querying with findAll, findByPk, and findOne",
        text: "Use `Model.findAll({ where: { ... } })` to retrieve multiple records, `Model.findByPk(id)` to lookup by primary key, and `Model.findOne()` for a single match.",
        codeSnippet: `const popularBlogs = await Blog.findAll({\n  where: {\n    likes: { [Op.gte]: 50 }\n  },\n  order: [['likes', 'DESC']],\n  limit: 10\n});`,
        mcq: {
          id: "q-13.2-3-v1",
          question: "How do you query for rows where a column value is greater than or equal to a number using Sequelize operator symbols?",
          options: [
            { id: "A", text: "Using the `Op.gte` symbol: `{ likes: { [Op.gte]: 50 } }`" },
            { id: "B", text: "Using plain string comparison: `{ likes: \">= 50\" }`" },
            { id: "C", text: "Using regex: `{ likes: { $gt: 50 } }`" },
            { id: "D", text: "Sequelize does not support numerical comparisons" }
          ],
          correctAnswer: "A",
          explanationNote: "Sequelize uses Symbol operators imported from `Op` (e.g. `Op.gte` for greater than or equal) to securely build parameterized SQL conditions."
        },
        retestMcq: {
          id: "q-13.2-3-v2",
          question: "What does `Blog.findByPk(12)` return if no row with primary key ID `12` exists in the database?",
          options: [
            { id: "A", text: "null" },
            { id: "B", text: "undefined" },
            { id: "C", text: "Throws a fatal RowNotFoundException" },
            { id: "D", text: "An empty object `{}`" }
          ],
          correctAnswer: "A",
          explanationNote: "In Sequelize, `findByPk` resolves to `null` if no record matching the designated primary key is found."
        }
      },
      {
        heading: "Creating and Updating Records",
        text: "Create records with `Model.create(req.body)`. To update an existing instance, modify its properties and call `await instance.save()` or use `Model.update()`.",
        codeSnippet: `// Create\nconst newBlog = await Blog.create({ title: 'Fullstack Open', likes: 10 });\n\n// Update existing instance\nblog.likes = blog.likes + 1;\nawait blog.save();`,
        mcq: {
          id: "q-13.2-4-v1",
          question: "What is the difference between `Model.create(data)` and `const instance = Model.build(data)` in Sequelize?",
          options: [
            { id: "A", text: "`create` instantiates the object AND immediately executes an `INSERT` statement to save it to the DB; `build` only creates an in-memory instance without saving until `.save()` is called" },
            { id: "B", text: "`build` compiles the TypeScript model into SQL" },
            { id: "C", text: "`create` only works for admin users" },
            { id: "D", text: "`build` creates the database table if it doesn't exist" }
          ],
          correctAnswer: "A",
          explanationNote: "`Model.build()` initializes a JavaScript instance in memory without querying the database, while `Model.create()` builds and immediately commits it via SQL `INSERT`."
        },
        retestMcq: {
          id: "q-13.2-4-v2",
          question: "How do you delete a record represented by a Sequelize model instance named `blog`?",
          options: [
            { id: "A", text: "await blog.destroy();" },
            { id: "B", text: "blog.delete();" },
            { id: "C", text: "await Blog.dropInstance(blog);" },
            { id: "D", text: "blog.remove();" }
          ],
          correctAnswer: "A",
          explanationNote: "Calling `await instance.destroy()` executes a SQL `DELETE FROM <table> WHERE id = ?` on that specific instance."
        }
      },
      {
        heading: "Validations and Custom Model Methods",
        text: "Sequelize models support built-in validators (e.g. `isEmail`, `min`, `max`, `len`) executed before data reaches the database, rejecting invalid input with validation errors.",
        codeSnippet: `username: {\n  type: DataTypes.STRING,\n  allowNull: false,\n  unique: true,\n  validate: {\n    isEmail: { msg: 'Username must be a valid email' },\n    len: [4, 100]\n  }\n}`,
        mcq: {
          id: "q-13.2-5-v1",
          question: "When do Sequelize model validations configured under `validate: { ... }` execute?",
          options: [
            { id: "A", text: "In JavaScript memory before the SQL query is sent to the database" },
            { id: "B", text: "Inside PostgreSQL kernel after the record is committed" },
            { id: "C", text: "Only on the browser frontend before HTTP request is dispatched" },
            { id: "D", text: "Only when manually triggered by a database trigger script" }
          ],
          correctAnswer: "A",
          explanationNote: "Sequelize validations run within the Node.js application layer prior to dispatching SQL commands, catching invalid data early."
        },
        retestMcq: {
          id: "q-13.2-5-v2",
          question: "What type of error is thrown by Sequelize when attempting to insert a row that violates a `unique: true` constraint in the database?",
          options: [
            { id: "A", text: "SequelizeUniqueConstraintError" },
            { id: "B", text: "SequelizeDatabaseConnectionRefused" },
            { id: "C", text: "TypeError: Duplicate Entry" },
            { id: "D", text: "ReferenceError: KeyInUse" }
          ],
          correctAnswer: "A",
          explanationNote: "Sequelize catches database unique constraint violations and wraps them in a strongly typed `SequelizeUniqueConstraintError`."
        }
      }
    ]
  },
  {
    id: "13-3-migrations-and-version-control",
    number: "13.3",
    title: "Database Migrations & Version Control",
    subtitle: "Avoid destructive schema syncs, write up/down migrations using Umzug, and manage migration deployment lifecycles.",
    readTime: "13 min",
    objectives: [
      "Understand why sequelize.sync() is unsafe in production",
      "Configure Umzug for version-controlled database migrations",
      "Write up and down migration scripts with queryInterface",
      "Track applied migrations in a dedicated metadata table",
      "Automate migrations in CI/CD before starting web servers"
    ],
    theoryBlocks: [
      {
        heading: "Why sequelize.sync() is Dangerous in Production",
        text: "sequelize.sync({ alter: true }) or { force: true } can silently drop columns, lock tables, or destroy production data. Production systems must use explicit migration scripts.",
        codeSnippet: `// NEVER do this in production:\n// await sequelize.sync({ force: true }); // DROPS ALL PRODUCTION TABLES!`,
        mcq: {
          id: "q-13.3-0-v1",
          question: "Why is `sequelize.sync({ force: true })` catastrophic if run in a production environment?",
          options: [
            { id: "A", text: "It executes `DROP TABLE IF EXISTS` on all models, permanently deleting all existing tables and production data" },
            { id: "B", text: "It shuts down the PostgreSQL server daemon permanently" },
            { id: "C", text: "It reverts Git commits on the host server" },
            { id: "D", text: "It converts all passwords into plain text" }
          ],
          correctAnswer: "A",
          explanationNote: "`sync({ force: true })` drops existing tables before recreating them, wiping out every record in the database."
        },
        retestMcq: {
          id: "q-13.3-0-v2",
          question: "What is the purpose of a Database Migration tool (such as Umzug)?",
          options: [
            { id: "A", text: "To version-control incremental schema modifications (creating tables, adding columns) through reversible `up` and `down` migration files" },
            { id: "B", text: "To migrate an application from Node.js to Go automatically" },
            { id: "C", text: "To compress database tables into zip files" },
            { id: "D", text: "To transfer hosting providers without downtime" }
          ],
          correctAnswer: "A",
          explanationNote: "Migrations treat database schema changes like source code version control, recording every schema modification in chronological, reversible transition scripts."
        }
      },
      {
        heading: "Migration Architecture with Umzug",
        text: "Umzug is a lightweight migration tool for Sequelize. It tracks executed migrations in a database table (e.g. `migrations`), executing only unapplied scripts on deploy.",
        codeSnippet: `import { Umzug, SequelizeStorage } from 'umzug';\n\nconst migrator = new Umzug({\n  migrations: { glob: 'migrations/*.js' },\n  context: sequelize.getQueryInterface(),\n  storage: new SequelizeStorage({ sequelize }),\n  logger: console,\n});\n\nawait migrator.up();`,
        mcq: {
          id: "q-13.3-1-v1",
          question: "How does Umzug know which migration files have already been executed on a database?",
          options: [
            { id: "A", text: "It reads recorded migration file names from a dedicated tracking table (`SequelizeMeta` or `migrations`) in the database" },
            { id: "B", text: "It compares timestamps in a local hidden `.migration` file in Git" },
            { id: "C", text: "It prompts the administrator on the command line every time" },
            { id: "D", text: "It scans all database tables and guesses what changed" }
          ],
          correctAnswer: "A",
          explanationNote: "Umzug uses a storage backend that records applied migration filenames in a database table, ensuring each migration runs exactly once."
        },
        retestMcq: {
          id: "q-13.3-1-v2",
          question: "What method is called on the Umzug instance to run all pending, unapplied migrations in sequential order?",
          options: [
            { id: "A", text: "await migrator.up();" },
            { id: "B", text: "migrator.executeAll();" },
            { id: "C", text: "await migrator.sync();" },
            { id: "D", text: "migrator.applyLatest();" }
          ],
          correctAnswer: "A",
          explanationNote: "`migrator.up()` checks the migrations folder against the tracking table and runs the `up` function of all unexecuted migration files in order."
        }
      },
      {
        heading: "Writing up and down Migration Scripts",
        text: "Each migration exports an `up` function (applies the schema change) and a `down` function (reverses it, e.g. dropping the table or removing the column).",
        codeSnippet: `export const up = async ({ context: queryInterface }) => {\n  await queryInterface.createTable('blogs', {\n    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },\n    title: { type: DataTypes.TEXT, allowNull: false },\n    created_at: { type: DataTypes.DATE, allowNull: false }\n  });\n};\n\nexport const down = async ({ context: queryInterface }) => {\n  await queryInterface.dropTable('blogs');\n};`,
        mcq: {
          id: "q-13.3-2-v1",
          question: "In an Umzug/Sequelize migration file, what is the role of the `down` function?",
          options: [
            { id: "A", text: "Provides the exact reversal logic to undo the changes made in `up` if a rollback is triggered" },
            { id: "B", text: "Runs when the database server powers down" },
            { id: "C", text: "Backs up the database before `up` executes" },
            { id: "D", text: "Logs query metrics to the console" }
          ],
          correctAnswer: "A",
          explanationNote: "The `down` function defines the rollback logic, allowing developers and CI/CD pipelines to revert changes safely if a deployment fails."
        },
        retestMcq: {
          id: "q-13.3-2-v2",
          question: "If `up` executes `queryInterface.addColumn('users', 'bio', { ... })`, what should `down` execute?",
          options: [
            { id: "A", text: "await queryInterface.removeColumn('users', 'bio');" },
            { id: "B", text: "await queryInterface.dropTable('users');" },
            { id: "C", text: "await queryInterface.clearColumn('bio');" },
            { id: "D", text: "await queryInterface.renameColumn('users', 'bio', 'old_bio');" }
          ],
          correctAnswer: "A",
          explanationNote: "The inverse of `addColumn` is `removeColumn`, returning the table to its exact pre-migration state."
        }
      },
      {
        heading: "QueryInterface vs Models in Migrations",
        text: "Migrations should use `queryInterface` directly rather than importing application Models, preventing future model code changes from breaking historical migration runs.",
        codeSnippet: `// In migration:\nawait queryInterface.addColumn('blogs', 'author', {\n  type: DataTypes.STRING,\n  allowNull: true\n});`,
        mcq: {
          id: "q-13.3-3-v1",
          question: "Why should database migrations interact through `queryInterface` rather than importing application Sequelize models (like `import { Blog } from ...`)?",
          options: [
            { id: "A", text: "Application models evolve over time; importing modern models into old migrations can cause historical migrations to fail when run on a clean database" },
            { id: "B", text: "Because `queryInterface` bypasses database user authentication" },
            { id: "C", text: "Models cannot run outside of express route controllers" },
            { id: "D", text: "`queryInterface` is written in Rust for faster compilation" }
          ],
          correctAnswer: "A",
          explanationNote: "Migrations should be self-contained historical snapshots. If a migration imports a model that later adds new associations or columns, running older migrations on fresh environments will crash."
        },
        retestMcq: {
          id: "q-13.3-3-v2",
          question: "What method on `queryInterface` adds a new index to a table in a migration script?",
          options: [
            { id: "A", text: "await queryInterface.addIndex('blogs', ['author']);" },
            { id: "B", text: "await queryInterface.createIndexOn('blogs.author');" },
            { id: "C", text: "await queryInterface.indexColumn('author');" },
            { id: "D", text: "await queryInterface.makeIndex('blogs', 'author');" }
          ],
          correctAnswer: "A",
          explanationNote: "`queryInterface.addIndex(tableName, attributes, options)` is the standard Sequelize QueryInterface method to generate database indexes in migration scripts."
        }
      },
      {
        heading: "Rolling Back Migrations with down()",
        text: "Use `migrator.down()` to revert the most recently applied migration script during local debugging or automated deployment rollback strategies.",
        codeSnippet: `const rollbackLastMigration = async () => {\n  await migrator.down();\n  console.log('Last migration rolled back successfully');\n};`,
        mcq: {
          id: "q-13.3-4-v1",
          question: "What happens when `await migrator.down()` is executed on an Umzug migrator instance?",
          options: [
            { id: "A", text: "It executes the `down` function of the most recently applied migration and removes its record from the tracking table" },
            { id: "B", text: "It rolls back all migrations back to the initial database creation" },
            { id: "C", text: "It deletes the PostgreSQL database instance" },
            { id: "D", text: "It restarts the operating system" }
          ],
          correctAnswer: "A",
          explanationNote: "By default, `migrator.down()` undoes the single latest applied migration and deletes its entry from the database tracking table."
        },
        retestMcq: {
          id: "q-13.3-4-v2",
          question: "How do you roll back ALL applied migrations completely with Umzug?",
          options: [
            { id: "A", text: "await migrator.down({ to: 0 });" },
            { id: "B", text: "await migrator.reset();" },
            { id: "C", text: "await migrator.dropAll();" },
            { id: "D", text: "await migrator.purge();" }
          ],
          correctAnswer: "A",
          explanationNote: "Passing `{ to: 0 }` instructs Umzug to execute `down` on every applied migration sequentially until no migrations remain."
        }
      },
      {
        heading: "Automating Migrations in Production Deployments",
        text: "In automated CI/CD and container workflows, run migrations as a pre-deploy release command or at application boot before starting the Express web server listener.",
        codeSnippet: `const startApp = async () => {\n  await connectToDatabase();\n  await runMigrations(); // Run migrations before listening\n  app.listen(PORT, () => console.log(\`Server on \${PORT}\`));\n};`,
        mcq: {
          id: "q-13.3-5-v1",
          question: "Why should database migrations be executed before the Express HTTP server begins accepting user requests (`app.listen`)?",
          options: [
            { id: "A", text: "To ensure the database schema matches what the API route controllers expect before any HTTP requests are processed, preventing schema mismatch crashes" },
            { id: "B", text: "Because Express routes cannot be registered until SQL tables exist" },
            { id: "C", text: "Because PostgreSQL locks ports until all migrations finish" },
            { id: "D", text: "To speed up HTTP TCP handshake responses" }
          ],
          correctAnswer: "A",
          explanationNote: "Running migrations prior to `app.listen()` guarantees that newly deployed code referencing new columns or tables will not encounter database errors when handling incoming client traffic."
        },
        retestMcq: {
          id: "q-13.3-5-v2",
          question: "In Docker Compose production stacks, where is it best to execute database migrations?",
          options: [
            { id: "A", text: "In a dedicated short-lived migration service or startup script that runs before the web application containers launch" },
            { id: "B", text: "Inside the PostgreSQL container Dockerfile during image build time" },
            { id: "C", text: "In the client browser before the React bundle loads" },
            { id: "D", text: "Manually through SSH every single minute" }
          ],
          correctAnswer: "A",
          explanationNote: "Running migrations via a dedicated one-off release task or container avoids race conditions when multiple API replicas boot up concurrently."
        }
      }
    ]
  },
  {
    id: "13-4-table-relationships-and-joins",
    number: "13.4",
    title: "Table Relationships & Joins",
    subtitle: "Establish One-to-Many associations, eliminate N+1 queries using eager loading, and configure foreign key constraints.",
    readTime: "14 min",
    objectives: [
      "Model One-to-Many associations with hasMany and belongsTo",
      "Use eager loading (include) to issue SQL JOINs",
      "Identify and eradicate N+1 database queries",
      "Filter joined models using nested where conditions",
      "Disambiguate multiple associations using aliases (as)"
    ],
    theoryBlocks: [
      {
        heading: "One-to-Many Relationships (hasMany / belongsTo)",
        text: "A User can create many Blogs, but each Blog belongs to one User. In Sequelize, express this pair with `User.hasMany(Blog)` and `Blog.belongsTo(User)`.",
        codeSnippet: `User.hasMany(Blog);\nBlog.belongsTo(User);`,
        mcq: {
          id: "q-13.4-0-v1",
          question: "In a One-to-Many association between `User` and `Blog`, which table holds the foreign key column (`user_id`)?",
          options: [
            { id: "A", text: "The `blogs` table" },
            { id: "B", text: "The `users` table" },
            { id: "C", text: "A separate join table named `users_blogs`" },
            { id: "D", text: "Both tables hold foreign keys to each other" }
          ],
          correctAnswer: "A",
          explanationNote: "In a one-to-many relationship, the 'many' side (`blogs`) stores the foreign key column (`userId` / `user_id`) pointing to the primary key of the 'one' side (`users`)."
        },
        retestMcq: {
          id: "q-13.4-0-v2",
          question: "Why must both `User.hasMany(Blog)` and `Blog.belongsTo(User)` typically be declared in Sequelize models?",
          options: [
            { id: "A", text: "Declaring both sides configures bi-directional navigation, allowing queries from User to Blogs and from Blog to User" },
            { id: "B", text: "Because PostgreSQL rejects foreign keys unless declared twice" },
            { id: "C", text: "It creates two separate duplicate foreign key columns" },
            { id: "D", text: "One is for reading data and one is for writing data" }
          ],
          correctAnswer: "A",
          explanationNote: "Defining both associations gives both models helper methods (e.g. `user.getBlogs()`, `blog.getUser()`) and enables eager loading in either direction."
        }
      },
      {
        heading: "Eager Loading with include",
        text: "Fetch related models in a single SQL query using the `include` option in `findAll` or `findByPk`, generating a SQL `LEFT OUTER JOIN` behind the scenes.",
        codeSnippet: `const blogsWithAuthor = await Blog.findAll({\n  include: {\n    model: User,\n    attributes: ['id', 'username', 'name']\n  }\n});`,
        mcq: {
          id: "q-13.4-1-v1",
          question: "What underlying SQL operation does Sequelize perform when you include `{ model: User }` in a `Blog.findAll()` query?",
          options: [
            { id: "A", text: "A SQL `LEFT OUTER JOIN` between the `blogs` and `users` tables" },
            { id: "B", text: "A separate HTTP REST request to the user endpoint" },
            { id: "C", text: "A `DROP TABLE` followed by `CREATE TABLE`" },
            { id: "D", text: "A full table scan without using indexes" }
          ],
          correctAnswer: "A",
          explanationNote: "Eager loading via `include` issues a SQL `LEFT OUTER JOIN`, pulling blog records and their associated user details in one query."
        },
        retestMcq: {
          id: "q-13.4-1-v2",
          question: "Why is specifying `attributes: ['id', 'username']` inside an `include: { model: User }` clause recommended?",
          options: [
            { id: "A", text: "To avoid leaking sensitive columns (such as `password_hash`) and reduce unnecessary payload transfer" },
            { id: "B", text: "Because Sequelize throws an error if more than 2 attributes are fetched" },
            { id: "C", text: "To force PostgreSQL to sort users alphabetically" },
            { id: "D", text: "To disable database indexing" }
          ],
          correctAnswer: "A",
          explanationNote: "Limiting attributes with `attributes: [...]` prevents sensitive data like hashed passwords or secret tokens from being serialized into the response."
        }
      },
      {
        heading: "Solving the N+1 Query Problem",
        text: "Iterating over blogs and querying the author for each blog creates N+1 database queries. Eager loading with `include` resolves this in a single joined query.",
        codeSnippet: `// BAD: N+1 queries (1 query for blogs, then 1 query per blog for user)\n// GOOD: 1 joined query using eager loading\nconst blogs = await Blog.findAll({ include: User });`,
        mcq: {
          id: "q-13.4-2-v1",
          question: "What is the \"N+1 Query Problem\" in database applications?",
          options: [
            { id: "A", text: "Executing 1 query to fetch N parent records, and then executing N individual subsequent queries to fetch the related data for each parent record" },
            { id: "B", text: "When a database table exceeds N+1 gigabytes in size" },
            { id: "C", text: "When a SQL query contains N+1 syntax errors" },
            { id: "D", text: "When an API endpoint takes N+1 milliseconds to respond" }
          ],
          correctAnswer: "A",
          explanationNote: "The N+1 problem occurs when fetching N parent rows triggers N extra roundtrip queries to fetch related children, resulting in massive network latency that eager loading solves."
        },
        retestMcq: {
          id: "q-13.4-2-v2",
          question: "How many database queries does `Blog.findAll({ include: User })` execute to fetch 100 blogs with their associated users?",
          options: [
            { id: "A", text: "1 single joined query" },
            { id: "B", text: "101 queries (1 for blogs + 100 for users)" },
            { id: "C", text: "200 queries" },
            { id: "D", text: "100 queries" }
          ],
          correctAnswer: "A",
          explanationNote: "By using eager loading (`include`), Sequelize generates a single SQL query with a `JOIN`, fetching all 100 blogs and their authors in one roundtrip."
        }
      },
      {
        heading: "Filtering Associated Models with where in include",
        text: "You can apply filters to associated models by nesting a `where` clause inside the `include` object, effectively converting the join into an inner join.",
        codeSnippet: `const activeUsersWithAdminBlogs = await User.findAll({\n  where: { disabled: false },\n  include: {\n    model: Blog,\n    where: { important: true }\n  }\n});`,
        mcq: {
          id: "q-13.4-3-v1",
          question: "What is the effect of adding a `where: { important: true }` condition inside an `include: { model: Blog }` block?",
          options: [
            { id: "A", text: "Only users who have at least one blog where `important === true` will be returned, and only those matching blogs will be populated" },
            { id: "B", text: "All users are returned, but non-important blogs are flagged with a warning" },
            { id: "C", text: "It updates all blogs in the database setting important to true" },
            { id: "D", text: "It creates a temporary table named important_blogs" }
          ],
          correctAnswer: "A",
          explanationNote: "Adding a `where` condition inside an `include` turns the join into an `INNER JOIN`, returning only parent rows that have matching associated records meeting that filter."
        },
        retestMcq: {
          id: "q-13.4-3-v2",
          question: "How can you return all Users even if they have NO matching blogs when applying a filter to the included model?",
          options: [
            { id: "A", text: "Set `required: false` inside the `include` block to preserve an outer join" },
            { id: "B", text: "Remove the primary key from the User model" },
            { id: "C", text: "Use `where: { [Op.or]: [{ ... }, null] }`" },
            { id: "D", text: "Sequelize does not allow returning empty parent records" }
          ],
          correctAnswer: "A",
          explanationNote: "Setting `required: false` in the `include` forces Sequelize to use a `LEFT OUTER JOIN`, ensuring parent records without matching children are still returned."
        }
      },
      {
        heading: "Lazy Loading with Association Getters",
        text: "Sequelize generates dynamic helper methods on model instances like `await user.getBlogs()`, `await blog.getUser()`, and `await user.addBlog(blog)`.",
        codeSnippet: `const user = await User.findByPk(req.user.id);\nconst userBlogs = await user.getBlogs();\nconst newBlog = await user.createBlog({ title: 'New Post', url: '...' });`,
        mcq: {
          id: "q-13.4-4-v1",
          question: "What is \"Lazy Loading\" in Sequelize?",
          options: [
            { id: "A", text: "Querying associated records on-demand via generated instance methods (e.g. `await user.getBlogs()`) only when they are needed later in execution" },
            { id: "B", text: "Delaying database writes until the server shuts down" },
            { id: "C", text: "Postponing database index creation until 1,000 rows are inserted" },
            { id: "D", text: "Serving cached data instead of contacting the database" }
          ],
          correctAnswer: "A",
          explanationNote: "Lazy loading queries associated entities on-demand when requested later in code execution, rather than eagerly joining them during the initial model fetch."
        },
        retestMcq: {
          id: "q-13.4-4-v2",
          question: "Which method automatically creates a new blog record and assigns its foreign key `userId` to the current user instance?",
          options: [
            { id: "A", text: "await user.createBlog({ title: 'My Post' });" },
            { id: "B", text: "user.pushBlog({ title: 'My Post' });" },
            { id: "C", text: "Blog.attachToUser(user.id);" },
            { id: "D", text: "user.blogs.push({ title: 'My Post' });" }
          ],
          correctAnswer: "A",
          explanationNote: "When associations are defined, Sequelize adds dynamic methods like `create<Association>` which automatically sets the foreign key to the parent instance's ID."
        }
      },
      {
        heading: "Foreign Key Aliasing with as",
        text: "When associating the same model multiple times (e.g. a Task with a `creator` and an `assignee`), use the `as` alias option to distinguish relationships.",
        codeSnippet: `Task.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });\nTask.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });\n\n// In query:\nawait Task.findAll({ include: ['creator', 'assignee'] });`,
        mcq: {
          id: "q-13.4-5-v1",
          question: "Why is the `{ as: 'aliasName' }` option required when a model has multiple associations with the same target model?",
          options: [
            { id: "A", text: "To uniquely identify and distinguish the different relationships and foreign keys connecting the two tables" },
            { id: "B", text: "To rename the database table on disk" },
            { id: "C", text: "To encrypt the foreign key in transit" },
            { id: "D", text: "Because Sequelize prohibits multiple relationships to the same table without alias" }
          ],
          correctAnswer: "A",
          explanationNote: "When a model relates to another model more than once (e.g. creator vs assignee), aliases (`as`) distinguish which foreign key and association is being referenced."
        },
        retestMcq: {
          id: "q-13.4-5-v2",
          question: "How do you eager load an aliased association when querying the parent model?",
          options: [
            { id: "A", text: "Specify `{ model: User, as: 'creator' }` in the `include` array" },
            { id: "B", text: "Specify `{ table: 'users_creator' }`" },
            { id: "C", text: "Sequelize automatically loads all aliases without including them" },
            { id: "D", text: "Aliases can only be loaded lazily and cannot be eager loaded" }
          ],
          correctAnswer: "A",
          explanationNote: "When querying an aliased association, you must supply the matching alias via `as: 'creator'` inside the `include` definition."
        }
      }
    ]
  },
  {
    id: "13-5-many-to-many-relationships",
    number: "13.5",
    title: "Many-to-Many Relationships & Join Tables",
    subtitle: "Implement belongsToMany associations, custom junction models with metadata, and manage reading lists.",
    readTime: "14 min",
    objectives: [
      "Understand why Many-to-Many relationships require junction tables",
      "Configure belongsToMany associations using custom through models",
      "Attach custom attributes (e.g. isRead) to join table rows",
      "Omit join metadata in responses with through: { attributes: [] }",
      "Update junction model attributes directly"
    ],
    theoryBlocks: [
      {
        heading: "The Many-to-Many Concept & Join Tables",
        text: "In a Many-to-Many relationship (e.g. Users and Reading Lists of Blogs), neither table can hold the other's foreign key directly. A junction/join table bridges them.",
        codeSnippet: `// Junction Table: user_readings\n// id | user_id | blog_id | read | created_at`,
        mcq: {
          id: "q-13.5-0-v1",
          question: "Why does a Many-to-Many relationship between `users` and `blogs` require a separate Join (Junction) Table?",
          options: [
            { id: "A", text: "Because a relational table column cannot hold an arbitrary array of foreign keys; the join table breaks the relationship into two One-to-Many pairs" },
            { id: "B", text: "Because PostgreSQL does not allow tables to have more than 5 columns" },
            { id: "C", text: "Because join tables improve database read speeds by 100x" },
            { id: "D", text: "Because Node.js cannot parse foreign keys without a third table" }
          ],
          correctAnswer: "A",
          explanationNote: "Relational database first normal form (1NF) requires atomic values per column. A join table records each link as an independent row (`user_id`, `blog_id`)."
        },
        retestMcq: {
          id: "q-13.5-0-v2",
          question: "What are the two primary foreign keys stored in a join table linking `users` and `blogs`?",
          options: [
            { id: "A", text: "`user_id` referencing users(id) and `blog_id` referencing blogs(id)" },
            { id: "B", text: "`user_name` and `blog_title`" },
            { id: "C", text: "Only `id` and `timestamp`" },
            { id: "D", text: "A single hash combining both objects" }
          ],
          correctAnswer: "A",
          explanationNote: "The join table stores foreign keys pointing to the primary keys of both connected models (`userId` and `blogId`)."
        }
      },
      {
        heading: "Configuring belongsToMany in Sequelize",
        text: "Define many-to-many associations using `ModelA.belongsToMany(ModelB, { through: JoinModel })` on both models, pointing to the designated junction model.",
        codeSnippet: `User.belongsToMany(Blog, { through: UserBlogList, as: 'readingList' });\nBlog.belongsToMany(User, { through: UserBlogList, as: 'savedByUsers' });`,
        mcq: {
          id: "q-13.5-1-v1",
          question: "In the declaration `User.belongsToMany(Blog, { through: ReadingList })`, what is `ReadingList`?",
          options: [
            { id: "A", text: "The junction/join model representing the intermediary table that connects Users and Blogs" },
            { id: "B", text: "An in-memory JavaScript array" },
            { id: "C", text: "A special PostgreSQL index type" },
            { id: "D", text: "A third party npm caching library" }
          ],
          correctAnswer: "A",
          explanationNote: "The `through` property specifies the join table or model through which the two entities are associated."
        },
        retestMcq: {
          id: "q-13.5-1-v2",
          question: "What happens if you pass a string like `{ through: 'user_blogs' }` instead of a model class?",
          options: [
            { id: "A", text: "Sequelize automatically generates an underlying join table named `user_blogs` without requiring a dedicated custom model definition" },
            { id: "B", text: "The application throws a fatal configuration error" },
            { id: "C", text: "PostgreSQL ignores the association" },
            { id: "D", text: "Sequelize converts the relationship into a One-to-One association" }
          ],
          correctAnswer: "A",
          explanationNote: "If a string is passed to `through`, Sequelize creates and manages a default join table with that name automatically."
        }
      },
      {
        heading: "Adding Custom Attributes to the Join Table",
        text: "Join tables often store relationship metadata, such as `read: boolean` or `rating: integer`. Define these extra columns directly in the junction Model.",
        codeSnippet: `class UserReading extends Model {}\nUserReading.init({\n  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },\n  userId: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },\n  blogId: { type: DataTypes.INTEGER, references: { model: 'blogs', key: 'id' } },\n  isRead: { type: DataTypes.BOOLEAN, defaultValue: false }\n}, { sequelize, modelName: 'user_reading' });`,
        mcq: {
          id: "q-13.5-2-v1",
          question: "Why would you create an explicit model class for a join table (like `UserReading`) rather than letting Sequelize generate one automatically?",
          options: [
            { id: "A", text: "To store and validate custom attributes specific to the relationship (like `isRead`, `rating`, or custom timestamps)" },
            { id: "B", text: "Because Sequelize cannot create join tables without a model" },
            { id: "C", text: "To bypass foreign key verification in PostgreSQL" },
            { id: "D", text: "To make the join table accessible via HTTP GET directly" }
          ],
          correctAnswer: "A",
          explanationNote: "Defining a custom model allows adding extra attributes to the association (e.g. marking whether a blog has been read, tracking dates, or storing ratings)."
        },
        retestMcq: {
          id: "q-13.5-2-v2",
          question: "Where do join table attributes appear on associated model instances when eager loaded in a query?",
          options: [
            { id: "A", text: "Under a nested property corresponding to the join model name (e.g. `blog.user_reading.isRead`)" },
            { id: "B", text: "They overwrite the parent model attributes with the same name" },
            { id: "C", text: "They are returned as a separate detached array" },
            { id: "D", text: "They are deleted automatically unless requested via raw SQL" }
          ],
          correctAnswer: "A",
          explanationNote: "Sequelize nests join table data inside an object property named after the through model on the fetched instance."
        }
      },
      {
        heading: "Filtering and Excluding Join Table Attributes",
        text: "By default, Sequelize includes all join table columns. Use `through: { attributes: [] }` in the `include` clause to cleanly omit junction metadata from the output.",
        codeSnippet: `const user = await User.findByPk(id, {\n  include: {\n    model: Blog,\n    as: 'readingList',\n    through: { attributes: ['isRead', 'id'] } // Or [] to omit all\n  }\n});`,
        mcq: {
          id: "q-13.5-3-v1",
          question: "How can you prevent the intermediary join table attributes from cluttering the returned JSON when eager loading a many-to-many relationship?",
          options: [
            { id: "A", text: "Add `through: { attributes: [] }` inside the `include` clause" },
            { id: "B", text: "Set `raw: true` on the root query" },
            { id: "C", text: "Delete the join model after executing the query" },
            { id: "D", text: "Use `DROP TABLE` on the join table" }
          ],
          correctAnswer: "A",
          explanationNote: "Setting `through: { attributes: [] }` tells Sequelize to omit join table columns from the JSON result, keeping the response payload clean."
        },
        retestMcq: {
          id: "q-13.5-3-v2",
          question: "How do you filter many-to-many queries based on a condition on the join table (e.g. only unread blogs)?",
          options: [
            { id: "A", text: "Place the filter in the through option: `through: { where: { isRead: false } }`" },
            { id: "B", text: "Place the filter in the root `where` clause: `where: { isRead: false }`" },
            { id: "C", text: "Sequelize cannot filter on join table columns" },
            { id: "D", text: "Filter the records in memory using JavaScript `.filter()` after fetching all records" }
          ],
          correctAnswer: "A",
          explanationNote: "Using `through: { where: { ... } }` in the include clause applies SQL `WHERE` conditions directly to the junction table join."
        }
      },
      {
        heading: "Association Methods for Many-to-Many",
        text: "Sequelize provides instance methods to manage many-to-many relations: `await user.addReadingList(blog, { through: { isRead: false } })` and `await user.removeReadingList(blog)`.",
        codeSnippet: `const user = await User.findByPk(userId);\nconst blog = await Blog.findByPk(blogId);\n\n// Add association with join table attribute:\nawait user.addReadingList(blog, { through: { isRead: false } });`,
        mcq: {
          id: "q-13.5-4-v1",
          question: "What SQL statement does `await user.addReadingList(blog)` execute under the hood?",
          options: [
            { id: "A", text: "An `INSERT INTO user_readings (user_id, blog_id) VALUES (?, ?)`" },
            { id: "B", text: "An `UPDATE users SET blog_id = ?`" },
            { id: "C", text: "A `SELECT` query followed by a `DELETE`" },
            { id: "D", text: "It creates a new database table" }
          ],
          correctAnswer: "A",
          explanationNote: "`add<Association>` inserts a new record into the junction table linking the primary keys of the two instances."
        },
        retestMcq: {
          id: "q-13.5-4-v2",
          question: "Which method removes an existing many-to-many association row from the join table between two instances?",
          options: [
            { id: "A", text: "await user.removeReadingList(blog);" },
            { id: "B", text: "user.deleteReadingList(blog);" },
            { id: "C", text: "blog.unassociate(user);" },
            { id: "D", text: "user.detach(blog);" }
          ],
          correctAnswer: "A",
          explanationNote: "`remove<Association>` deletes the corresponding row from the junction table without deleting either the user or the blog records themselves."
        }
      },
      {
        heading: "Updating Join Table Records Directly",
        text: "To update metadata on an existing relationship (like marking a blog as read), query the junction model directly using `UserReading.findOne()` or `update()`.",
        codeSnippet: `const reading = await UserReading.findOne({\n  where: { userId: req.user.id, blogId: req.params.id }\n});\nif (reading) {\n  reading.isRead = req.body.read;\n  await reading.save();\n}`,
        mcq: {
          id: "q-13.5-5-v1",
          question: "When a user wants to toggle `isRead: true` for a blog in their reading list, what is the cleanest approach?",
          options: [
            { id: "A", text: "Query the junction model (`UserReading`) directly and update the `isRead` attribute on that record" },
            { id: "B", text: "Delete the blog and recreate it with isRead set to true" },
            { id: "C", text: "Drop the join table and recreate it" },
            { id: "D", text: "Add a new column to the `users` table for every blog read" }
          ],
          correctAnswer: "A",
          explanationNote: "Since `isRead` belongs to the junction table, querying the junction model directly allows updating the attribute cleanly without touching other tables."
        },
        retestMcq: {
          id: "q-13.5-5-v2",
          question: "What authorization check should always be performed before updating a reading list entry in an API endpoint?",
          options: [
            { id: "A", text: "Verify that the authenticated user owns the reading list entry (`reading.userId === req.user.id`)" },
            { id: "B", text: "Verify that the user has admin rights across all tables" },
            { id: "C", text: "Check that the database is running in single-user mode" },
            { id: "D", text: "Ensure the blog was written by the same user" }
          ],
          correctAnswer: "A",
          explanationNote: "A user should only be able to mark blogs in their own reading list as read, requiring verification that the session user ID matches `reading.userId`."
        }
      }
    ]
  },
  {
    id: "13-6-transactions-indexing-capstone",
    number: "13.6",
    title: "Transactions, Indexing & Full Stack Capstone",
    subtitle: "Execute atomic ACID transactions, optimize queries with B-tree indexes, implement server-side session revocation, and certify mastery.",
    readTime: "15 min",
    objectives: [
      "Understand ACID database transaction properties",
      "Execute managed transactions using sequelize.transaction",
      "Optimize query performance using B-tree database indexing",
      "Implement server-side token session revocation tables",
      "Celebrate complete mastery of all 14 Full Stack Open parts"
    ],
    theoryBlocks: [
      {
        heading: "Database Transactions & ACID Properties",
        text: "A transaction groups multiple SQL operations into an atomic unit: all operations must succeed, or all changes are rolled back, preserving database integrity.",
        codeSnippet: `// ACID: Atomicity, Consistency, Isolation, Durability`,
        mcq: {
          id: "q-13.6-0-v1",
          question: "What does the \"Atomicity\" property of ACID transactions guarantee in a relational database?",
          options: [
            { id: "A", text: "All operations within the transaction succeed together, or the entire transaction is rolled back with zero modifications made (\"all or nothing\")" },
            { id: "B", text: "Queries execute at the speed of atomic nuclear particles" },
            { id: "C", text: "Every table can only contain a single column" },
            { id: "D", text: "Data is automatically split into individual atoms in memory" }
          ],
          correctAnswer: "A",
          explanationNote: "Atomicity guarantees that a series of operations acts as a single indivisible unit. If any statement fails, the entire transaction is aborted and rolled back."
        },
        retestMcq: {
          id: "q-13.6-0-v2",
          question: "Why are transactions critical when implementing a bank transfer between two account balances (decrement Account A, increment Account B)?",
          options: [
            { id: "A", text: "To prevent money from disappearing if the server crashes or an error occurs between deducting Account A and crediting Account B" },
            { id: "B", text: "To bypass database password checks during money transfers" },
            { id: "C", text: "Because SQL cannot update numbers without a transaction" },
            { id: "D", text: "To convert fiat currency into cryptocurrency" }
          ],
          correctAnswer: "A",
          explanationNote: "Without a transaction, an unexpected crash or error after decrementing Account A would leave money lost; a transaction ensures either both balances update or neither does."
        }
      },
      {
        heading: "Managed Transactions in Sequelize",
        text: "Pass a callback to `sequelize.transaction(async t => { ... })`. Sequelize automatically commits on return or rolls back if an unhandled error is thrown.",
        codeSnippet: `await sequelize.transaction(async (t) => {\n  const user = await User.create({ username: 'bob' }, { transaction: t });\n  await Profile.create({ userId: user.id, bio: 'Hello' }, { transaction: t });\n  // Automatically commits if promise resolves!\n  // Automatically rolls back if an error is thrown!\n});`,
        mcq: {
          id: "q-13.6-1-v1",
          question: "What is the primary benefit of Sequelize's managed transaction pattern (`sequelize.transaction(async (t) => { ... })`)?",
          options: [
            { id: "A", text: "It automatically commits the transaction if the callback promise resolves, and automatically executes a rollback if any error is thrown" },
            { id: "B", text: "It makes SQL queries run without connecting to a database" },
            { id: "C", text: "It guarantees that queries finish in under 1 millisecond" },
            { id: "D", text: "It prevents multiple users from visiting the website" }
          ],
          correctAnswer: "A",
          explanationNote: "Managed transactions eliminate manual `commit()` and `rollback()` calls by handling lifecycle automatically based on whether the async callback fulfills or rejects."
        },
        retestMcq: {
          id: "q-13.6-1-v2",
          question: "What mistake must be avoided when writing queries inside a managed transaction callback?",
          options: [
            { id: "A", text: "Forgetting to pass `{ transaction: t }` to queries inside the callback, causing them to execute outside the transaction" },
            { id: "B", text: "Returning a value from the async function" },
            { id: "C", text: "Using `await` on database operations" },
            { id: "D", text: "Querying more than one model" }
          ],
          correctAnswer: "A",
          explanationNote: "Any query executed without `{ transaction: t }` runs outside the transaction on an independent connection, bypassing atomic rollback protection."
        }
      },
      {
        heading: "Database Indexing for Performance",
        text: "Indexes (typically B-trees) allow PostgreSQL to locate rows in `O(log N)` time instead of scanning every table row (`O(N)` Sequential Scan).",
        codeSnippet: `CREATE INDEX idx_blogs_user_id ON blogs(user_id);\nCREATE UNIQUE INDEX idx_users_email ON users(lower(email));`,
        mcq: {
          id: "q-13.6-2-v1",
          question: "What is the performance trade-off of creating database indexes on a table?",
          options: [
            { id: "A", text: "Indexes drastically accelerate `SELECT` query read speeds, but slightly slow down `INSERT`, `UPDATE`, and `DELETE` writes because the index structure must be maintained" },
            { id: "B", text: "Indexes speed up writes but slow down reads" },
            { id: "C", text: "Indexes consume zero additional disk space" },
            { id: "D", text: "Indexes can only be created on integer columns" }
          ],
          correctAnswer: "A",
          explanationNote: "Indexes provide fast lookups for `SELECT` and `WHERE` clauses, but introduce slight overhead during write operations because the B-tree index must be updated."
        },
        retestMcq: {
          id: "q-13.6-2-v2",
          question: "Which SQL command displays the query execution plan and indicates whether an index was utilized (Index Scan vs Seq Scan)?",
          options: [
            { id: "A", text: "EXPLAIN ANALYZE <query>;" },
            { id: "B", text: "SHOW QUERY SPEED <query>;" },
            { id: "C", text: "DEBUG <query>;" },
            { id: "D", text: "TEST INDEXES ON <query>;" }
          ],
          correctAnswer: "A",
          explanationNote: "`EXPLAIN ANALYZE` executes the SQL query in PostgreSQL and returns detailed profiling metrics, including whether an Index Scan or Sequential Scan was performed."
        }
      },
      {
        heading: "Session Revocation with Server-Side Token Storage",
        text: "Store active login session tokens in a database `sessions` table. To log out or ban a compromised user, delete or invalidate their session record in the database.",
        codeSnippet: `// Check if token exists in active sessions table:\nconst session = await Session.findOne({ where: { token, userId } });\nif (!session) {\n  return res.status(401).json({ error: 'Session expired or revoked' });\n}`,
        mcq: {
          id: "q-13.6-3-v1",
          question: "Why is combining JWTs with a server-side database session table beneficial for security?",
          options: [
            { id: "A", text: "Pure stateless JWTs cannot be revoked before expiration; storing active sessions in the database enables immediate logout and instant credential invalidation" },
            { id: "B", text: "It eliminates the need for password hashing" },
            { id: "C", text: "It removes the requirement for HTTPS encryption" },
            { id: "D", text: "It allows JWTs to be decoded without a secret key" }
          ],
          correctAnswer: "A",
          explanationNote: "Pure stateless JWTs remain valid until their expiration timestamp. A server-side session table provides immediate revocation capabilities."
        },
        retestMcq: {
          id: "q-13.6-3-v2",
          question: "What occurs when an admin sets `user.disabled = true` in the database?",
          options: [
            { id: "A", text: "Middleware checking user status rejects all incoming requests from that user immediately with a 401/403 status" },
            { id: "B", text: "PostgreSQL permanently deletes the user's past blog posts" },
            { id: "C", text: "The user's browser crashes immediately" },
            { id: "D", text: "The user is converted to a guest viewer" }
          ],
          correctAnswer: "A",
          explanationNote: "Auth middleware checks the database on protected requests; if `user.disabled` is true, access is immediately blocked regardless of token signatures."
        }
      },
      {
        heading: "Full Stack Open Curriculum Mastery",
        text: "Across Parts 0 through 13, you mastered modern web engineering: React, Node, Express, MongoDB, TypeScript, React Native, CI/CD pipelines, Docker containers, and PostgreSQL.",
        codeSnippet: `// Full Stack Open (Parts 0–13):\n// Frontend • Backend • DB • Mobile • DevOps • SQL`,
        mcq: {
          id: "q-13.6-4-v1",
          question: "Which of the following architectural patterns represents the complete Full Stack Open production stack mastered across this course?",
          options: [
            { id: "A", text: "React/TypeScript Single Page Application served by Nginx, communicating via REST/GraphQL with a Node/Express backend running in Docker, persisting relational data in PostgreSQL via Sequelize with CI/CD automation" },
            { id: "B", text: "Monolithic PHP server with unencrypted SQLite running on a local desktop without automated testing" },
            { id: "C", text: "Frontend-only React app connecting directly to a public MongoDB instance without backend authentication" },
            { id: "D", text: "Client-side HTML with inline script tags and hardcoded passwords" }
          ],
          correctAnswer: "A",
          explanationNote: "The Full Stack Open curriculum builds a production-ready system: TypeScript/React frontend, Express/Node API, Docker containerization, PostgreSQL relational persistence, and GitHub Actions CI/CD."
        },
        retestMcq: {
          id: "q-13.6-4-v2",
          question: "What is the benefit of having end-to-end TypeScript coverage spanning frontend, backend, and database models?",
          options: [
            { id: "A", text: "Type consistency prevents runtime shape mismatches, catches contract bugs during compilation, and improves developer velocity with autocomplete across the entire stack" },
            { id: "B", text: "It reduces JavaScript file size to zero bytes" },
            { id: "C", text: "It eliminates the need for database indexing" },
            { id: "D", text: "It allows web servers to boot without Node.js" }
          ],
          correctAnswer: "A",
          explanationNote: "End-to-end TypeScript provides compile-time safety and self-documenting interfaces across client-server boundaries, catching errors before deployment."
        }
      },
      {
        heading: "Official Course Completion & Certification",
        text: "Congratulations! You have completed all 14 parts (Parts 0–13) of the Full Stack Open curriculum. You are now equipped with full stack engineering skills.",
        codeSnippet: `console.log("Full Stack Open Course: 100% COMPLETE!");\n// All 14 Parts Certified`,
        mcq: {
          id: "q-13.6-5-v1",
          question: "What key software engineering capability defines a competent Full Stack Developer following completion of this course?",
          options: [
            { id: "A", text: "The ability to independently architect, build, containerize, test, and deploy resilient web applications spanning UI, APIs, databases, and automated pipelines" },
            { id: "B", text: "Memorizing every single NPM package name in existence" },
            { id: "C", text: "Writing applications without automated tests or version control" },
            { id: "D", text: "Running servers only on localhost without production security" }
          ],
          correctAnswer: "A",
          explanationNote: "A competent full stack developer understands the complete software delivery lifecycle: user interfaces, API architecture, data persistence and referential integrity, automated testing, and CI/CD container deployments."
        },
        retestMcq: {
          id: "q-13.6-5-v2",
          question: "What is the recommended next step to showcase your Full Stack Open mastery to employers and collaborators?",
          options: [
            { id: "A", text: "Deploy a full stack capstone project with public GitHub CI/CD repository, live URL, and showcase your certified completion profile on DO PILOT" },
            { id: "B", text: "Delete all your Git repositories to preserve privacy" },
            { id: "C", text: "Stop writing automated tests now that the course is done" },
            { id: "D", text: "Rely exclusively on local SQLite databases for production" }
          ],
          correctAnswer: "A",
          explanationNote: "Deploying a live full stack application backed by automated testing, clean documentation, and your DO PILOT certification provides verifiable proof of your full stack capabilities."
        }
      }
    ]
  }
];

export function getActiveQuestionsForLevelFullstackPart13(
  section: SectionContent,
  studentId: string,
  isRetest: boolean = false
): McqQuestion[] {
  const attemptCount = getLevelAttemptCountFullstackPart13(section.id, studentId);
  const useRetest = isRetest || attemptCount > 0;

  return section.theoryBlocks.map((block) => {
    if (useRetest && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq!;
  });
}

export function getLevelAttemptCountFullstackPart13(sectionId: string, studentId: string): number {
  try {
    const key = `dopilot_fullstack_p13_attempt_${studentId}_${sectionId}`;
    const val = localStorage.getItem(key);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function setLevelAttemptCountFullstackPart13(sectionId: string, studentId: string, count: number): void {
  try {
    const key = `dopilot_fullstack_p13_attempt_${studentId}_${sectionId}`;
    localStorage.setItem(key, count.toString());
  } catch {}
}

export function getConsecutiveFailedLevelsFullstackPart13(studentId: string): number {
  try {
    const key = `dopilot_fullstack_p13_failed_levels_streak_${studentId}`;
    const val = localStorage.getItem(key);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function setConsecutiveFailedLevelsFullstackPart13(studentId: string, streak: number): void {
  try {
    const key = `dopilot_fullstack_p13_failed_levels_streak_${studentId}`;
    localStorage.setItem(key, streak.toString());
  } catch {}
}

export function resetConsecutiveFailuresFullstackPart13(studentId: string): void {
  try {
    const key = `dopilot_fullstack_p13_failed_levels_streak_${studentId}`;
    const lockKey = `dopilot_fullstack_p13_locked_${studentId}`;
    localStorage.setItem(key, '0');
    localStorage.removeItem(lockKey);
  } catch {}
}

export function recordLevelAttemptResultFullstackPart13(
  sectionId: string,
  studentId: string,
  passed: boolean
): { isPassed: boolean; attemptCount: number; isSecondFailureInLevel: boolean; consecutiveFailedLevels: number; isLocked: boolean } {
  const currentAttempts = getLevelAttemptCountFullstackPart13(sectionId, studentId);
  const nextAttempts = currentAttempts + 1;
  setLevelAttemptCountFullstackPart13(sectionId, studentId, nextAttempts);

  let streak = getConsecutiveFailedLevelsFullstackPart13(studentId);

  if (passed) {
    streak = 0;
    setConsecutiveFailedLevelsFullstackPart13(studentId, 0);
    return {
      isPassed: true,
      attemptCount: nextAttempts,
      isSecondFailureInLevel: false,
      consecutiveFailedLevels: 0,
      isLocked: false
    };
  } else {
    streak += 1;
    setConsecutiveFailedLevelsFullstackPart13(studentId, streak);
    const isLocked = streak >= 3;
    if (isLocked) {
      try {
        localStorage.setItem(`dopilot_fullstack_p13_locked_${studentId}`, 'true');
      } catch {}
    }
    return {
      isPassed: false,
      attemptCount: nextAttempts,
      isSecondFailureInLevel: streak === 2,
      consecutiveFailedLevels: streak,
      isLocked
    };
  }
}
