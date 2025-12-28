#!/bin/bash

# Create project directory
mkdir fitpath-app
cd fitpath-app

# Initialize React TypeScript project
npx create-react-app . --template typescript

# Install all dependencies
npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-radio-group
npm install class-variance-authority clsx tailwind-merge
npm install framer-motion lucide-react recharts
npm install tailwindcss-animate
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p

echo "✅ Project setup complete!"
echo "Now copy the source files and run: npm start"