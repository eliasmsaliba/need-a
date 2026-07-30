import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["customer", "provider"]);
export const providerStatus = pgEnum("provider_status", [
  "pending_verification",
  "active",
  "suspended",
]);
export const paymentMethod = pgEnum("payment_method", ["card", "eft"]);
export const otpPurpose = pgEnum("otp_purpose", ["verify_email"]);

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
