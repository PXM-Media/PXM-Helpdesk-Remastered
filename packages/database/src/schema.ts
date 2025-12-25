import { pgTable, text, timestamp, boolean, uuid, pgEnum, jsonb, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ----------------------------------------------------------------------
// Enums matching Zendesk
// ----------------------------------------------------------------------
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "AGENT", "END_USER"]);
export const ticketStatusEnum = pgEnum("ticket_status", ["NEW", "OPEN", "PENDING", "HOLD", "SOLVED", "CLOSED"]);
export const ticketPriorityEnum = pgEnum("ticket_priority", ["URGENT", "HIGH", "NORMAL", "LOW"]);
export const ticketTypeEnum = pgEnum("ticket_type", ["PROBLEM", "INCIDENT", "QUESTION", "TASK"]);
export const fieldTypeEnum = pgEnum("field_type", ["TEXT", "TEXTAREA", "DROPDOWN", "CHECKBOX", "DATE", "INTEGER", "DECIMAL"]);
export const commentChannelEnum = pgEnum("comment_channel", ["WEB", "EMAIL", "API", "CHAT"]);

// ----------------------------------------------------------------------
// Organizations (Tenants/Companies)
// ----------------------------------------------------------------------
export const organizations = pgTable("organizations", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    sharedTickets: boolean("shared_tickets").default(false), // Can users see each other's tickets?
    sharedComments: boolean("shared_comments").default(false),
    domainNames: text("domain_names").array(), // For auto-mapping users by email domain
    details: jsonb("details"), // Store arbitrary address info etc
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ----------------------------------------------------------------------
// Groups (Agent Teams)
// ----------------------------------------------------------------------
export const groups = pgTable("groups", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(), // e.g. "Support - Level 1"
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ----------------------------------------------------------------------
// Users (Agents & End Users)
// ----------------------------------------------------------------------
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    role: userRoleEnum("role").default("END_USER").notNull(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    defaultGroupId: uuid("default_group_id").references(() => groups.id), // For agents

    // Auth & Profile
    password: text("password"),
    image: text("image"),
    phone: text("phone"),
    timeZone: text("time_zone").default("UTC"),

    // Status
    active: boolean("active").default(true),
    verified: boolean("verified").default(false),
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ----------------------------------------------------------------------
// Ticket Fields (Custom Fields Definition)
// ----------------------------------------------------------------------
export const ticketFields = pgTable("ticket_fields", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(), // Display name for agents/users
    description: text("description"),
    type: fieldTypeEnum("type").notNull(),
    key: text("key").unique(), // API key for this field

    // Validation & Visibility
    requiredInPortal: boolean("required_in_portal").default(false),
    visibleInPortal: boolean("visible_in_portal").default(false),
    editableInPortal: boolean("editable_in_portal").default(false),
    systemField: boolean("system_field").default(false), // Is this a built-in field?

    options: jsonb("options"), // Array of options for Dropdowns
    position: integer("position").default(0), // Ordering
    active: boolean("active").default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ----------------------------------------------------------------------
// Tickets
// ----------------------------------------------------------------------
export const tickets = pgTable("tickets", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }), // T-1000 style sequential IDs
    subject: text("subject").notNull(),
    description: text("description"), // Initial problem description

    // Core Workflow
    status: ticketStatusEnum("status").default("NEW").notNull(),
    priority: ticketPriorityEnum("priority").default("NORMAL").notNull(),
    type: ticketTypeEnum("type").default("QUESTION"),

    // Assignment
    requesterId: uuid("requester_id").references(() => users.id).notNull(), // The Customer
    submitterId: uuid("submitter_id").references(() => users.id).notNull(), // Who actually created it (might be agent on behalf of customer)
    assigneeId: uuid("assignee_id").references(() => users.id), // The Agent
    groupId: uuid("group_id").references(() => groups.id), // The Team
    organizationId: uuid("organization_id").references(() => organizations.id),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ----------------------------------------------------------------------
// Ticket Field Values (Custom Field Data)
// ----------------------------------------------------------------------
export const ticketFieldValues = pgTable("ticket_field_values", {
    id: uuid("id").defaultRandom().primaryKey(),
    ticketId: integer("ticket_id").references(() => tickets.id).notNull(),
    fieldId: uuid("field_id").references(() => ticketFields.id).notNull(),
    value: text("value"), // Store as string, parse based on field type
});

// ----------------------------------------------------------------------
// Comments (Conversation Stream)
// ----------------------------------------------------------------------
export const comments = pgTable("comments", {
    id: uuid("id").defaultRandom().primaryKey(),
    ticketId: integer("ticket_id").references(() => tickets.id).notNull(),
    authorId: uuid("author_id").references(() => users.id).notNull(),

    body: text("body").notNull(),
    htmlBody: text("html_body"), // For rich text emails
    public: boolean("public").default(true).notNull(), // True = Public Reply, False = Internal Note
    channel: commentChannelEnum("channel").default("WEB").notNull(),

    attachments: jsonb("attachments"), // Array of file metadata
    metadata: jsonb("metadata"), // Email headers, etc

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ----------------------------------------------------------------------
// Relations (For convenient query API)
// ----------------------------------------------------------------------
export const organizationRelations = relations(organizations, ({ many }) => ({
    users: many(users),
    tickets: many(tickets),
}));

export const userRelations = relations(users, ({ one, many }) => ({
    organization: one(organizations, {
        fields: [users.organizationId],
        references: [organizations.id],
    }),
    requestedTickets: many(tickets, { relationName: "requester_tickets" }),
    assignedTickets: many(tickets, { relationName: "assignee_tickets" }),
}));

export const ticketRelations = relations(tickets, ({ one, many }) => ({
    requester: one(users, {
        fields: [tickets.requesterId],
        references: [users.id],
        relationName: "requester_tickets",
    }),
    assignee: one(users, {
        fields: [tickets.assigneeId],
        references: [users.id],
        relationName: "assignee_tickets",
    }),
    group: one(groups, {
        fields: [tickets.groupId],
        references: [groups.id],
    }),
    comments: many(comments),
    customValues: many(ticketFieldValues),
}));

export const commentRelations = relations(comments, ({ one }) => ({
    ticket: one(tickets, {
        fields: [comments.ticketId],
        references: [tickets.id],
    }),
    author: one(users, {
        fields: [comments.authorId],
        references: [users.id],
    }),
}));
