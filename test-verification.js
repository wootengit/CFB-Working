// CFB Core Project - Verification Test Script
// Quick validation that our core components are working before kickoff

const http = require('http');
const fs = require('fs');

console.log('🏈 CFB CORE PROJECT - CRISIS MODE VERIFICATION');
console.log('='.repeat(50));

// Test 1: Check if dev server is running
function testDevServer() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3000', (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Dev server running on localhost:3000');
                resolve(true);
            } else {
                console.log('❌ Dev server not responding correctly');
                resolve(false);
            }
        });
        
        req.on('error', (err) => {
            console.log('❌ Dev server not running:', err.message);
            resolve(false);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ Dev server timeout');
            resolve(false);
        });
    });
}

// Test 2: Verify core components exist
function testCoreComponents() {
    const components = [
        'components/GameCard.tsx',
        'components/ModernGameCards.tsx',
        'utils/teamLogos.ts'
    ];
    
    let allExist = true;
    
    components.forEach(component => {
        if (fs.existsSync(component)) {
            console.log(`✅ ${component} exists`);
        } else {
            console.log(`❌ ${component} MISSING`);
            allExist = false;
        }
    });
    
    return allExist;
}

// Test 3: Check package.json dependencies
function testDependencies() {
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const criticalDeps = ['next', 'react', 'typescript'];
        
        let allPresent = true;
        criticalDeps.forEach(dep => {
            if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
                console.log(`✅ ${dep} installed`);
            } else {
                console.log(`❌ ${dep} MISSING`);
                allPresent = false;
            }
        });
        
        return allPresent;
    } catch (error) {
        console.log('❌ Could not read package.json');
        return false;
    }
}

// Main verification function
async function runVerification() {
    console.log('\n🔍 TESTING DEV SERVER...');
    const serverWorking = await testDevServer();
    
    console.log('\n🔍 TESTING CORE COMPONENTS...');
    const componentsOk = testCoreComponents();
    
    console.log('\n🔍 TESTING DEPENDENCIES...');
    const depsOk = testDependencies();
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 VERIFICATION RESULTS:');
    console.log(`Dev Server: ${serverWorking ? '✅' : '❌'}`);
    console.log(`Components: ${componentsOk ? '✅' : '❌'}`);
    console.log(`Dependencies: ${depsOk ? '✅' : '❌'}`);
    
    const allGood = serverWorking && componentsOk && depsOk;
    
    if (allGood) {
        console.log('\n🎉 READY FOR KICKOFF! All systems go!');
        console.log('🌐 Visit: http://localhost:3000');
    } else {
        console.log('\n🚨 CRITICAL ISSUES FOUND - NEED IMMEDIATE ATTENTION!');
    }
    
    return allGood;
}

// Run verification
if (require.main === module) {
    runVerification().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { runVerification };