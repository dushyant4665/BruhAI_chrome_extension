
import React, { useState } from 'react';
import { processCode } from '../lib/api';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('explain');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await processCode(input, action);
      setResult(response.text);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <img src="../icons/icon48.png" alt="AI Assistant" className="w-8 h-8"/>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Code AI Assistant
        </h1>
      </div>

      <div className="flex gap-2">
        <select 
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="bg-gray-800 px-3 py-2 rounded-lg flex-1"
        >
          <option value="explain">Explain Code</option>
          <option value="debug">Debug Code</option>
          <option value="optimize">Optimize Code</option>
        </select>
        
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Analyze'}
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your code here..."
        className="w-full h-40 bg-gray-800 p-3 rounded-lg font-mono text-sm"
      />

      <div className="bg-gray-800 p-4 rounded-lg min-h-[200px]">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        )}
      </div>
    </div>
  );
}
