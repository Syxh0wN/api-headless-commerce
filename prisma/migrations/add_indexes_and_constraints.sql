-- Índices e Constraints Essenciais para E-commerce

-- ===== ÍNDICES PARA PERFORMANCE =====

-- Índice GIN para busca em atributos de variantes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_variant_attributes_gin 
ON product_variants USING GIN (attributes);

-- Índice para busca textual em produtos (requer extensão pg_trgm)
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_title_gin_trgm 
-- ON products USING GIN (title gin_trgm_ops);

-- Índices para slugs únicos (já existem como constraints, mas adicionando para performance)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_slug ON products (slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_category_slug ON categories (slug);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_brand_slug ON brands (slug);

-- Índices para SKUs únicos
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_variant_sku ON product_variants (sku);

-- Índices para carrinho
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_user_id ON carts (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_session_id ON carts (session_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_status ON carts (status);

-- Índices para pedidos
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_user_id ON orders (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_status ON orders (status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_placed_at ON orders (placed_at);

-- Índices para pagamentos
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_order_id ON payments (order_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_status ON payments (status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_idempotency_key ON payments (idempotency_key);

-- Índices para promo codes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_promo_code_code_lower ON promo_codes (LOWER(code));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_promo_code_active ON promo_codes (is_active) WHERE is_active = true;

-- Índices para webhook events
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webhook_event_external_id ON webhook_events (external_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_webhook_event_processed ON webhook_events (processed_at);

-- Índices para API keys
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_key_hash ON api_keys (key_hash);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_key_expires ON api_keys (expires_at);

-- Índices para audit logs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_actor ON audit_logs (actor);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_entity ON audit_logs (entity, entity_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_log_at ON audit_logs (at);

-- ===== CONSTRAINTS ADICIONAIS =====

-- Constraint para garantir que promo codes tenham código único em lowercase
ALTER TABLE promo_codes 
ADD CONSTRAINT unique_promo_code_lower 
UNIQUE (LOWER(code));

-- Constraint para garantir que webhook events tenham external_id único
ALTER TABLE webhook_events 
ADD CONSTRAINT unique_webhook_external_id 
UNIQUE (external_id);

-- Constraint para garantir que payments tenham idempotency_key único
ALTER TABLE payments 
ADD CONSTRAINT unique_payment_idempotency_key 
UNIQUE (idempotency_key);

-- Constraint para garantir que cart_items tenham combinação única de cart_id + variant_id
ALTER TABLE cart_items 
ADD CONSTRAINT unique_cart_variant 
UNIQUE (cart_id, variant_id);

-- ===== TRIGGERS PARA AUDIT LOGGING =====

-- Função para criar audit log
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (actor, action, entity, entity_id, diff, at)
  VALUES (
    COALESCE(current_setting('app.current_user', true), 'system'),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW)
      ELSE jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
    END,
    NOW()
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers para audit logging em tabelas críticas
CREATE TRIGGER audit_products AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_product_variants AFTER INSERT OR UPDATE OR DELETE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_orders AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_payments AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_promo_codes AFTER INSERT OR UPDATE OR DELETE ON promo_codes
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- ===== FUNÇÕES ÚTEIS =====

-- Função para calcular total do carrinho
CREATE OR REPLACE FUNCTION calculate_cart_total(cart_uuid UUID)
RETURNS TABLE(subtotal_cents BIGINT, total_items BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(ci.qty * ci.unit_price_cents), 0) as subtotal_cents,
    COALESCE(SUM(ci.qty), 0) as total_items
  FROM cart_items ci
  WHERE ci.cart_id = cart_uuid;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar estoque disponível
CREATE OR REPLACE FUNCTION check_inventory_available(variant_uuid UUID, requested_qty INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  available_qty INTEGER;
BEGIN
  SELECT inventory_qty INTO available_qty
  FROM product_variants
  WHERE id = variant_uuid;
  
  RETURN COALESCE(available_qty, 0) >= requested_qty;
END;
$$ LANGUAGE plpgsql;

-- ===== COMENTÁRIOS PARA DOCUMENTAÇÃO =====

COMMENT ON TABLE products IS 'Produtos principais com informações básicas';
COMMENT ON TABLE product_variants IS 'Variantes de produtos com preços e estoque';
COMMENT ON TABLE cart_items IS 'Itens do carrinho com snapshots de preços';
COMMENT ON TABLE orders IS 'Pedidos com referência ao carrinho original';
COMMENT ON TABLE payments IS 'Pagamentos com idempotência';
COMMENT ON TABLE promo_codes IS 'Códigos promocionais com validação temporal';
COMMENT ON TABLE webhook_events IS 'Eventos de webhook com dedupe por external_id';
COMMENT ON TABLE api_keys IS 'Chaves de API para autenticação';
COMMENT ON TABLE audit_logs IS 'Log de auditoria para todas as operações críticas';
