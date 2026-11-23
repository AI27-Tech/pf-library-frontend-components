import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';
import { sanitizeInput } from './inputFormat';
import { sanitizeDateText } from '../DatePicker/dateUtils';
import { DateInput } from '../DatePicker/DateInput';

describe('sanitizeInput', () => {
  it('digits deja solo dígitos y conserva ceros a la izquierda', () => {
    expect(sanitizeInput('digits', '00a1-2 3')).toBe('00123');
  });

  it('integer admite un solo signo al inicio', () => {
    expect(sanitizeInput('integer', '-1-2.5')).toBe('-125');
    expect(sanitizeInput('integer', '1-2')).toBe('12');
  });

  it('decimal admite un solo punto y signo inicial', () => {
    expect(sanitizeInput('decimal', '-1.2.3abc')).toBe('-1.23');
    expect(sanitizeInput('decimal', '1.')).toBe('1.');
  });

  it('phone admite + solo al inicio y separadores comunes', () => {
    expect(sanitizeInput('phone', '+52 (55) 1234-5678 ext')).toBe('+52 (55) 1234-5678 ');
    expect(sanitizeInput('phone', '55+12')).toBe('5512');
  });

  it('letters rechaza dígitos y acepta acentos', () => {
    expect(sanitizeInput('letters', "José-Ñandú O'Neil 3")).toBe("José-Ñandú O'Neil ");
  });

  it('alphanumeric rechaza espacios y símbolos', () => {
    expect(sanitizeInput('alphanumeric', 'ABC-123 x!')).toBe('ABC123x');
  });

  it('email rechaza espacios', () => {
    expect(sanitizeInput('email', ' a b@c.mx ')).toBe('ab@c.mx');
  });

  it('text no cambia nada', () => {
    expect(sanitizeInput('text', 'a1 !')).toBe('a1 !');
  });
});

describe('Input format', () => {
  it('descarta al escribir y al pegar', async () => {
    const user = userEvent.setup();
    render(<Input format="digits" aria-label="folio" />);
    const input = screen.getByLabelText('folio') as HTMLInputElement;
    await user.type(input, 'a1b2');
    expect(input.value).toBe('12');
    await user.clear(input);
    await user.click(input);
    await user.paste('9x8-7');
    expect(input.value).toBe('987');
  });

  it('entrega a onChange el valor ya limpio', async () => {
    const user = userEvent.setup();
    const seen: string[] = [];
    render(<Input format="letters" aria-label="nombre" onChange={(e) => seen.push(e.target.value)} />);
    await user.type(screen.getByLabelText('nombre'), 'a1b');
    expect(seen.at(-1)).toBe('ab');
  });

  it('fija inputMode según el formato', () => {
    render(<Input format="phone" aria-label="tel" />);
    expect(screen.getByLabelText('tel')).toHaveAttribute('inputmode', 'tel');
  });
});

describe('DateInput texto', () => {
  it('sanitizeDateText deja dígitos y separadores', () => {
    expect(sanitizeDateText('1a/2b-3.4 5')).toBe('1/2-3.45');
    expect(sanitizeDateText('//1//2')).toBe('1/2');
  });

  it('no acepta letras ni más de 10 caracteres', async () => {
    const user = userEvent.setup();
    render(<DateInput id="f" />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    await user.type(input, 'ab12/03/2026999');
    expect(input.value).toBe('12/03/2026');
  });
});
