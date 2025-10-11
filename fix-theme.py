#!/usr/bin/env python3
"""
Script to fix theme issues across all pages in the application.
This will update all hardcoded dark mode styles to support both light and dark modes.
"""

import os
import re
from pathlib import Path

# Define replacement patterns
replacements = [
    # Background patterns - Must be before text patterns to avoid double replacements
    (r'className="bg-white/5\b', 'className="bg-white dark:bg-white/5'),
    (r'className="(.*)bg-white/5\b', r'className="\1bg-white dark:bg-white/5'),
    (r'className="(.*)bg-white/10\b', r'className="\1bg-gray-50 dark:bg-white/10'),
    (r'className="(.*)bg-white/20\b', r'className="\1bg-gray-100 dark:bg-white/20'),
    (r'className="(.*)bg-black/20\b', r'className="\1bg-gray-100 dark:bg-black/20'),
    (r'className="(.*)bg-black/80\b', r'className="\1bg-white dark:bg-black/80'),

    # Border patterns
    (r'border-white/10\b', 'border-gray-200 dark:border-white/10'),
    (r'border-white/20\b', 'border-gray-300 dark:border-white/20'),
    (r'border-white/5\b', 'border-gray-100 dark:border-white/5'),

    # Text color patterns - be careful not to replace already fixed patterns
    (r'(?<!dark:)text-white\b(?! rounded| font| transition)', 'text-gray-900 dark:text-white'),
    (r'(?<!dark:)text-gray-400\b', 'text-gray-600 dark:text-gray-400'),
    (r'(?<!dark:)text-gray-300\b', 'text-gray-700 dark:text-gray-300'),
    (r'(?<!dark:)text-gray-200\b', 'text-gray-800 dark:text-gray-200'),

    # Placeholder patterns
    (r'placeholder-gray-400\b', 'placeholder-gray-500 dark:placeholder-gray-400'),
    (r'placeholder-white/60\b', 'placeholder-gray-500 dark:placeholder-white/60'),

    # Hover patterns
    (r'hover:bg-white/10\b', 'hover:bg-gray-100 dark:hover:bg-white/10'),
    (r'hover:bg-white/20\b', 'hover:bg-gray-200 dark:hover:bg-white/20'),
    (r'hover:bg-white/5\b', 'hover:bg-gray-50 dark:hover:bg-white/5'),
    (r'hover:text-white\b', 'hover:text-gray-900 dark:hover:text-white'),
    (r'hover:border-white/20\b', 'hover:border-gray-300 dark:hover:border-white/20'),

    # Focus patterns
    (r'focus:border-white/40\b', 'focus:border-gray-400 dark:focus:border-white/40'),
    (r'focus:ring-white/20\b', 'focus:ring-gray-300 dark:focus:ring-white/20'),
]

# Files to process
files_to_process = [
    'src/app/admin/dashboard/page.tsx',
    'src/app/admin/employees/page.tsx',
    'src/app/admin/tariffs/page.tsx',
    'src/app/admin/reports/page.tsx',
    'src/app/admin/analytics/page.tsx',
    'src/app/admin/profile/page.tsx',
    'src/app/admin/settings/page.tsx',
    'src/app/employee/dashboard/page.tsx',
    'src/app/employee/meter-reading/page.tsx',
    'src/app/employee/customers/page.tsx',
    'src/app/employee/bill-generation/page.tsx',
    'src/app/employee/profile/page.tsx',
    'src/app/employee/settings/page.tsx',
    'src/app/customer/bills/page.tsx',
    'src/app/customer/payment/page.tsx',
    'src/app/customer/profile/page.tsx',
    'src/app/customer/services/page.tsx',
    'src/app/customer/new-connection/page.tsx',
    'src/app/customer/notifications/page.tsx',
    'src/app/login/page.tsx',
    'src/app/register/page.tsx',
    'src/app/forgot-password/page.tsx',
]

def fix_file(filepath):
    """Fix theme issues in a single file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Apply all replacements
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content)

        # Check if file was modified
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function to process all files."""
    fixed_files = []
    skipped_files = []

    for filepath in files_to_process:
        full_path = Path(filepath)
        if full_path.exists():
            if fix_file(full_path):
                fixed_files.append(filepath)
                print(f"[FIXED] {filepath}")
            else:
                skipped_files.append(filepath)
                print(f"[SKIPPED] {filepath}")
        else:
            print(f"[ERROR] File not found: {filepath}")

    print(f"\nSummary:")
    print(f"   Fixed: {len(fixed_files)} files")
    print(f"   Skipped: {len(skipped_files)} files")

    if fixed_files:
        print(f"\nSuccessfully fixed theme issues in {len(fixed_files)} files!")

if __name__ == "__main__":
    main()