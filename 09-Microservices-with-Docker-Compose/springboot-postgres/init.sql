-- init.sql — Runs automatically on first PostgreSQL startup

CREATE TABLE IF NOT EXISTS items (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO items (name) VALUES
    ('DevOps Item 1'),
    ('DevOps Item 2'),
    ('DevOps Item 3');
