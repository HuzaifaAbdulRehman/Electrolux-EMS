-- Create system_settings table for admin configuration
CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT,
  `category` ENUM('general', 'billing', 'security', 'system') NOT NULL,
  `data_type` ENUM('string', 'number', 'boolean') NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  INDEX `idx_category` (`category`),
  INDEX `idx_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `category`, `data_type`) VALUES
-- General Settings
('company_name', 'Electrolux Distribution Co.', 'general', 'string'),
('timezone', 'UTC-5', 'general', 'string'),
('currency', 'USD', 'general', 'string'),
('language', 'English', 'general', 'string'),
('date_format', 'MM/DD/YYYY', 'general', 'string'),
('fiscal_year_start', 'January', 'general', 'string'),
('auto_logout', '60', 'general', 'number'),
('maintenance_mode', 'false', 'general', 'boolean'),

-- Billing Configuration
('billing_cycle', 'monthly', 'billing', 'string'),
('payment_due_days', '15', 'billing', 'number'),
('late_fee_percentage', '2', 'billing', 'number'),
('grace_period', '5', 'billing', 'number'),
('auto_generate_bills', 'true', 'billing', 'boolean'),
('enable_auto_pay', 'true', 'billing', 'boolean'),
('tax_rate', '15', 'billing', 'number'),
('minimum_payment', '10', 'billing', 'number'),

-- Security Settings
('password_min_length', '8', 'security', 'number'),
('password_complexity', 'true', 'security', 'boolean'),
('two_factor_auth', 'optional', 'security', 'string'),
('session_timeout', '30', 'security', 'number'),
('max_login_attempts', '5', 'security', 'number'),
('ip_whitelist', 'false', 'security', 'boolean'),
('api_rate_limit', '100', 'security', 'number'),
('data_encryption', 'true', 'security', 'boolean'),
('audit_logging', 'true', 'security', 'boolean'),
('backup_frequency', 'daily', 'security', 'string'),

-- System Configuration
('cache_enabled', 'true', 'system', 'boolean'),
('cdn_enabled', 'true', 'system', 'boolean'),
('debug_mode', 'false', 'system', 'boolean'),
('performance_monitoring', 'true', 'system', 'boolean'),
('error_tracking', 'true', 'system', 'boolean'),
('analytics_enabled', 'true', 'system', 'boolean'),
('database_backup', 'daily', 'system', 'string'),
('log_retention', '90', 'system', 'number')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);
