import { useState, useEffect } from 'react';

import { IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode);
    console.log("asjdjasd")
  }, [darkMode]);

  const toggleMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  return (
    <IconButton onClick={toggleMode} disableRipple>
      {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
}
