CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    author VARCHAR(30) NOT NULL CHECK (length(trim(author)) > 0),
    content VARCHAR(500) NOT NULL CHECK (length(trim(content)) > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
