#!/usr/bin/env node

/**
 * Quick test script to verify songs API is returning valid data
 * Run this to check if the backend is working properly
 */

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://song-api-rvfw.onrender.com',
  timeout: 10000,
});

async function testAPI() {
  console.log('🔍 Testing Songs API...\n');
  
  try {
    console.log('📡 Fetching songs from: https://song-api-rvfw.onrender.com/layug/songs\n');
    const response = await axiosInstance.get('/layug/songs');
    
    console.log(`✅ API Response Status: ${response.status}`);
    console.log(`✅ Total Songs: ${response.data.length}\n`);
    
    if (response.data.length === 0) {
      console.log('⚠️  WARNING: No songs in database!');
      console.log('Upload a song first using the "+ Upload Song" button in the app.\n');
      return;
    }
    
    // Check first 3 songs
    console.log('📋 Checking first 3 songs:\n');
    response.data.slice(0, 3).forEach((song, index) => {
      console.log(`Song ${index + 1}:`);
      console.log(`  ✓ ID: ${song.id}`);
      console.log(`  ✓ Title: ${song.title}`);
      console.log(`  ✓ Artist: ${song.artist}`);
      console.log(`  ✓ URL: ${song.url ? '✅ PRESENT' : '❌ MISSING'}`);
      
      // Validate URL format
      if (song.url) {
        try {
          new URL(song.url);
          console.log(`    └─ URL format: Valid ✓`);
        } catch (e) {
          console.log(`    └─ URL format: ❌ INVALID`);
        }
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ API Test Failed!\n');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - API server might be offline');
    } else if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Error: ${error.response.statusText}`);
    } else if (error.message) {
      console.error(`Error: ${error.message}`);
    }
    
    console.error('\nℹ️  Check that the API server is running at:');
    console.error('https://song-api-rvfw.onrender.com\n');
  }
}

testAPI();
