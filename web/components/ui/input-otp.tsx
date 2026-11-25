/**
 * Saisie d'un code à usage unique, case par case : le composant `InputOTP` de
 * shadcn/ui (même découpage, même bibliothèque `input-otp`), habillé par un
 * module CSS plutôt que par Tailwind, que le site n'utilise pas.
 *
 * Un seul vrai `<input>`, transparent, couvre les cases : le collage, le
 * remplissage automatique d'iOS (`autoComplete="one-time-code"`) et le
 * gestionnaire de mots de passe marchent comme sur un champ ordinaire.
 */
'use client';

import { OTPInput, OTPInputContext } from 'input-otp';
import { Minus } from 'lucide-react';
import { useContext, type ComponentProps } from 'react';

import s from './input-otp.module.css';

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ');

export function InputOTP({ className, containerClassName, ...props }: ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cx(s.root, containerClassName)}
      className={cx(s.input, className)}
      {...props}
    />
  );
}

export function InputOTPGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="input-otp-group" className={cx(s.group, className)} {...props} />;
}

export function InputOTPSlot({ index, className, ...props }: ComponentProps<'div'> & { index: number }) {
  const context = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = context?.slots[index] ?? {};
  return (
    <div data-slot="input-otp-slot" data-active={isActive || undefined} className={cx(s.slot, className)} {...props}>
      {char}
      {hasFakeCaret && (
        <div className={s.caretBox} aria-hidden>
          <div className={s.caret} />
        </div>
      )}
    </div>
  );
}

export function InputOTPSeparator(props: ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-separator" role="separator" className={s.separator} {...props}>
      <Minus size={16} aria-hidden />
    </div>
  );
}
