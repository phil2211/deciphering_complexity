# Start from the PostgreSQL image
FROM postgres:latest

# Set environment variables for the PostgreSQL database
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD Passw0rd
ENV POSTGRES_DB mycustomers

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Add your Python script and requirements.txt file to the Docker image
ADD load_fakedata.py /docker-entrypoint-initdb.d/
ADD requirements.txt /docker-entrypoint-initdb.d/

# Install any Python packages your script needs
RUN pip3 install -r /docker-entrypoint-initdb.d/requirements.txt

# Use PostgreSQL's Docker entrypoint script
COPY ./docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

# Run your Python script after the database starts
CMD ["python", "/docker-entrypoint-initdb.d/load_fakedata.py"]