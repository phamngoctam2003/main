
import { useEffect } from 'react';


export const limitPost = (selector, post, limit) => {
  if (typeof limit !== 'number' || isNaN(limit) || limit <= 0) {
    console.error("limit phải là một số dương hợp lệ");
    return;
  }
  useEffect(() => {
    const lineClaps = document.querySelectorAll(selector); 
    lineClaps.forEach((lineClap) => { 
      let text = lineClap.textContent;
      const maxLength = Number(limit);
    
      if (text.length > maxLength) {
        lineClap.textContent = text.slice(0, maxLength) + '...';
      }
    });
  }, [post]); 
};

export const useTruncateText = (selector, post, limit) => {
  useEffect(() => {
    if (isNaN(limit) || limit <= 0) {
      console.error("limit phải là một số dương hợp lệ");
      return;
    }

    const lineClap = document.querySelector(selector);
    if (lineClap) {
      let text = lineClap.textContent;    
      const maxLength = Number(limit);
    
      if (text.length > maxLength) {
        lineClap.textContent = text.slice(0, maxLength) + '...';
      }
    }
  }, [post, selector, limit]); 
};
