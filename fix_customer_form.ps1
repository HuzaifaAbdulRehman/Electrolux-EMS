# PowerShell script to update admin customers page

$filePath = "d:\Programming\Projects\electrolux_ems\src\app\admin\customers\page.tsx"

# Read the entire file
$content = Get-Content -Path $filePath -Raw

# 1. Update newCustomer state initialization - remove loadRequired and purposeOfConnection
$content = $content -replace "(?s)(const \[newCustomer, setNewCustomer\] = useState\(\{[^}]*?)idType: 'national_id' as 'passport' \| 'drivers_license' \| 'national_id' \| 'voter_id' \| 'aadhaar'", "`$1idType: 'national_id' as 'national_id'"

$content = $content -replace "(?s)(connectionType: 'single-phase',\s*)loadRequired: '5',(\s*propertyAddress)", "`$1`$2"

$content = $content -replace "(?s)(landmark: '',\s*)purposeOfConnection: 'domestic' as 'domestic' \| 'business' \| 'industrial' \| 'agricultural'(\s*\}\);)", "`$1`$2"

# 2. Make Father's Name optional (remove required attribute)
$content = $content -replace "(?s)(<label[^>]*?>Father's Name \*</label>\s*<input\s*type=""text""\s*)required", "`$1"

# 3. Remove ID Type dropdown - keep only National ID with CNIC formatting
$content = $content -replace "(?s)<div>\s*<label[^>]*?>ID Type \*</label>\s*<select[^>]*?>[^<]*<option value=""national_id"">National ID</option>[^<]*<option value=""passport"">Passport</option>[^<]*<option value=""drivers_license"">Driver's License</option>[^<]*<option value=""voter_id"">Voter ID</option>[^<]*<option value=""aadhaar"">Aadhaar Card</option>\s*</select>\s*</div>", ""

# 4. Update ID Number input to always use CNIC formatting (remove conditional)
$content = $content -replace "(?s)(<div className=""md:col-span-2"">\s*<label[^>]*?>ID Number \*</label>\s*<input\s*type=""text""\s*)inputMode=\{newCustomer\.idType === 'national_id' \? 'numeric' : 'text'\}", "`${1}inputMode=""numeric"""

$content = $content -replace "(?s)(value=\{)newCustomer\.idType === 'national_id' \? formatCNIC\(newCustomer\.idNumber\) : newCustomer\.idNumber(\})", "`${1}formatCNIC(newCustomer.idNumber)`$2"

$content = $content -replace "(?s)(onChange=\{\(e\) => \{\s*)if \(newCustomer\.idType === 'national_id'\) \{\s*const raw = onlyDigits\(e\.target\.value\)\.slice\(0, 13\);\s*setNewCustomer\(\{ \.\.\.newCustomer, idNumber: raw \}\);\s*\} else \{\s*setNewCustomer\(\{ \.\.\.newCustomer, idNumber: e\.target\.value \}\);\s*\}", "`${1}const raw = onlyDigits(e.target.value).slice(0, 13); setNewCustomer({ ...newCustomer, idNumber: raw });"

$content = $content -replace "(?s)(placeholder=\{)newCustomer\.idType === 'national_id' \? '42101-1234567-1 \(13 digits\)' : 'Enter ID number'(\})", "`${1}'42101-1234567-1 (13 digits)'`$2"

$content = $content -replace "(?s)\{newCustomer\.idType === 'national_id' && \(\s*<p className=""mt-1[^>]*?>[^<]*</p>\s*\)\}", "<p className=""mt-1 text-xs text-gray-600 dark:text-gray-400"">CNIC must be 13 digits (formatted 5-7-1).</p>"

# 5. Remove Connection Type dropdown - set to single-phase only
$content = $content -replace "(?s)<div>\s*<label[^>]*?>Connection Type \*</label>\s*<select\s*required\s*value=\{newCustomer\.connectionType\}[^>]*?>\s*<option value=""single-phase"">Single Phase</option>\s*<option value=""three-phase"">Three Phase</option>\s*</select>\s*</div>", "<div><label className=""block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"">Connection Type *</label><div className=""w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 cursor-not-allowed"">Single Phase (Default)</div><input type=""hidden"" name=""connectionType"" value=""single-phase"" /></div>"

# 6. Remove Load Required field
$content = $content -replace "(?s)<div>\s*<label[^>]*?>Load Required \(kW\) \*</label>\s*<input\s*type=""number""[^>]*?/>\s*</div>", ""

# 7. Remove Purpose of Connection field
$content = $content -replace "(?s)<div>\s*<label[^>]*?>Purpose of Connection</label>\s*<input\s*type=""text""\s*disabled[^>]*?/>\s*</div>", ""

# 8. Update handleAddCustomer form reset to match new state
$content = $content -replace "(?s)(setNewCustomer\(\{[^}]*?)idType: 'national_id' as 'passport' \| 'drivers_license' \| 'national_id' \| 'voter_id' \| 'aadhaar'", "`$1idType: 'national_id' as 'national_id'"

$content = $content -replace "(?s)(connectionType: 'single-phase',\s*)loadRequired: '5',(\s*propertyAddress: '')", "`$1`$2"

$content = $content -replace "(?s)(landmark: '',\s*)purposeOfConnection: 'domestic' as 'domestic' \| 'business' \| 'industrial' \| 'agricultural'(\s*\}\);)", "`$1`$2"

# 9. Update the property type onChange to remove purposeOfConnection logic
$content = $content -replace "(?s)(onChange=\{\(e\) => \{\s*const propertyType = e\.target\.value as any;\s*)// Auto-set purpose based on property type\s*const purposeMap: Record<string, string> = \{\s*'Residential': 'domestic',\s*'Commercial': 'business',\s*'Industrial': 'industrial',\s*'Agricultural': 'agricultural'\s*\};\s*(setNewCustomer\(\{\s*\.\.\.newCustomer,\s*propertyType),\s*purposeOfConnection: purposeMap\[propertyType\] as any", "`${1}`$2"

# Write the updated content back
$content | Set-Content -Path $filePath -NoNewline

Write-Host "File updated successfully!"
