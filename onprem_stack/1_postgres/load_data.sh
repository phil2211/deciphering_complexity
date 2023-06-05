#!/bin/bash

# Generate customers_test_data.csv
python3 demodata_customers.py

# Generate contacts_test_data.csv
python3 demodata_contacts.py


# Load data into PostgreSQL
PGPASSWORD=<your_password> psql -h your_host -d your_database -U your_user <<EOF
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    lastName VARCHAR(255),
    firstName VARCHAR(255),
    profession VARCHAR(255),
    street VARCHAR(255),
    city VARCHAR(255),
    country VARCHAR(255)
);
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255),
    channel VARCHAR(255),
    value VARCHAR(255),
    customerId INTEGER,
    CONSTRAINT fk_customer
        FOREIGN KEY(customerId) 
        REFERENCES customers(id)
);
\copy customers(last+Name, firstName, birthdate, profession) FROM '/path/to/customers_test_data.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
\copy contacts(type, channel, value, customerId) FROM '/path/to/contacts_test_data.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
EOF
