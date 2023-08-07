import psycopg2
from faker import Faker
import random

# Initialize Faker
fake = Faker()
professions = ['Engineer', 'Doctor', 'Teacher', 'Artist', 'Designer', 'Developer']
types = ['personal', 'work']
channels = ['email', 'phone']


# Connect to the PostgreSQL database
conn = psycopg2.connect(
    dbname="mycustomers",
    user="postgres",
    password="example",
    host="db"
)
cur = conn.cursor()

# Drop tables
cur.execute("""
    DROP TABLE IF EXISTS contacts;
    DROP TABLE IF EXISTS customers;
""")

# Create tables
cur.execute("""
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    lastName VARCHAR(255),
    firstName VARCHAR(255),
    profession VARCHAR(255),
    street VARCHAR(255),
    city VARCHAR(255),
    country VARCHAR(255)
);
""")
cur.execute("""
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
""")

# Generate and insert fake data
for _ in range(10000):  # Generate 10000 rows of fake data
    # Insert fake data into customers
    cur.execute("""
        INSERT INTO customers (lastName, firstName, profession, street, city, country)
        VALUES (%s, %s, %s, %s, %s, %s);
    """, (fake.last_name(), fake.first_name(), random.choice(professions), fake.street_address(), fake.city(), fake.country()))

for _ in range(30000): # Generate 30000 rows of fake data
    # Insert fake data into contacts
    type = random.choice(types)
    channel = random.choice(channels)

    if channel == 'email':
        value = fake.email()
    elif channel == 'phone':
        value = fake.phone_number()

    customerId = random.randint(1, 10000)  # Assuming the customer IDs range from 1 to 10000

    cur.execute("""
        INSERT INTO contacts (type, channel, value, customerId)
        VALUES (%s, %s, %s, %s);
    """, (type, channel, value, customerId))

# Commit changes and close connection
conn.commit()
cur.close()
conn.close()

