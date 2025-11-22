
import React, { useState } from 'react';
import { MOCK_POSITIONS } from '../constants';
import { Position } from '../types';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick, count }) => (
  <button
    className={`px-4 py-2 border-b-2 font-medium text-sm ${
      isActive
        ? 'border-orange-500 text-orange-500'
        : 'border-transparent text-gray-400 hover:text-gray-200'
    } transition-colors`}
    onClick={onClick}
  >
    {label} {count !== undefined && `(${count})`}
  </button>
);

const PositionsTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Positions');

  const tabs = [
    { label: 'Positions', count: MOCK_POSITIONS.length },
    { label: 'Orders', count: 2 },
    { label: 'Balances', count: 0 },
    { label: 'History', count: 0 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Positions':
        return (
          <>
            <div className="flex items-center text-gray-400 text-sm mb-4">
              <input type="checkbox" id="hideOtherPairs" className="mr-2 accent-orange-500" />
              <label htmlFor="hideOtherPairs">Hide other pairs</label>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="py-2 px-4">Pair</th>
                    <th className="py-2 px-4">Size (BTC)</th>
                    <th className="py-2 px-4">Margin (USDT)</th>
                    <th className="py-2 px-4">Entry Price</th>
                    <th className="py-2 px-4">Mark Price</th>
                    <th className="py-2 px-4">MMR</th>
                    <th className="py-2 px-4">Unrealized PNL</th>
                    <th className="py-2 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {MOCK_POSITIONS.map((position: Position) => (
                    <tr key={position.pair} className="hover:bg-gray-700 text-sm text-gray-200">
                      <td className="py-3 px-4">
                        {position.pair}
                        <div className={`text-xs mt-0.5 ${position.type === 'Long' ? 'text-green-500' : 'text-red-500'}`}>
                          {position.type} <span className="text-gray-500">{position.leverage}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-green-500">{position.size.toFixed(2)}</td>
                      <td className="py-3 px-4">{position.margin.toFixed(2)}</td>
                      <td className="py-3 px-4">{position.entryPrice.toFixed(4)}</td>
                      <td className="py-3 px-4">{position.markPrice.toFixed(4)}</td>
                      <td className="py-3 px-4 text-orange-500">{position.mmr.toFixed(2)}%</td>
                      <td className="py-3 px-4">
                        <div className={`${position.unrealizedPNL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${position.unrealizedPNL.toFixed(2)}
                        </div>
                        <div className={`text-xs ${position.unrealizedPNL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({position.unrealizedPNLPercentage}%)
                        </div>
                      </td>
                      <td className="py-3 px-4 flex justify-end space-x-2">
                        <button className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-1 rounded">
                          TP/SL
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded">
                          Close
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      case 'Orders':
        return (
          <div className="flex items-center justify-between text-gray-400 text-sm mb-4 px-4">
            <span>Active Orders</span>
            <button className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-1 rounded">
              Cancel all
            </button>
          </div>
        );
      default:
        return <div className="p-4 text-gray-400">No data available for this tab.</div>;
    }
  };

  return (
    <div className="bg-gray-800 rounded-md shadow-sm flex flex-col">
      <div className="flex border-b border-gray-700 px-4">
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            label={tab.label}
            isActive={activeTab === tab.label}
            onClick={() => setActiveTab(tab.label)}
            count={tab.count}
          />
        ))}
      </div>
      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
};

export default PositionsTable;