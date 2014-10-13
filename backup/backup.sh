#!/bin/bash

MONGODB_USERNAME
MONGODB_PASSWORD
UPYUN_USERNAME
UPYUN_PASSWORD

usage() {
cat << EOF

usage: $0 options

This script dumps the current mongo database, tars it, then sends it to an upyun bucket.

OPTIONS:
   -h      Show this message
   -u      Mongodb username
   -p      Mongodb password
   -y      upyun username
   -z      upyun password
EOF
}

while getopts “h:u:p:y:z:” OPTION
do
    case $OPTION in
        h)
            usage
            exit 1
            ;;
        u)
            MONGODB_USERNAME=$OPTARG
            ;;
        p)
            MONGODB_PASSWORD=$OPTARG
            ;;
        y)
            UPYUN_USERNAME=$OPTARG
            ;;
        z)
            UPYUN_PASSWORD=$OPTARG
            ;;
        ?)
            usage
            exit
        ;;
    esac
done

if [ -z $MONGODB_USERNAME ] || [ -z $MONGODB_PASSWORD ] || [ -z $UPYUN_USERNAME ] || [ -z $UPYUN_PASSWORD ]; then
    usage
    exit 1
fi

# Get the directory the script is being run from
SCRIPT_DIR=$(dirname $0)
# Store the current date in YYYY-mm-DD-HHMMSS
DATE=$(date "+%F-%H%M%S")
FILE_NAME="backup-$DATE"
ARCHIVE_NAME="$FILE_NAME.tar.gz"
BACKUP_DIR="$SCRIPT_DIR/backup/"
UPYUN_HOST="v0.ftp.upyun.com"
REMOTE_DIR="/b"

# Lock the database
# Note there is a bug in mongo 2.2.0 where you must touch all the databases before you run mongodump
mongo -username "$MONGODB_USERNAME" -password "$MONGODB_PASSWORD" admin --eval "var databaseNames = db.getMongo().getDBNames(); for (var i in databaseNames) { printjson(db.getSiblingDB(databaseNames[i]).getCollectionNames()) }; printjson(db.fsyncLock());"

# Dump the database
mongodump -username "$MONGODB_USERNAME" -password "$MONGODB_PASSWORD" --out $BACKUP_DIR/$FILE_NAME

# Unlock the database
mongo -username "$MONGODB_USERNAME" -password "$MONGODB_PASSWORD" admin --eval "printjson(db.fsyncUnlock());"

# Tar Gzip the file
tar -C $BACKUP_DIR/ -zcvf $BACKUP_DIR/$ARCHIVE_NAME $FILE_NAME/

# Remove the backup directory
rm -r $BACKUP_DIR/$FILE_NAME

# Send the file to the upyun
lftp -c "open ftp://$UPYUN_HOST;
user $UPYUN_USERNAME $UPYUN_PASSWORD;
lcd $BACKUP_DIR;
cd $REMOTE_DIR;
mirror --reverse --dereference --verbose"