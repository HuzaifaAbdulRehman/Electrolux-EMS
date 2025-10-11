#!/usr/bin/env python3
"""
Comprehensive script to fix ALL remaining theme issues across the entire application.
This will ensure proper light/dark mode support for every element.
"""

import os
import re
from pathlib import Path

# Comprehensive replacement patterns for fixing theme issues
replacements = [
    # Fix text colors without dark: prefix (most important)
    (r'(?<!")text-white(?!")', 'text-gray-900 dark:text-white'),
    (r'(?<!")text-gray-400(?!")', 'text-gray-600 dark:text-gray-400'),
    (r'(?<!")text-gray-300(?!")', 'text-gray-700 dark:text-gray-300'),
    (r'(?<!")text-gray-500(?!")', 'text-gray-600 dark:text-gray-500'),

    # Fix background colors
    (r'(?<!")bg-white/5(?!")', 'bg-white dark:bg-white/5'),
    (r'(?<!")bg-white/10(?!")', 'bg-gray-50 dark:bg-white/10'),
    (r'(?<!")bg-black/20(?!")', 'bg-white dark:bg-black/20'),
    (r'(?<!")bg-black/80(?!")', 'bg-white dark:bg-black/80'),

    # Fix borders
    (r'(?<!")border-white/10(?!")', 'border-gray-200 dark:border-white/10'),
    (r'(?<!")border-white/20(?!")', 'border-gray-300 dark:border-white/20'),

    # Fix hover states
    (r'(?<!")hover:bg-white/10(?!")', 'hover:bg-gray-100 dark:hover:bg-white/10'),
    (r'(?<!")hover:bg-white/20(?!")', 'hover:bg-gray-200 dark:hover:bg-white/20'),
    (r'(?<!")hover:text-white(?!")', 'hover:text-gray-900 dark:hover:text-white'),

    # Fix placeholders
    (r'(?<!")placeholder-gray-400(?!")', 'placeholder-gray-500 dark:placeholder-gray-400'),

    # Fix duplicate dark: prefixes that may have been created
    (r'dark:dark:', 'dark:'),
    (r'text-gray-900 dark:text-gray-900 dark:text-white', 'text-gray-900 dark:text-white'),
    (r'text-gray-600 dark:text-gray-600 dark:text-gray-400', 'text-gray-600 dark:text-gray-400'),
    (r'bg-white dark:bg-white dark:bg-white/5', 'bg-white dark:bg-white/5'),
    (r'border-gray-200 dark:border-gray-200 dark:border-white/10', 'border-gray-200 dark:border-white/10'),
]

# Get all TypeScript/React files in the project
def get_all_tsx_files():
    files = []
    for root, dirs, filenames in os.walk('src'):
        # Skip node_modules and other unnecessary directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.next', 'dist']]
        for filename in filenames:
            if filename.endswith('.tsx'):
                files.append(os.path.join(root, filename))
    return files

def fix_file(filepath):
    """Fix theme issues in a single file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Skip if file already has proper dark mode classes everywhere
        if 'dark:text-white' in content and 'dark:bg-white/5' in content:
            # Apply selective fixes only
            for pattern, replacement in replacements[-6:]:  # Only apply cleanup patterns
                content = re.sub(pattern, replacement, content)
        else:
            # Apply all replacements
            for pattern, replacement in replacements:
                content = re.sub(pattern, replacement, content)

        # Special fixes for specific patterns
        # Fix cases where text-white is used for buttons (should stay white)
        content = re.sub(
            r'(bg-gradient-to-r.*?)text-gray-900 dark:text-white',
            r'\1text-white',
            content
        )

        # Fix icon colors in gradient backgrounds (should stay white)
        content = re.sub(
            r'(<.*?className="w-\d+ h-\d+) text-gray-900 dark:text-white(".*?/>)',
            r'\1 text-white\2',
            content,
            flags=re.IGNORECASE
        )

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
    files = get_all_tsx_files()
    fixed_files = []
    skipped_files = []
    error_files = []

    print(f"Found {len(files)} TSX files to check...")
    print("-" * 50)

    for filepath in files:
        try:
            if fix_file(filepath):
                fixed_files.append(filepath)
                print(f"[FIXED] {filepath}")
            else:
                skipped_files.append(filepath)
                # Don't print skipped files to reduce output
        except Exception as e:
            error_files.append(filepath)
            print(f"[ERROR] {filepath}: {e}")

    print("-" * 50)
    print(f"\nSummary:")
    print(f"  Fixed: {len(fixed_files)} files")
    print(f"  Skipped: {len(skipped_files)} files (no changes needed)")
    print(f"  Errors: {len(error_files)} files")

    if fixed_files:
        print(f"\nFixed files:")
        for f in fixed_files:
            print(f"  - {f}")

if __name__ == "__main__":
    main()