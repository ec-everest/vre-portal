CREATE TABLE IF NOT EXISTS user_tokens ( 
    id              SERIAL                    UNIQUE,
    user_id         int4             NOT NULL,
    token           VARCHAR          NOT NULL,
    refresh_token   VARCHAR	     NOT NULL,
    ins_tms TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT "user_tokens_pkey" PRIMARY KEY (id),
    CONSTRAINT "user_tokens_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_user (id),
    CONSTRAINT "user_tokens_user_id_uniq" UNIQUE (user_id)
);
COMMENT ON TABLE  user_tokens               IS 'User-Token Table';
COMMENT ON COLUMN user_tokens.id            IS 'Row''s id';
COMMENT ON COLUMN user_tokens.user_id       IS 'User''s id';
COMMENT ON COLUMN user_tokens.token         IS 'Access Token';
COMMENT ON COLUMN user_tokens.refresh_token IS 'Refresh Token';
COMMENT ON COLUMN user_tokens.ins_tms       IS 'Insert Timestamp';

CREATE TABLE IF NOT EXISTS user_community ( 
    id             SERIAL          UNIQUE,
    user_id        INT4    NOT NULL,
    community_name VARCHAR NOT NULL,
    CONSTRAINT "user_community_pkey" PRIMARY KEY (id),
    CONSTRAINT "user_community_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_user (id),
    CONSTRAINT "user_community_user_id_uniq" UNIQUE (user_id)
);
COMMENT ON TABLE  user_community                IS 'User-Community Table';
COMMENT ON COLUMN user_community.id             IS 'Row''s id';
COMMENT ON COLUMN user_community.user_id        IS 'User''s id';
COMMENT ON COLUMN user_community.community_name IS 'Community''s Name';
