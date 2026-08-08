# Step 1: Use an official node image as base
FROM node:18-alpine

# Step 2: Set working directory inside container
WORKDIR /usr/src/app

# Step 3: Copy package dependencies definition
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --production

# Step 5: Copy application code
COPY . .

# Step 6: Expose application port
EXPOSE 3000

# Step 7: Define startup command
CMD ["npm", "start"]
