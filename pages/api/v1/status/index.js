import database from "infra/database.js";
import { Connection } from "pg";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const postVers = await database.query('SELECT VERSION();');
  const maxConnect = await database.query('SHOW max_connections;');
  const peopleActivity = await database.query('SELECT count(*) FROM pg_stat_activity;');
  const bdVers = postVers.rows[0].version;
  const bdMax = maxConnect.rows[0].max_connections;
  const bdActivity = peopleActivity.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    bd_version: bdVers,
    max_connect: bdMax,
    bd_activity: bdActivity,
  });

  
}

export default status;
