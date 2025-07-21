import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  
  development:{

    client: "sqlite3",
    
    connection:{

      filename: "./src/database/db.sqlite3"

    },

    migrations:{

      directory: "./src/database/migrations",

    },
    
    useNullAsDefault: true

  },

};

module.exports = config;
