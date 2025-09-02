import database from "infra/database.js";
import { Connection } from "pg";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const postVers = await database.query('SHOW server_version;');
  const maxConnect = await database.query('SHOW max_connections;');
  const databaseName = process.env.POSTGRES_DB;
  const peopleActivity = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  

  const bdVers = postVers.rows[0].server_version;
  const bdMax = maxConnect.rows[0].max_connections;
  const bdActivity = peopleActivity.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: bdVers,
        max_connection: parseInt(bdMax),
        activity: bdActivity,
      },
    },
  });

  
}

export default status;
