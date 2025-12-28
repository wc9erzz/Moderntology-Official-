
const astronomy = require('astronomy-engine');
console.log('Body members:', Object.keys(astronomy.Body));
console.log('Available functions:', Object.keys(astronomy));
try {
    console.log('Body.Ceres:', astronomy.Body.Ceres);
} catch (e) {
    console.log('Body.Ceres not found');
}
