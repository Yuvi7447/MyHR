/**
 * App Component Test
 */

import React from 'react';
import App from '../App';

describe('App', () => {
  it('should export App component', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});
