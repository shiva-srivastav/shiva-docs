// // test-hash.js - Run this file to verify the password hash
// const bcrypt = require('bcrypt');

// // The password we want to test
// const password = 'shiva#docs#telusko';

// // Generate a new hash for the password
// bcrypt.hash(password, 10, function(err, hash) {
//   if (err) {
//     console.error('Error generating hash:', err);
//     return;
//   }
  
//   console.log('New hash for password:', hash);
  
//   // Verify that the existing hash works with the password
//   const existingHash = '$2b$10$4YtbRcUWSOIrDYOQFRCfC.ydUSp2MnHWBLKnQPdQOLJaOOEXfk5wa';
  
//   bcrypt.compare(password, existingHash, function(err, result) {
//     if (err) {
//       console.error('Error comparing with existing hash:', err);
//       return;
//     }
    
//     console.log('Does password match existing hash?', result);
    
//     if (!result) {
//       console.log('WARNING: The existing hash does not match the password!');
//       console.log('Use the new hash generated above instead.');
//     } else {
//       console.log('Existing hash is valid for the password.');
//     }
//   });
// });

// // How to run this:
// // 1. Save this as test-hash.js in your server directory
// // 2. Run: node test-hash.js
// // 3. Check if the password matches the hash


const bcrypt = require('bcrypt');
const password = 'shiva#docs#telusko';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  console.log('Password:', password);
  console.log('New hash:', hash);
});