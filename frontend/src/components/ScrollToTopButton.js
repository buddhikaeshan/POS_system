import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { ArrowUp } from 'lucide-react'; // Optional: Lucide arrow icon

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Listen for scroll events to show or hide the button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true); // Show button after scrolling down 300px
      } else {
        setIsVisible(false); // Hide button when at the top
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll); // Clean up on unmount
    };
  }, []);

  // Function to scroll back to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    isVisible && (
      <Button
        variant="primary"
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          borderRadius: '50%',
          zIndex: 1000,
          padding: '10px',
        }}
      >
        <ArrowUp size={20} />
      </Button>
    )
  );
};

export default ScrollToTopButton;
