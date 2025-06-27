const fs = require('fs');
const path = require('path');

// Get current directory
const __dirname = process.cwd();

// Import client configurations (you'll need to convert to CommonJS or use dynamic import)
const { clientConfigs } = require('../config/ClientManager');

function updateAppConfig(clientId) {
  const clientConfig = clientConfigs[clientId];
  
  if (!clientConfig) {
    console.error(`❌ Client configuration not found for: ${clientId}`);
    process.exit(1);
  }

  console.log(`📝 Updating app.json for client: ${clientId}`);

  // Read current app.json
  const appJsonPath = path.join(__dirname, '..', 'app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

  // Update with client-specific configuration
  appJson.expo.name = clientConfig.appName;
  appJson.expo.slug = clientConfig.appName.toLowerCase().replace(/\s+/g, '-');
  appJson.expo.version = clientConfig.appStore.version;
  appJson.expo.icon = clientConfig.logoUrl;
  
  // Android configuration
  if (appJson.expo.android) {
    appJson.expo.android.package = clientConfig.appStore.bundleId;
    appJson.expo.android.versionCode = clientConfig.appStore.buildNumber;
  }
  
  // iOS configuration
  if (appJson.expo.ios) {
    appJson.expo.ios.bundleIdentifier = clientConfig.appStore.bundleId;
    appJson.expo.ios.buildNumber = clientConfig.appStore.buildNumber.toString();
  }

  // Update colors/theme
  if (appJson.expo.splash) {
    appJson.expo.splash.backgroundColor = clientConfig.primaryColor;
  }

  // Write updated app.json
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
  console.log('✅ app.json updated successfully');

  // Update EAS configuration
  updateEasConfig(clientId, clientConfig);
}

function updateEasConfig(clientId, clientConfig) {
  const easJsonPath = path.join(__dirname, '..', 'eas.json');
  
  if (!fs.existsSync(easJsonPath)) {
    console.log('⚠️  eas.json not found, creating one...');
    const easConfig = {
      cli: {
        version: ">= 16.0.0"
      },
      build: {
        development: {
          developmentClient: true,
          distribution: "internal"
        },
        preview: {
          distribution: "internal",
          env: {
            EXPO_PUBLIC_CLIENT_ID: clientId
          }
        },
        production: {
          env: {
            EXPO_PUBLIC_CLIENT_ID: clientId
          }
        }
      },
      submit: {
        production: {}
      }
    };
    
    fs.writeFileSync(easJsonPath, JSON.stringify(easConfig, null, 2));
  } else {
    const easJson = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'));
    
    // Update environment variables for all build profiles
    Object.keys(easJson.build).forEach(profile => {
      if (!easJson.build[profile].env) {
        easJson.build[profile].env = {};
      }
      easJson.build[profile].env.EXPO_PUBLIC_CLIENT_ID = clientId;
    });
    
    fs.writeFileSync(easJsonPath, JSON.stringify(easJson, null, 2));
  }
  
  console.log('✅ eas.json updated successfully');
}

// Get client ID from command line arguments
const clientId = process.argv[2];

if (!clientId) {
  console.error('❌ Please provide a client ID');
  console.log('Usage: node update-app-config.js <client-id>');
  process.exit(1);
}

updateAppConfig(clientId);
