const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/employee/work-orders/page.tsx',
  'src/app/customer/settings/page.tsx',
  'src/app/customer/services/page.tsx',
  'src/app/customer/request-reading/page.tsx',
  'src/app/customer/payment/page.tsx',
  'src/app/customer/outage-schedule/page.tsx',
  'src/app/customer/notifications/page.tsx',
  'src/app/customer/new-connection/page.tsx',
  'src/app/customer/complaints/page.tsx',
  'src/app/customer/bills/page.tsx',
  'src/app/customer/bill-calculator/page.tsx',
  'src/app/customer/analytics/page.tsx'
];

// Add necessary imports
const sessionImport = "import { useSession } from 'next-auth/react';\n";
const hookLine = "  const { data: session } = useSession();\n";

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Add useSession import if not present
    if (!content.includes("from 'next-auth/react'")) {
      // Add after the first import React line
      content = content.replace(
        /import React[^;]*;/,
        (match) => match + '\n' + sessionImport
      );
    }

    // Add useSession hook if not present
    if (!content.includes('useSession()')) {
      // Add after the function declaration
      content = content.replace(
        /export default function \w+\(\) \{/,
        (match) => match + '\n' + hookLine
      );
    }

    // Replace hardcoded names
    content = content.replace(
      /userName="Huzaifa"/g,
      'userName={session?.user?.name || \'Customer\'}'
    );

    content = content.replace(
      /userName="John Smith"/g,
      'userName={session?.user?.name || \'Employee\'}'
    );

    // Also fix any hardcoded emails
    content = content.replace(
      /'john\.doe@example\.com'/g,
      'session?.user?.email || \'customer@example.com\''
    );

    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

console.log('All files have been updated!');


