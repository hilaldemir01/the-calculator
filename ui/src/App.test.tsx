import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Scientific Calculator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.body.className = '';
  });

  it('renders initial display with zero', () => {
    render(<App />);
    const display = screen.getByTestId('display');
    expect(display).toHaveTextContent('0');
  });

  it('builds a chained expression correctly with new operators', () => {
    render(<App />);
    const display = screen.getByTestId('display');

    // "7 + 8 × 9"
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByText('×'));
    fireEvent.click(screen.getByText('9'));

    expect(display).toHaveTextContent('7+8×9');
  });

  it('handles advanced operators (square root, exponentiation, percentage)', () => {
    render(<App />);
    const display = screen.getByTestId('display');

    fireEvent.click(screen.getByText('√'));     
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('6'));
    fireEvent.click(screen.getByText(')'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('xʸ'));   
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('%')); 

    expect(display).toHaveTextContent('sqrt(16)+2^3%');
  });

  it('deletes a single character on Backspace (⌫)', () => {
    render(<App />);
    const display = screen.getByTestId('display');

    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('3'));
    
    expect(display).toHaveTextContent('123');

    fireEvent.click(screen.getByText('⌫'));
    
    expect(display).toHaveTextContent('12');
  });

  it('clears the entire display on Clear (C)', () => {
    render(<App />);
    const display = screen.getByTestId('display');

    fireEvent.click(screen.getByText('9'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('5'));
    
    expect(display).toHaveTextContent('9+5');

    fireEvent.click(screen.getByText('C'));
    expect(display).toHaveTextContent('0');
  });

  it('toggles Dark Mode correctly and saves to localStorage', () => {
    render(<App />);
    
    const themeSwitch = screen.getByRole('checkbox');
    
    expect(themeSwitch).not.toBeChecked();
    expect(document.body.classList.contains('dark-mode')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');

    fireEvent.click(themeSwitch);
    
    expect(themeSwitch).toBeChecked();
    expect(document.body.classList.contains('dark-mode')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('sanitizes and sends the correct payload to the Go backend on equals', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { result: 14 } });

    render(<App />);
    const display = screen.getByTestId('display');

    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('xʸ')); // ^
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('6'));

    fireEvent.click(screen.getByText('='));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(expect.stringContaining('/api/calculate'), {
        expression: '2**3+6'
      });
    });

    await waitFor(() => {
      expect(display).toHaveTextContent('14');
    });
  });

  it('shows an error message if the backend returns an error', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { error: 'Geçersiz matematiksel ifade' } }
    });

    render(<App />);
    
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('÷'));
    fireEvent.click(screen.getByText('0'));
    
    fireEvent.click(screen.getByText('='));

    await waitFor(() => {
      const errorBanner = screen.getByText('Geçersiz matematiksel ifade');
      expect(errorBanner).toBeInTheDocument();
    });
  });
});