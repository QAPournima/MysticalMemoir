import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';

export const useTimeTurnerNavigation = () => {
  const navigate = useNavigate();
  const { showLoading } = useLoading();

  const navigateWithAnimation = (path, options = {}) => {
    const { 
      message = "Traveling through time...", 
      duration = 1500,
      replace = false 
    } = options;

    // Show loading animation
    showLoading(message, duration);

    // Navigate after a short delay to show the animation
    setTimeout(() => {
      if (replace) {
        navigate(path, { replace: true });
      } else {
        navigate(path);
      }
    }, 100);
  };

  const navigateToPage = (page) => {
    const messages = {
      home: "Returning to mystical library...",
      diary: "Opening memoir chronicles...",
      todos: "Accessing mystical quests...",
      drawing: "Entering the art studio...",
      gallery: "Visiting the gallery...",
      settings: "Adjusting mystical preferences...",
      login: "Returning to entrance hall...",
      signup: "Preparing for element discovery..."
    };

    const message = messages[page] || "Weaving magic...";
    navigateWithAnimation(`/${page}`, { message });
  };

  return {
    navigateWithAnimation,
    navigateToPage
  };
}; 