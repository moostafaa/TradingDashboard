
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fix: Moved function declaration to the top to resolve "used before its declaration" error.
    const initializeWidget = () => {
      if (containerRef.current && window.TradingView) {
        // Clear previous widget if any, though unlikely in a single-instance component
        containerRef.current.innerHTML = '';
        new window.TradingView.widget({
          autosize: true,
          symbol: "BINANCE:BTCUSDT", // Default symbol as per mock-up
          interval: "D", // Default interval
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1", // Candlesticks
          locale: "en",
          toolbar_bg: "#1f2937", // bg-gray-800
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          save_image: false,
          container_id: containerRef.current.id,
          withdateranges: true, // Show date ranges at the bottom
          range: "3M", // Default range, matching chart in image roughly
          show_popup_button: true, // Shows "Open chart in TradingView" button
        });
      }
    };

    const scriptId = 'tradingview-widget-script';

    // Check if the script is already loaded to avoid duplicates
    if (document.getElementById(scriptId)) {
      if (window.TradingView) {
        initializeWidget();
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.id = scriptId;
    script.onload = () => {
      if (window.TradingView) {
        initializeWidget();
      }
    };
    script.onerror = (error) => {
      console.error('Failed to load TradingView script:', error);
    };
    document.head.appendChild(script);

    // Assign a unique ID to the container if it doesn't have one
    if (containerRef.current && !containerRef.current.id) {
      containerRef.current.id = `tradingview_widget_container_${Math.random().toString(36).substring(2, 11)}`;
    }

    // Cleanup function: remove the script and widget if the component unmounts
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Although TradingView widget doesn't have a direct 'destroy' method,
      // clearing the container should remove the iframe.
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-grow bg-gray-800 rounded-md shadow-sm h-full overflow-hidden" // Removed fixed height and added h-full
      aria-label="TradingView Chart for BTC/USDT"
    >
      {/* TradingView widget will be injected here */}
    </div>
  );
};

export default TradingViewChart;