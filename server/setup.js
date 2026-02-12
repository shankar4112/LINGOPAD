#!/usr/bin/env node

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import process from 'process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌍 LingoPad Translation API Setup');
console.log('================================\n');

console.log('LingoPad uses free Hugging Face AI models for translation.');
console.log('✅ No API keys required - everything works out of the box!');
console.log('✅ 100% free translation service');
console.log('✅ Support for 17 languages including Indic and non-Indic scripts\n');

const questions = [
  {
    key: 'PORT',
    question: 'Enter server port (default: 3001): ',
    info: 'The port where the translation server will run'
  },
  {
    key: 'CLIENT_URL',
    question: 'Enter client URL (default: http://localhost:5173): ',
    info: 'The URL where your frontend is running'
  }
];

const answers = {};

async function askQuestion(question) {
  return new Promise((resolve) => {
    console.log(`\n${question.info}`);
    rl.question(question.question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setup() {
  for (const question of questions) {
    const answer = await askQuestion(question);
    if (answer) {
      answers[question.key] = answer;
    }
  }

  // Set defaults
  const defaults = {
    'PORT': '3001',
    'CLIENT_URL': 'http://localhost:5173',
    'NODE_ENV': 'development'
  };

  // Use provided answers or defaults
  Object.entries(defaults).forEach(([key, defaultValue]) => {
    if (!answers[key]) {
      answers[key] = defaultValue;
    }
  });

  // Update .env file
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add environment variables
  Object.entries(answers).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const newLine = `${key}=${value}`;
    
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, newLine);
    } else {
      envContent += `\n${newLine}`;
    }
  });

  fs.writeFileSync(envPath, envContent.trim());

  console.log('\n✅ Configuration saved to .env file');
  console.log('\n🚀 You can now start the server with: npm start');
  console.log('\n🌟 Translation service ready - no additional setup needed!');
  
  rl.close();
}

setup().catch(console.error);
