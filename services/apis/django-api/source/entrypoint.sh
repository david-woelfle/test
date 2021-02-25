#!/bin/bash
set -e

echo "Entering entrypoint.sh"

# Ensure the DB layout matches the current state of the application
printf "\n\nCreating and applying migrations."
python3 /source/api/manage.py makemigrations
python3 /source/api/manage.py migrate

# Run prod deploy checks if not in devl.
if [ $DJANGO_DEBUG != "TRUE" ]
then
    printf "\n\n"
    echo "Running Djangos production deploy checks"
    python3 /source/api/manage.py check --deploy
    printf "\nDjango production tests done\n\n"
fi

# Check if SSL certificates have been provided by the user. If yes use there.
# If not create self signed certificates.
# Use a directory in tmp as the user might have no write access for the
# /source/ folder
printf "\n\n"
echo "Checking the certificate situation."
mkdir -p /tmp/cert
chmod 700 /tmp/cert
cd /tmp/cert
if [ -z "$SSL_CERT_PEM" ] || [ -z "$SSL_KEY_PEM" ]
then
    # As proposed by:
    # https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl
    echo "Environment variables SSL_CERT_PEM or SSL_KEY_PEM empty."
    echo "Generating self signed certificate."
    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=$HOSTNAME"
else
    # write the users cert and key to file if both have been provided.
    echo "The user provided cert.pem and key.pem"
    printf "\ncert.pem:\n$SSL_CERT_PEM\n\n"
    echo "$SSL_CERT_PEM" > cert.pem
    echo "$SSL_KEY_PEM" > key.pem
fi

# Start up the server, use the internal devl server in debug mode.
# Both should bind to port 8000 within the container and start the server.
if [[ $DJANGO_DEBUG == "TRUE" ]]
then
    # --noreload prevents duplicate entries in DB.
    printf "\n\nStarting up Django development server.\n\n\n"
    python3 /source/api/manage.py runserver --noreload 0.0.0.0:8000 &
else
    # This also listens to port 8080 for normal HTTPS but you shouldn't use
    # it and don't expose port 8080 as HTTPS is always prefered.
    printf "\n\nCollecting static files."
    python3 /source/api/manage.py collectstatic
    cd /source/api && \
    printf "\n\nStarting up Daphne production server.\n\n\n"
    daphne -e ssl:8000:privateKey=/tmp/cert/key.pem:certKey=/tmp/cert/cert.pem \
           -b 0.0.0.0 \
           -p 8080 api_main.asgi:application &
fi

# Patches SIGTERM and SIGINT to stop the service. This is required
# to trigger graceful shutdown if docker wants to stop the container.
service_pid=$!
trap "kill -TERM $service_pid" SIGTERM
trap "kill -INT $service_pid" INT

# Run until the container is stopped. Give the service maximal 2 seconds to
# clean up and shut down, afterwards we pull the plug hard.
wait
sleep 2