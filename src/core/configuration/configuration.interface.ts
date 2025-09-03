export interface Configuration {
  node_env: string;

  jwt: {
    access_secret: string;
    refresh_secret: string;
  };

  database: {
    host: string;
    user: string;
    password: string;
    port: number;
    database: string;
    connectionLimit: number;
  };

  cookie: {
    domain: string;
    secure: boolean | undefined;
    same_site: string;
  };
}
