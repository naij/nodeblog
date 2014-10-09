#!/bin/sh
 
# MONGODB_SHELL='mongo'
# DUMP_UTILITY='mongodump'

# DB_NAME='kiwiobject'
# SERVER_USER='wangjian'
# HOST_NAME='42.121.30.57'

# date_now=`date +%Y_%m_%d_%H_%M_%S`
# BASE_PATH='/root/mongodb/'
# BACKUP_PATH=${BASE_PATH}${date_now}
# BACKUP_FILENAME=${BASE_PATH}${date_now}'.bz2'
# current_year=`date +%Y`

# log() {
#     echo $1
# }

# do_cleanup(){
#     rm -rf ${current_year}*
#     log 'cleaning up....'
# }

# do_backup(){
#     log 'snapshotting the db and creating archive' && \
#     ${MONGODB_SHELL} admin fsync_lock.js && \
#     log 'db locked and creating backup' 
#     ${DUMP_UTILITY} -d ${DB_NAME} -o ${BACKUP_PATH} && tar -jcf ${BACKUP_FILENAME} ${BACKUP_PATH} && \
#     ${MONGODB_SHELL} admin fsync_unlock.js && \
#     log 'data backd up and created snapshot'
# }

# save_in_cloud(){
#     log 'saving backup to another server...'
#     scp ${DIR}/${BACKUP_FILENAME} ${SERVER_USER}@${HOST_NAME}:${CLOUD_PATH}/${BACKUP_FILENAME}
#     log 'saved scuccessfully'
# }

# do_backup


usage() {
cat << EOF
usage: $0 options

This script dumps the current mongo database, tars it, then sends it to an Amazon S3 bucket.

OPTIONS:
   -h      Show this message
   -u      Mongodb user
   -p      Mongodb password
   -k      AWS Access Key
   -s      AWS Secret Key
   -r      Amazon S3 region
   -b      Amazon S3 bucket name
EOF
}

MONGODB_USER=
MONGODB_PASSWORD=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
S3_REGION=
S3_BUCKET=

while getopts “ht:u:p:k:s:r:b:” OPTION
do
  case $OPTION in
    h)
      usage
      exit 1
      ;;
    u)
      MONGODB_USER=$OPTARG
      ;;
    p)
      MONGODB_PASSWORD=$OPTARG
      ;;
    k)
      AWS_ACCESS_KEY=$OPTARG
      ;;
    s)
      AWS_SECRET_KEY=$OPTARG
      ;;
    r)
      S3_REGION=$OPTARG
      ;;
    b)
      S3_BUCKET=$OPTARG
      ;;
    ?)
      usage
      exit
    ;;
  esac
done

if [[ -z $MONGODB_USER ]] || [[ -z $MONGODB_PASSWORD ]]
then
  usage
  exit 1
fi

# Get the directory the script is being run from
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $DIR
# Store the current date in YYYY-mm-DD-HHMMSS
DATE=$(date -u "+%F-%H%M%S")
FILE_NAME="backup-$DATE"
ARCHIVE_NAME="$FILE_NAME.tar.gz"

# Lock the database
# Note there is a bug in mongo 2.2.0 where you must touch all the databases before you run mongodump
mongo -username "$MONGODB_USER" -password "$MONGODB_PASSWORD" admin --eval "var databaseNames = db.getMongo().getDBNames(); for (var i in databaseNames) { printjson(db.getSiblingDB(databaseNames[i]).getCollectionNames()) }; printjson(db.fsyncLock());"

# Dump the database
mongodump -username "$MONGODB_USER" -password "$MONGODB_PASSWORD" --out $DIR/backup/$FILE_NAME

# Unlock the database
mongo -username "$MONGODB_USER" -password "$MONGODB_PASSWORD" admin --eval "printjson(db.fsyncUnlock());"

# Tar Gzip the file
tar -C $DIR/backup/ -zcvf $DIR/backup/$ARCHIVE_NAME $FILE_NAME/

# Remove the backup directory
rm -r $DIR/backup/$FILE_NAME

# Send the file to the backup drive or S3

# HEADER_DATE=$(date -u "+%a, %d %b %Y %T %z")
# CONTENT_MD5=$(openssl dgst -md5 -binary $DIR/backup/$ARCHIVE_NAME | openssl enc -base64)
# CONTENT_TYPE="application/x-download"
# STRING_TO_SIGN="PUT\n$CONTENT_MD5\n$CONTENT_TYPE\n$HEADER_DATE\n/$S3_BUCKET/$ARCHIVE_NAME"
# SIGNATURE=$(echo -e -n $STRING_TO_SIGN | openssl dgst -sha1 -binary -hmac $AWS_SECRET_KEY | openssl enc -base64)

# curl -X PUT \
# --header "Host: $S3_BUCKET.s3-$S3_REGION.amazonaws.com" \
# --header "Date: $HEADER_DATE" \
# --header "content-type: $CONTENT_TYPE" \
# --header "Content-MD5: $CONTENT_MD5" \
# --header "Authorization: AWS $AWS_ACCESS_KEY:$SIGNATURE" \
# --upload-file $DIR/backup/$ARCHIVE_NAME \
# https://$S3_BUCKET.s3-$S3_REGION.amazonaws.com/$ARCHIVE_NAME