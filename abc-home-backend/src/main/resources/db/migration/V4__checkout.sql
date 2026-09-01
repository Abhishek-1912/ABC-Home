CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    line1 VARCHAR(200) NOT NULL,
    line2 VARCHAR(200),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(30) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    address_id BIGINT NOT NULL REFERENCES addresses(id),
    subtotal NUMERIC(10,2) NOT NULL,
    shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PLACED',
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(20) NOT NULL DEFAULT 'COD',
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    variant_id BIGINT REFERENCES product_variants(id),
    product_name VARCHAR(200) NOT NULL,
    variant_label VARCHAR(100),
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL,
    line_total NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);