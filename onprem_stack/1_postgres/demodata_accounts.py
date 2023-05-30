import csv
import random
import faker  

fake = faker.Faker()

types = ['Savings', 'Checking', 'Credit']

with open('accounts.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["number", "type", "description", "balance", "customerId"])

    for _ in range(100000):
        number = fake.unique.iban()
        type = random.choice(types)
        description = fake.text(max_nb_chars=100)
        balance = round(random.uniform(100, 5000), 2)
        customerId = random.randint(1, 10000)

        writer.writerow([number, type, description, balance, customerId])
