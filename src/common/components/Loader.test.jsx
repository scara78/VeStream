import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loader from './Loader';

describe('Loader', () => {
    it('renders correctly', () => {
        render(<Loader />);
        expect(screen.getByText(/INITIALIZING SYSTEM/i)).toBeInTheDocument();
    });
});
