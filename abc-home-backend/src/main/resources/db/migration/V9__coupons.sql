CREATE TABLE coupons (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL,      -- PERCENTAGE or FIXED
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_value NUMERIC(10,2) NOT NULL DEFAULT 0,
    max_discount_amount NUMERIC(10,2),       -- caps percentage discounts; null = uncapped
    usage_limit INT,                         -- null = unlimited
    used_count INT NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMP,                    -- null = never expires
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE orders ADD COLUMN coupon_id BIGINT REFERENCES coupons(id);
ALTER TABLE orders ADD COLUMN discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0;