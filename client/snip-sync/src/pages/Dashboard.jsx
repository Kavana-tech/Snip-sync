import React, { useState } from 'react';

// Sample snippet data for demonstration
const initialSnippets = [
  { id: 1, title: "Snippet 1", code: "const hello = 'world';" },
  { id: 2, title: "Snippet 2", code: "let name = 'John';" },
];

const Dashboard = () => {
  // State to store snippets
  const [snippets, setSnippets] = useState(initialSnippets);
  const [newSnippet, setNewSnippet] = useState({ title: '', code: '' });

  // Handle adding a new snippet
  const handleAddSnippet = () => {
    if (newSnippet.title && newSnippet.code) {
      const newId = snippets.length + 1;
      setSnippets([...snippets, { ...newSnippet, id: newId }]);
      setNewSnippet({ title: '', code: '' }); // Reset form
    }
  };

  // Handle deleting a snippet
  const handleDeleteSnippet = (id) => {
    setSnippets(snippets.filter(snippet => snippet.id !== id));
  };

  // Handle editing a snippet (you can extend this as a modal or inline editor)
  const handleEditSnippet = (id) => {
    const snippet = snippets.find(snippet => snippet.id === id);
    if (snippet) {
      setNewSnippet({ title: snippet.title, code: snippet.code });
      handleDeleteSnippet(id); // Delete the snippet for now (simulate edit)
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <div className="text-center text-xl font-semibold">SnipSync</div>
        <ul className="mt-8">
          <li><a href="#" className="block py-2 px-4 hover:bg-gray-700">Dashboard</a></li>
          <li><a href="#" className="block py-2 px-4 hover:bg-gray-700">My Projects</a></li>
          <li><a href="#" className="block py-2 px-4 hover:bg-gray-700">Profile</a></li>
          <li><a href="#" className="block py-2 px-4 hover:bg-gray-700">Teams</a></li>
          <li><a href="#" className="block py-2 px-4 hover:bg-gray-700">Settings</a></li>
          <li><a href="#" className="block py-2 px-4 hover:bg-gray-700">Logout</a></li>
        </ul>
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-white p-6">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-semibold text-gray-800">Welcome, User</div>
          <div className="flex items-center space-x-4">
          </div>
        </div>

        {/* Snippets Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Your Snippets</h3>
            <button
              onClick={() => handleAddSnippet()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Snippet
            </button>
          </div>

          {/* Snippet Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {snippets.map((snippet) => (
              <div key={snippet.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-lg font-semibold mb-2">{snippet.title}</div>
                <pre className="text-sm text-gray-700 bg-gray-100 p-2 rounded-lg">
                  {snippet.code}
                </pre>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEditSnippet(snippet.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSnippet(snippet.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Snippet Form */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Add a New Snippet</h3>
          <input
            type="text"
            placeholder="Title"
            value={newSnippet.title}
            onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
            className="p-2 mb-4 w-full border rounded bg-gray-100"
          />
          <textarea
            placeholder="Code"
            value={newSnippet.code}
            onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
            className="p-2 mb-4 w-full border rounded bg-gray-100"
            rows="6"
          ></textarea>
          <button
            onClick={handleAddSnippet}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Save Snippet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;