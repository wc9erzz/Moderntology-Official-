
const swisseph = require('sweph-wasm');

console.log('Type:', typeof swisseph);
console.log('Keys:', Object.keys(swisseph));

// Test async init if it's a function
if (typeof swisseph === 'function') {
    swisseph().then(mod => {
        console.log('Initialized Module Keys:', Object.keys(mod).slice(0, 10));
        try {
            // Try calc
            const jd = 2460250.5;
            // Guess function name
            if (mod.swe_calc_ut) {
                const res = mod.swe_calc_ut(jd, 0, 0);
                console.log('Calc Res:', res);
            } else {
                console.log('swe_calc_ut not found on module');
            }
        } catch (e) {
            console.error('Error during calc:', e);
        }
    }).catch(console.error);
} else {
    // Sync usage
    try {
        const jd = 2460250.5;
        // Guess function name
        if (swisseph.swe_calc_ut) {
            const res = swisseph.swe_calc_ut(jd, 0, 0);
            console.log('Calc Res:', res);
        }
    } catch (e) { console.error(e) }
}
