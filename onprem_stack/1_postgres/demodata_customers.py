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
    writer.writerow(["lastName", "firstName", "birthdate", "profession"])

    # Generate and write 100 rows of fake data
    for _ in range(10000):
        birthdate = fake.date_of_birth(minimum_age=20, maximum_age=70)
        birthdate = birthdate.strftime('%m/%d/%Y')  # Format the date as MM/DD/YYYY
        writer.writerow([fake.last_name(), fake.first_name(), birthdate, random.choice(professions)])

