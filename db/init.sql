CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, price)
SELECT 'Teclado', 120.00
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Teclado'
);

INSERT INTO products (name, price)
SELECT 'Mouse', 65.90
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Mouse'
);
