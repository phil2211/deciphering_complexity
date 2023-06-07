#!/bin/bash
if ! command -v python3 &> /dev/null
then
    echo "python3 could not be found, please install it"
    exit
fi

if ! command -v psql &> /dev/null
then
    echo "psql could not be found, please install it"
    exit
fi

if [ $# -ne 2 ]; then
    echo "Usage: load_data.sh <username> <postgresql hostname>"
    exit 1
fi
USER=$1
HOST=$2


# Generate customers_test_data.csv
rm -f customers.csv
python3 demodata_customers.py

# Generate contacts_test_data.csv
rm -f contacts.csv
python3 demodata_contacts.py


# Load data into PostgreSQL
psql -h $HOST -U $USER -d postgres<<EOF
DROP DATABASE IF EXISTS mycustomers;
CREATE DATABASE mycustomers;

\connect mycustomers;

GRANT ALL PRIVILEGES ON DATABASE mycustomers TO $USER;

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
\copy customers(lastName, firstName, profession, street, city, country) FROM ${PWD}/customers.csv WITH (FORMAT csv, HEADER true, DELIMITER ',');
\copy contacts(type, channel, value, customerId) FROM ${PWD}/contacts.csv WITH (FORMAT csv, HEADER true, DELIMITER ',');
EOF