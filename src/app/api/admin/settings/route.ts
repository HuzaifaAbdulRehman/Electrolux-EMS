import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle/db';
import { systemSettings } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch all system settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can access system settings
    if (session.user.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    console.log('[Admin Settings API] Fetching system settings');

    // Fetch all settings from database
    const settings = await db.select().from(systemSettings);

    // Format settings into the structure expected by the frontend
    const formattedSettings: Record<string, Record<string, any>> = {
      general: {},
      billing: {},
      security: {},
      system: {},
      notifications: {},
      tariffs: {},
      electricity: {},
    };

    settings.forEach((setting) => {
      const category = setting.category;
      const key = setting.settingKey;
      let value: any = setting.settingValue;

      // Parse value based on data type
      if (setting.dataType === 'boolean') {
        value = value === 'true' || value === '1';
      } else if (setting.dataType === 'number') {
        value = value;
      }

      // Initialize category if it doesn't exist
      if (!formattedSettings[category]) {
        formattedSettings[category] = {};
      }

      formattedSettings[category][key] = value;
    });

    console.log('[Admin Settings API] Settings fetched successfully');

    return NextResponse.json({
      success: true,
      data: formattedSettings,
      message: 'Settings fetched successfully',
    });
  } catch (error: any) {
    console.error('[Admin Settings API] Error fetching settings:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch settings',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH - Update system settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can modify system settings
    if (session.user.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      );
    }

    console.log('[Admin Settings API] Updating system settings');

    // Update each setting in the database
    const updates = [];

    for (const [category, categorySettings] of Object.entries(settings)) {
      for (const [key, value] of Object.entries(categorySettings as Record<string, any>)) {
        // Convert key from camelCase to snake_case
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();

        const settingValue = String(value);

        updates.push(
          db
            .update(systemSettings)
            .set({ settingValue, updatedAt: new Date() })
            .where(eq(systemSettings.settingKey, snakeKey))
        );
      }
    }

    // Execute all updates
    await Promise.all(updates);

    console.log('[Admin Settings API] Settings updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error: any) {
    console.error('[Admin Settings API] Error updating settings:', error);
    return NextResponse.json(
      {
        error: 'Failed to update settings',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST - Initialize default settings (run once)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can initialize settings
    if (session.user.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    console.log('[Admin Settings API] Initializing default settings');

    const defaultSettings = [
      // General Settings
      { settingKey: 'company_name', settingValue: 'Electrolux Distribution Co.', category: 'general', dataType: 'string' },
      { settingKey: 'timezone', settingValue: 'UTC-5', category: 'general', dataType: 'string' },
      { settingKey: 'currency', settingValue: 'USD', category: 'general', dataType: 'string' },
      { settingKey: 'language', settingValue: 'English', category: 'general', dataType: 'string' },
      { settingKey: 'date_format', settingValue: 'MM/DD/YYYY', category: 'general', dataType: 'string' },
      { settingKey: 'fiscal_year_start', settingValue: 'January', category: 'general', dataType: 'string' },
      { settingKey: 'auto_logout', settingValue: '60', category: 'general', dataType: 'number' },
      { settingKey: 'maintenance_mode', settingValue: 'false', category: 'general', dataType: 'boolean' },

      // Billing Configuration
      { settingKey: 'billing_cycle', settingValue: 'monthly', category: 'billing', dataType: 'string' },
      { settingKey: 'payment_due_days', settingValue: '15', category: 'billing', dataType: 'number' },
      { settingKey: 'late_fee_percentage', settingValue: '2', category: 'billing', dataType: 'number' },
      { settingKey: 'grace_period', settingValue: '5', category: 'billing', dataType: 'number' },
      { settingKey: 'auto_generate_bills', settingValue: 'true', category: 'billing', dataType: 'boolean' },
      { settingKey: 'enable_auto_pay', settingValue: 'true', category: 'billing', dataType: 'boolean' },
      { settingKey: 'tax_rate', settingValue: '15', category: 'billing', dataType: 'number' },
      { settingKey: 'minimum_payment', settingValue: '10', category: 'billing', dataType: 'number' },

      // Security Settings
      { settingKey: 'password_min_length', settingValue: '8', category: 'security', dataType: 'number' },
      { settingKey: 'password_complexity', settingValue: 'true', category: 'security', dataType: 'boolean' },
      { settingKey: 'two_factor_auth', settingValue: 'optional', category: 'security', dataType: 'string' },
      { settingKey: 'session_timeout', settingValue: '30', category: 'security', dataType: 'number' },
      { settingKey: 'max_login_attempts', settingValue: '5', category: 'security', dataType: 'number' },
      { settingKey: 'ip_whitelist', settingValue: 'false', category: 'security', dataType: 'boolean' },
      { settingKey: 'api_rate_limit', settingValue: '100', category: 'security', dataType: 'number' },
      { settingKey: 'data_encryption', settingValue: 'true', category: 'security', dataType: 'boolean' },
      { settingKey: 'audit_logging', settingValue: 'true', category: 'security', dataType: 'boolean' },
      { settingKey: 'backup_frequency', settingValue: 'daily', category: 'security', dataType: 'string' },

      // System Configuration
      { settingKey: 'cache_enabled', settingValue: 'true', category: 'system', dataType: 'boolean' },
      { settingKey: 'cdn_enabled', settingValue: 'true', category: 'system', dataType: 'boolean' },
      { settingKey: 'debug_mode', settingValue: 'false', category: 'system', dataType: 'boolean' },
      { settingKey: 'performance_monitoring', settingValue: 'true', category: 'system', dataType: 'boolean' },
      { settingKey: 'error_tracking', settingValue: 'true', category: 'system', dataType: 'boolean' },
      { settingKey: 'analytics_enabled', settingValue: 'true', category: 'system', dataType: 'boolean' },
      { settingKey: 'database_backup', settingValue: 'daily', category: 'system', dataType: 'string' },
      { settingKey: 'log_retention', settingValue: '90', category: 'system', dataType: 'number' },
    ];

    // Insert default settings
    for (const setting of defaultSettings) {
      try {
        await db.insert(systemSettings).values(setting as any);
      } catch (err: any) {
        // Ignore duplicate key errors
        if (!err.message.includes('Duplicate entry')) {
          throw err;
        }
      }
    }

    console.log('[Admin Settings API] Default settings initialized successfully');

    return NextResponse.json({
      success: true,
      message: 'Default settings initialized successfully',
    });
  } catch (error: any) {
    console.error('[Admin Settings API] Error initializing settings:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize settings',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
