CREATE TABLE "Colleges" (
	"name"	                          TEXT,
	"location"                        TEXT,
  "campus_size"	                    NUMERIC,
	"accommodations"	                TEXT,
	"resources"	                      TEXT,
	PRIMARY KEY("name")
);

CREATE TABLE "Reviews" (
	"id"	                            INTEGER NOT NULL,
  "college_name"                    TEXT,
	"identities_list"                 TEXT,
  "race"	                          TEXT,
	"disability_identity"	            TEXT,
	"gender"	                        TEXT,
	"sexual_orientation"	            TEXT,
	"optin"	                          TEXT,
	"lgbtq_id"	                      TEXT,  -- Yes/No
	"lgbtq_safety"	                  INTEGER, -- chk
	"exclusionary"	                  TEXT,  -- Yes/No
	"friendly"	                      TEXT,  -- Yes/No
	"lgbtqRec"	                      TEXT,
	"accommodations_difficulty"	      INTEGER,
	"reliability_rating"	            INTEGER,
	"timeliness"	                    TEXT,
	"accommodation_rating"	          INTEGER, -- chk
	"mobility"	                      TEXT,  -- Yes/No
	"outside_rating"	                INTEGER, -- chk
	"inside_accessibility"	          INTEGER, -- chk
	"accessibility"	                  TEXT,
	"liberal_rating"	                INTEGER, -- chk
	"gender_inclusivity"	            TEXT,
	"diversity_rating"	              INTEGER,
	"tolerance_rating"	              INTEGER,
	"supportive_rating"	              INTEGER, -- chk
	"clubs_rating"	                  INTEGER,
	"overallAccess_rating"	          INTEGER, -- chk
	"overallIdentity_rating"	        INTEGER, -- chk
	"general_review"	                TEXT,
	"identity_review"	                TEXT,
	PRIMARY KEY("id"),
  FOREIGN KEY ("college_name") REFERENCES Colleges("name")
);