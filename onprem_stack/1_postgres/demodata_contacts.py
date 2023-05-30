import csv
import random
import faker  

# Create a Faker instance
fake = faker.Faker()

types = ['personal', 'work']
channels = ['email', 'phone', 'address']

# Open (or create) a CSV file to write to
with open('contacts.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    # Write the header
    writer.writerow(["type", "channel", "value", "customerId"])

    # Generate and write 30000 rows of fake data
    for _ in range(30000):
        type = random.choice(types)
        channel = random.choice(channels)
        
        if channel == 'email':
            value = fake.email()
        elif channel == 'phone':
            value = fake.phone_number()
        elif channel == 'address':
            value = fake.address().replace('\n', ', ')
        
        customerId = random.randint(1, 10000)  # Assuming the customer IDs range from 1 to 10000

        writer.writerow([type, channel, value, customerId])
