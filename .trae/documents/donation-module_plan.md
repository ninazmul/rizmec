# Donation Module with PayStation Hosted Checkout — Implementation Plan

## 1. Repo Research Conclusion

### 1.1 Tech Stack & Architecture
- **Framework:** Next.js 16 App Router, TypeScript strict mode
- **Database:** Mongoose 9.x with MongoDB (connection pool: min 2 / max 20)
- **Auth:** Clerk for admin session, custom RBAC via MongoDB `User.permissions`
- **UI:** Tailwind CSS, Radix UI primitives, `lucide-react` icons, `react-hot-toast`
- **Forms:** Existing pattern uses controlled `useState` + `<Input>/<Label>/<Button>` from `@/components/ui/*` (Zod/RHF available in deps, not used in existing public forms yet)
- **Cache strategy:** Public routes use `export const revalidate = 120`; dashboard routes use `export const dynamic = "force-dynamic"`; server actions call `revalidatePath()` after mutation
- **HTTP client:** `axios` is available in `package.json`

### 1.2 Existing Files & Patterns Reused (Exact)

| Concern | Reference File | Pattern to Reuse |
|---|---|---|
| Model schema + I/F export | [contactMessage.model.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/lib/database/models/contactMessage.model.ts) | `export interface I... extends Document`, `Schema({...},{timestamps:true})`, `models.X \|\| model("X", Schema)` |
| Model registration | [lib/database/index.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/lib/database/index.ts#L1-L15) | Side-effect import of the new model |
| Index on a field | [project.model.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/lib/database/models/project.model.ts#L18) | `unique: true, index: true` and `Schema.index({...})` for compound |
| Server actions (public submit) | [contact.actions.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/lib/actions/contact.actions.ts#L10-L40) | `"use server"`, `connectToDatabase()`, try/catch, `{ success, data }`, `JSON.parse(JSON.stringify())`, `revalidatePath()` |
| Server actions (RBAC + paginated query) | [rbac.actions.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/lib/actions/rbac.actions.ts#L78-L120) | `requirePermission(module,action)`, `{page,limit,search}`, `skip=(page-1)*limit`, `Promise.all([find.skip.limit.lean, countDocuments])`, `safeJson()`, `totalPages = ceil(total/limit)` |
| Actions barrel export | [lib/actions/index.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/lib/actions/index.ts) | Add `export * from "./donation.actions"` |
| Dashboard server page | [dashboard/users/page.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/app/dashboard/users/page.tsx) | `force-dynamic`, `requirePermission()`, pass `{access, initialResult}` to Client |
| Dashboard client (search + pagination + table) | [UsersClient.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/app/dashboard/users/UsersClient.tsx) | `useSearchParams`/`pathname`/`router` for URL-driven search, `<Table>` from `@/components/ui/table`, Prev/Next pager with total label |
| Dashboard client (read/unread status + detail modal) | [ContactClient.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/app/dashboard/contact-messages/ContactClient.tsx) | `<Dialog>` for details, badge colors per status |
| Stats cards grid (Promise.all counts) | [dashboard/page.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/app/dashboard/page.tsx#L29-L118) | `Promise.all([countDocuments...])`, grid of card tiles with icons |
| Public page layout (hero + section) | [contact/page.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/app/(root)/contact/page.tsx) | Hero: `bg-primary text-white py-16`, content: `max-w-7xl mx-auto px-4 py-14` |
| Public form (controlled + toast) | [ContactForm.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/app/(root)/contact/ContactForm.tsx) | `useState` fields, submit calls server action, `toast.success/error`, reset form |
| Toaster placement (public) | [contact/page.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/app/(root)/contact/page.tsx#L19) | Import `<Toaster>` from `react-hot-toast` |
| Sidebar menu registration | [constants/permissions.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/constants/permissions.ts#L3-L64) | Add `donations` to `CMS_MODULES`, `MODULE_LABELS`, `MODULE_ROUTES` |
| Sidebar icon map | [AdminSidebar.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/app/dashboard/components/AdminSidebar.tsx#L20-L33) | Add icon entry for `"donations"` (e.g. `HeartHandshake` or `Coins`) |
| Header "Donate Now" link | [Header.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/components/shared/Header.tsx#L61-L67) | Change button href from `/volunteer-career` to `/donation` |
| Dashboard layout | [dashboard/layout.tsx](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/app/dashboard/layout.tsx) | No changes; layout hosts module pages |
| Helpers | [lib/utils.ts](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/lib/utils.ts#L85-L106) | `handleError`, `safeJson`, `formatCount`, `cn` |
| Permission checks in client | [use-permissions hook + rbac-rules](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/lib/auth/rbac-rules.ts) | `usePermissions(access)` then `hasPermission("donations","read")` |
| ENV vars | [.env.local](file:///Users/n.i.nazmul/Documents/Working%20Files/Landing%20Page/rizmec/.env.local) | Add 3 new vars; `NEXT_PUBLIC_SERVER_URL` already exists |

### 1.3 Inferred Conventions (to obey strictly)
- All `return` payloads from actions: `{ success: boolean; data?: T; error?: string }`
- `.lean()` + `safeJson()` for all dashboard-reads to avoid Mongoose doc bloat
- Field projection: never fetch `gatewayResponse` in list queries; only in detail query
- Search uses case-insensitive `new RegExp(search, "i")` in `$or` array
- All mutations use `revalidatePath("/dashboard/donations")`
- Toast: `react-hot-toast` (not shadcn `toaster`)
- Status badges: inline `<span className="text-xs px-2.5 py-1 rounded-full ... font-bold">`
- No comments in generated code

---

## 2. Files & Modules to Create or Modify

### CREATE (13 new files + 1 new folder)

```
lib/database/models/donation.model.ts
lib/services/paystation.service.ts
lib/actions/donation.actions.ts

app/(root)/donation/page.tsx
app/(root)/donation/DonationForm.tsx
app/(root)/donation/success/page.tsx
app/(root)/donation/failed/page.tsx

app/api/payment/callback/route.ts

app/dashboard/donations/page.tsx
app/dashboard/donations/DonationsClient.tsx
app/dashboard/donations/[id]/page.tsx
app/dashboard/donations/[id]/DonationDetailClient.tsx
```

### MODIFY (5 existing files)

```
lib/database/index.ts                   — import donation.model.ts
lib/actions/index.ts                    — export * from "./donation.actions"
constants/permissions.ts                — add "donations" module + label + route
app/dashboard/components/AdminSidebar.tsx — add icon to iconMap
components/shared/Header.tsx            — "Donate Now" href → /donation
```

### ENV ADDITIONS (to `.env.local`)

```
PAYSTATION_MERCHANT_ID=
PAYSTATION_PASSWORD=
PAYSTATION_BASE_URL=https://api.paystation.com.bd
```
(Note: `NEXT_PUBLIC_SERVER_URL` is already present.)

---

## 3. Step-by-Step Modification Plan

### Phase A — Data Layer

#### A1. Donation Model (`lib/database/models/donation.model.ts`)
- **Interface `IDonation extends Document`** with all required fields + `Types.ObjectId`.
- **Status enum** (TS + Mongoose): `pending | processing | success | failed | cancelled | refund`; default `pending`.
- **Fields:**
  - `invoiceNumber: String` — required, unique, index
  - `donorName`, `donorPhone`, `donorEmail` — strings (phone indexed)
  - `amount: Number` — required
  - `message: String` — default `""`
  - `status` — enum, indexed
  - `transactionId: String` — index (sparse to allow nulls for pending)
  - `paymentMethod: String` — e.g. `"bKash"`, `"Nagad"`
  - `reference: String`
  - `gatewayResponse: Schema.Types.Mixed` (or `Object`) — **never projected in lists**
  - `timestamps: true` → `createdAt` (indexed), `updatedAt`
- **Indexes:**
  ```ts
  DonationSchema.index({ invoiceNumber: 1 }, { unique: true });
  DonationSchema.index({ status: 1 });
  DonationSchema.index({ createdAt: -1 });
  DonationSchema.index({ transactionId: 1 }, { sparse: true });
  DonationSchema.index({ donorPhone: 1 });
  DonationSchema.index({ status: 1, createdAt: -1 }); // for status-filtered sorted list
  DonationSchema.index({ donorEmail: 1 }); // implied useful for search
  ```
- **Export:** `models.Donation || model("Donation", DonationSchema)`

#### A2. Register Model (`lib/database/index.ts`)
- Add line: `import "./models/donation.model";` after the last existing model import.

---

### Phase B — PayStation Service (server-only)

#### B1. `lib/services/paystation.service.ts`
Pure server-side helper; **no `"use client"` import ever**. All functions throw or return typed results.

Functions:

1. **`generateInvoiceNumber(): string`**
   - Format: `DON-YYYYMMDD-<6 alphanumeric>`
   - Date part via `new Date()` (`Asia/Dhaka` consideration — use `toISOString().slice(0,10).replace(/-/g,"")` to keep deterministic in UTC, or rely on server time).
   - Random: `crypto.randomBytes(3).toString("hex").toUpperCase()` → exactly 6 chars.

2. **`initiatePayment(payload)` → `{ payment_url, status_code, ...raw }`**
   - `POST <PAYSTATION_BASE_URL>/initiate-payment` (axios)
   - Form fields per docs: `merchantId`, `password`, `invoice_number`, `currency="BDT"`, `payment_amount`, `cust_name`, `cust_phone`, `cust_email`, `callback_url`, `reference="Donation"`, `pay_with_charge` (optional, default `undefined`).
   - `callback_url` = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payment/callback`
   - Validate env vars upfront and throw if missing (safe: runs only in server).
   - Return full axios data object; throw on non-200 network.

3. **`verifyTransactionByInvoice(invoiceNumber)` → PayStationTransactionResponse**
   - `POST <PAYSTATION_BASE_URL>/transaction-status`
   - **Headers:** `{ merchantId: PAYSTATION_MERCHANT_ID }`
   - **Body:** `{ invoice_number: invoiceNumber }`
   - Return full data; throw on network failure.

4. **`verifyTransactionByTrxId(trxId)` → PayStationTransactionResponse** (secondary)
   - `POST <PAYSTATION_BASE_URL>/v2/transaction-status`
   - **Headers:** `{ merchantId, "Content-Type": "application/json" }`
   - **Body:** `{ trxId }`

Types inside file:
```ts
export type PayStationInitiateResponse = {
  status_code: string;
  status: string;
  message: string;
  payment_amount?: string;
  invoice_number?: string;
  payment_url?: string;
};
export type PayStationTxnData = {
  invoice_number: string;
  trx_status: "Success" | "Failed" | string;
  trx_id: string;
  payment_amount: string;
  payer_mobile_no?: string;
  payment_method?: string;
  reference?: string;
};
export type PayStationVerifyResponse = {
  status_code: string;
  status: string;
  message: string;
  data?: PayStationTxnData;
};
```

---

### Phase C — Server Actions

#### C1. `lib/actions/donation.actions.ts` — `"use server"`
Import: `connectToDatabase`, `requirePermission`, `Donation` model, `safeJson`, `handleError`, `revalidatePath`, plus PayStation service + invoice generator.

Actions:

1. **`createDonation(params)` — PUBLIC (no RBAC)**
   - Params: `{ donorName, donorPhone, donorEmail, amount: number, message? }`
   - Validate: min amount `>= 20`, required fields present, `isFinite(amount)`.
   - Loop (retry up to 3 times):
     - Generate invoice.
     - Attempt `Donation.create({ status:"pending", invoiceNumber, ... })` with `unique: true`.
     - If duplicate key → retry.
   - Return `{ success:true, data: safeJson(newDonation) }` or error.

2. **`initiateDonationPayment(params)` — PUBLIC**
   - Params: `{ donorName, donorPhone, donorEmail, amount, message? }`
   - Step 1: Call `createDonation` logic inline (or reuse; prefer reuse) → get saved donation.
   - Step 2: Call `paystation.initiatePayment(...)`.
   - Step 3: If PayStation `status_code !== "200" || status !== "success"`:
       - Update donation `status = "failed"`, push `gatewayResponse`.
       - Return `{ success:false, error: message }`.
   - Step 4: If success → update donation `status = "processing"` (to track that checkout was initiated), store partial gateway response.
   - **Return:** `{ success:true, data: { payment_url, donationId, invoiceNumber } }`

3. **`verifyDonationPayment(params)` — used by callback route (server context), NOT exported to actions barrel as public client call**
   - Mark as `export async function` but with a design note that the API route calls it.
   - Params: `{ invoiceNumber, trxId? }`
   - 1. Load Donation by invoice. If missing → `{ verified:false, reason:"not_found" }`
   - 2. Call `verifyTransactionByInvoice(invoiceNumber)`.
   - 3. Success check: `response.status_code === "200" && response.data?.trx_status?.toLowerCase() === "success"`
   - 4. If success → update:
       - `status = "success"`
       - `transactionId = data.trx_id`
       - `paymentMethod = data.payment_method`
       - `reference = data.reference || reference`
       - `gatewayResponse = { verify: fullResponse, ...existing }`
   - 5. If NOT success (trx_status failed / canceled) →
       - Update `status` accordingly: map `trx_status` → `failed` / `cancelled`
       - Store gateway response
   - 6. Optional secondary verify with `trxId` if primary returned ambiguous result.
   - Return: `{ verified: boolean, donation, raw }`

4. **`getDonations(params)` — RBAC `donations:read`**
   - Params: `{ page?, limit?, search?, status? }`
   - Defaults: `page=1, limit=20`
   - Build `query: any = {}`
     - If `status` → `{ status }`
     - If `search` → `$or: [ {invoiceNumber: RegExp i}, {donorPhone: RegExp i}, {donorEmail: RegExp i}, {transactionId: RegExp i} ]`
   - Projection: `.select("-gatewayResponse")` — NEVER leak gateway payload in list
   - Sort: `{ createdAt: -1 }`
   - `Promise.all([ find.sort.skip.limit.lean(), countDocuments(query) ])`
   - Return shape (matches users pagination):
     ```ts
     {
       donations: safeJson(list),
       totalCount, totalPages, currentPage: page
     }
     ```

5. **`getDonation(id)` — RBAC `donations:read`**
   - Find by id (or by invoiceNumber — accept `{ id }: {id:string}` and try ObjectId first else fall back to `invoiceNumber` lookup).
   - **Include** `gatewayResponse` here (admin only).
   - Return `{ success, data }`.

6. **`getDonationStatistics()` — RBAC `donations:read`**
   - **Single aggregation pipeline** to return all metrics in 1 DB round trip:
     ```
     [
       { $facet: {
           today:    [{$match: {createdAt:{$gte:startOfDay}, status:"success"}}, {$count:"n"}],
           month:    [{$match: {createdAt:{$gte:startOfMonth}, status:"success"}}, {$count:"n"}],
           totalAmt: [{$match:{status:"success"}}, {$group:{_id:null, sum:{$sum:"$amount"}, count:{$sum:1}}}],
           pending:  [{$match:{status:"pending"}}, {$count:"n"}],
           failed:   [{$match:{status:"failed"}}, {$count:"n"}],
           refund:   [{$match:{status:"refund"}}, {$count:"n"}],
           success:  [{$match:{status:"success"}}, {$count:"n"}],
       }}
     ]
     ```
   - Plus:
     - `todayDonations: today[0]?.n || 0`
     - `monthlyDonations: month[0]?.n || 0`
     - `totalDonationsCount: totalAmt[0]?.count || 0`
     - `totalDonationsAmount: totalAmt[0]?.sum || 0`
     - `successfulDonations: success[0]?.n || 0`
     - `pendingDonations: pending[0]?.n || 0`
     - `failedDonations: failed[0]?.n || 0`
     - `refundedDonations: refund[0]?.n || 0`
   - Date ranges use Asia/Dhaka offset applied to `new Date()` (or UTC if server is configured consistently; use simple `new Date(new Date().setHours(0,0,0,0))` for today start).

7. **`deleteDonation(id)` — RBAC `donations:delete`**
   - `findByIdAndDelete(id)`
   - `revalidatePath("/dashboard/donations")`
   - Return `{ success:true }`

#### C2. Barrel (`lib/actions/index.ts`)
- Append section:
  ```
  // Donations
  export * from "@/lib/actions/donation.actions";
  ```

---

### Phase D — Permissions & Navigation

#### D1. `constants/permissions.ts`
- Add `"donations"` to the end of `CMS_MODULES` `as const` tuple.
- Add to `MODULE_LABELS`: `donations: "Donations"`.
- Add to `MODULE_ROUTES`: `donations: "/dashboard/donations"`.

#### D2. `app/dashboard/components/AdminSidebar.tsx`
- Import an icon (e.g. `Coins` or `HeartHandshake` from lucide).
- Extend iconMap type via key `"donations"`: `donations: Coins`.

#### D3. `components/shared/Header.tsx`
- Change the "Donate Now" CTA href from `/volunteer-career` → `/donation`.
- (Optional: add `/donation` entry to the `menuItems` array near "Volunteer & Career" if desired; this plan doesn't add it unless approved.)

---

### Phase E — Public Donation Pages

#### E1. `app/(root)/donation/page.tsx`
- `export const revalidate = 120;`
- `metadata: Metadata` with title/description.
- Hero section: `bg-primary text-white py-16`, heading "Make a Donation", subheading, decorative image using `/public/assets/images/donation.jpeg` (already present in repo) using a background div or inline `<img>`.
- Layout: `max-w-7xl mx-auto px-4 py-14` grid `1 / lg:3` — description column (2 sections) + form column.
- **Sections (right-to-left or stacked on mobile):**
  - Left (lg:col-span-1):
    - Donation Description — card with body text about mission.
    - Trust/Security Notice — lock/shield icon, "Secure payment via PayStation", "256-bit SSL", "Your information is encrypted".
    - Donation Information — bank details not required (PayStation handles it); instead: "We accept bKash, Nagad, Rocket, Visa, MasterCard, etc." use image `/public/assets/images/gateway.png` (already present).
  - Right (lg:col-span-2):
    - `<DonationForm />`
- Import and render `<Toaster />`.

#### E2. `app/(root)/donation/DonationForm.tsx` — `"use client"`
- Follow `ContactForm.tsx` exactly: `useState` per field, `loading` state.
- Fields:
  - Full Name * — `<Input>`
  - Phone * — `<Input>` (tel)
  - Email * — `<Input type="email">`
  - Amount * — `<Input type="number" min={20}>`
  - Quick-amount chips (UI only, setAmount 500/1000/2000/5000/10000) — optional UX, no backend effect.
  - Message (optional) — `<Textarea rows={4}>`
- Submit handler:
  1. Validate required fields: name, phone, email, amount required; `Number(amount) >= 20`.
  2. `setLoading(true)`
  3. Call `initiateDonationPayment({ donorName:name, donorPhone:phone, donorEmail:email, amount:Number(amount), message })`.
  4. On `res.success && res.data.payment_url`:
     - Client-side redirect: `window.location.href = res.data.payment_url`.
  5. On failure → `toast.error(res.error || "Failed to initiate payment")`, stop loading.
- `<Button>` label: "Proceed to Secure Payment 🔒" or "Donate Now" with Heart icon.

#### E3. Success page: `app/(root)/donation/success/page.tsx`
- Accept `searchParams: { invoice?: string }` (donation page URL can pass invoice when redirecting).
- Call `getDonationByInvoice` via a newly created small public action (or reuse `getDonation` but NOT require RBAC).
  - **Design:** Add a 8th public server action `getPublicDonationByInvoice(invoice)` that returns projection without gatewayResponse and does not require RBAC.
- If not found OR not `success` → show "We are verifying your donation. Please check back in a few minutes." skeleton.
- If verified → display grid/table of:
  - Thank you hero (green/primary panel with check icon)
  - Invoice Number
  - Donation Amount (৳)
  - Transaction ID
  - Payment Method
  - Date (BD locale)
  - Status badge success
- CTA buttons: "Return Home" → `/`, "Download Receipt" (optional, out of scope — disabled or omitted).
- `export const dynamic = "force-dynamic";` (no ISR to ensure real-time verification status).

#### E4. Failed page: `app/(root)/donation/failed/page.tsx`
- Similar layout. Red/error theme.
- Copy: "Your payment could not be completed."
- CTAs:
  - "Retry Donation" → href `/donation`
  - "Return Home" → href `/`
- Optional display of invoice if available in query.

---

### Phase F — Callback Route

#### F1. `app/api/payment/callback/route.ts`
- Exports `GET` handler (PayStation does GET redirect).
- Read from `request.nextUrl.searchParams`: `status`, `invoice_number`, `trx_id`.
- Steps:
  1. Sanity check: `invoice_number` present (else 400).
  2. Call `verifyDonationPayment({ invoiceNumber: invoice_number, trxId: trx_id })`.
  3. If result donation final `status === "success"` → `redirect(BASE + /donation/success?invoice=...)`.
  4. Else → `redirect(BASE + /donation/failed?invoice=...)`.
  5. `revalidatePath("/dashboard/donations")` + `/dashboard` (to update stats).
- Security notes:
  - Never trust URL `status` alone. Always call PayStation Transaction Status API first. That is done inside `verifyDonationPayment` (Phase C).
  - Idempotent: if already verified, just re-redirect to success (don't re-apply changes or throw).
- Error fallback: catch → redirect to `/donation/failed`.

---

### Phase G — Dashboard Integration

#### G1. Dashboard Donations List: `app/dashboard/donations/page.tsx`
- `export const dynamic = "force-dynamic";`
- `requirePermission("donations","read")` → `access`.
- Call `getDonationStatistics()` and `getDonations({page:1,limit:20})` in parallel.
- Pass `initialDonations`, `initialStats`, `access` to Client.

#### G2. Client list: `app/dashboard/donations/DonationsClient.tsx` — `"use client"`
Matches `UsersClient.tsx` structure.

Key elements:
1. **Stats cards (top):** 7 tiles using Card UI or the light tile style from dashboard home:
   - Today's Donations (count or amount? both → label amounts)
   - Monthly (same)
   - Total Donations (amount + count sub)
   - Successful / Pending / Failed / Refunded
2. **Filters row:**
   - Search `<Input>` with `Search` icon left, placeholder "Search by Invoice, Phone, Email, or Txn ID".
   - Status filter `<Select>` options: All, Pending, Processing, Success, Failed, Cancelled, Refund.
   - URL-driven using `useSearchParams` + `router.replace` (`page`, `search`, `status`).
3. **Table** (`@/components/ui/table`):
   - Columns: Invoice #, Donor Name, Phone, Email, Amount (৳), Status, Date, Actions.
   - Status badges color-coded:
     - pending → amber, processing → blue, success → green, failed → red, cancelled → gray, refund → purple.
   - Empty state with dashed border text.
4. **Pagination** (footer of table container, same as UsersClient):
   - `Page X of Y (Z donations)`, Prev/Next buttons.
5. **Reload hook `reload(page, search, status)`** calls `getDonations` again and sets state.
6. **Actions column:**
   - Eye button → `router.push(/dashboard/donations/${_id})`.
   - Trash button → `deleteDonation(id)` with confirm, toast, reload. Requires `hasPermission("donations","delete")`.

#### G3. Dashboard Donation Detail: `app/dashboard/donations/[id]/page.tsx`
- Server component; `force-dynamic`.
- `requirePermission("donations","read")`.
- `getDonation(params.id)`.
- Pass to `DonationDetailClient({ donation, access })`.

#### G4. `app/dashboard/donations/[id]/DonationDetailClient.tsx` — `"use client"`
- Mirrors detail dialog in ContactClient, but as its own page (breadcrumbs back to list).
- Two columns:
  - Left: Donor info (name/phone/email/message)
  - Right: Payment info (invoice, txn ID, method, amount, status, dates)
- Collapsible `<details>` or `<Tabs>` for "Raw Gateway Response" (formatted JSON via `<pre>`).
- Optional admin manual action: "Mark as Refunded" (mutation + revalidate) — implement a small action `updateDonationStatus(id,status)` if desired (add to actions list if scope expanded).

---

## 4. Dependencies & Considerations

- **`axios` already present** → use it for PayStation calls.
- **No new packages required.**
- ENV variables: user must set `PAYSTATION_MERCHANT_ID` and `PAYSTATION_PASSWORD`; `PAYSTATION_BASE_URL` has default.
- `NEXT_PUBLIC_SERVER_URL` already present and MUST match the production host exactly so PayStation's callback resolves (no trailing slash; use `.replace(/\/$/, "")` in code defensively).
- **Timezone:** Statistics and invoice date stamp use a consistent date source; if needed apply Dhaka UTC+6 offsets (the current codebase uses `toLocaleString("en-US", { timeZone: "Asia/Dhaka" })` in `formatDateTime`). Use start-of-day in Asia/Dhaka for "Today" facet via:
  ```ts
  const now = new Date();
  const startOfDayDhaka = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
  startOfDayDhaka.setHours(0,0,0,0);
  ```
- **Duplicate invoice safety:** Because invoice has DB `unique` index, duplicate PayStation "Duplicate invoice number" (code 1008) is handled by retry in `createDonation`.
- **Idempotent verification:** In `verifyDonationPayment`, use a guard so donations already in a final state (`success`/`failed`/`cancelled`/`refund`) only update if the new result contradicts and is authoritative (e.g., a pending can become success, but a success never becomes failed).
- **Logging:** Keep `console.error` for payment failures (matches the project). No Sentry/Pino added.

---

## 5. Risk Handling

| Risk | Mitigation |
|---|---|
| PayStation callback never hits (user closes tab) | Donation remains `processing`/`pending`; dashboard shows status honestly. Optional future: a cron/UI "Re-verify" button (NOT in current scope; code leaves status as is). |
| Duplicate callback replay | DB invoice unique + final-state guard in `verifyDonationPayment` prevents double-credit. |
| ENV missing in production | PayStation service **throws readable errors** at initiate-time; submit handler surfaces via toast to admin logs / browser error. |
| Malformed PayStation responses | All PayStation response reads use optional chaining and strict string equality (`=== "200"`); never trust partial objects. |
| Large dataset performance | Indexes cover every query path; aggregation uses single `$facet`; list queries `.select("-gatewayResponse")` + `.lean()`; pagination uses `skip/limit` which is fine for typical millions-of-rows scales (when scaling further, cursor-based pagination is a known upgrade but exceeds current scope). |
| Accidental dashboard exposure | All `getDonations`/`getDonation`/`statistics`/`delete` enforce `requirePermission("donations", <action>)`. |
| GatewayResponse leaking to list view | `.select("-gatewayResponse")` explicitly excludes it. |
| Cross-origin navigation to PayStation | Client uses `window.location.href = payment_url` (not fetch), so 3-D Secure flows work. |
| Callback validation timing | If PayStation status API returns "processing" (rare), we leave donation in `processing` and user lands on `/donation/success?invoice=...` which displays "verifying your donation" message per spec. |

---

## 6. File Creation Order (for execution phase)

1. `lib/database/models/donation.model.ts`
2. `lib/database/index.ts` (modify: register model)
3. `lib/services/paystation.service.ts`
4. `lib/actions/donation.actions.ts`
5. `lib/actions/index.ts` (modify: barrel)
6. `constants/permissions.ts` (modify: add module)
7. `app/dashboard/components/AdminSidebar.tsx` (modify: icon)
8. `components/shared/Header.tsx` (modify: donate CTA)
9. `app/api/payment/callback/route.ts`
10. `app/(root)/donation/DonationForm.tsx`
11. `app/(root)/donation/page.tsx`
12. `app/(root)/donation/success/page.tsx`
13. `app/(root)/donation/failed/page.tsx`
14. `app/dashboard/donations/page.tsx`
15. `app/dashboard/donations/DonationsClient.tsx`
16. `app/dashboard/donations/[id]/page.tsx`
17. `app/dashboard/donations/[id]/DonationDetailClient.tsx`
18. Update `.env.local` (manual) + docs note.
