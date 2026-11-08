CREATE TABLE "railway_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"railway_project_id" text NOT NULL,
	"service_id" text NOT NULL,
	"environment_id" text NOT NULL,
	"last_deployment_id" text,
	"last_deploy_status" text,
	"last_deploy_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "railway_links_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
ALTER TABLE "railway_links" ADD CONSTRAINT "railway_links_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;