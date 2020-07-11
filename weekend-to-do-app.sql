CREATE TABLE "tasks" (
    "id" SERIAL PRIMARY KEY,
    "task" varchar(120),
    "notes" varchar(240),
    "status" boolean
)