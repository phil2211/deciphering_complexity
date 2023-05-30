#!/bin/bash

# Generate customers_test_data.csv
python3 demodata_customers.py

# Generate contacts_test_data.csv
python3 demodata_contacts.py

# Generate account_test_data.csv
python3 demodata_accounts.py

# Load data into PostgreSQL
PGPASSWORD=<your_password> psql -h your_host -d your_database -U your_user <<EOF
\copy customers(last+Name, firstName, birthdate, profession) FROM '/path/to/customers_test_data.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
\copy contacts(type, channel, value, customerId) FROM '/path/to/contacts_test_data.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
\copy account(number, type, description, balance, customerId) FROM '/path/to/account_test_data.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
EOF
