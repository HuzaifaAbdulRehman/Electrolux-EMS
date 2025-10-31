# Manual Changes Required for Admin Add Customer Form

File watchers are preventing automatic editing. Please make these changes manually to:
**File**: `src/app/admin/customers/page.tsx`

## Change 1: Update State Declaration (Lines 66-84)

**FIND:**
```typescript
const [newCustomer, setNewCustomer] = useState({
  applicantName: '',
  fatherName: '',
  email: '',
  phone: '',
  alternatePhone: '',
  idType: 'national_id' as 'passport' | 'drivers_license' | 'national_id' | 'voter_id' | 'aadhaar',
  idNumber: '',
  propertyType: 'Residential' as 'Residential' | 'Commercial' | 'Industrial' | 'Agricultural',
  connectionType: 'single-phase',
  loadRequired: '5',
  propertyAddress: '',
  city: '',
  state: '',
  zone: '',
  pincode: '',
  landmark: '',
  purposeOfConnection: 'domestic' as 'domestic' | 'business' | 'industrial' | 'agricultural'
});
```

**REPLACE WITH:**
```typescript
const [newCustomer, setNewCustomer] = useState({
  applicantName: '',
  fatherName: '',
  email: '',
  phone: '',
  alternatePhone: '',
  idType: 'national_id' as 'national_id',
  idNumber: '',
  propertyType: 'Residential' as 'Residential' | 'Commercial' | 'Industrial' | 'Agricultural',
  connectionType: 'single-phase',
  propertyAddress: '',
  city: '',
  state: '',
  zone: '',
  pincode: '',
  landmark: ''
});
```

## Change 2: Make Father's Name Optional (Line 806)

**FIND:**
```typescript
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Father's Name *</label>
<input
  type="text"
  required
  value={newCustomer.fatherName}
```

**REPLACE WITH:**
```typescript
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Father's Name</label>
<input
  type="text"
  value={newCustomer.fatherName}
```

Change placeholder from `"Father's full name"` to `"Father's full name (optional)"`

## Change 3: Remove ID Type Dropdown (Lines 860-874)

**DELETE ENTIRE DIV:**
```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID Type *</label>
  <select
    required
    value={newCustomer.idType}
    onChange={(e) => setNewCustomer({...newCustomer, idType: e.target.value as any})}
    className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
  >
    <option value="national_id">National ID</option>
    <option value="passport">Passport</option>
    <option value="drivers_license">Driver's License</option>
    <option value="voter_id">Voter ID</option>
    <option value="aadhaar">Aadhaar Card</option>
  </select>
</div>
```

## Change 4: Update ID Number to CNIC Only (Lines 876-897)

**FIND:**
```typescript
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID Number *</label>
  <input
    type="text"
    inputMode={newCustomer.idType === 'national_id' ? 'numeric' : 'text'}
    required
    value={newCustomer.idType === 'national_id' ? formatCNIC(newCustomer.idNumber) : newCustomer.idNumber}
    onChange={(e) => {
      if (newCustomer.idType === 'national_id') {
        const raw = onlyDigits(e.target.value).slice(0, 13);
        setNewCustomer({ ...newCustomer, idNumber: raw });
      } else {
        setNewCustomer({ ...newCustomer, idNumber: e.target.value });
      }
    }}
    className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder={newCustomer.idType === 'national_id' ? '42101-1234567-1 (13 digits)' : 'Enter ID number'}
  />
  {newCustomer.idType === 'national_id' && (
    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">CNIC must be 13 digits (formatted 5-7-1).</p>
  )}
</div>
```

**REPLACE WITH:**
```typescript
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">National ID (CNIC) *</label>
  <input
    type="text"
    inputMode="numeric"
    required
    value={formatCNIC(newCustomer.idNumber)}
    onChange={(e) => {
      const raw = onlyDigits(e.target.value).slice(0, 13);
      setNewCustomer({ ...newCustomer, idNumber: raw });
    }}
    className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="42101-1234567-1 (13 digits)"
  />
  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">CNIC must be 13 digits (formatted 5-7-1).</p>
</div>
```

## Change 5: Change Connection Type to Fixed Single-Phase (Lines 934-945)

**FIND:**
```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Connection Type *</label>
  <select
    required
    value={newCustomer.connectionType}
    onChange={(e) => setNewCustomer({...newCustomer, connectionType: e.target.value})}
    className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-800 dark:[&>option]:text-white"
  >
    <option value="single-phase">Single Phase</option>
    <option value="three-phase">Three Phase</option>
  </select>
</div>
```

**REPLACE WITH:**
```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Connection Type *</label>
  <div className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 cursor-not-allowed">
    Single Phase (Default)
  </div>
</div>
```

## Change 6: Delete Load Required Field (Lines 947-958)

**DELETE ENTIRE DIV:**
```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Load Required (kW) *</label>
  <input
    type="number"
    required
    min="1"
    value={newCustomer.loadRequired}
    onChange={(e) => setNewCustomer({...newCustomer, loadRequired: e.target.value})}
    className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="e.g., 5"
  />
</div>
```

## Change 7: Delete Purpose of Connection Field (Lines 960-969)

**DELETE ENTIRE DIV:**
```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Purpose of Connection</label>
  <input
    type="text"
    disabled
    value={newCustomer.purposeOfConnection}
    className="w-full px-3 py-2 border border-gray-300 dark:border-white/20 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 cursor-not-allowed"
    placeholder="Auto-set based on property type"
  />
</div>
```

## Change 8: Update Property Type onChange (Lines 910-924)

**FIND:**
```typescript
onChange={(e) => {
  const propertyType = e.target.value as any;
  // Auto-set purpose based on property type
  const purposeMap: Record<string, string> = {
    'Residential': 'domestic',
    'Commercial': 'business',
    'Industrial': 'industrial',
    'Agricultural': 'agricultural'
  };
  setNewCustomer({
    ...newCustomer,
    propertyType,
    purposeOfConnection: purposeMap[propertyType] as any
  });
}}
```

**REPLACE WITH:**
```typescript
onChange={(e) => {
  setNewCustomer({
    ...newCustomer,
    propertyType: e.target.value as any
  });
}}
```

## Change 9: Update Form Reset in handleAddCustomer (Lines 190-208)

**FIND:**
```typescript
setNewCustomer({
  applicantName: '',
  fatherName: '',
  email: '',
  phone: '',
  alternatePhone: '',
  idType: 'national_id' as 'passport' | 'drivers_license' | 'national_id' | 'voter_id' | 'aadhaar',
  idNumber: '',
  propertyType: 'Residential' as 'Residential' | 'Commercial' | 'Industrial' | 'Agricultural',
  connectionType: 'single-phase',
  loadRequired: '5',
  propertyAddress: '',
  city: '',
  state: '',
  zone: '',
  pincode: '',
  landmark: '',
  purposeOfConnection: 'domestic' as 'domestic' | 'business' | 'industrial' | 'agricultural'
});
```

**REPLACE WITH:**
```typescript
setNewCustomer({
  applicantName: '',
  fatherName: '',
  email: '',
  phone: '',
  alternatePhone: '',
  idType: 'national_id' as 'national_id',
  idNumber: '',
  propertyType: 'Residential' as 'Residential' | 'Commercial' | 'Industrial' | 'Agricultural',
  connectionType: 'single-phase',
  propertyAddress: '',
  city: '',
  state: '',
  zone: '',
  pincode: '',
  landmark: ''
});
```

## Testing

After making changes:
1. Save the file
2. Server will auto-reload (already running at http://localhost:3001)
3. Go to http://localhost:3001/admin/customers
4. Click "Add Customer" button
5. Verify:
   - Father Name is optional (no asterisk, no required validation)
   - Only CNIC input visible (no ID Type dropdown)
   - Connection Type shows "Single Phase (Default)" as disabled text
   - No Load Required field
   - No Purpose of Connection field
   - Form matches customer registration form

## Server Status

✅ Dev server is running at http://localhost:3001
⚠️ Jest worker warnings are non-critical (server still functional)
✅ /admin/customers page compiled successfully
