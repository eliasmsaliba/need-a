import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["customer", "provider", "admin"]);
export type UserRole = (typeof userRole.enumValues)[number];
export const providerStatus = pgEnum("provider_status", [
  "pending_verification",
  "active",
  "suspended",
]);
export type ProviderStatus = (typeof providerStatus.enumValues)[number];
export const customerStatus = pgEnum("customer_status", ["active", "suspended"]);
export const adminSubRole = pgEnum("admin_sub_role", ["ops", "support", "finance"]);
export const paymentMethod = pgEnum("payment_method", ["card", "eft"]);
export const otpPurpose = pgEnum("otp_purpose", ["verify_email"]);
export const bookingType = pgEnum("booking_type", ["fixnow", "schedule", "quotes"]);
export type BookingType = (typeof bookingType.enumValues)[number];
export const bookingStatus = pgEnum("booking_status", [
  "pending",
  "assigned",
  "en_route",
  "arrived",
  "working",
  "done",
  "cancelled",
]);
export type BookingStatus = (typeof bookingStatus.enumValues)[number];

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const customerProfiles = pgTable("customer_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull().default(""),
  phone: text("phone").notNull().default(""),
  payment: paymentMethod("payment").notNull().default("card"),
  cardLast4: text("card_last4"),
  notifSms: boolean("notif_sms").notNull().default(true),
  notifEmail: boolean("notif_email").notNull().default(true),
  notifPush: boolean("notif_push").notNull().default(false),
  status: customerStatus("status").notNull().default("active"),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  text: text("text").notNull(),
});

export const providerProfiles = pgTable("provider_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  bizName: text("biz_name").notNull().default(""),
  bizPhone: text("biz_phone").notNull().default(""),
  bizTradingName: text("biz_trading_name").notNull().default(""),
  selectedCategories: text("selected_categories")
    .array()
    .notNull()
    .default([]),
  serviceRadius: integer("service_radius").notNull().default(15),
  selectedDays: text("selected_days").array().notNull().default([]),
  startTime: text("start_time").notNull().default("08:00"),
  endTime: text("end_time").notNull().default("17:00"),
  hourlyRate: integer("hourly_rate").notNull().default(350),
  calloutFee: integer("callout_fee").notNull().default(150),
  bankName: text("bank_name").notNull().default(""),
  accountHolder: text("account_holder").notNull().default(""),
  accountNumber: text("account_number").notNull().default(""),
  branchCode: text("branch_code").notNull().default(""),
  status: providerStatus("status").notNull().default("pending_verification"),
  guaranteeDays: integer("guarantee_days").notNull().default(30),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  seq: integer("seq").generatedAlwaysAsIdentity(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  bookingType: bookingType("booking_type").notNull(),
  address: text("address").notNull(),
  location: text("location").notNull(),
  running: boolean("running").notNull(),
  emergency: boolean("emergency").notNull(),
  notes: text("notes").notNull().default(""),
  schedDate: text("sched_date"),
  schedTime: text("sched_time"),
  selectedProviderIds: text("selected_provider_ids").array().notNull().default([]),
  finalProviderId: uuid("final_provider_id").references(() => users.id),
  amount: integer("amount").notNull(),
  status: bookingStatus("status").notNull().default("pending"),
  arrivalPin: text("arrival_pin").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminProfiles = pgTable("admin_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  subRole: adminSubRole("sub_role").notNull().default("ops"),
});

export const otpCodes = pgTable("otp_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  codeHash: text("code_hash").notNull(),
  purpose: otpPurpose("purpose").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
