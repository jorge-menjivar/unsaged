# Backup

Before running the migrations, it is recommended to make a backup of the database. You can do so with the following command:

```sh
pg_dump --verbose --host=<supabase_url> --port=5432 --username=postgres --format=c --file <location_to_save_to>.sql -n auth -n extensions -n graphql -n graphql_public -n next_auth -n pgbouncer -n pgsodium -n pgsodium_masks -n public -n realtime -n "storage" -n vault postgres
```

To restore the database from the backup, you can use the following command:

```sh
pg_restore --verbose --host=<supabase_url> --port=5432 --username=postgres --clean --format=c --dbname=postgres <location_of_backup>.sql
```

When restoring the database, you will need to generate a new JWT secret. You can do this in the [Supabase dashboard](https://supabase.com/dashboard/project/_/settings/api). This means that you will also need to update the NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable in the .env.local file.

## Run Migrations

Run migrations with the following command:

```sh
supabase db push --debug
```
