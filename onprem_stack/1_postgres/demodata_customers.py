import csv
import random
import faker  
from datetime import datetime

# Create a Faker instance
fake = faker.Faker()

professions = ['Engineer', 'Doctor', 'Teacher', 'Artist', 'Designer', 'Developer']

# Open (or create) a CSV file to write to
with open('customers.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    # Write the header
    writer.writerow(["lastName", "firstName", "profession", "street", "city", "country"])

    # Generate and write 100 rows of fake data
    for _ in range(10000):
        writer.writerow([fake.last_name(), fake.first_name(), random.choice(professions), fake.street_address(), fake.city(), fake.country()])

