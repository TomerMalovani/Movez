# Use the official Node.js 18 image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies within the container
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Rebuild bcrypt (and other native modules) for the correct architecture
RUN npm rebuild bcrypt --build-from-source

# Expose the port on which the app will run
EXPOSE 3000

# Start the application
CMD ["npm", "start"]