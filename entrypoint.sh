#!/bin/sh

# Check if a marker file exists to see if seeding was already done
if [ ! -f /usr/src/app/data/seeded.marker ]; then
  echo "First run: Seeding database..."
  node dist/server/config/seed-db.js
  node dist/server/config/seed-embeddings.js
  
  # Create the marker file so this never runs again
  touch /usr/src/app/data/seeded.marker
  echo "Seeding complete."
else
  echo "Database already seeded. Skipping."
fi

exec node dist/index.js