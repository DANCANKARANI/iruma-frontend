// Mode.tsx

import { useTheme } from "./themeContext";


const Mode: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-4">
      <h1 className="text-2xl">
        Current Theme: <span className="capitalize">{theme}</span>
      </h1>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 mt-4 bg-blue-500 text-white rounded"
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default Mode;
