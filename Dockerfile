####################################
# linking up the app container     #
# and the mongoDB server container #
# using legacy linking             #
####################################
# Build: docker build -t katunold/write-it

# Start mongoDB
# docker run -d --name mongo-write-it mongo

# Start and link the mongodb container
# Run: docker run -d -p 3000:3000 --link mongo-write-it:mongo katunold/write-it

# base image
FROM node:12.2.0

LABEL AUTHOR="Arnold Katumba"

# set working directory
WORKDIR /Write-it

# add app
COPY . /Write-it

# install and cache app dependencies
RUN npm i

EXPOSE 3000
CMD ["npm", "start"]
