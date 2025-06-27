import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../contexts/ThemeContext';



export default function ChartPage() {
  const router = useRouter();
  const { theme, toggleTheme, currentTheme } = useTheme();
  const webViewRef = useRef<WebView>(null);
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['MA', 'RSI']);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenControls, setShowFullscreenControls] = useState(true);

  const symbols = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  ];

  const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W', '1M'];

  const indicators = [
    { key: 'MA', name: 'Moving Average', study: 'MASimple@tv-basicstudies' },
    { key: 'EMA', name: 'EMA', study: 'MAExp@tv-basicstudies' },
    { key: 'RSI', name: 'RSI', study: 'RSI@tv-basicstudies' },
    { key: 'MACD', name: 'MACD', study: 'MACD@tv-basicstudies' },
    { key: 'BB', name: 'Bollinger Bands', study: 'BB@tv-basicstudies' },
    { key: 'Volume', name: 'Volume', study: 'Volume@tv-basicstudies' },
    { key: 'Stoch', name: 'Stochastic', study: 'Stochastic@tv-basicstudies' },
    { key: 'ATR', name: 'ATR', study: 'ATR@tv-basicstudies' },
  ];

  const tradingViewHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
        <style>
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; height: 100%; }
          html { height: 100%; }
          #tradingview_chart { height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="tradingview_chart"></div>
        <script type="text/javascript">
          let widget;
          let currentStudies = new Map();
          
          function initChart() {
            widget = new TradingView.widget({
              "width": "100%",
              "height": "100%",
              "symbol": "NASDAQ:${selectedSymbol}",
              "interval": "${selectedTimeframe}",
              "timezone": "Etc/UTC",
              "theme": "${theme.tradingViewTheme}",
              "style": "1",
              "locale": "en",
              "toolbar_bg": "${theme.tradingViewToolbar}",
              "enable_publishing": false,
              "hide_top_toolbar": false,
              "hide_legend": false,
              "save_image": false,
              "container_id": "tradingview_chart",
              "studies": [],
              "show_popup_button": true,
              "popup_width": "1000",
              "popup_height": "650",
              "no_referral_id": true,
              "onChartReady": function() {
                console.log('Chart ready, initializing...');
                // Initialize with current indicators
                const currentIndicators = ${JSON.stringify(selectedIndicators)};
                const indicatorMap = ${JSON.stringify(indicators.reduce((acc, ind) => ({ ...acc, [ind.key]: ind.study }), {}))};
                
                currentIndicators.forEach(key => {
                  if (indicatorMap[key]) {
                    const studyId = widget.chart().createStudy(indicatorMap[key]);
                    currentStudies.set(key, studyId);
                    console.log('Added indicator:', key);
                  }
                });
                
                // Notify React Native that chart is ready
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'chartReady'
                }));
              }
            });
          }
          
          function toggleIndicator(key, study) {
            console.log('Toggling indicator:', key, study);
            if (!widget || !widget.chart) return;
            
            if (currentStudies.has(key)) {
              // Remove indicator
              console.log('Removing indicator:', key);
              widget.chart().removeEntity(currentStudies.get(key));
              currentStudies.delete(key);
            } else {
              // Add indicator
              console.log('Adding indicator:', key);
              const studyId = widget.chart().createStudy(study);
              currentStudies.set(key, studyId);
            }
          }
          
          // Listen for messages from React Native
          document.addEventListener('message', function(event) {
            try {
              console.log('Document message received:', event.data);
              const data = JSON.parse(event.data);
              
              if(data.action === 'toggleIndicator') {
                toggleIndicator(data.key, data.study);
              }
            } catch (e) {
              console.log('Document message parsing error:', e);
            }
          });
          
          window.addEventListener('message', function(event) {
            try {
              console.log('Window message received:', event.data);
              const data = JSON.parse(event.data);
              
              if(data.action === 'toggleIndicator') {
                toggleIndicator(data.key, data.study);
              }
            } catch (e) {
              console.log('Window message parsing error:', e);
            }
          });
          
          initChart();
        </script>
      </body>
    </html>
  `;

  const handleSymbolSelect = (symbol: string) => {
    console.log('Selecting symbol:', symbol);
    setSelectedSymbol(symbol);
    // Symbol change will trigger HTML regeneration (which is fine)
  };

  const handleTimeframeSelect = (timeframe: string) => {
    console.log('Selecting timeframe:', timeframe);
    setSelectedTimeframe(timeframe);
    // Timeframe change will trigger HTML regeneration (which is fine)
  };

  const handleIndicatorToggle = (indicatorKey: string) => {
    console.log('Toggling indicator:', indicatorKey);
    const indicator = indicators.find(ind => ind.key === indicatorKey);
    if (!indicator) return;

    setSelectedIndicators(prev => {
      const newIndicators = prev.includes(indicatorKey)
        ? prev.filter(key => key !== indicatorKey)
        : [...prev, indicatorKey];
      
      // Send message to WebView to toggle indicator without reloading
      const message = JSON.stringify({
        action: 'toggleIndicator',
        key: indicatorKey,
        study: indicator.study
      });
      console.log('Sending indicator message:', message);
      webViewRef.current?.postMessage(message);
      
      return newIndicators;
    });
  };

  const resetHideControlsTimer = () => {
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    setShowFullscreenControls(true);
    hideControlsTimeoutRef.current = setTimeout(() => {
      setShowFullscreenControls(false);
    }, 3000); // Hide after 3 seconds
  };

  const handleFullScreen = () => {
    setIsFullscreen(prev => {
      const newFullscreen = !prev;
      if (newFullscreen) {
        setShowFullscreenControls(true);
        resetHideControlsTimer();
      } else {
        setShowFullscreenControls(true);
        if (hideControlsTimeoutRef.current) {
          clearTimeout(hideControlsTimeoutRef.current);
        }
      }
      return newFullscreen;
    });
  };

  const handleFullscreenTap = () => {
    if (isFullscreen) {
      if (showFullscreenControls) {
        handleFullScreen(); // Exit fullscreen if controls are visible
      } else {
        resetHideControlsTimer(); // Show controls if they're hidden
      }
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header - Hide in fullscreen */}
      {!isFullscreen && (
        <View style={[styles.header, { 
          backgroundColor: theme.headerBackground, 
          borderBottomColor: theme.headerBorder 
        }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Trading Charts</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleThemeToggle} style={styles.themeButton}>
              <Ionicons 
                name={currentTheme === 'light' ? 'sunny' : currentTheme === 'dark' ? 'moon' : 'moon-outline'} 
                size={20} 
                color={theme.text} 
              />
              <Text style={[styles.themeText, { color: theme.secondaryText }]}>{theme.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFullScreen} style={styles.fullscreenButton}>
              <Ionicons name="expand" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Combined Selectors - Hide in fullscreen */}
      {!isFullscreen && (
        <View style={[styles.combinedSelectorContainer, { 
          backgroundColor: theme.headerBackground, 
          borderBottomColor: theme.headerBorder 
        }]}>
          <View style={styles.compactSelectorRow}>
            <Text style={[styles.compactLabel, { color: theme.text }]}>Symbol:</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.compactSelector}
            >
              {symbols.map((item) => (
                <TouchableOpacity
                  key={item.symbol}
                  style={[
                    styles.compactButton,
                    { 
                      backgroundColor: theme.buttonBackground, 
                      borderColor: theme.buttonBorder 
                    },
                    selectedSymbol === item.symbol && { 
                      backgroundColor: theme.selectedButton, 
                      borderColor: theme.selectedButton 
                    }
                  ]}
                  onPress={() => handleSymbolSelect(item.symbol)}
                >
                  <Text
                    style={[
                      styles.compactButtonText,
                      { color: theme.text },
                      selectedSymbol === item.symbol && { color: theme.selectedButtonText }
                    ]}
                  >
                    {item.symbol}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.compactSelectorRow}>
            <Text style={[styles.compactLabel, { color: theme.text }]}>Time:</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.compactSelector}
            >
              {timeframes.map((timeframe) => (
                <TouchableOpacity
                  key={timeframe}
                  style={[
                    styles.compactButton,
                    { 
                      backgroundColor: theme.buttonBackground, 
                      borderColor: theme.buttonBorder 
                    },
                    selectedTimeframe === timeframe && { 
                      backgroundColor: theme.selectedButton, 
                      borderColor: theme.selectedButton 
                    }
                  ]}
                  onPress={() => handleTimeframeSelect(timeframe)}
                >
                  <Text
                    style={[
                      styles.compactButtonText,
                      { color: theme.text },
                      selectedTimeframe === timeframe && { color: theme.selectedButtonText }
                    ]}
                  >
                    {timeframe}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Chart Container */}
      <View style={[
        isFullscreen ? styles.fullscreenChartContainer : styles.chartContainer,
        !isFullscreen && { borderColor: theme.border }
      ]}>
        <WebView
          ref={webViewRef}
          source={{ html: tradingViewHTML }}
          style={isFullscreen ? styles.fullscreenWebview : styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'chartReady') {
                console.log('Chart is ready!');
              }
            } catch (e) {
              console.log('Message parsing error:', e);
            }
          }}
          renderLoading={() => (
            <View style={[styles.loadingContainer, { backgroundColor: theme.headerBackground }]}>
              <Text style={[styles.loadingText, { color: theme.secondaryText }]}>Loading Chart...</Text>
            </View>
          )}
          onError={(error) => {
            console.error('WebView error:', error);
            Alert.alert('Error', 'Failed to load chart. Please try again.');
          }}
        />
        
        {/* Fullscreen controls overlay - positioned above WebView */}
        {isFullscreen && (
          <>
            {/* Top overlay area for controls */}
            <TouchableOpacity 
              style={styles.fullscreenTopOverlay}
              onPress={handleFullscreenTap}
              activeOpacity={1}
            >
              {showFullscreenControls && (
                <View style={styles.fullscreenControls}>
                  <TouchableOpacity onPress={handleFullScreen} style={styles.exitFullscreenButton}>
                    <Ionicons name="contract" size={24} color="#fff" />
                  </TouchableOpacity>
                  <View style={styles.fullscreenInfo}>
                    <Text style={styles.fullscreenSymbolText}>{selectedSymbol} • {selectedTimeframe}</Text>
                    <TouchableOpacity onPress={handleThemeToggle} style={styles.fullscreenThemeButton}>
                      <Ionicons 
                        name={currentTheme === 'light' ? 'sunny' : currentTheme === 'dark' ? 'moon' : 'moon-outline'} 
                        size={16} 
                        color="#fff" 
                      />
                      <Text style={styles.fullscreenThemeText}>{theme.name}</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={handleFullScreen} style={styles.exitFullscreenButton}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
            
            {/* Bottom overlay area for tap to show/hide controls */}
            <TouchableOpacity 
              style={styles.fullscreenBottomOverlay}
              onPress={handleFullscreenTap}
              activeOpacity={1}
            />
          </>
        )}
      </View>

      {/* TradingView Style Indicators Panel - Hide in fullscreen */}
      {!isFullscreen && (
        <View style={[styles.indicatorsPanel, { 
          backgroundColor: theme.panelBackground, 
          borderTopColor: theme.border 
        }]}>
          <View style={styles.indicatorsPanelHeader}>
            <Text style={[styles.indicatorsPanelTitle, { color: theme.text }]}>Indicators</Text>
            <Text style={[styles.indicatorsCount, { color: theme.secondaryText }]}>({selectedIndicators.length})</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.indicatorsScrollContainer}
          >
            {indicators.map((indicator) => {
              const isSelected = selectedIndicators.includes(indicator.key);
              return (
                <TouchableOpacity
                  key={indicator.key}
                  style={[
                    styles.indicatorBox,
                    { 
                      backgroundColor: theme.indicatorBox, 
                      borderColor: theme.border 
                    },
                    isSelected && { 
                      backgroundColor: theme.selectedButton, 
                      borderColor: theme.selectedButton 
                    }
                  ]}
                  onPress={() => handleIndicatorToggle(indicator.key)}
                >
                  <View style={styles.indicatorContent}>
                    <Text style={[
                      styles.indicatorName,
                      { color: theme.text },
                      isSelected && { color: theme.selectedButtonText }
                    ]}>
                      {indicator.name}
                    </Text>
                    <View style={[
                      styles.indicatorCheckbox,
                      { borderColor: theme.border },
                      isSelected && { 
                        backgroundColor: theme.selectedButtonText, 
                        borderColor: theme.selectedButtonText 
                      }
                    ]}>
                      {isSelected && (
                        <Ionicons name="checkmark" size={12} color={theme.selectedButton} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  fullscreenButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  themeText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4,
  },
  combinedSelectorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderBottomWidth: 1,
  },
  compactSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  compactLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 60,
    marginRight: 8,
  },
  compactSelector: {
    flexDirection: 'row',
    flex: 1,
  },
  compactButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 6,
  },
  compactButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    flex: 0.7,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  fullscreenChartContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 999,
  },
  fullscreenControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 30,
    marginHorizontal: 16,
    minHeight: 50,
    zIndex: 1001,
  },
  exitFullscreenButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenTopOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'transparent',
    zIndex: 1000,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  fullscreenBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  fullscreenSymbolText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  fullscreenInfo: {
    alignItems: 'center',
    flex: 1,
  },
  fullscreenThemeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  fullscreenThemeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 2,
  },
  webview: {
    flex: 1,
  },
  fullscreenWebview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  // TradingView Style Indicators Panel
  indicatorsPanel: {
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  indicatorsPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  indicatorsPanelTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  indicatorsCount: {
    fontSize: 14,
    marginLeft: 4,
  },
  indicatorsScrollContainer: {
    paddingHorizontal: 16,
  },
  indicatorBox: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1.5,
    minWidth: 100,
  },
  indicatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  indicatorName: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  indicatorCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
